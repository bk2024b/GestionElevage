import { createClient } from '@/lib/supabase/server'
import { EarTagBadge } from '@/components/lapins/EarTagBadge'
import { modifierLapin, supprimerLapin } from '../actions'
import { notFound } from 'next/navigation'

export default async function FicheLapinPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const { id } = await params
  const { error } = await searchParams
  const supabase = await createClient()

  const { data: lapin } = await supabase.from('lapins').select('*').eq('id', id).single()
  if (!lapin) notFound()

  const modifierAvecId = modifierLapin.bind(null, id)
  const supprimerAvecId = supprimerLapin.bind(null, id)

  return (
    <div className="px-6 py-6 max-w-md">
      <div className="flex items-center gap-3 mb-4">
        <EarTagBadge identifiant={lapin.identifiant} sexe={lapin.sexe} />
        <h1 className="text-xl font-medium">{lapin.nom || 'Sans nom'}</h1>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-md px-3 py-2 mb-3">{error}</p>
      )}

      <form action={modifierAvecId} className="flex flex-col gap-3">
        <input name="nom" type="text" defaultValue={lapin.nom ?? ''} placeholder="Nom" className="border rounded-md px-3 py-2" />
        <input name="race" type="text" defaultValue={lapin.race ?? ''} placeholder="Race" className="border rounded-md px-3 py-2" />
        <input name="date_naissance" type="date" defaultValue={lapin.date_naissance ?? ''} className="border rounded-md px-3 py-2" />
        <input name="poids_actuel" type="number" step="0.1" defaultValue={lapin.poids_actuel ?? ''} placeholder="Poids (kg)" className="border rounded-md px-3 py-2" />
        <input name="couleur" type="text" defaultValue={lapin.couleur ?? ''} placeholder="Couleur" className="border rounded-md px-3 py-2" />
        <input name="numero_cage" type="text" defaultValue={lapin.numero_cage ?? ''} placeholder="Numéro de cage" className="border rounded-md px-3 py-2" />

        <label className="text-sm text-gray-600">
          Âge 1ère saillie prévu (mois)
          <input name="age_premiere_saillie" type="number" defaultValue={lapin.age_premiere_saillie ?? ''} className="border rounded-md px-3 py-2 w-full mt-1" />
        </label>

        <label className="text-sm text-gray-600">
          Statut
          <select name="statut" defaultValue={lapin.statut} className="border rounded-md px-3 py-2 w-full mt-1">
            <option value="actif">Actif</option>
            <option value="vendu">Vendu</option>
            <option value="decede">Décédé</option>
          </select>
        </label>

        <textarea name="notes" defaultValue={lapin.notes ?? ''} placeholder="Notes" className="border rounded-md px-3 py-2" rows={3} />

        <button type="submit" className="bg-[#1F2B22] text-white rounded-md py-2 mt-2">
          Enregistrer les modifications
        </button>
      </form>

      <form action={supprimerAvecId} className="mt-3">
        <button type="submit" className="text-sm text-red-600 w-full text-center py-2">
          Supprimer ce lapin
        </button>
      </form>
    </div>
  )
}