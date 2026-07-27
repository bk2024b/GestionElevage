import { createClient } from '@/lib/supabase/server'
import { confirmerPaiement, suspendreCompte } from './actions'
import { joursRestants } from '@/lib/abonnement'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input, Field } from '@/components/ui/Input'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Users, Clock, AlertCircle, Rabbit } from 'lucide-react'

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

  const { data: tousLesLapins } = await supabase
    .from('lapins')
    .select('user_id')

  const abonnementParUser = new Map((abonnements ?? []).map((a) => [a.user_id, a]))

  const nbLapinsParUser = new Map<string, number>()
  for (const l of tousLesLapins ?? []) {
    nbLapinsParUser.set(l.user_id, (nbLapinsParUser.get(l.user_id) ?? 0) + 1)
  }

  const nbActifs = (abonnements ?? []).filter((a) => a.statut === 'actif').length
  const nbEssai = (abonnements ?? []).filter((a) => a.statut === 'essai').length
  const nbExpires = (abonnements ?? []).filter((a) => a.statut === 'expire').length

  return (
    <div className="max-w-md md:max-w-4xl mx-auto px-5 py-6">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl md:text-2xl font-bold">Administration</h1>
        <ButtonLink href="/admin/ressources" variante="secondaire" className="text-xs py-2.5">
          Gérer les ressources
        </ButtonLink>
      </div>

      {error && (
        <p className="text-sm text-danger bg-danger/10 rounded-control px-3 py-2 mb-3">{error}</p>
      )}

      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card className="!p-4">
          <Users size={20} strokeWidth={2} className="text-accent-green mb-2" />
          <p className="text-xs text-ink-soft">Abonnés actifs</p>
          <p className="text-xl font-bold">{nbActifs}</p>
        </Card>
        <Card className="!p-4">
          <Clock size={20} strokeWidth={2} className="text-ink-soft mb-2" />
          <p className="text-xs text-ink-soft">En essai</p>
          <p className="text-xl font-bold">{nbEssai}</p>
        </Card>
        <Card className="!p-4">
          <AlertCircle size={20} strokeWidth={2} className="text-danger mb-2" />
          <p className="text-xs text-ink-soft">Expirés</p>
          <p className="text-xl font-bold">{nbExpires}</p>
        </Card>
      </div>

      <div className="md:grid md:grid-cols-2 md:gap-4 flex flex-col gap-3 md:flex-none">
        {profils?.map((p) => {
          const abonnement = abonnementParUser.get(p.id)
          const jours = abonnement ? joursRestants(abonnement.date_fin) : 0
          const nbLapins = nbLapinsParUser.get(p.id) ?? 0
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

              <div className="flex items-center gap-1.5 mb-3">
                <Rabbit size={13} className="text-ink-soft" />
                <span className="text-xs text-ink-soft">
                  {nbLapins} lapin{nbLapins > 1 ? 's' : ''} enregistré{nbLapins > 1 ? 's' : ''}
                </span>
              </div>

              <p className="text-xs text-ink-soft mb-3">
                {abonnement ? `${jours} jour(s) restant(s) — expire le ${new Date(abonnement.date_fin).toLocaleDateString('fr-FR')}` : 'Aucun abonnement'}
              </p>

              <div className="flex flex-col gap-2 border-t border-line pt-3">
                <form action={confirmerAvecId} className="flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Durée (jours)">
                      <Input name="duree_jours" type="number" defaultValue={30} />
                    </Field>
                    <Field label="Référence paiement">
                      <Input name="notes" type="text" placeholder="Ex: MoMo #1234" />
                    </Field>
                  </div>
                  <Button type="submit" variante="primaire" className="text-xs py-2">
                    Confirmer le paiement
                  </Button>
                </form>

                <form action={suspendreAvecId}>
                  <Button type="submit" variante="danger" className="w-full text-xs py-2">
                    Suspendre ce compte
                  </Button>
                </form>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}