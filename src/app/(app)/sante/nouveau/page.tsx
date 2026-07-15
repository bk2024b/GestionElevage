import { createClient } from '@/lib/supabase/server'
import { creerSoin } from '../actions'
import { Input, Textarea, Select, Field } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

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
    <div className="px-5 py-6 max-w-md mx-auto">
      <h1 className="text-xl font-display font-semibold mb-5">Nouveau soin</h1>

      {error && (
        <p className="text-sm text-danger bg-danger/10 rounded-card px-3 py-2 mb-3">{error}</p>
      )}

      <form action={creerSoin} className="flex flex-col gap-3">
        <Field label="Lapin">
          <Select name="lapin_id" required>
            {lapins?.map((l) => (
              <option key={l.id} value={l.id}>{l.identifiant} — {l.nom || 'sans nom'}</option>
            ))}
          </Select>
        </Field>

        <Field label="Type">
          <Select name="type" required>
            <option value="maladie">Maladie</option>
            <option value="traitement">Traitement</option>
            <option value="vaccin">Vaccin</option>
            <option value="controle_veto">Contrôle vétérinaire</option>
          </Select>
        </Field>

        <Input name="libelle" type="text" placeholder="Ex: Coccidiose, Vaccin myxomatose..." required />

        <Field label="Date">
          <Input
            name="date_soin"
            type="date"
            required
            defaultValue={new Date().toISOString().split('T')[0]}
          />
        </Field>

        <Input name="cout" type="number" step="1" placeholder="Coût (FCFA, optionnel)" />
        <Textarea name="notes" placeholder="Notes" rows={2} />

        <Button type="submit" variante="primaire" className="mt-1">
          Enregistrer
        </Button>
      </form>
    </div>
  )
}