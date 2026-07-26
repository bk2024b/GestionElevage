'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AppLogoMark } from './AppLogoMark'
import { BrandName } from './BrandName'
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
  ShieldCheck,
  ChevronRight,
} from 'lucide-react'

const SECTIONS = [
  {
    titre: 'Élevage',
    items: [
      { href: '/dashboard', label: 'Tableau de bord', icon: Home },
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

export function Sidebar({
  isAdmin = false,
  nom,
  nomElevage,
}: {
  isAdmin?: boolean
  nom?: string | null
  nomElevage?: string | null
}) {
  const pathname = usePathname()
  const initiales = (nom || 'É').slice(0, 2).toUpperCase()

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:shrink-0 md:sticky md:top-0 md:h-screen bg-ink text-white">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <AppLogoMark size="sm" />
        <div>
          <BrandName className="font-semibold text-sm block leading-tight" />
          <span className="text-[10px] text-white/40 uppercase tracking-wide">Cuniculture</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {SECTIONS.map((section) => (
          <div key={section.titre} className="mb-5">
            <p className="text-[10px] uppercase tracking-wide text-white/40 px-3 mb-1.5">{section.titre}</p>
            <div className="flex flex-col gap-0.5">
              {section.items.map(({ href, label, icon: Icon }) => {
                const actif = pathname.startsWith(href)
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-control text-sm transition-colors ${
                      actif ? 'bg-accent-green text-white font-medium' : 'text-white/70 hover:bg-white/5'
                    }`}
                  >
                    <Icon size={16} strokeWidth={actif ? 2.4 : 2} />
                    {label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}

        {isAdmin && (
          <div className="border-t border-white/10 pt-4 mt-2">
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-3 py-2 rounded-control text-sm ${
                pathname.startsWith('/admin') ? 'bg-accent text-white font-medium' : 'text-accent'
              }`}
            >
              <ShieldCheck size={16} />
              Interface admin
            </Link>
          </div>
        )}
      </nav>

      <Link
        href="/parametres"
        className="flex items-center gap-2.5 px-4 py-4 border-t border-white/10 hover:bg-white/5"
      >
        <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-xs font-medium shrink-0">
          {initiales}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm truncate">{nom || 'Éleveur'}</p>
          <p className="text-[11px] text-white/50 truncate">{isAdmin ? 'Administrateur' : nomElevage || 'Éleveur'}</p>
        </div>
        <ChevronRight size={14} className="text-white/40 shrink-0" />
      </Link>
    </aside>
  )
}