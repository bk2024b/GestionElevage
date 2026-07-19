import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'

export function QuickAction({ href, icon: Icon, label, accent = false }: { href: string; icon: LucideIcon; label: string; accent?: boolean }) {
  return (
    <Link href={href} className="tap flex flex-col items-center gap-2 py-3">
      <span className={`w-14 h-14 flex items-center justify-center rounded-full border ${accent ? 'bg-accent-soft border-accent/20' : 'bg-surface border-line'}`}>
        <Icon size={20} className={accent ? 'text-accent' : 'text-ink'} strokeWidth={1.75} />
      </span>
      <span className={`w-6 h-[3px] rounded-pill ${accent ? 'bg-accent' : 'bg-ink/70'}`} />
      <span className="text-xs text-ink-soft text-center leading-tight">{label}</span>
    </Link>
  )
}