import type { Metadata } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SubAudit — Descubre las suscripciones que estás pagando sin saberlo',
  description:
    'Sube tu extracto bancario y descubre cuánto gastas en suscripciones. 100% privado, tus datos no salen de tu navegador. Gratis.',
  keywords: ['suscripciones', 'auditoría', 'extracto bancario', 'ahorro', 'finanzas personales', 'España'],
  openGraph: {
    title: 'SubAudit — ¿Cuánto pierdes en suscripciones que no usas?',
    description: 'El español medio gasta 329€/mes en suscripciones. Descubre las tuyas en 10 segundos.',
    type: 'website',
    locale: 'es_ES',
  },
  robots: 'index, follow',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased bg-[#04060a] text-white`}>
        {children}
      </body>
    </html>
  );
}
