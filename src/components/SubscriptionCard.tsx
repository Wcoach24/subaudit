'use client';

import { useState } from 'react';
import { Subscription } from '@/lib/detector';

function getAmountColor(amount: number): string {
  if (amount > 15) return 'text-[#ff6b6b]';
  if (amount > 5) return 'text-[#ffb84d]';
  return 'text-[#51cf66]';
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function SubscriptionCard({ subscription: sub }: { subscription: Subscription }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const faviconUrl = sub.domain ? `https://www.google.com/s2/favicons?domain=${sub.domain}&sz=64` : null;

  return (
    <div className="bg-[#0f1219] border border-[#1a1f2e] rounded-lg overflow-hidden hover:border-[#00d2ff]/30 transition-all">
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#1a1f2e] flex items-center justify-center overflow-hidden">
              {faviconUrl ? (
                <img src={faviconUrl} alt={sub.merchantName} className="w-6 h-6" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              ) : (
                <span className="text-[#8a8f99] text-sm font-bold">{sub.merchantName.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-sans font-medium text-white truncate">{sub.merchantName}</h3>
              <p className="font-sans text-xs text-[#8a8f99] mt-1">{sub.monthsActive} {sub.monthsActive === 1 ? 'mes' : 'meses'} \u00b7 {sub.charges.length} cargos</p>
              <div className="flex items-center gap-2 mt-1.5 text-xs text-[#8a8f99]">
                <span className="font-mono text-[11px]">{formatDate(sub.firstCharge)}</span>
                <span>\u2192</span>
                <span className="font-mono text-[11px]">{formatDate(sub.lastCharge)}</span>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 text-right">
            <div className={`font-mono text-lg font-bold ${getAmountColor(sub.amount)}`}>{sub.amount.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\u20ac</div>
            <p className="font-sans text-xs text-[#8a8f99] mt-0.5">{sub.frequencyLabel}</p>
            <span className="inline-block mt-1.5 px-2 py-0.5 bg-[#1a1f2e] text-[#8a8f99] rounded text-[10px] font-sans">{sub.categoryLabel}</span>
          </div>
        </div>
        <button onClick={() => setIsExpanded(!isExpanded)} className="w-full flex items-center justify-between px-3 py-2 text-[#8a8f99] hover:text-[#00d2ff] hover:bg-[#1a1f2e]/50 rounded transition-all">
          <span className="font-sans text-sm font-medium">C\u00f3mo cancelar</span>
          <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
      </div>
      {isExpanded && (
        <div className="border-t border-[#1a1f2e] bg-[#08090d] px-4 py-4 space-y-3">
          {sub.cancelSteps && sub.cancelSteps.length > 0 ? (
            <>
              <ol className="space-y-2">
                {sub.cancelSteps.map((step, idx) => (
                  <li key={idx} className="font-sans text-sm text-[#8a8f99] flex gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#00d2ff]/20 flex items-center justify-center text-[#00d2ff] text-xs font-medium">{idx + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              {sub.cancelUrl && (
                <a href={sub.cancelUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 px-4 py-2 bg-[#00d2ff]/20 text-[#00d2ff] font-sans text-sm font-medium rounded hover:bg-[#00d2ff]/30 transition-all">Ir a cancelaci\u00f3n \u2192</a>
              )}
            </>
          ) : (
            <p className="font-sans text-sm text-[#8a8f99]">Busca en la configuraci\u00f3n del servicio c\u00f3mo cancelar tu suscripci\u00f3n.</p>
          )}
        </div>
      )}
    </div>
  );
}
