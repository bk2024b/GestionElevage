'use client'

import { useEffect, useState, useCallback } from 'react'
import { marquerTourTermine } from '@/app/(app)/dashboard/actions'
import { Button } from '@/components/ui/Button'

interface Etape {
  cible: string | null
  titre: string
  texte: string
}

const ETAPES: Etape[] = [
  {
    cible: null,
    titre: 'Bienvenue sur Ferme F001 👋',
    texte: "Petite visite guidée en quelques secondes pour te montrer l'essentiel de ton tableau de bord.",
  },
  {
    cible: 'kpi-total',
    titre: 'Ton cheptel en un coup d\'œil',
    texte: 'Le nombre total de lapins de ton élevage, mis à jour automatiquement à chaque nouvelle fiche ou vente.',
  },
  {
    cible: 'kpi-engraissement',
    titre: 'Les sujets prêts à vendre',
    texte: 'Dès qu\'un lapereau est sevré, il passe ici — ce sont les lapins que tu peux vendre.',
  },
  {
    cible: 'alertes',
    titre: 'Rien à retenir par cœur',
    texte: 'Palpation, mise bas, sevrage — tes rappels apparaissent ici automatiquement, au bon moment.',
  },
  {
    cible: 'finances',
    titre: 'Ta rentabilité, claire',
    texte: 'Le bénéfice du mois, calculé à partir de tes dépenses et revenus enregistrés — plus besoin de calculer à la main.',
  },
  {
    cible: null,
    titre: "C'est tout pour l'essentiel !",
    texte: 'Retrouve toutes les autres fonctionnalités via le menu ☰ en haut (mobile) ou la barre latérale (ordinateur). Bonne prise en main !',
  },
]

export function GuidedTour({ actif }: { actif: boolean }) {
  const [visible, setVisible] = useState(actif)
  const [index, setIndex] = useState(0)
  const [rect, setRect] = useState<DOMRect | null>(null)

  const etape = ETAPES[index]

  const recalculer = useCallback(() => {
    if (!etape.cible) {
      setRect(null)
      return
    }
    const el = document.querySelector(`[data-tour="${etape.cible}"]`)
    if (el) setRect(el.getBoundingClientRect())
  }, [etape.cible])

  useEffect(() => {
    if (!visible) return
    recalculer()
    window.addEventListener('resize', recalculer)
    window.addEventListener('scroll', recalculer, true)
    return () => {
      window.removeEventListener('resize', recalculer)
      window.removeEventListener('scroll', recalculer, true)
    }
  }, [visible, recalculer])

  async function terminer() {
    setVisible(false)
    await marquerTourTermine()
  }

  function suivant() {
    if (index < ETAPES.length - 1) {
      setIndex(index + 1)
    } else {
      terminer()
    }
  }

  if (!visible) return null

  const pad = 8
  const cadre = rect
    ? { top: rect.top - pad, left: rect.left - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 }
    : null

  // Position du panneau : sous la cible si possible, sinon centré
  const panneauStyle: React.CSSProperties = cadre
    ? {
        position: 'fixed',
        top: Math.min(cadre.top + cadre.height + 14, window.innerHeight - 220),
        left: Math.max(Math.min(cadre.left, window.innerWidth - 320), 12),
        zIndex: 70,
      }
    : {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 70,
      }

  return (
    <>
      {/* Voile sombre avec découpe autour de la cible */}
      <div className="fixed inset-0 z-[60] pointer-events-none">
        {cadre ? (
          <>
            <div className="absolute bg-ink/50" style={{ top: 0, left: 0, right: 0, height: Math.max(cadre.top, 0) }} />
            <div className="absolute bg-ink/50" style={{ top: cadre.top, left: 0, width: Math.max(cadre.left, 0), height: cadre.height }} />
            <div className="absolute bg-ink/50" style={{ top: cadre.top, left: cadre.left + cadre.width, right: 0, height: cadre.height }} />
            <div className="absolute bg-ink/50" style={{ top: cadre.top + cadre.height, left: 0, right: 0, bottom: 0 }} />
            <div
              className="absolute rounded-control ring-2 ring-accent-green"
              style={{ top: cadre.top, left: cadre.left, width: cadre.width, height: cadre.height }}
            />
          </>
        ) : (
          <div className="absolute inset-0 bg-ink/50" />
        )}
      </div>

      {/* Panneau explicatif */}
      <div style={panneauStyle} className="w-[290px] bg-surface rounded-card shadow-xl border border-line p-5 pointer-events-auto">
        <p className="text-xs text-ink-soft mb-1">Étape {index + 1} / {ETAPES.length}</p>
        <h3 className="text-base font-semibold text-ink mb-1.5">{etape.titre}</h3>
        <p className="text-sm text-ink-soft leading-relaxed mb-4">{etape.texte}</p>
        <div className="flex items-center justify-between gap-2">
          <button onClick={terminer} className="tap text-xs text-ink-soft/70">
            Passer
          </button>
          <Button variante="primaire" className="text-xs py-2 px-4" onClick={suivant}>
            {index < ETAPES.length - 1 ? 'Suivant' : 'Terminer'}
          </Button>
        </div>
      </div>
    </>
  )
}