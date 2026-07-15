import { createClient } from '@/lib/supabase/server'
import { EarTagBadge } from '@/components/lapins/EarTagBadge'
import { modifierStatutAccouplement, confirmerPalpation } from './actions'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Select } from '@/components/ui/Input'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

const LABEL_STATUT: Record<string, string> = {
  en_cours: 'En cours',
  confirmee: 'Gestation confirmée',
  echouee: 'Échouée',
  terminee: 'Terminée',
}

const TON_STATUT: Record<string, 'success' | 'neutre' | 'danger' | 'accent'> = {
  en_cours: 'neutre',
  confirmee: 'success',
  echouee: 'danger',
  terminee: 'accent',
}

function palpationDue(dateAccouplement: string) {
  const datePalpation = new Date(dateAccouplement)
  datePalpation.setDate(datePalpation.getDate() + 15)
  return new Date() >= datePalpation
}

export default async function ReproductionPage() {
  const supabase = await createClient()

  const { data: accouplements } = await supabase
    .from('accouplements')
    .select(`
      *,
      femelle:accouplements_femelle_id_fkey(identifiant, nom, sexe),
      male:accouplements_male_id_fkey(identifiant, nom, sexe)
    `)
    .order('date_accouplement', { ascending: false })

  return (
    <div className="px-5 py-6 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-display font-semibold">Reproduction</h1>
        <Link href="/reproduction/nouveau" className="tap flex items-center gap-1 text-sm bg-ink text-paper px-3 py-2 rounded-card">
          <Plus size={16} />
          Accouplement
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {accouplements?.map((a) => {
          const modifierAvecId = modifierStatutAccouplement.bind(null, a.id)
          const palpationRequise = a.statut === 'en_cours' && palpationDue(a.date_accouplement)

          return (
            <Card key={a.id}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <EarTagBadge identifiant={a.femelle.identifiant} sexe="F" />
                  <span className="text-sm text-ink-soft/60">×</span>
                  <EarTagBadge identifiant={a.male.identifiant} sexe="M" />
                </div>
                <Badge ton={TON_STATUT[a.statut]}>{LABEL_STATUT[a.statut]}</Badge>
              </div>

              <div className="text-sm flex flex-col gap-1 mb-2">
                <div className="flex justify-between">
                  <span className="text-ink-soft">Accouplement</span>
                  <span>{new Date(a.date_accouplement).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-soft">Nid prévu</span>
                  <span>{new Date(a.date_nid_prevue).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-soft">Mise bas prévue</span>
                  <span className="font-medium">{new Date(a.date_misebas_prevue).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>

              {a.statut === 'confirmee' && (
                <p className="text-xs bg-success/10 text-success rounded-card px-2 py-1.5 mb-2">
                  Gestation confirmée — mise bas prévue le {new Date(a.date_misebas_prevue).toLocaleDateString('fr-FR')}
                </p>
              )}

              {a.statut === 'echouee' && (
                <p className="text-xs bg-danger/10 text-danger rounded-card px-2 py-1.5 mb-2">
                  Accouplement échoué — un nouvel essai peut être planifié
                </p>
              )}

              {palpationRequise ? (
                <div className="border-t border-line pt-2 mt-1">
                  <p className="text-xs text-ink-soft mb-2">Palpation à effectuer — la femelle est-elle gestante ?</p>
                  <div className="flex gap-2">
                    <form action={confirmerPalpation.bind(null, a.id, 'oui')} className="flex-1">
                      <Button type="submit" className="w-full bg-success text-paper text-xs py-1.5">
                        Oui, gestante
                      </Button>
                    </form>
                    <form action={confirmerPalpation.bind(null, a.id, 'non')} className="flex-1">
                      <Button type="submit" className="w-full bg-danger text-paper text-xs py-1.5">
                        Non, échouée
                      </Button>
                    </form>
                  </div>
                </div>
              ) : (
                <form action={modifierAvecId} className="flex items-center gap-2">
                  <Select name="statut" defaultValue={a.statut} className="!py-1.5 text-xs flex-1">
                    {Object.entries(LABEL_STATUT).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </Select>
                  <Button type="submit" variante="discret" className="text-xs py-1.5">
                    Mettre à jour
                  </Button>
                </form>
              )}
            </Card>
          )
        })}

        {accouplements?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-ink-soft mb-1">Aucun accouplement enregistré.</p>
            <p className="text-xs text-ink-soft/70">Enregistre ton premier accouplement pour démarrer un suivi.</p>
          </div>
        )}
      </div>
    </div>
  )
}