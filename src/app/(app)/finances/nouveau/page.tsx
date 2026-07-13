import { creerTransaction } from '../actions'
import { CATEGORIES_DEPENSE, CATEGORIES_REVENU } from '@/lib/finances'

export default async function NouvelleTransactionPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; type?: string }>
}) {
  const { error, type } = await searchParams
  const typeDefaut = type === 'revenu' ? 'revenu' : 'depense'

  return (
    <div className="px-6 py-6 max-w-md">
      <h1 className="text-xl font-medium mb-4">Nouvelle transaction</h1>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-md px-3 py-2 mb-3">{error}</p>
      )}

      <form action={creerTransaction} className="flex flex-col gap-3">
        <label className="text-sm text-gray-600">
          Type
          <select name="type" defaultValue={typeDefaut} required className="border rounded-md px-3 py-2 w-full mt-1">
            <option value="depense">Dépense</option>
            <option value="revenu">Revenu</option>
          </select>
        </label>

        <label className="text-sm text-gray-600">
          Catégorie
          <select name="categorie" required className="border rounded-md px-3 py-2 w-full mt-1">
            <optgroup label="Dépenses">
              {Object.entries(CATEGORIES_DEPENSE).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </optgroup>
            <optgroup label="Revenus">
              {Object.entries(CATEGORIES_REVENU).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </optgroup>
          </select>
        </label>

        <input name="montant" type="number" step="1" placeholder="Montant (FCFA)" required className="border rounded-md px-3 py-2" />

        <label className="text-sm text-gray-600">
          Date
          <input
            name="date_transaction"
            type="date"
            required
            defaultValue={new Date().toISOString().split('T')[0]}
            className="border rounded-md px-3 py-2 w-full mt-1"
          />
        </label>

        <textarea name="description" placeholder="Description (optionnel)" className="border rounded-md px-3 py-2" rows={2} />

        <button type="submit" className="bg-[#1F2B22] text-white rounded-md py-2 mt-2">
          Enregistrer
        </button>
      </form>
    </div>
  )
}