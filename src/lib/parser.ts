import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export interface Transaction {
  date: Date;
  concept: string;
  amount: number;
  raw: string;
}

function normalizeDateString(dateStr: string): Date | null {
  if (!dateStr || typeof dateStr !== 'string') return null;
  dateStr = dateStr.trim();

  // DD/MM/YYYY
  const ddmmyyyy = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (ddmmyyyy) {
    const [, day, month, year] = ddmmyyyy;
    const d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    if (!isNaN(d.getTime())) return d;
  }

  // YYYY-MM-DD
  const yyyymmdd = dateStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (yyyymmdd) {
    const [, year, month, day] = yyyymmdd;
    const d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    if (!isNaN(d.getTime())) return d;
  }

  // ISO fallback
  const iso = new Date(dateStr);
  if (!isNaN(iso.getTime())) return iso;

  return null;
}

function normalizeAmount(amountStr: string | number): number | null {
  if (amountStr === null || amountStr === undefined || amountStr === '') return null;
  let numStr = String(amountStr).trim();

  if (numStr.includes(',') && numStr.includes('.')) {
    const lastDot = numStr.lastIndexOf('.');
    const lastComma = numStr.lastIndexOf(',');
    if (lastComma > lastDot) {
      numStr = numStr.replace(/\./g, '').replace(',', '.');
    } else {
      numStr = numStr.replace(/,/g, '');
    }
  } else if (numStr.includes(',')) {
    const lastCommaPos = numStr.lastIndexOf(',');
    const digitsAfter = numStr.length - lastCommaPos - 1;
    if (digitsAfter <= 3 && digitsAfter > 0) {
      numStr = numStr.replace(/\./g, '').replace(',', '.');
    } else {
      numStr = numStr.replace(/,/g, '');
    }
  }

  const amount = parseFloat(numStr);
  return isNaN(amount) ? null : amount;
}

function detectDateColumn(headers: string[]): number {
  for (let i = 0; i < headers.length; i++) {
    const h = headers[i].toLowerCase().trim();
    if (h.includes('fecha') || h.includes('date') || h.includes('operaci\u00f3n') || h.includes('valor')) return i;
  }
  return -1;
}

function detectAmountColumn(headers: string[]): number {
  for (let i = 0; i < headers.length; i++) {
    const h = headers[i].toLowerCase().trim();
    if (h.includes('importe') || h.includes('amount') || h.includes('cantidad') || h.includes('movimiento')) return i;
  }
  return -1;
}

function detectConceptColumn(headers: string[]): number {
  for (let i = 0; i < headers.length; i++) {
    const h = headers[i].toLowerCase().trim();
    if (h.includes('concepto') || h.includes('descripci\u00f3n') || h.includes('description') || h.includes('detalle')) return i;
  }
  return -1;
}

function processRows(data: any[]): Transaction[] {
  if (!data || data.length === 0) return [];
  const headers = Object.keys(data[0]);
  const dateCol = detectDateColumn(headers);
  const amountCol = detectAmountColumn(headers);
  const conceptCol = detectConceptColumn(headers);

  if (dateCol === -1 || amountCol === -1) {
    throw new Error('No se pudieron detectar columnas de fecha o importe.');
  }

  const txs: Transaction[] = [];
  for (const row of data) {
    const dateStr = row[headers[dateCol]];
    const amountStr = row[headers[amountCol]];
    const conceptStr = conceptCol >= 0 ? row[headers[conceptCol]] : '';

    let date: Date | null = null;
    if (typeof dateStr === 'number') {
      date = new Date((dateStr - 25569) * 86400 * 1000);
      if (isNaN(date.getTime())) date = null;
    } else {
      date = normalizeDateString(dateStr);
    }

    const amount = normalizeAmount(amountStr);
    if (date && amount !== null) {
      txs.push({
        date,
        concept: conceptStr ? String(conceptStr).trim() : 'Sin concepto',
        amount: amount < 0 ? amount : -Math.abs(amount),
        raw: conceptStr ? String(conceptStr).trim() : '',
      });
    }
  }

  txs.sort((a, b) => a.date.getTime() - b.date.getTime());
  return txs;
}

function parseCSV(file: File): Promise<Transaction[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      encoding: 'UTF-8',
      complete: (results: any) => {
        try {
          const txs = processRows(results.data);
          if (txs.length > 0) { resolve(txs); return; }
          // Retry with ISO-8859-1
          Papa.parse(file, {
            header: true, skipEmptyLines: true, dynamicTyping: false, encoding: 'ISO-8859-1',
            complete: (r2: any) => { try { resolve(processRows(r2.data)); } catch (e) { reject(e); } },
            error: (e: any) => reject(e),
          });
        } catch (e) { reject(e); }
      },
      error: (e: any) => reject(e),
    });
  });
}

function parseXLS(file: File): Promise<Transaction[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: 'array' });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        if (!sheet) throw new Error('El archivo no contiene hojas');
        const json = XLSX.utils.sheet_to_json(sheet, { defval: '' });
        resolve(processRows(json));
      } catch (err) { reject(err); }
    };
    reader.onerror = () => reject(new Error('Error leyendo el archivo'));
    reader.readAsArrayBuffer(file);
  });
}

export async function parseFile(file: File): Promise<Transaction[]> {
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (ext === 'csv' || ext === 'txt') return parseCSV(file);
  if (ext === 'xls' || ext === 'xlsx') return parseXLS(file);
  throw new Error('Formato no soportado. Usa CSV, XLS o XLSX.');
}
