'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Rabbit, Bell, PieChart } from 'lucide-react'

const ONGLETS = [
  { href: '/dashboard', label: 'Accueil', icon: Home },
  { href: '/lapins', label: 'Lapins', icon: Rabbit },
  { href: '/rappels', label: 'Rappels', icon: Bell },
  { href: '/finances', label: 'Finances', icon: PieChart },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-line/60 safe-bottom z-20">
      <div className="flex max-w-md mx-auto">
        {ONGLETS.map(({ href, label, icon: Icon }) => {
          const actif = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center gap-1.5 py-3 tap"
            >
              <Icon
                size={22}
                strokeWidth={actif ? 2.2 : 1.6}
                className={actif ? 'text-accent' : 'text-ink-soft/50'}
              />
              <span className={`text-[11px] ${actif ? 'text-accent font-medium' : 'text-ink-soft/50'}`}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}