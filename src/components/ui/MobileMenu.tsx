'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu,
  X,
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

export function MobileMenu({ isAdmin = false }: { isAdmin?: boolean }) {
  const [ouvert, setOuvert] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <button onClick={() => setOuvert(true)} className="md:hidden tap text-ink">
        <Menu size={22} />
      </button>

      {ouvert && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-ink/40"
            onClick={() => setOuvert(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-paper safe-top safe-bottom overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-5">
              <span className="font-semibold text-sm">Menu</span>
              <button onClick={() => setOuvert(false)} className="tap text-ink-soft">
                <X size={20} />
              </button>
            </div>

            <nav className="px-3">
              {SECTIONS.map((section) => (
                <div key={section.titre} className="mb-5">
                  <p className="text-[10px] uppercase tracking-wide text-ink-soft/50 px-3 mb-1.5">
                    {section.titre}
                  </p>
                  <div className="flex flex-col gap-0.5">
                    {section.items.map(({ href, label, icon: Icon }) => {
                      const actif = pathname.startsWith(href)
                      return (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setOuvert(false)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-control text-sm ${
                            actif ? 'bg-accent-green-soft text-accent-green font-medium' : 'text-ink'
                          }`}
                        >
                          <Icon size={17} strokeWidth={actif ? 2.4 : 1.8} />
                          {label}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}

              {isAdmin && (
                <div className="border-t border-line pt-4 mt-2">
                  <Link
                    href="/admin"
                    onClick={() => setOuvert(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-control text-sm ${
                      pathname.startsWith('/admin') ? 'bg-accent-soft text-accent font-medium' : 'text-accent'
                    }`}
                  >
                    <ShieldCheck size={17} />
                    Interface admin
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}