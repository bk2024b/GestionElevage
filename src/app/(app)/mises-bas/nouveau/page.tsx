import { createClient } from '@/lib/supabase/server'
import { creerMiseBas } from '../actions'

export default async function NouvelleMiseBasPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; accouplement_id?: string }>
}) {
  const { error, accouplement_id } = await searchParams
  const supabase = await createClient()

  const { data: accouplements } = await supabase
    .from('accouplements')
    .select(`id, date_misebas_prevue, femelle_id, femelle:accouplements_femelle_id_fkey(identifiant, nom)`)
    .in('statut', ['en_cours', 'confirmee'])
    .order('date_misebas_prevue')

  return (
    <div className="px-6 py-6 max-w-md">
      <h1 className="text-xl font-medium mb-4">Enregistrer une mise bas</h1>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-md px-3 py-2 mb-3">{error}</p>
      )}

      <form action={creerMiseBas} className="flex flex-col gap-3">
        <label className="text-sm text-gray-600">
          Accouplement lié
          <select name="accouplement_id" defaultValue={accouplement_id} className="border rounded-md px-3 py-2 w-full mt-1"
            onChange={undefined}
          >
            <option value="">— Aucun (mise bas manuelle) —</option>
            {accouplements?.map((a: any) => (
              <option key={a.id} value={a.id} data-femelle={a.femelle_id}>
                {a.femelle.identifiant} — prévue le {new Date(a.date_misebas_prevue).toLocaleDateString('fr-FR')}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm text-gray-600">
          Femelle (id) — requis si pas d'accouplement lié
          <input name="femelle_id" type="text" placeholder="UUID de la femelle" className="border rounded-md px-3 py-2 w-full mt-1" />
        </label>

        <label className="text-sm text-gray-600">
          Date de mise bas
          <input
            name="date_misebas"
            type="date"
            required
            defaultValue={new Date().toISOString().split('T')[0]}
            className="border rounded-md px-3 py-2 w-full mt-1"
          />
        </label>

        <div className="grid grid-cols-3 gap-2">
          <input name="nb_males" type="number" placeholder="Mâles" className="border rounded-md px-3 py-2" />
          <input name="nb_femelles" type="number" placeholder="Femelles" className="border rounded-md px-3 py-2" />
          <input name="nb_morts_nes" type="number" placeholder="Morts-nés" className="border rounded-md px-3 py-2" />
        </div>
        <input name="nb_lapereaux" type="number" placeholder="Total lapereaux vivants" className="border rounded-md px-3 py-2" />

        <textarea name="observations" placeholder="Observations" className="border rounded-md px-3 py-2" rows={2} />

        <button type="submit" className="bg-[#1F2B22] text-white rounded-md py-2 mt-2">
          Enregistrer
        </button>
      </form>
    </div>
  )
}