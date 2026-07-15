import { createClient } from '@/lib/supabase/server'
import { EarTagBadge } from '@/components/lapins/EarTagBadge'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'
import { Plus } from 'lucide-react'

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
    <div className="px-5 py-6 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-display font-semibold">Mes lapins</h1>
        <Link
          href="/lapins/nouveau"
          className="tap flex items-center gap-1 text-sm bg-ink text-paper px-3 py-2 rounded-card"
        >
          <Plus size={16} />
          Ajouter
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {lapins?.map((lapin) => (
          <Link key={lapin.id} href={`/lapins/${lapin.id}`} className="tap">
            <Card className="flex items-center gap-3">
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

        {lapins?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-ink-soft mb-1">Aucun lapin enregistré.</p>
            <p className="text-xs text-ink-soft/70">Ajoute ton premier lapin pour commencer.</p>
          </div>
        )}
      </div>
    </div>
  )
}