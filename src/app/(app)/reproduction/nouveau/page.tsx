import { createClient } from '@/lib/supabase/server'
import { creerAccouplement } from '../actions'

export default async function NouvelAccouplementPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const supabase = await createClient()

  const { data: femelles } = await supabase
    .from('lapins')
    .select('id, identifiant, nom')
    .eq('sexe', 'F')
    .eq('statut', 'actif')
    .order('identifiant')

  const { data: males } = await supabase
    .from('lapins')
    .select('id, identifiant, nom')
    .eq('sexe', 'M')
    .eq('statut', 'actif')
    .order('identifiant')

  return (
    <div className="px-6 py-6 max-w-md">
      <h1 className="text-xl font-medium mb-4">Nouvel accouplement</h1>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-md px-3 py-2 mb-3">{error}</p>
      )}

      {(!femelles?.length || !males?.length) && (
        <p className="text-sm text-amber-700 bg-amber-50 rounded-md px-3 py-2 mb-3">
          Il te faut au moins une femelle et un mâle actifs pour enregistrer un accouplement.
        </p>
      )}

      <form action={creerAccouplement} className="flex flex-col gap-3">
        <label className="text-sm text-gray-600">
          Femelle
          <select name="femelle_id" required className="border rounded-md px-3 py-2 w-full mt-1">
            {femelles?.map((f) => (
              <option key={f.id} value={f.id}>{f.identifiant} — {f.nom || 'sans nom'}</option>
            ))}
          </select>
        </label>

        <label className="text-sm text-gray-600">
          Mâle
          <select name="male_id" required className="border rounded-md px-3 py-2 w-full mt-1">
            {males?.map((m) => (
              <option key={m.id} value={m.id}>{m.identifiant} — {m.nom || 'sans nom'}</option>
            ))}
          </select>
        </label>

        <label className="text-sm text-gray-600">
          Date d'accouplement
          <input
            name="date_accouplement"
            type="date"
            required
            defaultValue={new Date().toISOString().split('T')[0]}
            className="border rounded-md px-3 py-2 w-full mt-1"
          />
        </label>

        <textarea name="notes" placeholder="Notes" className="border rounded-md px-3 py-2" rows={2} />

        <button type="submit" className="bg-[#1F2B22] text-white rounded-md py-2 mt-2">
          Enregistrer
        </button>
      </form>
    </div>
  )
}