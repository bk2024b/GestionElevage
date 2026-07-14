import { createClient } from '@/lib/supabase/server'
import { EarTagBadge } from '@/components/lapins/EarTagBadge'
import { modifierStatutAccouplement, confirmerPalpation } from './actions'
import Link from 'next/link'

const LABEL_STATUT: Record<string, string> = {
  en_cours: 'En cours',
  confirmee: 'Gestation confirmée',
  echouee: 'Échouée',
  terminee: 'Terminée',
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
    <div className="px-6 py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-medium">Reproduction</h1>
        <Link href="/reproduction/nouveau" className="text-sm bg-[#1F2B22] text-white px-3 py-2 rounded-md">
          + Accouplement
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {accouplements?.map((a) => {
          const modifierAvecId = modifierStatutAccouplement.bind(null, a.id)
          const palpationRequise = a.statut === 'en_cours' && palpationDue(a.date_accouplement)

          return (
            <div key={a.id} className="bg-white border rounded-md px-4 py-3">
              <div className="flex items-center gap-2 mb-2">
                <EarTagBadge identifiant={a.femelle.identifiant} sexe="F" />
                <span className="text-sm text-gray-400">×</span>
                <EarTagBadge identifiant={a.male.identifiant} sexe="M" />
              </div>

              <div className="text-sm flex flex-col gap-1 mb-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Accouplement</span>
                  <span>{new Date(a.date_accouplement).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Nid prévu</span>
                  <span>{new Date(a.date_nid_prevue).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Mise bas prévue</span>
                  <span className="font-medium">{new Date(a.date_misebas_prevue).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>

              {a.statut === 'confirmee' && (
                <div className="text-xs bg-green-50 text-green-800 rounded-md px-2 py-1.5 mb-2">
                  Gestation confirmée — mise bas prévue le {new Date(a.date_misebas_prevue).toLocaleDateString('fr-FR')}
                </div>
              )}

              {a.statut === 'echouee' && (
                <div className="text-xs bg-red-50 text-red-800 rounded-md px-2 py-1.5 mb-2">
                  Accouplement échoué — un nouvel essai peut être planifié
                </div>
              )}

              {palpationRequise ? (
                <div className="border-t pt-2 mt-1">
                  <p className="text-xs text-gray-600 mb-2">Palpation à effectuer — la femelle est-elle gestante ?</p>
                  <div className="flex gap-2">
                    <form action={confirmerPalpation.bind(null, a.id, 'oui')} className="flex-1">
                      <button type="submit" className="w-full text-xs bg-green-600 text-white px-2 py-1.5 rounded-md">
                        Oui, gestante
                      </button>
                    </form>
                    <form action={confirmerPalpation.bind(null, a.id, 'non')} className="flex-1">
                      <button type="submit" className="w-full text-xs bg-red-600 text-white px-2 py-1.5 rounded-md">
                        Non, échouée
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <form action={modifierAvecId} className="flex items-center gap-2">
                  <select
                    name="statut"
                    defaultValue={a.statut}
                    className="border rounded-md px-2 py-1 text-xs flex-1"
                  >
                    {Object.entries(LABEL_STATUT).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                  <button type="submit" className="text-xs bg-gray-100 px-2 py-1 rounded-md">
                    Mettre à jour
                  </button>
                </form>
              )}
            </div>
          )
        })}

        {accouplements?.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-8">
            Aucun accouplement enregistré.
          </p>
        )}
      </div>
    </div>
  )
}