import { createClient } from '@/lib/supabase/server'
import { EarTagBadge } from '@/components/lapins/EarTagBadge'
import { supprimerSoin } from './actions'
import { LABEL_TYPE_SOIN } from '@/lib/sante'
import { formatFCFA } from '@/lib/finances'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Plus, X } from 'lucide-react'
import Link from 'next/link'

const TON_TYPE_SOIN: Record<string, 'danger' | 'accent' | 'neutre' | 'success'> = {
  maladie: 'danger',
  traitement: 'accent',
  vaccin: 'neutre',
  controle_veto: 'success',
}

export default async function SantePage() {
  const supabase = await createClient()

  const { data: soins } = await supabase
    .from('soins')
    .select(`*, lapin:lapin_id(identifiant, sexe, nom)`)
    .order('date_soin', { ascending: false })

  return (
    <div className="px-5 py-6 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-display font-semibold">Santé & soins</h1>
        <Link href="/sante/nouveau" className="tap flex items-center gap-1 text-sm bg-ink text-paper px-3 py-2 rounded-card">
          <Plus size={16} />
          Soin
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {soins?.map((s: any) => {
          const supprimerAvecId = supprimerSoin.bind(null, s.id)

          return (
            <Card key={s.id}>
              <div className="flex items-center gap-2 mb-1">
                <EarTagBadge identifiant={s.lapin.identifiant} sexe={s.lapin.sexe} />
                <Badge ton={TON_TYPE_SOIN[s.type]}>{LABEL_TYPE_SOIN[s.type]}</Badge>
              </div>
              <p className="text-sm mb-1">{s.libelle}</p>
              <div className="flex justify-between items-center">
                <p className="text-xs text-ink-soft">
                  {new Date(s.date_soin).toLocaleDateString('fr-FR')}
                  {s.cout ? ` — ${formatFCFA(Number(s.cout))}` : ''}
                </p>
                <form action={supprimerAvecId}>
                  <button type="submit" className="tap text-ink-soft/50">
                    <X size={14} />
                  </button>
                </form>
              </div>
              {s.notes && <p className="text-xs text-ink-soft mt-1">{s.notes}</p>}
            </Card>
          )
        })}

        {soins?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-ink-soft mb-1">Aucun soin enregistré.</p>
            <p className="text-xs text-ink-soft/70">Enregistre un vaccin, traitement ou contrôle vétérinaire.</p>
          </div>
        )}
      </div>
    </div>
  )
}