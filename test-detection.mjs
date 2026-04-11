import fs from 'fs';
import Papa from 'papaparse';
import merchantsData from './src/data/merchants.json' assert { type: 'json' };

// Transaction interface
class Transaction {
  constructor(date, concept, amount, type) {
    this.date = date;
    this.concept = concept;
    this.amount = amount;
    this.type = type;
  }
}

// Match merchant function
function matchMerchant(concept) {
  const merchants = merchantsData;
  const upper = concept.toUpperCase();
  for (const m of merchants) {
    for (const pattern of m.patterns) {
      if (upper.includes(pattern.toUpperCase())) {
        return m;
      }
    }
  }
  return null;
}

// Normalize concept
function normalizeConcept(concept) {
  return concept
    .toUpperCase()
    .replace(/\d{2,}/g, '')
    .replace(/[^A-ZÁÉÍÓÚÑ\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Check similar amounts
function amountsSimilar(a, b) {
  if (a === 0 || b === 0) return false;
  const ratio = Math.abs(a - b) / Math.max(a, b);
  return ratio <= 0.05;
}

// Detect frequency
function detectFrequency(dates) {
  if (dates.length < 2) return 'unknown';

  const sorted = [...dates].sort((a, b) => a.getTime() - b.getTime());
  const intervals = [];

  for (let i = 1; i < sorted.length; i++) {
    const diff = Math.round(
      (sorted[i].getTime() - sorted[i - 1].getTime()) / (1000 * 60 * 60 * 24)
    );
    intervals.push(diff);
  }

  const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;

  if (avgInterval >= 6 && avgInterval <= 8) return 'weekly';
  if (avgInterval >= 25 && avgInterval <= 35) return 'monthly';
  if (avgInterval >= 350 && avgInterval <= 380) return 'annual';
  return 'unknown';
}

// Check regular intervals
function intervalsRegular(dates) {
  if (dates.length < 2) return false;

  const sorted = [...dates].sort((a, b) => a.getTime() - b.getTime());
  const intervals = [];

  for (let i = 1; i < sorted.length; i++) {
    const diff = Math.round(
      (sorted[i].getTime() - sorted[i - 1].getTime()) / (1000 * 60 * 60 * 24)
    );
    intervals.push(diff);
  }

  if (intervals.length === 0) return false;

  const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const variance = intervals.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / intervals.length;
  const stddev = Math.sqrt(variance);

  return stddev <= Math.max(5, avg * 0.15);
}

// Main detection function
function detectSubscriptions(transactions) {
  const debits = transactions.filter((t) => t.type === 'cargo' && t.amount > 0);

  const groups = new Map();

  for (const tx of debits) {
    const merchant = matchMerchant(tx.concept);
    let key;

    if (merchant) {
      key = `merchant:${merchant.id}`;
    } else {
      key = `unknown:${normalizeConcept(tx.concept)}`;
    }

    if (!groups.has(key)) {
      groups.set(key, {
        merchantRecord: merchant,
        key,
        transactions: [],
      });
    }
    groups.get(key).transactions.push(tx);
  }

  const subscriptions = [];

  for (const [, group] of groups) {
    const txs = group.transactions;
    if (txs.length < 2) continue;

    const sameMerchant = true;
    const amounts = txs.map((t) => t.amount);
    const medianAmount = amounts.sort((a, b) => a - b)[Math.floor(amounts.length / 2)];
    const similarAmounts = txs.filter((t) => amountsSimilar(t.amount, medianAmount)).length;
    const amountSignal = similarAmounts / txs.length >= 0.7;

    const dates = txs.map((t) => t.date);
    const regularInterval = intervalsRegular(dates);

    const signals = [sameMerchant, amountSignal, regularInterval].filter(Boolean).length;
    if (signals < 2) continue;

    const frequency = detectFrequency(dates);
    const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());

    const merchant = group.merchantRecord;
    const merchantName = merchant
      ? merchant.name
      : normalizeConcept(txs[0].concept) || txs[0].concept;

    let faviconUrl = '';
    if (merchant?.cancel_url) {
      try {
        const domain = new URL(merchant.cancel_url).hostname;
        faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
      } catch {
        faviconUrl = '';
      }
    }

    const confidence = Math.min(1, signals / 3 + (txs.length > 3 ? 0.1 : 0));

    subscriptions.push({
      id: merchant?.id || `unknown-${subscriptions.length}`,
      merchantId: merchant?.id || null,
      merchantName,
      category: merchant?.category || 'other',
      amount: medianAmount,
      frequency: frequency !== 'unknown' ? frequency : 'monthly',
      firstSeen: sortedDates[0],
      lastSeen: sortedDates[sortedDates.length - 1],
      occurrences: txs.length,
      cancelUrl: merchant?.cancel_url || null,
      cancelSteps: merchant?.cancel_steps_es || [],
      faviconUrl,
      confidence,
    });
  }

  subscriptions.sort((a, b) => b.amount - a.amount);

  let totalMonthly = 0;
  for (const sub of subscriptions) {
    switch (sub.frequency) {
      case 'monthly':
        totalMonthly += sub.amount;
        break;
      case 'annual':
        totalMonthly += sub.amount / 12;
        break;
      case 'weekly':
        totalMonthly += sub.amount * 4.33;
        break;
      default:
        totalMonthly += sub.amount;
    }
  }

  return {
    subscriptions,
    totalMonthly: Math.round(totalMonthly * 100) / 100,
    totalAnnual: Math.round(totalMonthly * 12 * 100) / 100,
    transactionCount: transactions.length,
  };
}

// Parse CSV file
function parseCSV(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data } = Papa.parse(fileContent, { header: false });

  const transactions = [];
  const headers = data[0];

  // Find column indices
  let dateIdx = -1, conceptIdx = -1, amountIdx = -1;

  for (let i = 0; i < headers.length; i++) {
    const h = headers[i].toLowerCase();
    if (h.includes('fecha')) dateIdx = i;
    if (h.includes('concepto')) conceptIdx = i;
    if (h.includes('importe')) amountIdx = i;
  }

  // Parse rows
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row.length < 3) continue;

    const dateStr = row[dateIdx].trim();
    const concept = row[conceptIdx].trim();
    const amountStr = row[amountIdx].trim();

    if (!dateStr || !concept || !amountStr) continue;

    // Parse date (YYYY-MM-DD)
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) continue;

    // Parse amount (handle negative)
    const amount = Math.abs(parseFloat(amountStr));
    if (isNaN(amount)) continue;

    transactions.push(new Transaction(
      date,
      concept,
      amount,
      parseFloat(amountStr) < 0 ? 'cargo' : 'abono'
    ));
  }

  return transactions;
}

// Main
console.log('SubAudit Detection Test\n');
console.log('Reading test CSV...');

const transactions = parseCSV('./test-data.csv');
console.log(`Found ${transactions.length} transactions\n`);

console.log('Transactions:');
transactions.forEach(t => {
  console.log(`  ${t.date.toISOString().split('T')[0]} | ${t.concept.padEnd(30)} | €${t.amount.toFixed(2)} (${t.type})`);
});

console.log('\n\nRunning detection algorithm...\n');
const result = detectSubscriptions(transactions);

console.log(`Detected ${result.subscriptions.length} subscriptions:\n`);

result.subscriptions.forEach(sub => {
  console.log(`${sub.merchantName}`);
  console.log(`  Category: ${sub.category}`);
  console.log(`  Amount: €${sub.amount.toFixed(2)}`);
  console.log(`  Frequency: ${sub.frequency}`);
  console.log(`  Occurrences: ${sub.occurrences}`);
  console.log(`  First seen: ${sub.firstSeen.toISOString().split('T')[0]}`);
  console.log(`  Last seen: ${sub.lastSeen.toISOString().split('T')[0]}`);
  console.log(`  Confidence: ${(sub.confidence * 100).toFixed(0)}%`);
  if (sub.cancelUrl) {
    console.log(`  Cancel URL: ${sub.cancelUrl}`);
  }
  console.log();
});

console.log(`\nSummary:`);
console.log(`  Total Monthly: €${result.totalMonthly.toFixed(2)}`);
console.log(`  Total Annual: €${result.totalAnnual.toFixed(2)}`);
console.log(`  Transactions processed: ${result.transactionCount}`);
