import { createClient } from '@/lib/supabase/server'
import { EarTagBadge } from '@/components/lapins/EarTagBadge'
import { enregistrerSevrage } from './actions'
import Link from 'next/link'

export default async function MisesBasPage() {
  const supabase = await createClient()

  const { data: misesBas } = await supabase
    .from('mises_bas')
    .select(`*, femelle:femelle_id(identifiant, nom, sexe), sevrages(*)`)
    .order('date_misebas', { ascending: false })

  return (
    <div className="px-6 py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-medium">Mises bas</h1>
        <Link href="/mises-bas/nouveau" className="text-sm bg-[#1F2B22] text-white px-3 py-2 rounded-md">
          + Mise bas
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {misesBas?.map((m: any) => {
          const dejaSevre = m.sevrages?.length > 0
          const enregistrerAvecId = enregistrerSevrage.bind(null, m.id)

          return (
            <div key={m.id} className="bg-white border rounded-md px-4 py-3">
              <div className="flex items-center gap-2 mb-2">
                <EarTagBadge identifiant={m.femelle.identifiant} sexe="F" />
                <span className="text-sm text-gray-500">{new Date(m.date_misebas).toLocaleDateString('fr-FR')}</span>
              </div>

              <div className="text-sm flex flex-col gap-1 mb-2">
                <div className="flex justify-between"><span className="text-gray-500">Lapereaux vivants</span><span>{m.nb_lapereaux}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Mâles / Femelles</span><span>{m.nb_males} / {m.nb_femelles}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Morts-nés</span><span>{m.nb_morts_nes}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Sevrage prévu</span><span className="font-medium">{new Date(m.date_sevrage_prevue).toLocaleDateString('fr-FR')}</span></div>
              </div>

              {dejaSevre ? (
                <div className="text-xs bg-green-50 text-green-800 rounded-md px-2 py-1.5">
                  Sevré le {new Date(m.sevrages[0].date_sevrage).toLocaleDateString('fr-FR')}
                  {m.sevrages[0].nb_survivants != null && ` — ${m.sevrages[0].nb_survivants} survivants`}
                </div>
              ) : (
                <form action={enregistrerAvecId} className="flex flex-col gap-2 border-t pt-2 mt-1">
                  <p className="text-xs text-gray-500">Enregistrer le sevrage</p>
                  <div className="grid grid-cols-2 gap-2">
                    <input name="date_sevrage" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="border rounded-md px-2 py-1 text-xs" />
                    <input name="nb_survivants" type="number" placeholder="Survivants" className="border rounded-md px-2 py-1 text-xs" />
                  </div>
                  <input name="poids_moyen" type="number" step="0.01" placeholder="Poids moyen (kg)" className="border rounded-md px-2 py-1 text-xs" />
                  <button type="submit" className="text-xs bg-gray-100 px-2 py-1 rounded-md">
                    Valider le sevrage
                  </button>
                </form>
              )}
            </div>
          )
        })}

        {misesBas?.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-8">
            Aucune mise bas enregistrée.
          </p>
        )}
      </div>
    </div>
  )
}