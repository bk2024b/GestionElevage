import type { Metadata, Viewport } from 'next'
import { Sora, Inter, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

const sora = Sora({ subsets: ['latin'], variable: '--font-sora', weight: ['500', '600', '700'] })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], variable: '--font-plex-mono', weight: ['500'] })

export const metadata: Metadata = {
  title: 'Élevage Lapins',
  description: "Gestion complète d'élevage cunicole",
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#1F2B22',
  viewportFit: 'cover',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${sora.variable} ${inter.variable} ${plexMono.variable}`}>
        {children}
      </body>
    </html>
  )
}