import { createClient } from '@/lib/supabase/server'
import { EarTagBadge } from '@/components/lapins/EarTagBadge'
import { supprimerSoin } from './actions'
import { LABEL_TYPE_SOIN, COULEUR_TYPE_SOIN } from '@/lib/sante'
import { formatFCFA } from '@/lib/finances'
import Link from 'next/link'

export default async function SantePage() {
  const supabase = await createClient()

  const { data: soins } = await supabase
    .from('soins')
    .select(`*, lapin:lapin_id(identifiant, sexe, nom)`)
    .order('date_soin', { ascending: false })

  return (
    <div className="px-6 py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-medium">Santé & soins</h1>
        <Link href="/sante/nouveau" className="text-sm bg-[#1F2B22] text-white px-3 py-2 rounded-md">
          + Soin
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {soins?.map((s: any) => {
          const supprimerAvecId = supprimerSoin.bind(null, s.id)

          return (
            <div key={s.id} className="bg-white border rounded-md px-4 py-3">
              <div className="flex items-center gap-2 mb-1">
                <EarTagBadge identifiant={s.lapin.identifiant} sexe={s.lapin.sexe} />
                <span className={`text-xs px-2 py-0.5 rounded-md ${COULEUR_TYPE_SOIN[s.type]}`}>
                  {LABEL_TYPE_SOIN[s.type]}
                </span>
              </div>
              <p className="text-sm mb-1">{s.libelle}</p>
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  {new Date(s.date_soin).toLocaleDateString('fr-FR')}
                  {s.cout ? ` — ${formatFCFA(Number(s.cout))}` : ''}
                </p>
                <form action={supprimerAvecId}>
                  <button type="submit" className="text-xs text-gray-400">✕</button>
                </form>
              </div>
              {s.notes && <p className="text-xs text-gray-500 mt-1">{s.notes}</p>}
            </div>
          )
        })}

        {soins?.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-8">
            Aucun soin enregistré.
          </p>
        )}
      </div>
    </div>
  )
}