import { Transaction } from './parser';
import { findMerchant, categoryLabels, Merchant } from './merchants';

export interface Subscription {
  merchantId: string | null;
  merchantName: string;
  category: string;
  categoryLabel: string;
  amount: number;
  frequency: 'monthly' | 'annual' | 'weekly' | 'unknown';
  frequencyLabel: string;
  charges: Transaction[];
  firstCharge: Date;
  lastCharge: Date;
  monthsActive: number;
  cancelUrl: string | null;
  cancelSteps: string[] | null;
  domain: string | null;
}

export interface AuditResult {
  subscriptions: Subscription[];
  totalMonthly: number;
  totalAnnual: number;
  totalCount: number;
}

const freqLabels: Record<string, string> = {
  monthly: 'Mensual', annual: 'Anual', weekly: 'Semanal', unknown: 'Desconocida',
};

function fuzzyGroupKey(concept: string): string {
  return concept.toLowerCase().replace(/[^a-z\u00e1\u00e9\u00ed\u00f3\u00fa\u00f1\u00fc\s]/g, '').replace(/\s+/g, '').trim().slice(0, 20);
}

function groupByMerchant(txs: Transaction[]): Array<{ merchant: Merchant | null; transactions: Transaction[] }> {
  const map = new Map<string, { merchant: Merchant | null; transactions: Transaction[] }>();
  for (const tx of txs) {
    if (tx.amount >= 0) continue;
    const m = findMerchant(tx.concept);
    const key = m ? `k_${m.id}` : `u_${fuzzyGroupKey(tx.concept)}`;
    if (!map.has(key)) map.set(key, { merchant: m, transactions: [] });
    map.get(key)!.transactions.push(tx);
  }
  return Array.from(map.values());
}

function intervalDays(d1: Date, d2: Date): number {
  return Math.round(Math.abs(d2.getTime() - d1.getTime()) / 86400000);
}

function detectFreq(sorted: Transaction[]): 'monthly' | 'annual' | 'weekly' | 'unknown' {
  if (sorted.length < 2) return 'unknown';
  const intervals: number[] = [];
  for (let i = 1; i < sorted.length; i++) intervals.push(intervalDays(sorted[i - 1].date, sorted[i].date));
  const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  if (avg >= 28 && avg <= 35) return 'monthly';
  if (avg >= 358 && avg <= 372) return 'annual';
  if (avg >= 6 && avg <= 8) return 'weekly';
  return 'unknown';
}

function amountsSimilar(amounts: number[], tol = 0.05): boolean {
  if (amounts.length < 2) return true;
  const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
  return amounts.every((a) => Math.abs(a - avg) / avg <= tol);
}

function regularIntervals(sorted: Transaction[]): boolean {
  if (sorted.length < 2) return false;
  const intervals: number[] = [];
  for (let i = 1; i < sorted.length; i++) intervals.push(intervalDays(sorted[i - 1].date, sorted[i].date));
  const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  return (avg >= 6 && avg <= 8) || (avg >= 28 && avg <= 35) || (avg >= 358 && avg <= 372);
}

function isSubscription(txs: Transaction[], known: boolean): boolean {
  if (txs.length < 2) return false;
  const sorted = [...txs].sort((a, b) => a.date.getTime() - b.date.getTime());
  const amounts = sorted.map((t) => Math.abs(t.amount));
  const signals = [amountsSimilar(amounts), regularIntervals(sorted), known].filter(Boolean).length;
  return signals >= 2;
}

function getDomain(m: Merchant | null): string | null {
  if (!m?.cancelUrl) return null;
  try { return new URL(m.cancelUrl).hostname.replace('www.', ''); } catch { return null; }
}

export function detectSubscriptions(transactions: Transaction[]): AuditResult {
  const groups = groupByMerchant(transactions);
  const subs: Subscription[] = [];

  for (const group of groups) {
    const { merchant, transactions: txs } = group;
    if (txs.length < 2) continue;
    if (!isSubscription(txs, merchant !== null)) continue;

    const sorted = [...txs].sort((a, b) => a.date.getTime() - b.date.getTime());
    const freq = detectFreq(sorted);
    const amounts = sorted.map((t) => Math.abs(t.amount));
    const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const monthly = freq === 'annual' ? avg / 12 : avg;
    const first = sorted[0].date;
    const last = sorted[sorted.length - 1].date;
    const months = Math.max(1, (last.getFullYear() - first.getFullYear()) * 12 + (last.getMonth() - first.getMonth()));
    const cat = merchant?.category || 'other';

    subs.push({
      merchantId: merchant?.id || null,
      merchantName: merchant?.name || sorted[0].concept.slice(0, 30),
      category: cat,
      categoryLabel: categoryLabels[cat] || 'Otros',
      amount: Math.round(monthly * 100) / 100,
      frequency: freq,
      frequencyLabel: freqLabels[freq],
      charges: sorted,
      firstCharge: first,
      lastCharge: last,
      monthsActive: months,
      cancelUrl: merchant?.cancelUrl || null,
      cancelSteps: merchant?.cancelStepsEs || null,
      domain: getDomain(merchant),
    });
  }

  subs.sort((a, b) => b.amount - a.amount);
  const totalMonthly = Math.round(subs.reduce((s, sub) => s + sub.amount, 0) * 100) / 100;
  return { subscriptions: subs, totalMonthly, totalAnnual: Math.round(totalMonthly * 12 * 100) / 100, totalCount: subs.length };
}
