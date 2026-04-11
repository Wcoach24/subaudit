'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, AlertTriangle } from 'lucide-react';
import type { AuditResult, DetectedSubscription } from '@/lib/detector';

interface ResultsPanelProps {
  result: AuditResult;
  onReset: () => void;
}

const categoryColors: Record<string, { bg: string; badge: string }> = {
  streaming: { bg: 'bg-blue-900/20', badge: 'bg-blue-500/20 text-blue-300' },
  ai_saas: { bg: 'bg-purple-900/20', badge: 'bg-purple-500/20 text-purple-300' },
  gaming: { bg: 'bg-green-900/20', badge: 'bg-green-500/20 text-green-300' },
  fitness: { bg: 'bg-orange-900/20', badge: 'bg-orange-500/20 text-orange-300' },
  cloud: { bg: 'bg-cyan-900/20', badge: 'bg-cyan-500/20 text-cyan-300' },
  delivery: { bg: 'bg-yellow-900/20', badge: 'bg-yellow-500/20 text-yellow-300' },
  fintech: { bg: 'bg-emerald-900/20', badge: 'bg-emerald-500/20 text-emerald-300' },
  productivity: { bg: 'bg-indigo-900/20', badge: 'bg-indigo-500/20 text-indigo-300' },
  telecom: { bg: 'bg-pink-900/20', badge: 'bg-pink-500/20 text-pink-300' },
  insurance: { bg: 'bg-rose-900/20', badge: 'bg-rose-500/20 text-rose-300' },
  education: { bg: 'bg-violet-900/20', badge: 'bg-violet-500/20 text-violet-300' },
  other: { bg: 'bg-gray-900/20', badge: 'bg-gray-500/20 text-gray-300' },
};

const categoryLabels: Record<string, string> = {
  streaming: 'Streaming', ai_saas: 'IA / SaaS', gaming: 'Gaming', fitness: 'Fitness',
  cloud: 'Cloud', delivery: 'Delivery', fintech: 'Fintech', productivity: 'Productividad',
  telecom: 'Telecom', insurance: 'Seguros', education: 'Educaci\u00f3n', other: 'Otros',
};

function formatEuro(amount: number): string {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let current = 0;
    const step = value / 50;
    const timer = setInterval(() => {
      current += step;
      if (current >= value) { setDisplay(value); clearInterval(timer); }
      else { setDisplay(Math.round(current * 100) / 100); }
    }, 20);
    return () => clearInterval(timer);
  }, [value]);
  return <>{formatEuro(display)}</>;
}

function SubscriptionCard({ sub }: { sub: DetectedSubscription }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const colors = categoryColors[sub.category] || categoryColors.other;
  const frequencyLabel = { monthly: '/mes', annual: '/a\u00f1o', weekly: '/semana', unknown: '/mes' }[sub.frequency];

  return (
    <div className={`border border-[#1a202c] rounded-lg overflow-hidden transition-colors hover:border-[#1a202c]/80 ${colors.bg}`}>
      <div className="p-4 cursor-pointer hover:bg-[#12161e]/50 transition-colors" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {sub.faviconUrl ? (
              <div className="w-8 h-8 rounded flex-shrink-0 bg-[#12161e] flex items-center justify-center overflow-hidden">
                <img src={sub.faviconUrl} alt={sub.merchantName} className="w-6 h-6" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
            ) : (
              <div className="w-8 h-8 rounded flex-shrink-0 bg-[#12161e] flex items-center justify-center text-xs font-bold text-gray-400">{sub.merchantName.charAt(0)}</div>
            )}
            <div className="flex-1 min-w-0"><p className="font-semibold text-white truncate">{sub.merchantName}</p></div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-right">
              <p className="font-jetbrains-mono font-semibold text-[#00d2ff] whitespace-nowrap">{formatEuro(sub.amount)}</p>
              <p className="text-xs text-gray-400 whitespace-nowrap">{frequencyLabel}</p>
            </div>
            {isExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors.badge}`}>{categoryLabels[sub.category] || sub.category}</span>
          <span className="text-xs text-gray-400">{sub.occurrences} cargo{sub.occurrences !== 1 ? 's' : ''}</span>
          <span className="text-xs text-gray-400">\u00b7 desde {sub.firstSeen.toLocaleDateString('es-ES')}</span>
        </div>
      </div>
      {isExpanded && sub.cancelSteps.length > 0 && (
        <div className="border-t border-[#1a202c] p-4 bg-[#0b0e14]/50 space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><AlertTriangle size={16} className="text-[#e67e22]" />C\u00f3mo cancelar</h4>
            <ol className="space-y-2">
              {sub.cancelSteps.map((step, idx) => (
                <li key={idx} className="text-sm text-gray-300 flex gap-3">
                  <span className="font-jetbrains-mono font-semibold text-[#00d2ff] flex-shrink-0">{idx + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
          {sub.cancelUrl && (
            <a href={sub.cancelUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-[#00d2ff] hover:bg-[#00d2ff]/20 transition-colors text-sm font-medium">
              Ir a p\u00e1gina de cancelaci\u00f3n <ExternalLink size={14} />
            </a>
          )}
        </div>
      )}
      {isExpanded && sub.cancelSteps.length === 0 && (
        <div className="border-t border-[#1a202c] p-4 bg-[#0b0e14]/50">
          <p className="text-sm text-gray-400">No tenemos instrucciones de cancelaci\u00f3n para este servicio. Busca en la configuraci\u00f3n de tu cuenta.</p>
        </div>
      )}
    </div>
  );
}

export default function ResultsPanel({ result, onReset }: ResultsPanelProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 rounded-lg bg-[#12161e] border border-[#1a202c] hover:border-[#00d2ff]/30 transition-colors">
          <p className="text-sm text-gray-400 mb-2">Total mensual</p>
          <div className="font-jetbrains-mono text-3xl font-bold text-[#00d2ff]"><AnimatedNumber value={result.totalMonthly} /></div>
          <p className="text-xs text-gray-500 mt-2">en suscripciones activas</p>
        </div>
        <div className="p-6 rounded-lg bg-[#12161e] border border-[#1a202c] hover:border-[#00d2ff]/30 transition-colors">
          <p className="text-sm text-gray-400 mb-2">Total anual</p>
          <div className="font-jetbrains-mono text-3xl font-bold text-[#e67e22]"><AnimatedNumber value={result.totalAnnual} /></div>
          <p className="text-xs text-gray-500 mt-2">al a\u00f1o en suscripciones</p>
        </div>
        <div className="p-6 rounded-lg bg-[#12161e] border border-[#1a202c] hover:border-[#00d2ff]/30 transition-colors">
          <p className="text-sm text-gray-400 mb-2">Suscripciones</p>
          <div className="font-jetbrains-mono text-3xl font-bold text-[#2ecc71]">{result.subscriptions.length}</div>
          <p className="text-xs text-gray-500 mt-2">detectadas en tu extracto</p>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-[#e67e22]/10 border border-[#e67e22]/30 flex items-start gap-3">
        <AlertTriangle size={20} className="text-[#e67e22] flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-white">Podr\u00edas estar gastando <span className="font-jetbrains-mono text-[#e67e22]">{formatEuro(result.totalAnnual)}</span>/a\u00f1o en suscripciones</p>
          <p className="text-sm text-gray-300 mt-1">Revisa cada una y cancela las que ya no uses.</p>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-white">Tus suscripciones</h2>
        <div className="space-y-3">
          {result.subscriptions.map((sub) => (<SubscriptionCard key={sub.id} sub={sub} />))}
        </div>
      </div>

      <div className="p-6 rounded-lg bg-[#00d2ff]/5 border border-[#00d2ff]/20 text-center">
        <h3 className="text-lg font-semibold text-white mb-2">\u00bfQuieres una auditor\u00eda financiera completa?</h3>
        <p className="text-gray-400 mb-4">Un experto analiza todos tus gastos y te da un plan de ahorro personalizado.</p>
        <a href="#" className="inline-flex items-center px-6 py-2 rounded-lg bg-[#00d2ff] text-[#04060a] font-semibold hover:bg-[#00b8e6] transition-colors">Solicitar auditor\u00eda \u2014 149\u20ac</a>
      </div>

      <button onClick={onReset} className="w-full px-6 py-3 rounded-lg bg-[#12161e] border border-[#1a202c] text-white font-medium hover:border-[#00d2ff]/50 transition-colors">
        Analizar otro extracto
      </button>
    </div>
  );
}
