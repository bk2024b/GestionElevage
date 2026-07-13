import { creerAlimentation } from '../actions'

export default async function NouvelleAlimentationPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="px-6 py-6 max-w-md">
      <h1 className="text-xl font-medium mb-4">Nouvelle distribution</h1>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-md px-3 py-2 mb-3">{error}</p>
      )}

      <form action={creerAlimentation} className="flex flex-col gap-3">
        <label className="text-sm text-gray-600">
          Type d'aliment
          <select name="type_aliment" required className="border rounded-md px-3 py-2 w-full mt-1">
            <option value="Granulés">Granulés</option>
            <option value="Foin">Foin</option>
            <option value="Verdure">Verdure</option>
            <option value="Complément">Complément</option>
            <option value="Autre">Autre</option>
          </select>
        </label>

        <input name="quantite_kg" type="number" step="0.1" placeholder="Quantité (kg)" required className="border rounded-md px-3 py-2" />
        <input name="cout" type="number" step="1" placeholder="Coût (FCFA, optionnel)" className="border rounded-md px-3 py-2" />

        <label className="text-sm text-gray-600">
          Date
          <input
            name="date_distribution"
            type="date"
            required
            defaultValue={new Date().toISOString().split('T')[0]}
            className="border rounded-md px-3 py-2 w-full mt-1"
          />
        </label>

        <button type="submit" className="bg-[#1F2B22] text-white rounded-md py-2 mt-2">
          Enregistrer
        </button>
      </form>
    </div>
  )
}