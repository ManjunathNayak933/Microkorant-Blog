import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'The Korant — Indian Marketing Intelligence', template: '%s · The Korant' },
  description: 'Sharp, independent analysis on influencer marketing, D2C growth, and how Indian consumer brands spend — and misplace — their marketing budgets.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://korant.microkorant.in'),
  openGraph: {
    siteName: 'The Korant',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <link href="https://api.fontshare.com/v2/css?f[]=clash-display@600,700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
