import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SubAudit — Detecta suscripciones ocultas en tu extracto bancario',
  description: 'Sube tu extracto bancario y descubre en 10 segundos todas las suscripciones que estás pagando. Análisis privado, sin registro, sin enviar tus datos a ningún servidor.',
  openGraph: {
    title: 'SubAudit — Detecta suscripciones ocultas en tu extracto bancario',
    description: 'Sube tu extracto bancario y descubre en 10 segundos todas las suscripciones que estás pagando.',
    type: 'website',
    url: 'https://subaudit.es',
    siteName: 'SubAudit',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SubAudit — Detecta suscripciones ocultas en tu extracto bancario',
    description: 'Sube tu extracto bancario y descubre en 10 segundos todas las suscripciones que estás pagando.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'SubAudit',
              description: 'Detecta suscripciones ocultas en tu extracto bancario',
              url: 'https://subaudit.es',
              applicationCategory: 'FinanceApplication',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'EUR',
                description: 'Análisis gratuito de suscripciones',
              },
            }),
          }}
        />
      </head>
      <body className="font-space-grotesk bg-[#04060a] text-[#f0f0f0]">
        {children}
      </body>
    </html>
  )
}
