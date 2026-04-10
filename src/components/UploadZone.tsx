'use client';

import { useRef, useState } from 'react';

interface UploadZoneProps {
  onFileSelected: (file: File) => void;
  isProcessing: boolean;
}

export default function UploadZone({ onFileSelected, isProcessing }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const acceptString = 'text/csv,.csv,.xls,.xlsx,.txt';

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files?.[0]) onFileSelected(e.dataTransfer.files[0]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) onFileSelected(e.target.files[0]);
  };

  return (
    <div className="w-full">
      <input ref={inputRef} type="file" accept={acceptString} onChange={handleChange} className="hidden" />
      <div
        onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative p-12 rounded-lg border-2 border-dashed transition-all cursor-pointer ${
          isDragActive ? 'border-[#00d2ff] bg-[#00d2ff]/10' : 'border-[#1a1f2e] bg-[#0b0e14] hover:border-[#00d2ff]/50'
        } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <div className="flex flex-col items-center justify-center gap-4">
          {isProcessing ? (
            <>
              <div className="w-12 h-12 rounded-full border-2 border-[#1a1f2e] border-t-[#00d2ff] animate-spin" />
              <p className="font-sans text-sm text-[#8a8f99]">Procesando tu archivo...</p>
              <div className="w-48 h-1 bg-[#1a1f2e] rounded-full overflow-hidden"><div className="h-full bg-[#00d2ff] animate-pulse" /></div>
            </>
          ) : (
            <>
              <svg className="w-12 h-12 text-[#00d2ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="text-center">
                <p className="font-sans text-base font-medium text-white">Arrastra tu extracto bancario aqu\u00ed</p>
                <p className="font-sans text-sm text-[#8a8f99] mt-1">o haz clic para seleccionar</p>
              </div>
              <p className="font-sans text-xs text-[#8a8f99] mt-2">.csv, .xls, .xlsx, .txt</p>
            </>
          )}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-[#0f1219] rounded-lg border border-[#1a1f2e]">
        <svg className="w-4 h-4 text-[#00d2ff]" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        <span className="font-sans text-xs text-[#8a8f99]">\ud83d\udd12 Tus datos no salen de tu navegador</span>
      </div>
    </div>
  );
}
