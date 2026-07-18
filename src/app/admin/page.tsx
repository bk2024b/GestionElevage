import { createClient } from '@/lib/supabase/server'
import { confirmerPaiement, suspendreCompte } from './actions'
import { joursRestants } from '@/lib/abonnement'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input, Field } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

const LABEL_STATUT: Record<string, string> = {
  essai: 'Essai',
  actif: 'Actif',
  expire: 'Expiré',
}

const TON_STATUT: Record<string, 'neutre' | 'success' | 'danger'> = {
  essai: 'neutre',
  actif: 'success',
  expire: 'danger',
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const supabase = await createClient()

  const { data: profils } = await supabase
    .from('profils')
    .select('id, nom, nom_elevage, created_at')
    .order('created_at', { ascending: false })

  const { data: abonnements } = await supabase
    .from('abonnements')
    .select('*')

  const abonnementParUser = new Map((abonnements ?? []).map((a) => [a.user_id, a]))

  const nbActifs = (abonnements ?? []).filter((a) => a.statut === 'actif').length
  const nbEssai = (abonnements ?? []).filter((a) => a.statut === 'essai').length
  const nbExpires = (abonnements ?? []).filter((a) => a.statut === 'expire').length

  return (
    <div className="px-5 py-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-display font-semibold mb-5">Administration</h1>

      {error && (
        <p className="text-sm text-danger bg-danger/10 rounded-card px-3 py-2 mb-3">{error}</p>
      )}

      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card><p className="text-xs text-ink-soft">Abonnés actifs</p><p className="text-2xl font-display font-semibold">{nbActifs}</p></Card>
        <Card><p className="text-xs text-ink-soft">En essai</p><p className="text-2xl font-display font-semibold">{nbEssai}</p></Card>
        <Card><p className="text-xs text-ink-soft">Expirés</p><p className="text-2xl font-display font-semibold">{nbExpires}</p></Card>
      </div>

      <div className="flex flex-col gap-3">
        {profils?.map((p) => {
          const abonnement = abonnementParUser.get(p.id)
          const jours = abonnement ? joursRestants(abonnement.date_fin) : 0
          const confirmerAvecId = confirmerPaiement.bind(null, p.id)
          const suspendreAvecId = suspendreCompte.bind(null, p.id)

          return (
            <Card key={p.id}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-medium">{p.nom_elevage || 'Sans nom'}</p>
                  <p className="text-xs text-ink-soft">{p.nom}</p>
                </div>
                {abonnement && (
                  <Badge ton={TON_STATUT[abonnement.statut]}>{LABEL_STATUT[abonnement.statut]}</Badge>
                )}
              </div>

              <p className="text-xs text-ink-soft mb-3">
                {abonnement ? `${jours} jour(s) restant(s) — expire le ${new Date(abonnement.date_fin).toLocaleDateString('fr-FR')}` : 'Aucun abonnement'}
              </p>

              <form action={confirmerAvecId} className="flex flex-col gap-2 border-t border-line pt-3">
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Durée (jours)">
                    <Input name="duree_jours" type="number" defaultValue={30} />
                  </Field>
                  <Field label="Référence paiement">
                    <Input name="notes" type="text" placeholder="Ex: MoMo #1234" />
                  </Field>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" variante="primaire" className="flex-1 text-xs py-2">
                    Confirmer le paiement
                  </Button>
                  <form action={suspendreAvecId}>
                    <Button type="submit" variante="danger" className="text-xs py-2 px-3">
                      Suspendre
                    </Button>
                  </form>
                </div>
              </form>
            </Card>
          )
        })}
      </div>
    </div>
  )
}