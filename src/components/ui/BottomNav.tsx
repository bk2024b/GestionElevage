'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Rabbit, Bell, Wallet } from 'lucide-react'

const ONGLETS = [
  { href: '/dashboard', label: 'Accueil', icon: Home },
  { href: '/lapins', label: 'Lapins', icon: Rabbit },
  { href: '/rappels', label: 'Rappels', icon: Bell },
  { href: '/finances', label: 'Finances', icon: Wallet },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-line safe-bottom z-20">
      <div className="flex max-w-md mx-auto">
        {ONGLETS.map(({ href, label, icon: Icon }) => {
          const actif = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center gap-1 py-2.5 tap"
            >
              <Icon
                size={20}
                strokeWidth={actif ? 2.4 : 1.8}
                className={actif ? 'text-accent' : 'text-ink-soft/60'}
              />
              <span className={`text-[10px] ${actif ? 'text-accent font-medium' : 'text-ink-soft/60'}`}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}