import { creerLapin } from '../actions'
import { Input, Textarea, Select, Field } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default async function NouveauLapinPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="px-5 py-6 max-w-md mx-auto">
      <h1 className="text-xl font-display font-semibold mb-5">Nouveau lapin</h1>

      {error && (
        <p className="text-sm text-danger bg-danger/10 rounded-card px-3 py-2 mb-3">{error}</p>
      )}

      <form action={creerLapin} className="flex flex-col gap-3">
        <Field label="Sexe">
          <Select name="sexe" required>
            <option value="F">Femelle</option>
            <option value="M">Mâle</option>
          </Select>
        </Field>

        <Input name="nom" type="text" placeholder="Nom" />
        <Input name="race" type="text" placeholder="Race" />

        <Field label="Date de naissance">
          <Input name="date_naissance" type="date" />
        </Field>

        <Input name="poids_actuel" type="number" step="0.1" placeholder="Poids (kg)" />
        <Input name="couleur" type="text" placeholder="Couleur" />
        <Input name="numero_cage" type="text" placeholder="Numéro de cage" />

        <Field label="Âge 1ère saillie prévu (mois)">
          <Input name="age_premiere_saillie" type="number" placeholder="Ex: 6" />
        </Field>

        <Textarea name="notes" placeholder="Notes" rows={3} />

        <Button type="submit" variante="primaire" className="mt-1">
          Enregistrer
        </Button>
      </form>
    </div>
  )
}