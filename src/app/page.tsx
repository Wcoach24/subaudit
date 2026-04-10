'use client';

import { useRef, useState } from 'react';
import LandingHero from '@/components/LandingHero';
import UploadZone from '@/components/UploadZone';
import ResultsPanel from '@/components/ResultsPanel';
import { parseFile } from '@/lib/parser';
import { detectSubscriptions, AuditResult } from '@/lib/detector';

export default function Home() {
  const [result, setResult] = useState<AuditResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const uploadRef = useRef<HTMLDivElement>(null);

  const scrollToUpload = () => {
    uploadRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFile = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      const transactions = await parseFile(file);

      if (transactions.length === 0) {
        setError('No se encontraron transacciones en el archivo. Verifica que el formato es correcto.');
        setIsProcessing(false);
        return;
      }

      const auditResult = detectSubscriptions(transactions);

      if (auditResult.totalCount === 0) {
        setError(
          `Se leyeron ${transactions.length} transacciones pero no se detectaron suscripciones recurrentes. Prueba con un extracto de más meses.`
        );
        setIsProcessing(false);
        return;
      }

      setResult(auditResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error procesando el archivo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    scrollToUpload();
  };

  return (
    <main className="min-h-screen bg-[#04060a]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#04060a]/80 backdrop-blur-md border-b border-[#1a1f2e]/50">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-sans font-bold text-lg text-white">
            Sub<span className="text-[#00d2ff]">Audit</span>
          </span>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0f1219] rounded-full border border-[#1a1f2e]">
            <svg className="w-3 h-3 text-[#00d2ff]" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-sans text-[11px] text-[#8a8f99]">Tus datos no salen de tu navegador</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      {!result && <LandingHero onStartAudit={scrollToUpload} />}

      {/* Upload + Results section */}
      <section
        ref={uploadRef}
        className={`max-w-2xl mx-auto px-4 ${result ? 'pt-20' : 'pb-20'}`}
      >
        {!result && (
          <div className="space-y-4" id="upload">
            <h2 className="font-sans text-xl font-semibold text-white text-center">
              Sube tu extracto bancario
            </h2>
            <p className="font-sans text-sm text-[#8a8f99] text-center">
              Descarga el extracto desde tu banco en CSV o Excel y arrástralo aquí
            </p>
            <UploadZone onFileSelected={handleFile} isProcessing={isProcessing} />
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-[#e74c3c]/10 border border-[#e74c3c]/30 rounded-lg">
            <p className="font-sans text-sm text-[#ff6b6b]">{error}</p>
          </div>
        )}

        {result && <ResultsPanel result={result} onReset={handleReset} />}
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a1f2e]/50 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-2">
          <p className="font-sans text-xs text-[#8a8f99]">
            SubAudit no almacena ningún dato. Todo el procesamiento ocurre en tu navegador.
          </p>
          <p className="font-sans text-xs text-[#8a8f99]">
            Los cálculos son orientativos. Verifica siempre con tu entidad bancaria.
          </p>
        </div>
      </footer>
    </main>
  );
}
