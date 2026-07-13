import { createClient } from '@/lib/supabase/server'
import { EarTagBadge } from '@/components/lapins/EarTagBadge'
import { marquerRappelVu } from './actions'
import { LABEL_TYPE_RAPPEL, estEnRetard, estAujourdhui } from '@/lib/rappels'

export default async function RappelsPage() {
  const supabase = await createClient()

  const { data: rappels } = await supabase
    .from('rappels')
    .select(`*, lapin:lapin_id(identifiant, sexe, nom)`)
    .eq('vu', false)
    .order('date_prevue', { ascending: true })

  const { data: rappelsVus } = await supabase
    .from('rappels')
    .select(`*, lapin:lapin_id(identifiant, sexe, nom)`)
    .eq('vu', true)
    .order('date_prevue', { ascending: false })
    .limit(10)

  return (
    <div className="px-6 py-6">
      <h1 className="text-xl font-medium mb-4">Rappels</h1>

      <div className="flex flex-col gap-2 mb-6">
        {rappels?.map((r: any) => {
          const marquerAvecId = marquerRappelVu.bind(null, r.id)
          const retard = estEnRetard(r.date_prevue)
          const aujourdhui = estAujourdhui(r.date_prevue)

          return (
            <div
              key={r.id}
              className={`flex items-center gap-3 border rounded-md px-3 py-2 ${
                retard ? 'bg-red-50 border-red-200' : aujourdhui ? 'bg-amber-50 border-amber-200' : 'bg-white'
              }`}
            >
              {r.lapin && <EarTagBadge identifiant={r.lapin.identifiant} sexe={r.lapin.sexe} />}
              <div className="flex-1">
                <p className="text-sm">{LABEL_TYPE_RAPPEL[r.type] || r.message}</p>
                <p className="text-xs text-gray-500">
                  {retard ? 'En retard — ' : aujourdhui ? "Aujourd'hui — " : ''}
                  {new Date(r.date_prevue).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <form action={marquerAvecId}>
                <button type="submit" className="text-xs bg-gray-100 px-2 py-1 rounded-md">
                  Vu
                </button>
              </form>
            </div>
          )
        })}

        {rappels?.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-8">
            Aucun rappel en attente. Tout est à jour.
          </p>
        )}
      </div>

      {rappelsVus && rappelsVus.length > 0 && (
        <>
          <p className="text-xs text-gray-400 mb-2">Récemment traités</p>
          <div className="flex flex-col gap-2">
            {rappelsVus.map((r: any) => (
              <div key={r.id} className="flex items-center gap-3 border rounded-md px-3 py-2 opacity-50">
                {r.lapin && <EarTagBadge identifiant={r.lapin.identifiant} sexe={r.lapin.sexe} />}
                <p className="text-sm flex-1">{LABEL_TYPE_RAPPEL[r.type] || r.message}</p>
                <p className="text-xs text-gray-500">{new Date(r.date_prevue).toLocaleDateString('fr-FR')}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}