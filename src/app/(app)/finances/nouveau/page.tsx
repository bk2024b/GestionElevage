import { createClient } from '@/lib/supabase/server'
import { creerTransaction } from '../actions'
import { CATEGORIES_DEPENSE, CATEGORIES_REVENU } from '@/lib/finances'
import { Input, Textarea, Select, Field } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default async function NouvelleTransactionPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; type?: string }>
}) {
  const { error, type } = await searchParams
  const typeDefaut = type === 'revenu' ? 'revenu' : 'depense'
  const supabase = await createClient()

  const { data: lapinsEnEngraissement } = await supabase
    .from('lapins')
    .select('id, identifiant, nom')
    .eq('stade', 'engraissement')
    .eq('statut', 'actif')
    .order('identifiant')

  return (
    <div className="max-w-md mx-auto px-5 py-6">
      <h1 className="text-xl font-bold mb-5">Nouvelle transaction</h1>

      {error && (
        <p className="text-sm text-danger bg-danger/10 rounded-control px-3 py-2 mb-3">{error}</p>
      )}

      <Card>
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

          <Field label="Lapin vendu (uniquement pour Vente de lapin)">
            <Select name="lapin_id" defaultValue="">
              <option value="">— Aucun —</option>
              {lapinsEnEngraissement?.map((l) => (
                <option key={l.id} value={l.id}>{l.identifiant} — {l.nom || 'sans nom'}</option>
              ))}
            </Select>
          </Field>
          {(!lapinsEnEngraissement || lapinsEnEngraissement.length === 0) && (
            <p className="text-xs text-ink-soft/70 -mt-2">Aucun lapin en engraissement disponible pour l'instant.</p>
          )}

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
      </Card>
    </div>
  )
}