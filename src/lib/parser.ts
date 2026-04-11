import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export interface Transaction {
  date: Date;
  concept: string;
  amount: number;
  type: 'cargo' | 'abono';
}

export interface ParseResult {
  transactions: Transaction[];
  bankDetected: string | null;
  errors: string[];
}

const BANK_PATTERNS: Record<string, { dateCol: RegExp; conceptCol: RegExp; amountCol: RegExp; debitCol?: RegExp; creditCol?: RegExp }> = {
  bankinter: {
    dateCol: /fecha/i,
    conceptCol: /concepto/i,
    amountCol: /importe/i,
  },
  caixabank: {
    dateCol: /fecha/i,
    conceptCol: /concepto/i,
    amountCol: /importe|\u20ac/i,
  },
  bbva: {
    dateCol: /fecha/i,
    conceptCol: /movimiento/i,
    amountCol: /importe/i,
  },
  santander: {
    dateCol: /fecha/i,
    conceptCol: /concepto/i,
    amountCol: /importe/i,
  },
  openbank: {
    dateCol: /fecha\s*operaci\u00f3n|operaci\u00f3n/i,
    conceptCol: /concepto/i,
    amountCol: /importe/i,
  },
  sabadell: {
    dateCol: /fecha/i,
    conceptCol: /concepto/i,
    amountCol: /importe/i,
  },
  ing: {
    dateCol: /fecha/i,
    conceptCol: /descripci\u00f3n|description/i,
    amountCol: /importe|\u20ac/i,
  },
  revolut: {
    dateCol: /started\s*date|date/i,
    conceptCol: /description|descripci\u00f3n/i,
    amountCol: /amount|importe/i,
  },
};

function parseSpanishDate(dateStr: string): Date | null {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const trimmed = dateStr.trim();

  const slashMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashMatch) {
    const [, day, month, year] = slashMatch;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }

  const dashMatch = trimmed.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (dashMatch) {
    const [, day, month, year] = dashMatch;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }

  const isoMatch = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }

  return null;
}

function normalizeAmount(amountStr: string): number | null {
  if (!amountStr || typeof amountStr !== 'string') return null;
  let cleaned = amountStr.trim().replace(/[\u20ac$\u00a5\u00a3]/g, '').replace(/\s/g, '').trim();
  if (!cleaned) return null;

  const isNegative = cleaned.startsWith('-');
  if (isNegative) cleaned = cleaned.substring(1);

  const lastCommaIdx = cleaned.lastIndexOf(',');
  const lastPeriodIdx = cleaned.lastIndexOf('.');
  let result: number;

  if (lastCommaIdx > lastPeriodIdx) {
    result = parseFloat(cleaned.replace(/\./g, '').replace(',', '.'));
  } else if (lastPeriodIdx > lastCommaIdx) {
    result = parseFloat(cleaned.replace(/,/g, ''));
  } else {
    result = parseFloat(cleaned);
  }

  if (isNaN(result)) return null;
  return isNegative ? -result : result;
}

function detectBank(headers: string[]): string | null {
  const headerLower = headers.map(h => h.toLowerCase());
  for (const [bankName, patterns] of Object.entries(BANK_PATTERNS)) {
    const dateMatch = headerLower.some(h => patterns.dateCol.test(h));
    const conceptMatch = headerLower.some(h => patterns.conceptCol.test(h));
    const amountMatch = headerLower.some(h => patterns.amountCol.test(h));
    if (dateMatch && conceptMatch && amountMatch) return bankName;
  }
  return null;
}

function findColumnIndices(
  headers: string[],
  patterns: { dateCol: RegExp; conceptCol: RegExp; amountCol: RegExp }
): { dateIdx: number; conceptIdx: number; amountIdx: number } | null {
  const dateIdx = headers.findIndex(h => patterns.dateCol.test(h));
  const conceptIdx = headers.findIndex(h => patterns.conceptCol.test(h));
  const amountIdx = headers.findIndex(h => patterns.amountCol.test(h));
  if (dateIdx === -1 || conceptIdx === -1 || amountIdx === -1) return null;
  return { dateIdx, conceptIdx, amountIdx };
}

function parseGeneric(rows: (string | number | boolean)[][]): Transaction[] {
  const transactions: Transaction[] = [];
  if (rows.length < 2) return transactions;

  const headers = rows[0];
  const dataRows = rows.slice(1);
  let dateIdx = -1, conceptIdx = -1, amountIdx = -1;

  for (let i = 0; i < headers.length; i++) {
    const header = String(headers[i]).toLowerCase();
    if (/fecha|date|cuando|when/i.test(header)) dateIdx = i;
    if (/concepto|concept|description|descripci\u00f3n/i.test(header)) conceptIdx = i;
    if (/importe|amount|monto|valor/i.test(header)) amountIdx = i;
  }

  if (dateIdx === -1 || conceptIdx === -1 || amountIdx === -1) {
    for (let rowIdx = 0; rowIdx < Math.min(dataRows.length, 5); rowIdx++) {
      const row = dataRows[rowIdx];
      for (let colIdx = 0; colIdx < row.length; colIdx++) {
        const val = String(row[colIdx]).trim();
        if (dateIdx === -1 && parseSpanishDate(val)) dateIdx = colIdx;
        if (amountIdx === -1 && normalizeAmount(val) !== null) amountIdx = colIdx;
        if (conceptIdx === -1 && val.length > 5 && val.length < 100 && !/^\d/.test(val)) conceptIdx = colIdx;
      }
    }
  }

  if (dateIdx === -1 || conceptIdx === -1 || amountIdx === -1) return [];

  for (const row of dataRows) {
    const dateStr = String(row[dateIdx] || '').trim();
    const concept = String(row[conceptIdx] || '').trim();
    const amountStr = String(row[amountIdx] || '').trim();
    if (!dateStr || !concept || !amountStr) continue;
    const date = parseSpanishDate(dateStr);
    if (!date) continue;
    const amount = normalizeAmount(amountStr);
    if (amount === null) continue;
    transactions.push({ date, concept, amount: Math.abs(amount), type: amount < 0 ? 'cargo' : 'abono' });
  }
  return transactions;
}

function parseRowsToTransactions(data: (string | number | boolean)[][]): Transaction[] {
  if (data.length < 2) return [];
  const headers = data[0].map(h => String(h));
  const bankDetected = detectBank(headers);
  let columns = null;
  if (bankDetected && BANK_PATTERNS[bankDetected]) {
    columns = findColumnIndices(headers, BANK_PATTERNS[bankDetected]);
  }
  if (!columns) return parseGeneric(data);

  const { dateIdx, conceptIdx, amountIdx } = columns;
  const transactions: Transaction[] = [];

  for (const row of data.slice(1)) {
    const dateStr = String(row[dateIdx] || '').trim();
    const concept = String(row[conceptIdx] || '').trim();
    if (!dateStr || !concept) continue;
    const date = parseSpanishDate(dateStr);
    if (!date) continue;
    const parsedAmount = normalizeAmount(String(row[amountIdx] || '').trim());
    if (parsedAmount === null) continue;
    transactions.push({ date, concept, amount: Math.abs(parsedAmount), type: parsedAmount < 0 ? 'cargo' : 'abono' });
  }
  return transactions;
}

async function decodeFileContent(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  try {
    const decoder = new TextDecoder('utf-8', { fatal: true });
    return decoder.decode(buffer);
  } catch {
    const decoder = new TextDecoder('iso-8859-1');
    return decoder.decode(buffer);
  }
}

export async function parseFile(file: File): Promise<ParseResult> {
  try {
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (extension === 'csv') {
      const content = await decodeFileContent(file);
      return new Promise((resolve) => {
        Papa.parse(content, {
          complete: (results: Papa.ParseResult<unknown>) => {
            const data = results.data as (string | number | boolean)[][];
            if (data.length < 2) {
              resolve({ transactions: [], bankDetected: null, errors: ['CSV debe tener cabeceras y al menos una fila de datos'] });
              return;
            }
            const headers = data[0].map(h => String(h));
            const bankDetected = detectBank(headers);
            const transactions = parseRowsToTransactions(data);
            resolve({
              transactions,
              bankDetected,
              errors: transactions.length === 0 ? ['No se encontraron transacciones v\u00e1lidas en el CSV'] : [],
            });
          },
          error: (error: Error) => {
            resolve({ transactions: [], bankDetected: null, errors: [`Error de parseo CSV: ${error.message}`] });
          },
          header: false,
          skipEmptyLines: true,
          dynamicTyping: false,
        });
      });
    } else if (['xls', 'xlsx'].includes(extension || '')) {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' }) as (string | number | boolean)[][];
      if (data.length < 2) {
        return { transactions: [], bankDetected: null, errors: ['El archivo Excel debe tener cabeceras y al menos una fila'] };
      }
      const headers = data[0].map(h => String(h));
      const bankDetected = detectBank(headers);
      const transactions = parseRowsToTransactions(data);
      return {
        transactions,
        bankDetected,
        errors: transactions.length === 0 ? ['No se encontraron transacciones v\u00e1lidas en el Excel'] : [],
      };
    } else {
      return { transactions: [], bankDetected: null, errors: [`Tipo de archivo no soportado: ${extension}. Usa CSV o XLSX.`] };
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { transactions: [], bankDetected: null, errors: [`Error al procesar archivo: ${errorMsg}`] };
  }
}
