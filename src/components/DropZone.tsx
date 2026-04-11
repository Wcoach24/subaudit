'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload } from 'lucide-react';
import { parseFile, type Transaction } from '@/lib/parser';

interface DropZoneProps {
  onFileProcessed: (transactions: Transaction[]) => void;
  isProcessing: boolean;
  setIsProcessing: (v: boolean) => void;
}

export default function DropZone({
  onFileProcessed,
  isProcessing,
  setIsProcessing,
}: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const processFile = useCallback(async (file: File) => {
    const ext = file.name.toLowerCase().split('.').pop();
    if (!['csv', 'xls', 'xlsx'].includes(ext || '')) {
      setError('Por favor, sube un archivo CSV o XLS.');
      return;
    }

    setError(null);
    setFileName(file.name);
    setIsProcessing(true);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 25;
      });
    }, 150);

    try {
      const result = await parseFile(file);

      clearInterval(progressInterval);
      setProgress(100);

      if (result.errors.length > 0 && result.transactions.length === 0) {
        setError(result.errors[0]);
        setIsProcessing(false);
        setProgress(0);
        return;
      }

      setTimeout(() => {
        onFileProcessed(result.transactions);
        setIsProcessing(false);
        setProgress(0);
      }, 400);
    } catch (err) {
      clearInterval(progressInterval);
      const message = err instanceof Error ? err.message : 'Error al procesar el archivo.';
      setError(message);
      setIsProcessing(false);
      setProgress(0);
    }
  }, [onFileProcessed, setIsProcessing]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) processFile(files[0]);
  }, [processFile]);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.currentTarget.files;
      if (files && files.length > 0) processFile(files[0]);
    },
    [processFile]
  );

  const handleClick = () => {
    if (!isProcessing) fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          relative min-h-[200px] rounded-2xl border-2 border-dashed
          flex flex-col items-center justify-center gap-4 p-8
          transition-all duration-200 cursor-pointer
          ${isDragging
            ? 'border-[#00d2ff] bg-[#00d2ff]/5 shadow-lg shadow-[#00d2ff]/20'
            : 'border-[#1a202c] bg-[#0b0e14] hover:border-[#00d2ff]/50'
          }
          ${isProcessing ? 'opacity-75 pointer-events-none' : ''}
        `}
      >
        <div className={`transition-all duration-200 ${isDragging ? 'scale-110 text-[#00d2ff]' : 'text-gray-400'}`}>
          <Upload size={48} strokeWidth={1.5} />
        </div>

        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-white">{"Arrastra tu extracto bancario aqu\u00ED"}</p>
          <p className="text-sm text-gray-400">o haz clic para seleccionar archivo</p>
          <p className="text-xs text-gray-500">Formatos soportados: CSV, XLS, XLSX</p>
        </div>

        {fileName && !error && (
          <div className="mt-4 px-4 py-2 bg-[#12161e] rounded-lg border border-[#00d2ff]/30">
            <p className="text-sm text-[#00d2ff] font-jetbrains-mono">{fileName}</p>
          </div>
        )}

        {isProcessing && (
          <div className="mt-6 w-full max-w-xs space-y-2">
            <div className="h-1 bg-[#1a202c] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00d2ff] to-[#0099cc] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 text-center">Analizando extracto...</p>
          </div>
        )}

        {error && (
          <div className="mt-4 px-4 py-3 bg-red-900/20 border border-red-500/50 rounded-lg max-w-xs">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xls,.xlsx"
          onChange={handleFileInput}
          className="hidden"
          disabled={isProcessing}
        />
      </div>
    </div>
  );
}
