import { createClient } from '@/lib/supabase/server'
import { supprimerAlimentation } from './actions'
import { formatFCFA } from '@/lib/finances'
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
    <div className="px-6 py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-medium">Alimentation</h1>
        <Link href="/alimentation/nouveau" className="text-sm bg-[#1F2B22] text-white px-3 py-2 rounded-md">
          + Ajouter
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white border rounded-md px-3 py-3">
          <p className="text-xs text-gray-500">Ce mois</p>
          <p className="text-xl font-medium">{totalKgMois.toFixed(1)} kg</p>
        </div>
        <div className="bg-white border rounded-md px-3 py-3">
          <p className="text-xs text-gray-500">Coût ce mois</p>
          <p className="text-xl font-medium">{formatFCFA(totalCoutMois)}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {distributions?.map((d) => {
          const supprimerAvecId = supprimerAlimentation.bind(null, d.id)

          return (
            <div key={d.id} className="flex items-center gap-3 bg-white border rounded-md px-3 py-2">
              <div className="flex-1">
                <p className="text-sm">{d.type_aliment} — {Number(d.quantite_kg)} kg</p>
                <p className="text-xs text-gray-500">
                  {new Date(d.date_distribution).toLocaleDateString('fr-FR')}
                  {d.cout ? ` — ${formatFCFA(Number(d.cout))}` : ''}
                </p>
              </div>
              <form action={supprimerAvecId}>
                <button type="submit" className="text-xs text-gray-400">✕</button>
              </form>
            </div>
          )
        })}

        {distributions?.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-8">
            Aucune distribution enregistrée.
          </p>
        )}
      </div>
    </div>
  )
}