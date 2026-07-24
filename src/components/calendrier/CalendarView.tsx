'use client'

import { useState } from 'react'
import { EvenementCalendrier, LABEL_LEGENDE } from '@/lib/calendrier'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'

const JOURS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const MOIS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']

const COULEUR_POINT: Record<string, string> = {
  accouplement: 'bg-ink',
  nid: 'bg-accent',
  misebas: 'bg-danger',
  sevrage: 'bg-success',
  soin: 'bg-ink-soft',
}

export function CalendarView({ evenements }: { evenements: EvenementCalendrier[] }) {
  const [moisCourant, setMoisCourant] = useState(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })
  const [jourSelectionne, setJourSelectionne] = useState<string | null>(null)

  const evenementsParJour = new Map<string, EvenementCalendrier[]>()
  for (const e of evenements) {
    const liste = evenementsParJour.get(e.date) ?? []
    liste.push(e)
    evenementsParJour.set(e.date, liste)
  }

  const annee = moisCourant.getFullYear()
  const mois = moisCourant.getMonth()
  const premierJourMois = new Date(annee, mois, 1)
  const dernierJourMois = new Date(annee, mois + 1, 0)
  const decalage = (premierJourMois.getDay() + 6) % 7

  const jours: (string | null)[] = Array(decalage).fill(null)
  for (let j = 1; j <= dernierJourMois.getDate(); j++) {
    jours.push(new Date(annee, mois, j).toISOString().split('T')[0])
  }

  const aujourdhui = new Date().toISOString().split('T')[0]

  function changerMois(delta: number) {
    setMoisCourant(new Date(annee, mois + delta, 1))
    setJourSelectionne(null)
  }

  const detailJour = (
    <div>
      <p className="text-sm text-ink-soft mb-2">
        {jourSelectionne
          ? new Date(jourSelectionne).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
          : 'Sélectionne un jour'}
      </p>
      {jourSelectionne && (
        <div className="flex flex-col gap-2">
          {(evenementsParJour.get(jourSelectionne) ?? []).map((e, idx) => (
            <Card key={idx} className="!p-3 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${COULEUR_POINT[e.type]}`} />
              <span className="text-sm flex-1">{e.label}</span>
              {e.lapinIdentifiant && <span className="text-xs text-ink-soft font-mono">{e.lapinIdentifiant}</span>}
            </Card>
          ))}
          {(evenementsParJour.get(jourSelectionne) ?? []).length === 0 && (
            <p className="text-xs text-ink-soft/70">Aucun événement ce jour.</p>
          )}
        </div>
      )}
    </div>
  )

  return (
    <div className="md:grid md:grid-cols-[1fr_320px] md:gap-6 md:items-start">
      <div>
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => changerMois(-1)} className="tap p-2 border border-line rounded-card">
            <ChevronLeft size={16} />
          </button>
          <p className="text-sm font-medium font-display">{MOIS[mois]} {annee}</p>
          <button onClick={() => changerMois(1)} className="tap p-2 border border-line rounded-card">
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-1">
          {JOURS.map((j, i) => (
            <div key={i} className="text-center text-xs text-ink-soft/60">{j}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 mb-4">
          {jours.map((date, i) => {
            if (!date) return <div key={i} />
            const evts = evenementsParJour.get(date) ?? []
            const estAujourdhui = date === aujourdhui
            const estSelectionne = date === jourSelectionne

            return (
              <button
                key={date}
                onClick={() => setJourSelectionne(estSelectionne ? null : date)}
                className={`tap flex flex-col items-center py-2 md:py-3 rounded-card text-xs ${
                  estSelectionne ? 'bg-ink text-paper' : estAujourdhui ? 'bg-accent-soft' : ''
                }`}
              >
                <span>{Number(date.split('-')[2])}</span>
                {evts.length > 0 && (
                  <div className="flex gap-0.5 mt-0.5">
                    {evts.slice(0, 3).map((e, idx) => (
                      <span key={idx} className={`w-1.5 h-1.5 rounded-full ${COULEUR_POINT[e.type]}`} />
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>

        <div className="flex flex-wrap gap-3">
          {Object.entries(LABEL_LEGENDE).map(([type, label]) => (
            <div key={type} className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${COULEUR_POINT[type]}`} />
              <span className="text-xs text-ink-soft">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile : détail sous le calendrier, seulement si un jour est sélectionné */}
      {jourSelectionne && (
        <div className="md:hidden mt-4">
          {detailJour}
        </div>
      )}

      {/* Desktop : panneau de détail toujours visible à côté */}
      <div className="hidden md:block sticky top-6">
        {detailJour}
      </div>
    </div>
  )
}