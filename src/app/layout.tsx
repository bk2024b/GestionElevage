import type { Metadata, Viewport } from 'next'
import { Inter, IBM_Plex_Mono } from 'next/font/google'
import { PwaRegister } from '@/components/PwaRegister'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], variable: '--font-plex-mono', weight: ['500'] })

export const metadata: Metadata = {
  title: 'Ferme F001',
  description: "Gestion complète d'élevage cunicole",
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/icons/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Ferme F001',
  },
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
      <body className={`${inter.variable} ${plexMono.variable}`}>
        <PwaRegister />
        {children}
      </body>
    </html>
  )
}