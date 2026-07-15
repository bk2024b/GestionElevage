import { creerAlimentation } from '../actions'
import { Input, Select, Field } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default async function NouvelleAlimentationPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="px-5 py-6 max-w-md mx-auto">
      <h1 className="text-xl font-display font-semibold mb-5">Nouvelle distribution</h1>

      {error && (
        <p className="text-sm text-danger bg-danger/10 rounded-card px-3 py-2 mb-3">{error}</p>
      )}

      <form action={creerAlimentation} className="flex flex-col gap-3">
        <Field label="Type d'aliment">
          <Select name="type_aliment" required>
            <option value="Granulés">Granulés</option>
            <option value="Foin">Foin</option>
            <option value="Verdure">Verdure</option>
            <option value="Complément">Complément</option>
            <option value="Autre">Autre</option>
          </Select>
        </Field>

        <Input name="quantite_kg" type="number" step="0.1" placeholder="Quantité (kg)" required />
        <Input name="cout" type="number" step="1" placeholder="Coût (FCFA, optionnel)" />

        <Field label="Date">
          <Input
            name="date_distribution"
            type="date"
            required
            defaultValue={new Date().toISOString().split('T')[0]}
          />
        </Field>

        <Button type="submit" variante="primaire" className="mt-1">
          Enregistrer
        </Button>
      </form>
    </div>
  )
}