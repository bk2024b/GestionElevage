import { createClient } from '@/lib/supabase/server'
import { EarTagBadge } from '@/components/lapins/EarTagBadge'
import { enregistrerSevrage, identifierLapereaux } from './actions'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

function sevrageDisponible(dateMisebas: string) {
  const dateMinimum = new Date(dateMisebas)
  dateMinimum.setDate(dateMinimum.getDate() + 30)
  return new Date() >= dateMinimum
}

function dateSevrageMinimum(dateMisebas: string) {
  const d = new Date(dateMisebas)
  d.setDate(d.getDate() + 30)
  return d.toISOString().split('T')[0]
}

export default async function MisesBasPage() {
  const supabase = await createClient()

  const { data: misesBas } = await supabase
    .from('mises_bas')
    .select(`*, femelle:femelle_id(identifiant, nom, sexe), sevrages(*)`)
    .order('date_misebas', { ascending: false })

  return (
    <div className="max-w-md md:max-w-4xl mx-auto px-5 py-6">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Mises bas</h1>
          <p className="text-xs text-ink-soft mt-0.5 hidden md:block">
            {misesBas?.length ?? 0} mise{(misesBas?.length ?? 0) > 1 ? 's' : ''} bas enregistrée{(misesBas?.length ?? 0) > 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/mises-bas/nouveau">
          <Button variante="primaire" className="flex items-center gap-1">
            <Plus size={16} />
            Mise bas
          </Button>
        </Link>
      </div>

      <div className="md:grid md:grid-cols-2 md:gap-4 flex flex-col gap-3">
        {misesBas?.map((m: any) => {
          const dejaSevre = m.sevrages?.length > 0
          const enregistrerAvecId = enregistrerSevrage.bind(null, m.id)
          const identifierAvecId = identifierLapereaux.bind(null, m.id)
          const disponibles = m.nes_vivants + m.adoptes - m.retires
          const peutSevrer = sevrageDisponible(m.date_misebas)

          return (
            <Card key={m.id}>
              <div className="flex items-center gap-2 mb-3">
                <EarTagBadge identifiant={m.femelle.identifiant} sexe="F" />
                <span className="text-sm text-ink-soft">{new Date(m.date_misebas).toLocaleDateString('fr-FR')}</span>
              </div>

              <div className="text-sm flex flex-col gap-1 mb-3">
                <div className="flex justify-between"><span className="text-ink-soft">Nés vivants</span><span>{m.nes_vivants}</span></div>
                <div className="flex justify-between"><span className="text-ink-soft">Nés morts</span><span>{m.nes_morts}</span></div>
                {m.adoptes > 0 && <div className="flex justify-between"><span className="text-ink-soft">Adoptés</span><span>{m.adoptes}</span></div>}
                {m.retires > 0 && <div className="flex justify-between"><span className="text-ink-soft">Retirés</span><span>{m.retires}</span></div>}
                <div className="flex justify-between"><span className="text-ink-soft">Sevrage prévu</span><span className="font-medium">{new Date(m.date_sevrage_prevue).toLocaleDateString('fr-FR')}</span></div>
              </div>

              {!m.lapereaux_identifies ? (
                disponibles > 0 ? (
                  <form action={identifierAvecId} className="border-t border-line pt-3 flex flex-col gap-2">
                    <p className="text-xs text-ink-soft">Identifier les {disponibles} lapereaux (répartition par sexe) :</p>
                    <div className="grid grid-cols-2 gap-2">
                      <Input name="nb_males" type="number" placeholder="Mâles" defaultValue={0} className="!py-2 text-xs" />
                      <Input name="nb_femelles" type="number" placeholder="Femelles" defaultValue={0} className="!py-2 text-xs" />
                    </div>
                    <Button type="submit" variante="primaire" className="text-xs py-2">
                      Créer les fiches lapins
                    </Button>
                  </form>
                ) : (
                  <p className="text-xs text-ink-soft/70">Aucun lapereau disponible à identifier.</p>
                )
              ) : (
                <Badge ton="success">✓ Lapereaux identifiés</Badge>
              )}

              {dejaSevre ? (
                <p className="text-xs bg-accent-green-soft text-accent-green rounded-control px-3 py-2 mt-3">
                  Sevré le {new Date(m.sevrages[0].date_sevrage).toLocaleDateString('fr-FR')}
                  {m.sevrages[0].nb_survivants != null && ` — ${m.sevrages[0].nb_survivants} survivants`}
                  {m.sevrages[0].poids_moyen != null && ` — ${m.sevrages[0].poids_moyen} kg moyen`}
                </p>
              ) : peutSevrer ? (
                <form action={enregistrerAvecId} className="flex flex-col gap-2 border-t border-line pt-3 mt-3">
                  <p className="text-xs text-ink-soft">Enregistrer le sevrage (30 jours minimum atteints)</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      name="date_sevrage"
                      type="date"
                      min={dateSevrageMinimum(m.date_misebas)}
                      defaultValue={new Date().toISOString().split('T')[0]}
                      className="!py-2 text-xs"
                    />
                    <Input name="nb_survivants" type="number" max={disponibles} placeholder={`Survivants (max ${disponibles})`} className="!py-2 text-xs" />
                  </div>
                  <Input name="poids_moyen" type="number" step="0.01" placeholder="Poids moyen (kg)" className="!py-2 text-xs" />
                  <Button type="submit" variante="discret" className="text-xs py-2">
                    Valider le sevrage
                  </Button>
                </form>
              ) : (
                <p className="text-xs text-accent bg-accent-soft rounded-control px-3 py-2 mt-3">
                  Sevrage possible à partir du {new Date(dateSevrageMinimum(m.date_misebas)).toLocaleDateString('fr-FR')}
                </p>
              )}
            </Card>
          )
        })}

        {misesBas?.length === 0 && (
          <div className="md:col-span-2 text-center py-16">
            <p className="text-sm text-ink-soft mb-1">Aucune mise bas enregistrée.</p>
            <p className="text-xs text-ink-soft/70">Enregistre une mise bas depuis un accouplement confirmé.</p>
          </div>
        )}
      </div>
    </div>
  )
}