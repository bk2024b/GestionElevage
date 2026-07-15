import { createClient } from '@/lib/supabase/server'
import { supprimerAlimentation } from './actions'
import { formatFCFA } from '@/lib/finances'
import { Card, StatCard } from '@/components/ui/Card'
import { Plus, X } from 'lucide-react'
import Link from 'next/link'

export default async function AlimentationPage() {
  const supabase = await createClient()

  const { data: distributions } = await supabase
    .from('alimentation')
    .select('*')
    .order('date_distribution', { ascending: false })

  const debutMois = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
  const distributionsMois = (distributions ?? []).filter((d) => d.date_distribution >= debutMois)

  const totalKgMois = distributionsMois.reduce((s, d) => s + Number(d.quantite_kg), 0)
  const totalCoutMois = distributionsMois.reduce((s, d) => s + Number(d.cout ?? 0), 0)

  return (
    <div className="px-5 py-6 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-display font-semibold">Alimentation</h1>
        <Link href="/alimentation/nouveau" className="tap flex items-center gap-1 text-sm bg-ink text-paper px-3 py-2 rounded-card">
          <Plus size={16} />
          Ajouter
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard label="Ce mois" value={`${totalKgMois.toFixed(1)} kg`} />
        <StatCard label="Coût ce mois" value={formatFCFA(totalCoutMois)} />
      </div>

      <div className="flex flex-col gap-2">
        {distributions?.map((d) => {
          const supprimerAvecId = supprimerAlimentation.bind(null, d.id)

          return (
            <Card key={d.id} className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm">{d.type_aliment} — {Number(d.quantite_kg)} kg</p>
                <p className="text-xs text-ink-soft">
                  {new Date(d.date_distribution).toLocaleDateString('fr-FR')}
                  {d.cout ? ` — ${formatFCFA(Number(d.cout))}` : ''}
                </p>
              </div>
              <form action={supprimerAvecId}>
                <button type="submit" className="tap text-ink-soft/50">
                  <X size={14} />
                </button>
              </form>
            </Card>
          )
        })}

        {distributions?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-ink-soft mb-1">Aucune distribution enregistrée.</p>
            <p className="text-xs text-ink-soft/70">Enregistre ta première distribution d'aliment.</p>
          </div>
        )}
      </div>
    </div>
  )
}