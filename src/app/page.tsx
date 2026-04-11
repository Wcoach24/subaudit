'use client'

import { useState, useRef, useEffect } from 'react'
import { Shield, Upload, Search, Scissors } from 'lucide-react'
import DropZone from '@/components/DropZone'
import ResultsPanel from '@/components/ResultsPanel'
import { detectSubscriptions } from '@/lib/detector'
import type { Transaction } from '@/lib/parser'
import type { AuditResult } from '@/lib/detector'

export default function Home() {
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)

  const handleFileProcessed = (parsedTransactions: Transaction[]) => {
    const results = detectSubscriptions(parsedTransactions)
    setAuditResult(results)
  }

  const handleReset = () => {
    setAuditResult(null)
  }

  useEffect(() => {
    if (statsRef.current && !auditResult) {
      const counters = statsRef.current.querySelectorAll('[data-counter]')
      counters.forEach((el) => {
        const target = parseInt(el.getAttribute('data-target') || '0')
        animateCounter(el as HTMLElement, target)
      })
    }
  }, [auditResult])

  const animateCounter = (el: HTMLElement, target: number) => {
    let current = 0
    const increment = target / 60
    const interval = setInterval(() => {
      current += increment
      if (current >= target) {
        el.textContent = target.toString()
        clearInterval(interval)
      } else {
        el.textContent = Math.floor(current).toString()
      }
    }, 30)
  }

  return (
    <div className="min-h-screen bg-[#04060a] text-[#f0f0f0]">
      <header className="sticky top-0 z-40 backdrop-blur-sm border-b border-[#12161e] bg-[#04060a]/80">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-[#00d2ff]/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-[#00d2ff]" />
            </div>
            <h1 className="text-2xl font-bold font-space-grotesk">SubAudit</h1>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0b0e14] border border-[#12161e] rounded-full text-sm text-[#a0a0a0]">
            \ud83d\udd12 Tus datos no salen de tu navegador
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {!auditResult ? (
          <>
            <section className="mb-16 text-center">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 font-space-grotesk leading-tight">
                \u00bfCu\u00e1nto pierdes en{' '}
                <span className="text-[#00d2ff]">suscripciones</span> que no usas?
              </h2>
              <p className="text-lg sm:text-xl text-[#a0a0a0] max-w-2xl mx-auto mb-10">
                Sube tu extracto bancario y descubre en 10 segundos todas las suscripciones que est\u00e1s pagando. Sin registros. Sin enviar tus datos a ning\u00fan servidor.
              </p>

              <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
                <div className="p-6 bg-[#0b0e14] border border-[#12161e] rounded-lg">
                  <div className="text-4xl font-bold font-jetbrains-mono text-[#00d2ff] mb-2">
                    <span data-counter data-target="329">0</span>\u20ac
                  </div>
                  <p className="text-[#a0a0a0] text-sm">gasta de media un espa\u00f1ol en suscripciones</p>
                </div>
                <div className="p-6 bg-[#0b0e14] border border-[#12161e] rounded-lg">
                  <div className="text-4xl font-bold font-jetbrains-mono text-[#2ecc71] mb-2">
                    <span data-counter data-target="42">0</span>%
                  </div>
                  <p className="text-[#a0a0a0] text-sm">olvida al menos una suscripci\u00f3n activa</p>
                </div>
                <div className="p-6 bg-[#0b0e14] border border-[#12161e] rounded-lg">
                  <div className="text-4xl font-bold font-jetbrains-mono text-[#e67e22] mb-2">
                    <span data-counter data-target="67">0</span>\u20ac
                  </div>
                  <p className="text-[#a0a0a0] text-sm">de media en suscripciones no usadas</p>
                </div>
              </div>

              <DropZone onFileProcessed={handleFileProcessed} isProcessing={isProcessing} setIsProcessing={setIsProcessing} />
            </section>

            <section className="mb-16">
              <h3 className="text-3xl font-bold text-center mb-12 font-space-grotesk">C\u00f3mo funciona</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-[#0b0e14] border border-[#12161e] flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-[#00d2ff]" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">1. Sube tu extracto</h4>
                  <p className="text-[#a0a0a0]">Carga tu extracto bancario en CSV o Excel. Tus datos nunca salen de tu navegador.</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-[#0b0e14] border border-[#12161e] flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-[#00d2ff]" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">2. An\u00e1lisis autom\u00e1tico</h4>
                  <p className="text-[#a0a0a0]">Detectamos patrones de cobros recurrentes y los cruzamos con nuestra base de datos de servicios.</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-[#0b0e14] border border-[#12161e] flex items-center justify-center mb-4">
                    <Scissors className="w-8 h-8 text-[#00d2ff]" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">3. Cancela lo que sobra</h4>
                  <p className="text-[#a0a0a0]">Te damos instrucciones paso a paso para cancelar cada suscripci\u00f3n que no uses.</p>
                </div>
              </div>
            </section>

            <section className="mb-16 p-8 bg-[#0b0e14] border border-[#12161e] rounded-lg text-center">
              <h3 className="text-2xl font-bold mb-8 font-space-grotesk">As\u00ed cuidamos tu privacidad</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <Shield className="w-8 h-8 text-[#00d2ff] mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">100% privado</h4>
                  <p className="text-[#a0a0a0] text-sm">Todo el an\u00e1lisis se realiza en tu navegador. Cero servidores.</p>
                </div>
                <div>
                  <Shield className="w-8 h-8 text-[#2ecc71] mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Sin registro</h4>
                  <p className="text-[#a0a0a0] text-sm">No necesitas crear cuenta ni compartir tu email.</p>
                </div>
                <div>
                  <Shield className="w-8 h-8 text-[#e67e22] mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Gratis</h4>
                  <p className="text-[#a0a0a0] text-sm">Sin costos ocultos. Tu auditor\u00eda b\u00e1sica, siempre gratis.</p>
                </div>
              </div>
            </section>
          </>
        ) : (
          <ResultsPanel result={auditResult} onReset={handleReset} />
        )}
      </main>

      {!auditResult && (
        <section className="py-16 border-t border-[#12161e] text-center">
          <h3 className="text-3xl font-bold mb-4 font-space-grotesk">\u00bfQuieres una auditor\u00eda financiera completa?</h3>
          <p className="text-[#a0a0a0] mb-6 max-w-lg mx-auto">Un experto analiza todos tus gastos y te da un plan personalizado de ahorro.</p>
          <a href="#" className="cta-primary inline-block">Solicitar auditor\u00eda \u2014 149\u20ac \u2192</a>
        </section>
      )}

      <footer className="border-t border-[#12161e] py-8 text-center text-[#a0a0a0] text-sm">
        <p className="mb-2">SubAudit \u00a9 2026</p>
        <p className="text-xs max-w-lg mx-auto">SubAudit es una herramienta orientativa. Los datos se procesan exclusivamente en tu navegador y nunca se env\u00edan a ning\u00fan servidor. Los c\u00e1lculos son aproximados.</p>
      </footer>
    </div>
  )
}
