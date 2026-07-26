'use client'

import { useState, useTransition, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { rechercherLapins } from '@/app/(app)/lapins/actions'
import { EarTagBadge } from '@/components/lapins/EarTagBadge'

export function GlobalSearch() {
  const [terme, setTerme] = useState('')
  const [resultats, setResultats] = useState<any[]>([])
  const [ouvert, setOuvert] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function fermerSiDehors(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOuvert(false)
    }
    document.addEventListener('mousedown', fermerSiDehors)
    return () => document.removeEventListener('mousedown', fermerSiDehors)
  }, [])

  function onChange(valeur: string) {
    setTerme(valeur)
    setOuvert(true)
    startTransition(async () => {
      const r = await rechercherLapins(valeur)
      setResultats(r)
    })
  }

  return (
    <div ref={ref} className="relative w-full max-w-sm">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
      <input
        value={terme}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => terme && setOuvert(true)}
        placeholder="Rechercher un lapin (ex: F001)..."
        className="border border-line rounded-control pl-9 pr-3 py-2.5 text-sm bg-surface w-full focus:border-accent-green outline-none"
      />

      {ouvert && terme && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-line rounded-card shadow-lg overflow-hidden z-30">
          {isPending ? (
            <p className="text-xs text-ink-soft px-4 py-3">Recherche...</p>
          ) : resultats.length > 0 ? (
            resultats.map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  router.push(`/lapins/${l.id}`)
                  setOuvert(false)
                  setTerme('')
                }}
                className="tap flex items-center gap-2 w-full px-4 py-2.5 hover:bg-surface-secondary/50 text-left"
              >
                <EarTagBadge identifiant={l.identifiant} sexe={l.sexe} />
                <span className="text-sm text-ink">{l.nom || 'Sans nom'}</span>
              </button>
            ))
          ) : (
            <p className="text-xs text-ink-soft px-4 py-3">Aucun lapin trouvé.</p>
          )}
        </div>
      )}
    </div>
  )
}