import { createClient } from '@/lib/supabase/server'
import { creerAccouplement } from '../actions'
import { Input, Textarea, Select, Field } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

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
    <div className="px-5 py-6 max-w-md mx-auto">
      <h1 className="text-xl font-display font-semibold mb-5">Nouvel accouplement</h1>

      {error && (
        <p className="text-sm text-danger bg-danger/10 rounded-card px-3 py-2 mb-3">{error}</p>
      )}

      {(!femelles?.length || !males?.length) && (
        <p className="text-sm text-accent bg-accent-soft rounded-card px-3 py-2 mb-3">
          Il te faut au moins une femelle et un mâle actifs pour enregistrer un accouplement.
        </p>
      )}

      <form action={creerAccouplement} className="flex flex-col gap-3">
        <Field label="Femelle">
          <Select name="femelle_id" required>
            {femelles?.map((f) => (
              <option key={f.id} value={f.id}>{f.identifiant} — {f.nom || 'sans nom'}</option>
            ))}
          </Select>
        </Field>

        <Field label="Mâle">
          <Select name="male_id" required>
            {males?.map((m) => (
              <option key={m.id} value={m.id}>{m.identifiant} — {m.nom || 'sans nom'}</option>
            ))}
          </Select>
        </Field>

        <Field label="Date d'accouplement">
          <Input
            name="date_accouplement"
            type="date"
            required
            defaultValue={new Date().toISOString().split('T')[0]}
          />
        </Field>

        <Textarea name="notes" placeholder="Notes" rows={2} />

        <Button type="submit" variante="primaire" className="mt-1">
          Enregistrer
        </Button>
      </form>
    </div>
  )
}