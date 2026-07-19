'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AppLogoMark } from './AppLogoMark'
import {
  Home,
  Rabbit,
  HeartPulse,
  Baby,
  Stethoscope,
  Wheat,
  CalendarDays,
  Bell,
  Wallet,
  BarChart3,
  BookOpen,
  Settings,
} from 'lucide-react'

const SECTIONS = [
  {
    titre: 'Élevage',
    items: [
      { href: '/dashboard', label: 'Accueil', icon: Home },
      { href: '/lapins', label: 'Lapins', icon: Rabbit },
      { href: '/reproduction', label: 'Reproduction', icon: HeartPulse },
      { href: '/mises-bas', label: 'Naissances', icon: Baby },
      { href: '/sante', label: 'Santé', icon: Stethoscope },
      { href: '/alimentation', label: 'Alimentation', icon: Wheat },
      { href: '/calendrier', label: 'Calendrier', icon: CalendarDays },
      { href: '/rappels', label: 'Rappels', icon: Bell },
    ],
  },
  {
    titre: 'Gestion',
    items: [
      { href: '/finances', label: 'Finances', icon: Wallet },
      { href: '/statistiques', label: 'Statistiques', icon: BarChart3 },
      { href: '/store', label: 'Ressources', icon: BookOpen },
      { href: '/parametres', label: 'Paramètres', icon: Settings },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:shrink-0 md:sticky md:top-0 md:h-screen bg-ink text-paper">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <AppLogoMark size="sm" />
        <span className="font-display font-semibold text-sm">Élevage</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {SECTIONS.map((section) => (
          <div key={section.titre} className="mb-5">
            <p className="text-[10px] uppercase tracking-wide text-paper/40 px-3 mb-1.5">{section.titre}</p>
            <div className="flex flex-col gap-0.5">
              {section.items.map(({ href, label, icon: Icon }) => {
                const actif = pathname.startsWith(href)
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-card text-sm transition-colors ${
                      actif ? 'bg-accent-soft text-accent font-medium' : 'text-paper/70 hover:bg-paper/5'
                    }`}
                  >
                    <Icon size={16} strokeWidth={actif ? 2.5 : 2} />
                    {label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  )
}