import { creerLapin } from '../actions'

export default async function NouveauLapinPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="px-6 py-6 max-w-md">
      <h1 className="text-xl font-medium mb-4">Nouveau lapin</h1>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-md px-3 py-2 mb-3">{error}</p>
      )}

      <form action={creerLapin} className="flex flex-col gap-3">
        <label className="text-sm text-gray-600">
          Sexe
          <select name="sexe" required className="border rounded-md px-3 py-2 w-full mt-1">
            <option value="F">Femelle</option>
            <option value="M">Mâle</option>
          </select>
        </label>

        <input name="nom" type="text" placeholder="Nom" className="border rounded-md px-3 py-2" />
        <input name="race" type="text" placeholder="Race" className="border rounded-md px-3 py-2" />

        <label className="text-sm text-gray-600">
          Date de naissance
          <input name="date_naissance" type="date" className="border rounded-md px-3 py-2 w-full mt-1" />
        </label>

        <input name="poids_actuel" type="number" step="0.1" placeholder="Poids (kg)" className="border rounded-md px-3 py-2" />
        <input name="couleur" type="text" placeholder="Couleur" className="border rounded-md px-3 py-2" />
        <input name="numero_cage" type="text" placeholder="Numéro de cage" className="border rounded-md px-3 py-2" />

        <label className="text-sm text-gray-600">
          Âge 1ère saillie prévu (mois)
          <input name="age_premiere_saillie" type="number" placeholder="Ex: 6" className="border rounded-md px-3 py-2 w-full mt-1" />
        </label>

        <textarea name="notes" placeholder="Notes" className="border rounded-md px-3 py-2" rows={3} />

        <button type="submit" className="bg-[#1F2B22] text-white rounded-md py-2 mt-2">
          Enregistrer
        </button>
      </form>
    </div>
  )
}