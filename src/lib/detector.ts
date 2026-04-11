import merchantsData from '../data/merchants.json';

export type { Transaction } from './parser';
import type { Transaction } from './parser';

interface MerchantRecord {
  id: string;
  name: string;
  patterns: string[];
  category: string;
  typical_price_eur: number[];
  cancel_url: string;
  cancel_steps_es: string[];
  trial_trap: boolean;
}

export interface DetectedSubscription {
  id: string;
  merchantId: string | null;
  merchantName: string;
  category: string;
  amount: number;
  frequency: 'monthly' | 'annual' | 'weekly' | 'unknown';
  firstSeen: Date;
  lastSeen: Date;
  occurrences: number;
  cancelUrl: string | null;
  cancelSteps: string[];
  faviconUrl: string;
  confidence: number;
}

export interface AuditResult {
  subscriptions: DetectedSubscription[];
  totalMonthly: number;
  totalAnnual: number;
  transactionCount: number;
}

const merchants = merchantsData as MerchantRecord[];

function matchMerchant(concept: string): MerchantRecord | null {
  const upper = concept.toUpperCase();
  for (const m of merchants) {
    for (const pattern of m.patterns) {
      if (upper.includes(pattern.toUpperCase())) return m;
    }
  }
  return null;
}

function normalizeConcept(concept: string): string {
  return concept.toUpperCase().replace(/\d{2,}/g, '').replace(/[^A-Z\u00c1\u00c9\u00cd\u00d3\u00da\u00d1\s]/g, '').replace(/\s+/g, ' ').trim();
}

function amountsSimilar(a: number, b: number): boolean {
  if (a === 0 || b === 0) return false;
  return Math.abs(a - b) / Math.max(a, b) <= 0.05;
}

function detectFrequency(dates: Date[]): 'monthly' | 'annual' | 'weekly' | 'unknown' {
  if (dates.length < 2) return 'unknown';
  const sorted = [...dates].sort((a, b) => a.getTime() - b.getTime());
  const intervals: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    intervals.push(Math.round((sorted[i].getTime() - sorted[i - 1].getTime()) / (1000 * 60 * 60 * 24)));
  }
  const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  if (avg >= 6 && avg <= 8) return 'weekly';
  if (avg >= 25 && avg <= 35) return 'monthly';
  if (avg >= 350 && avg <= 380) return 'annual';
  return 'unknown';
}

function intervalsRegular(dates: Date[]): boolean {
  if (dates.length < 2) return false;
  const sorted = [...dates].sort((a, b) => a.getTime() - b.getTime());
  const intervals: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    intervals.push(Math.round((sorted[i].getTime() - sorted[i - 1].getTime()) / (1000 * 60 * 60 * 24)));
  }
  if (intervals.length === 0) return false;
  const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const variance = intervals.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / intervals.length;
  return Math.sqrt(variance) <= Math.max(5, avg * 0.15);
}

export function detectSubscriptions(transactions: Transaction[]): AuditResult {
  const debits = transactions.filter((t) => t.type === 'cargo' && t.amount > 0);

  interface TxGroup {
    merchantRecord: MerchantRecord | null;
    key: string;
    transactions: Transaction[];
  }

  const groups = new Map<string, TxGroup>();

  for (const tx of debits) {
    const merchant = matchMerchant(tx.concept);
    const key = merchant ? `merchant:${merchant.id}` : `unknown:${normalizeConcept(tx.concept)}`;
    if (!groups.has(key)) {
      groups.set(key, { merchantRecord: merchant, key, transactions: [] });
    }
    groups.get(key)!.transactions.push(tx);
  }

  const subscriptions: DetectedSubscription[] = [];

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
    const merchantName = merchant ? merchant.name : normalizeConcept(txs[0].concept) || txs[0].concept;

    let faviconUrl = '';
    if (merchant?.cancel_url) {
      try {
        const domain = new URL(merchant.cancel_url).hostname;
        faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
      } catch { faviconUrl = ''; }
    }

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
      confidence: Math.min(1, signals / 3 + (txs.length > 3 ? 0.1 : 0)),
    });
  }

  subscriptions.sort((a, b) => b.amount - a.amount);

  let totalMonthly = 0;
  for (const sub of subscriptions) {
    switch (sub.frequency) {
      case 'monthly': totalMonthly += sub.amount; break;
      case 'annual': totalMonthly += sub.amount / 12; break;
      case 'weekly': totalMonthly += sub.amount * 4.33; break;
      default: totalMonthly += sub.amount;
    }
  }

  return {
    subscriptions,
    totalMonthly: Math.round(totalMonthly * 100) / 100,
    totalAnnual: Math.round(totalMonthly * 12 * 100) / 100,
    transactionCount: transactions.length,
  };
}
