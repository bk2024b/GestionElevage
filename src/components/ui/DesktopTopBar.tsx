import { Bell } from 'lucide-react'
import { GlobalSearch } from './GlobalSearch'
import Link from 'next/link'

export function DesktopTopBar({ nbRappels }: { nbRappels: number }) {
  const dateAujourdhui = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="hidden md:flex items-center justify-between px-8 py-5 border-b border-line bg-surface">
      <GlobalSearch />

      <div className="flex items-center gap-4">
        <span className="text-sm text-ink-soft border border-line rounded-control px-3 py-2">
          {dateAujourdhui}
        </span>
        <Link href="/rappels" className="tap relative w-10 h-10 flex items-center justify-center rounded-full border border-line">
          <Bell size={17} className="text-ink" />
          {nbRappels > 0 && (
            <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-accent" />
          )}
        </Link>
      </div>
    </div>
  )
}