import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'

export function QuickAction({ href, icon: Icon, label }: { href: string; icon: LucideIcon; label: string }) {
  return (
    <Link href={href} className="tap flex flex-col items-center gap-2 py-3">
      <span className="w-12 h-12 flex items-center justify-center rounded-card bg-surface border border-line">
        <Icon size={20} className="text-ink" strokeWidth={1.75} />
      </span>
      <span className="text-xs text-ink-soft text-center leading-tight">{label}</span>
    </Link>
  )
}