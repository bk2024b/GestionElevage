import { creerTransaction } from '../actions'
import { CATEGORIES_DEPENSE, CATEGORIES_REVENU } from '@/lib/finances'
import { Input, Textarea, Select, Field } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default async function NouvelleTransactionPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; type?: string }>
}) {
  const { error, type } = await searchParams
  const typeDefaut = type === 'revenu' ? 'revenu' : 'depense'

  return (
    <div className="px-5 py-6 max-w-md mx-auto">
      <h1 className="text-xl font-display font-semibold mb-5">Nouvelle transaction</h1>

      {error && (
        <p className="text-sm text-danger bg-danger/10 rounded-card px-3 py-2 mb-3">{error}</p>
      )}

      <form action={creerTransaction} className="flex flex-col gap-3">
        <Field label="Type">
          <Select name="type" defaultValue={typeDefaut} required>
            <option value="depense">Dépense</option>
            <option value="revenu">Revenu</option>
          </Select>
        </Field>

        <Field label="Catégorie">
          <Select name="categorie" required>
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
          </Select>
        </Field>

        <Input name="montant" type="number" step="1" placeholder="Montant (FCFA)" required />

        <Field label="Date">
          <Input
            name="date_transaction"
            type="date"
            required
            defaultValue={new Date().toISOString().split('T')[0]}
          />
        </Field>

        <Textarea name="description" placeholder="Description (optionnel)" rows={2} />

        <Button type="submit" variante="primaire" className="mt-1">
          Enregistrer
        </Button>
      </form>
    </div>
  )
}