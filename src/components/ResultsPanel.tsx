'use client';

import { useEffect, useState } from 'react';
import { AuditResult } from '@/lib/detector';
import SubscriptionCard from './SubscriptionCard';

interface ResultsPanelProps {
  result: AuditResult;
  onReset: () => void;
}

function AnimatedCounter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const duration = 1000;
    let frame: number;
    const tick = () => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased * 100) / 100);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return (
    <span className="font-mono">
      {prefix}{display.toLocaleString('es-ES', { minimumFractionDigits: value % 1 !== 0 ? 2 : 0, maximumFractionDigits: 2 })}{suffix}
    </span>
  );
}

export default function ResultsPanel({ result, onReset }: ResultsPanelProps) {
  const [sortBy, setSortBy] = useState<'amount' | 'duration'>('amount');
  const sorted = [...result.subscriptions].sort((a, b) => sortBy === 'amount' ? b.amount - a.amount : b.monthsActive - a.monthsActive);

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0f1219] border border-[#1a1f2e] rounded-lg p-6">
          <p className="font-sans text-xs uppercase tracking-widest text-[#8a8f99] mb-2">Total mensual</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-white"><AnimatedCounter value={result.totalMonthly} suffix="\u20ac" /></span>
            <span className="font-sans text-sm text-[#8a8f99]">/mes</span>
          </div>
        </div>
        <div className="bg-[#0f1219] border border-[#1a1f2e] rounded-lg p-6">
          <p className="font-sans text-xs uppercase tracking-widest text-[#8a8f99] mb-2">Total anual</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-white"><AnimatedCounter value={result.totalAnnual} suffix="\u20ac" /></span>
            <span className="font-sans text-sm text-[#8a8f99]">/a\u00f1o</span>
          </div>
        </div>
        <div className="bg-[#0f1219] border border-[#1a1f2e] rounded-lg p-6">
          <p className="font-sans text-xs uppercase tracking-widest text-[#8a8f99] mb-2">Suscripciones</p>
          <span className="text-3xl font-bold text-white"><AnimatedCounter value={result.totalCount} /></span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#e74c3c]/15 to-[#e74c3c]/5 border border-[#e74c3c]/30 rounded-lg p-5">
        <p className="font-sans font-medium text-white">
          Podr\u00edas estar desperdiciando hasta{' '}
          <span className="font-mono text-[#ff6b6b] font-bold"><AnimatedCounter value={result.totalAnnual} suffix="\u20ac" /></span> /a\u00f1o en suscripciones
        </p>
        <p className="font-sans text-sm text-[#8a8f99] mt-1">Revisa cada una y decide cu\u00e1les realmente necesitas</p>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setSortBy('amount')} className={`px-4 py-2 rounded-lg font-sans text-sm font-medium transition-all ${sortBy === 'amount' ? 'bg-[#00d2ff] text-black' : 'bg-[#0f1219] text-[#8a8f99] border border-[#1a1f2e] hover:border-[#00d2ff]/50'}`}>Por importe</button>
        <button onClick={() => setSortBy('duration')} className={`px-4 py-2 rounded-lg font-sans text-sm font-medium transition-all ${sortBy === 'duration' ? 'bg-[#00d2ff] text-black' : 'bg-[#0f1219] text-[#8a8f99] border border-[#1a1f2e] hover:border-[#00d2ff]/50'}`}>Por duraci\u00f3n</button>
      </div>

      <div className="space-y-3">
        {sorted.map((sub, i) => <SubscriptionCard key={sub.merchantId || `sub-${i}`} subscription={sub} />)}
      </div>

      <div className="bg-[#0f1219] border border-[#1a1f2e] rounded-lg p-8 text-center space-y-3">
        <p className="font-sans text-lg font-medium text-white">\u00bfQuieres una auditor\u00eda financiera completa?</p>
        <p className="font-sans text-sm text-[#8a8f99]">Recomendaciones personalizadas para optimizar tus gastos</p>
        <a href="#contact" className="inline-block px-6 py-3 bg-[#00d2ff] text-black font-sans font-bold rounded-lg hover:bg-[#00d2ff]/90 transition-all">Solicitar auditor\u00eda completa \u2014 149\u20ac</a>
      </div>

      <div className="flex justify-center">
        <button onClick={onReset} className="px-4 py-2 font-sans text-sm text-[#8a8f99] border border-[#1a1f2e] rounded-lg hover:border-[#00d2ff]/50 hover:text-[#00d2ff] transition-all">\u2190 Analizar otro extracto</button>
      </div>
    </div>
  );
}
