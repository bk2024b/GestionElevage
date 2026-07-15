'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Rabbit, HeartPulse, Baby, Bell } from 'lucide-react'

const ONGLETS = [
  { href: '/dashboard', label: 'Accueil', icon: Home },
  { href: '/lapins', label: 'Lapins', icon: Rabbit },
  { href: '/reproduction', label: 'Reprod.', icon: HeartPulse },
  { href: '/mises-bas', label: 'Naissances', icon: Baby },
  { href: '/rappels', label: 'Rappels', icon: Bell },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-line safe-bottom z-20">
      <div className="flex max-w-md mx-auto">
        {ONGLETS.map(({ href, label, icon: Icon }) => {
          const actif = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center gap-1 py-2.5 tap"
            >
              <span
                className={`flex items-center justify-center w-9 h-6 rounded-pill transition-colors ${
                  actif ? 'bg-accent-soft' : ''
                }`}
              >
                <Icon
                  size={18}
                  strokeWidth={actif ? 2.5 : 2}
                  className={actif ? 'text-accent' : 'text-ink-soft'}
                />
              </span>
              <span className={`text-[10px] ${actif ? 'text-ink font-medium' : 'text-ink-soft'}`}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}