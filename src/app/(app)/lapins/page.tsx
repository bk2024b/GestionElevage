import { createClient } from '@/lib/supabase/server'
import { EarTagBadge } from '@/components/lapins/EarTagBadge'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { Plus, Rabbit } from 'lucide-react'

const TON_STATUT: Record<string, 'success' | 'neutre' | 'danger'> = {
  actif: 'success',
  vendu: 'neutre',
  decede: 'danger',
}

const LABEL_STATUT: Record<string, string> = {
  actif: 'Actif',
  vendu: 'Vendu',
  decede: 'Décédé',
}

export default async function LapinsPage() {
  const supabase = await createClient()
  const { data: lapins } = await supabase
    .from('lapins')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-md md:max-w-5xl mx-auto px-5 py-6">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Mes lapins</h1>
          <p className="text-xs text-ink-soft mt-0.5 hidden md:block">
            {lapins?.length ?? 0} lapin{(lapins?.length ?? 0) > 1 ? 's' : ''} enregistré{(lapins?.length ?? 0) > 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/lapins/nouveau">
          <Button variante="primaire" className="flex items-center gap-1">
            <Plus size={16} />
            Ajouter
          </Button>
        </Link>
      </div>

      {/* Mobile : liste */}
      <div className="flex flex-col gap-2 md:hidden">
        {lapins?.map((lapin) => (
          <Link key={lapin.id} href={`/lapins/${lapin.id}`} className="tap">
            <Card className="!p-4 flex items-center gap-3">
              <EarTagBadge identifiant={lapin.identifiant} sexe={lapin.sexe} />
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{lapin.nom || '—'}</p>
                {lapin.numero_cage && (
                  <p className="text-xs text-ink-soft">Cage {lapin.numero_cage}</p>
                )}
              </div>
              <Badge ton={TON_STATUT[lapin.statut]}>{LABEL_STATUT[lapin.statut]}</Badge>
            </Card>
          </Link>
        ))}
      </div>

      {/* Desktop : grille */}
      <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-4">
        {lapins?.map((lapin) => (
          <Link key={lapin.id} href={`/lapins/${lapin.id}`} className="tap">
            <Card className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className={`w-11 h-11 rounded-control flex items-center justify-center ${lapin.sexe === 'F' ? 'bg-danger/10 text-danger' : 'bg-accent-green-soft text-accent-green'}`}>
                  <Rabbit size={20} strokeWidth={2} />
                </span>
                <Badge ton={TON_STATUT[lapin.statut]}>{LABEL_STATUT[lapin.statut]}</Badge>
              </div>
              <p className="text-sm font-medium mb-1 truncate">{lapin.nom || 'Sans nom'}</p>
              <EarTagBadge identifiant={lapin.identifiant} sexe={lapin.sexe} />
              {lapin.numero_cage && (
                <p className="text-xs text-ink-soft mt-3">Cage {lapin.numero_cage}</p>
              )}
            </Card>
          </Link>
        ))}
      </div>

      {lapins?.length === 0 && (
        <div className="text-center py-16">
          <p className="text-sm text-ink-soft mb-1">Aucun lapin enregistré.</p>
          <p className="text-xs text-ink-soft/70">Ajoute ton premier lapin pour commencer.</p>
        </div>
      )}
    </div>
  )
}