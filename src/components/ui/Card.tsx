import type { HTMLAttributes, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { ChevronRight } from 'lucide-react'

export function Card({
  children,
  className = '',
  ...props
}: { children: ReactNode; className?: string } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`bg-surface border border-line rounded-card p-5 ${className}`} {...props}>
      {children}
    </div>
  )
}

/** Carte stat simple existante : label / valeur / sous-texte optionnel */
export function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <Card className="p-5">
      <p className="text-xs text-ink-soft">{label}</p>
      <p className="text-2xl font-bold text-ink">{value}</p>
      {sub && <p className="text-xs text-ink-soft/70">{sub}</p>}
    </Card>
  )
}

/** Nouvelle carte standard : icône + chiffre + libellé + delta coloré + mini-graphique optionnel */
export function StatCardIcone({
  icon: Icon,
  label,
  value,
  delta,
  tendance = 'neutre',
  donnees,
}: {
  icon: LucideIcon
  label: string
  value: string | number
  delta?: string
  tendance?: 'hausse' | 'baisse' | 'neutre'
  donnees?: number[]
}) {
  const couleurDelta = tendance === 'hausse' ? 'text-accent-green' : tendance === 'baisse' ? 'text-danger' : 'text-ink-soft'
  const flecheDelta = tendance === 'hausse' ? '↑' : tendance === 'baisse' ? '↓' : ''
  const max = donnees && donnees.length > 0 ? Math.max(...donnees, 1) : 1

  return (
    <Card className="flex items-center justify-between">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-ink-soft mb-1">{label}</p>
        <p className="text-[28px] leading-none font-bold text-ink">{value}</p>
        {delta && <p className={`text-xs mt-1.5 ${couleurDelta}`}>{flecheDelta} {delta}</p>}
        {donnees && donnees.length > 0 && (
          <div className="flex items-end gap-0.5 h-5 mt-2">
            {donnees.map((v, i) => (
              <div
                key={i}
                className={`flex-1 rounded-sm ${tendance === 'baisse' ? 'bg-danger/60' : 'bg-accent-green/60'}`}
                style={{ height: `${Math.max((v / max) * 100, 12)}%` }}
              />
            ))}
          </div>
        )}
      </div>
      <span className="w-12 h-12 rounded-control bg-accent-green-soft flex items-center justify-center shrink-0 ml-3">
        <Icon size={22} className="text-accent-green" strokeWidth={2} />
      </span>
    </Card>
  )
}

/** Carte avec tendance : libellé + valeur + mini graphique en barres */
export function TrendCard({
  label,
  value,
  delta,
  donnees,
}: {
  label: string
  value: string | number
  delta?: string
  donnees: number[]
}) {
  const max = Math.max(...donnees, 1)

  return (
    <Card>
      <p className="text-sm text-ink-soft mb-1">{label}</p>
      <div className="flex items-baseline gap-2 mb-3">
        <p className="text-[28px] leading-none font-bold text-ink">{value}</p>
        {delta && <span className="text-xs text-accent-green">↑ {delta}</span>}
      </div>
      <div className="flex items-end gap-0.5 h-8">
        {donnees.map((v, i) => (
          <div
            key={i}
            className="flex-1 bg-accent-green rounded-sm"
            style={{ height: `${Math.max((v / max) * 100, 8)}%` }}
          />
        ))}
      </div>
    </Card>
  )
}

/** Carte d'alerte : icône + titre + sous-titre + chevron */
export function AlertCard({
  icon: Icon,
  titre,
  sousTitre,
  onClick,
}: {
  icon: LucideIcon
  titre: string
  sousTitre: string
  onClick?: () => void
}) {
  return (
    <button onClick={onClick} className="tap w-full flex items-center gap-3 bg-accent-soft rounded-card p-4 text-left">
      <span className="w-9 h-9 rounded-control bg-white flex items-center justify-center shrink-0">
        <Icon size={17} className="text-accent" strokeWidth={2} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink truncate">{titre}</p>
        <p className="text-xs text-ink-soft truncate">{sousTitre}</p>
      </div>
      <ChevronRight size={16} className="text-ink-soft shrink-0" />
    </button>
  )
}