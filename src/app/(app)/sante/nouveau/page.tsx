import { createClient } from '@/lib/supabase/server'
import { creerSoin } from '../actions'

export default async function NouveauSoinPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const supabase = await createClient()

  const { data: lapins } = await supabase
    .from('lapins')
    .select('id, identifiant, nom, sexe')
    .eq('statut', 'actif')
    .order('identifiant')

  return (
    <div className="px-6 py-6 max-w-md">
      <h1 className="text-xl font-medium mb-4">Nouveau soin</h1>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-md px-3 py-2 mb-3">{error}</p>
      )}

      <form action={creerSoin} className="flex flex-col gap-3">
        <label className="text-sm text-gray-600">
          Lapin
          <select name="lapin_id" required className="border rounded-md px-3 py-2 w-full mt-1">
            {lapins?.map((l) => (
              <option key={l.id} value={l.id}>{l.identifiant} — {l.nom || 'sans nom'}</option>
            ))}
          </select>
        </label>

        <label className="text-sm text-gray-600">
          Type
          <select name="type" required className="border rounded-md px-3 py-2 w-full mt-1">
            <option value="maladie">Maladie</option>
            <option value="traitement">Traitement</option>
            <option value="vaccin">Vaccin</option>
            <option value="controle_veto">Contrôle vétérinaire</option>
          </select>
        </label>

        <input name="libelle" type="text" placeholder="Ex: Coccidiose, Vaccin myxomatose..." required className="border rounded-md px-3 py-2" />

        <label className="text-sm text-gray-600">
          Date
          <input
            name="date_soin"
            type="date"
            required
            defaultValue={new Date().toISOString().split('T')[0]}
            className="border rounded-md px-3 py-2 w-full mt-1"
          />
        </label>

        <input name="cout" type="number" step="1" placeholder="Coût (FCFA, optionnel)" className="border rounded-md px-3 py-2" />
        <textarea name="notes" placeholder="Notes" className="border rounded-md px-3 py-2" rows={2} />

        <button type="submit" className="bg-[#1F2B22] text-white rounded-md py-2 mt-2">
          Enregistrer
        </button>
      </form>
    </div>
  )
}