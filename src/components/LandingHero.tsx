'use client';

interface LandingHeroProps {
  onStartAudit: () => void;
}

export default function LandingHero({ onStartAudit }: LandingHeroProps) {
  return (
    <section className="min-h-screen bg-[#04060a] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="w-full max-w-2xl space-y-8 relative z-10">
        <div className="space-y-6 text-center">
          <h1 className="font-sans text-5xl md:text-6xl font-bold text-white leading-tight">
            \u00bfCu\u00e1nto pierdes en suscripciones que no usas?
          </h1>
          <p className="font-sans text-base md:text-lg text-[#8a8f99] leading-relaxed max-w-xl mx-auto">
            El espa\u00f1ol medio gasta <span className="text-white font-medium">329\u20ac/mes</span> en suscripciones. El{' '}
            <span className="text-[#00d2ff] font-medium">42%</span> olvida al menos una. Descubre las tuyas en{' '}
            <span className="text-[#00d2ff] font-medium">10 segundos</span>.
          </p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={onStartAudit}
            className="px-8 py-4 bg-[#00d2ff] text-black font-sans font-bold text-lg rounded-lg hover:bg-[#00d2ff]/90 transition-all shadow-lg shadow-[#00d2ff]/20 hover:shadow-[#00d2ff]/40"
          >
            Analiza tu extracto gratis
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-8">
          <div className="text-center">
            <div className="text-2xl mb-2">\ud83d\udd12</div>
            <p className="font-sans text-xs md:text-sm text-[#8a8f99] font-medium">100% privado</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">\u26a1</div>
            <p className="font-sans text-xs md:text-sm text-[#8a8f99] font-medium">Sin registro</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">\u23f1\ufe0f</div>
            <p className="font-sans text-xs md:text-sm text-[#8a8f99] font-medium">Resultados en segundos</p>
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <div className="flex items-center gap-2 px-4 py-3 bg-[#0f1219] border border-[#1a1f2e] rounded-lg">
            <svg className="w-4 h-4 text-[#00d2ff]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span className="font-sans text-xs text-[#8a8f99]">Tus datos no salen de tu navegador</span>
          </div>
        </div>
      </div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#00d2ff]/10 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-[#00d2ff]/5 rounded-full blur-3xl opacity-20" />
    </section>
  );
}
