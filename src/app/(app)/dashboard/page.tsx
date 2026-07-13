import { createClient } from '@/lib/supabase/server'
import { signOut } from '../../(auth)/actions'
import { EarTagBadge } from '@/components/lapins/EarTagBadge'
import { LABEL_TYPE_RAPPEL } from '@/lib/rappels'
import { formatFCFA } from '@/lib/finances'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { count: nbLapins } = await supabase
    .from('lapins')
    .select('*', { count: 'exact', head: true })

  const { count: nbActifs } = await supabase
    .from('lapins')
    .select('*', { count: 'exact', head: true })
    .eq('statut', 'actif')

  const { count: nbGestantes } = await supabase
    .from('accouplements')
    .select('*', { count: 'exact', head: true })
    .in('statut', ['en_cours', 'confirmee'])

  const { count: nbRappels } = await supabase
    .from('rappels')
    .select('*', { count: 'exact', head: true })
    .eq('vu', false)

  const { data: rappelsUrgents } = await supabase
    .from('rappels')
    .select(`*, lapin:lapin_id(identifiant, sexe)`)
    .eq('vu', false)
    .order('date_prevue', { ascending: true })
    .limit(3)

  const debutMois = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString()
    .split('T')[0]

  const { data: transactionsMois } = await supabase
    .from('transactions_financieres')
    .select('type, montant')
    .gte('date_transaction', debutMois)

  const beneficeDuMois = (transactionsMois ?? []).reduce(
    (s, t) => s + (t.type === 'revenu' ? Number(t.montant) : -Number(t.montant)),
    0
  )

  return (
    <div className="px-6 py-8">
      <h1 className="text-xl font-medium mb-1">Bienvenue</h1>
      <p className="text-sm text-gray-500 mb-6">{user?.email}</p>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white border rounded-md px-3 py-3">
          <p className="text-xs text-gray-500">Lapins</p>
          <p className="text-2xl font-medium">{nbLapins ?? 0}</p>
        </div>
        <div className="bg-white border rounded-md px-3 py-3">
          <p className="text-xs text-gray-500">Actifs</p>
          <p className="text-2xl font-medium">{nbActifs ?? 0}</p>
        </div>
        <div className="bg-white border rounded-md px-3 py-3">
          <p className="text-xs text-gray-500">Gestantes</p>
          <p className="text-2xl font-medium">{nbGestantes ?? 0}</p>
        </div>
      </div>

      {rappelsUrgents && rappelsUrgents.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-600">À faire</p>
            {nbRappels ? <span className="text-xs text-gray-400">{nbRappels} au total</span> : null}
          </div>
          <div className="flex flex-col gap-2">
            {rappelsUrgents.map((r: any) => (
              <div key={r.id} className="flex items-center gap-2 bg-white border rounded-md px-3 py-2">
                {r.lapin && <EarTagBadge identifiant={r.lapin.identifiant} sexe={r.lapin.sexe} />}
                <span className="text-sm flex-1">{LABEL_TYPE_RAPPEL[r.type] || r.message}</span>
                <span className="text-xs text-gray-500">{new Date(r.date_prevue).toLocaleDateString('fr-FR')}</span>
              </div>
            ))}
          </div>
          <Link href="/rappels" className="text-xs text-gray-500 mt-2 inline-block">
            Voir tous les rappels →
          </Link>
        </div>
      )}

      <p className="text-xs text-gray-400 mb-2">Élevage</p>
      <div className="flex flex-col gap-2 mb-6">
        <Link
          href="/lapins"
          className="block text-center bg-[#1F2B22] text-white rounded-md py-2"
        >
          Voir mes lapins
        </Link>
        <Link
          href="/reproduction"
          className="block text-center border border-[#1F2B22] text-[#1F2B22] rounded-md py-2"
        >
          Voir la reproduction
        </Link>
        <Link
          href="/sante"
          className="block text-center border border-[#1F2B22] text-[#1F2B22] rounded-md py-2"
        >
          Santé et soins
        </Link>
        <Link
          href="/alimentation"
          className="block text-center border border-[#1F2B22] text-[#1F2B22] rounded-md py-2"
        >
          Alimentation
        </Link>
        <Link
          href="/calendrier"
          className="block text-center border border-[#1F2B22] text-[#1F2B22] rounded-md py-2"
        >
          Calendrier
        </Link>
      </div>

      <p className="text-xs text-gray-400 mb-2">Gestion</p>
      <div className="flex flex-col gap-2 mb-6">
        <Link
          href="/finances"
          className="flex items-center justify-between border border-[#1F2B22] text-[#1F2B22] rounded-md py-2 px-4"
        >
          <span>Finances</span>
          <span className={`text-sm font-medium ${beneficeDuMois >= 0 ? '' : 'text-red-700'}`}>
            {formatFCFA(beneficeDuMois)} ce mois
          </span>
        </Link>
        <Link
          href="/statistiques"
          className="block text-center border border-[#1F2B22] text-[#1F2B22] rounded-md py-2"
        >
          Statistiques et export
        </Link>
        <Link
          href="/parametres"
          className="block text-center border border-[#1F2B22] text-[#1F2B22] rounded-md py-2"
        >
          Paramètres
        </Link>
      </div>

      <form action={signOut}>
        <button type="submit" className="text-sm text-red-600">Se déconnecter</button>
      </form>
    </div>
  )
}