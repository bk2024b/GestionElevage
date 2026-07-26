import { Plus, Venus, Mars } from 'lucide-react'

type TypeChip = 'male' | 'femelle' | 'defaut'

export function Chip({ type = 'defaut', children }: { type?: TypeChip; children: React.ReactNode }) {
  const Icon = type === 'male' ? Mars : type === 'femelle' ? Venus : null

  return (
    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-pill border border-line bg-white text-ink font-medium">
      {Icon && <Icon size={12} />}
      {children}
    </span>
  )
}

export function ChipAjouter({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="tap inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-pill border border-dashed border-line text-ink-soft"
    >
      <Plus size={12} />
      Ajouter
    </button>
  )
}