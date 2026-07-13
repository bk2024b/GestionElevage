'use client'

import { useState } from 'react'
import { EvenementCalendrier, COULEUR_EVENEMENT, LABEL_LEGENDE } from '@/lib/calendrier'

const JOURS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const MOIS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']

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
  const decalage = (premierJourMois.getDay() + 6) % 7 // lundi = 0

  const jours: (string | null)[] = Array(decalage).fill(null)
  for (let j = 1; j <= dernierJourMois.getDate(); j++) {
    jours.push(new Date(annee, mois, j).toISOString().split('T')[0])
  }

  const aujourdhui = new Date().toISOString().split('T')[0]

  function changerMois(delta: number) {
    setMoisCourant(new Date(annee, mois + delta, 1))
    setJourSelectionne(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => changerMois(-1)} className="text-sm px-3 py-1 border rounded-md">←</button>
        <p className="text-sm font-medium">{MOIS[mois]} {annee}</p>
        <button onClick={() => changerMois(1)} className="text-sm px-3 py-1 border rounded-md">→</button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {JOURS.map((j, i) => (
          <div key={i} className="text-center text-xs text-gray-400">{j}</div>
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
              className={`flex flex-col items-center py-1.5 rounded-md text-xs ${
                estSelectionne ? 'bg-[#1F2B22] text-white' : estAujourdhui ? 'bg-amber-50' : ''
              }`}
            >
              <span>{Number(date.split('-')[2])}</span>
              {evts.length > 0 && (
                <div className="flex gap-0.5 mt-0.5">
                  {evts.slice(0, 3).map((e, idx) => (
                    <span key={idx} className={`w-1.5 h-1.5 rounded-full ${COULEUR_EVENEMENT[e.type]}`} />
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(LABEL_LEGENDE).map(([type, label]) => (
          <div key={type} className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${COULEUR_EVENEMENT[type]}`} />
            <span className="text-xs text-gray-500">{label}</span>
          </div>
        ))}
      </div>

      {jourSelectionne && (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-600">
            {new Date(jourSelectionne).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          {(evenementsParJour.get(jourSelectionne) ?? []).map((e, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-white border rounded-md px-3 py-2">
              <span className={`w-2 h-2 rounded-full ${COULEUR_EVENEMENT[e.type]}`} />
              <span className="text-sm flex-1">{e.label}</span>
              {e.lapinIdentifiant && <span className="text-xs text-gray-500 font-mono">{e.lapinIdentifiant}</span>}
            </div>
          ))}
          {(evenementsParJour.get(jourSelectionne) ?? []).length === 0 && (
            <p className="text-xs text-gray-400">Aucun événement ce jour.</p>
          )}
        </div>
      )}
    </div>
  )
}