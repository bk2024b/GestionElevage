import { createClient } from '@/lib/supabase/server'
import { EarTagBadge } from '@/components/lapins/EarTagBadge'
import { modifierLapin, supprimerLapin } from '../actions'
import { recupererHistoriqueLapin, COULEUR_EVENEMENT_HISTORIQUE } from '@/lib/historique'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Textarea, Select, Field } from '@/components/ui/Input'
import { notFound } from 'next/navigation'

export default async function FicheLapinPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const { id } = await params
  const { error } = await searchParams
  const supabase = await createClient()

  const { data: lapin } = await supabase.from('lapins').select('*').eq('id', id).single()
  if (!lapin) notFound()

  const historique = await recupererHistoriqueLapin(
    lapin.id,
    lapin.sexe,
    lapin.date_naissance,
    lapin.date_statut,
    lapin.statut
  )

  const modifierAvecId = modifierLapin.bind(null, id)
  const supprimerAvecId = supprimerLapin.bind(null, id)

  return (
    <div className="px-5 py-6 max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-5">
        <EarTagBadge identifiant={lapin.identifiant} sexe={lapin.sexe} />
        <h1 className="text-xl font-display font-semibold">{lapin.nom || 'Sans nom'}</h1>
      </div>

      {error && (
        <p className="text-sm text-danger bg-danger/10 rounded-card px-3 py-2 mb-3">{error}</p>
      )}

      <form action={modifierAvecId} className="flex flex-col gap-3 mb-8">
        <Input name="nom" type="text" defaultValue={lapin.nom ?? ''} placeholder="Nom" />
        <Input name="race" type="text" defaultValue={lapin.race ?? ''} placeholder="Race" />
        <Input name="date_naissance" type="date" defaultValue={lapin.date_naissance ?? ''} />
        <Input name="poids_actuel" type="number" step="0.1" defaultValue={lapin.poids_actuel ?? ''} placeholder="Poids (kg)" />
        <Input name="couleur" type="text" defaultValue={lapin.couleur ?? ''} placeholder="Couleur" />
        <Input name="numero_cage" type="text" defaultValue={lapin.numero_cage ?? ''} placeholder="Numéro de cage" />

        <Field label="Âge 1ère saillie prévu (mois)">
          <Input name="age_premiere_saillie" type="number" defaultValue={lapin.age_premiere_saillie ?? ''} />
        </Field>

        <Field label="Statut">
          <Select name="statut" defaultValue={lapin.statut}>
            <option value="actif">Actif</option>
            <option value="vendu">Vendu</option>
            <option value="decede">Décédé</option>
          </Select>
        </Field>

        <Textarea name="notes" defaultValue={lapin.notes ?? ''} placeholder="Notes" rows={3} />

        <Button type="submit" variante="primaire" className="mt-1">
          Enregistrer les modifications
        </Button>
      </form>

      <h2 className="text-sm font-medium text-ink-soft mb-3">Historique</h2>
      <div className="flex flex-col gap-2 mb-8">
        {historique.map((e, idx) => (
          <Card key={idx} className="flex items-start gap-2 py-2">
            <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${COULEUR_EVENEMENT_HISTORIQUE[e.type]}`} />
            <div className="flex-1">
              <p className="text-sm">{e.label}</p>
              {e.detail && <p className="text-xs text-ink-soft">{e.detail}</p>}
            </div>
            <span className="text-xs text-ink-soft/70 shrink-0">{new Date(e.date).toLocaleDateString('fr-FR')}</span>
          </Card>
        ))}

        {historique.length === 0 && (
          <p className="text-xs text-ink-soft/70 text-center py-4">Aucun événement enregistré.</p>
        )}
      </div>

      <form action={supprimerAvecId}>
        <Button type="submit" variante="danger" className="w-full">
          Supprimer ce lapin
        </Button>
      </form>
    </div>
  )
}