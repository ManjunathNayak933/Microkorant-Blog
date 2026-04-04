import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'MicroKorant Blog', template: '%s | MicroKorant Blog' },
  description: 'Insights on influencer marketing, affiliate programs, SEO, and marketing attribution for Indian D2C brands.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.microkorant.in'),
  openGraph: {
    siteName: 'MicroKorant Blog',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap" rel="stylesheet" />
        <link href="https://api.fontshare.com/v2/css?f[]=clash-display@600,700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
