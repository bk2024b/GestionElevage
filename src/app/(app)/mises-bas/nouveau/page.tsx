import { createClient } from '@/lib/supabase/server'
import { creerMiseBas } from '../actions'
import { Input, Textarea, Select, Field } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default async function NouvelleMiseBasPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; accouplement_id?: string }>
}) {
  const { error, accouplement_id } = await searchParams
  const supabase = await createClient()

  const { data: accouplements } = await supabase
    .from('accouplements')
    .select(`id, date_misebas_prevue, femelle_id, femelle:accouplements_femelle_id_fkey(identifiant, nom)`)
    .in('statut', ['en_cours', 'confirmee'])
    .order('date_misebas_prevue')

  return (
    <div className="px-5 py-6 max-w-md mx-auto">
      <h1 className="text-xl font-display font-semibold mb-5">Enregistrer une mise bas</h1>

      {error && (
        <p className="text-sm text-danger bg-danger/10 rounded-card px-3 py-2 mb-3">{error}</p>
      )}

      <form action={creerMiseBas} className="flex flex-col gap-3">
        <Field label="Accouplement lié">
          <Select name="accouplement_id" defaultValue={accouplement_id}>
            <option value="">— Aucun (mise bas manuelle) —</option>
            {accouplements?.map((a: any) => (
              <option key={a.id} value={a.id}>
                {a.femelle.identifiant} — prévue le {new Date(a.date_misebas_prevue).toLocaleDateString('fr-FR')}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Femelle (id) — requis si pas d'accouplement lié">
          <Input name="femelle_id" type="text" placeholder="UUID de la femelle" />
        </Field>

        <Field label="Date de mise bas">
          <Input
            name="date_misebas"
            type="date"
            required
            defaultValue={new Date().toISOString().split('T')[0]}
          />
        </Field>

        <p className="text-xs text-ink-soft/70 -mb-1">
          Le sexe n'est pas distinguable à la naissance — il sera renseigné plus tard, à l'identification.
        </p>

        <div className="grid grid-cols-2 gap-2">
          <Field label="Nés vivants">
            <Input name="nes_vivants" type="number" defaultValue={0} required />
          </Field>
          <Field label="Nés morts">
            <Input name="nes_morts" type="number" defaultValue={0} />
          </Field>
          <Field label="Adoptés">
            <Input name="adoptes" type="number" defaultValue={0} />
          </Field>
          <Field label="Retirés">
            <Input name="retires" type="number" defaultValue={0} />
          </Field>
        </div>

        <Textarea name="observations" placeholder="Observations" rows={2} />

        <Button type="submit" variante="primaire" className="mt-1">
          Enregistrer
        </Button>
      </form>
    </div>
  )
}