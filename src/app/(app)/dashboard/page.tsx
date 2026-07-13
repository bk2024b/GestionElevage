import { createClient } from '@/lib/supabase/server'
import { signOut } from '../../(auth)/actions'
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
      </div>

      <form action={signOut}>
        <button type="submit" className="text-sm text-red-600">Se déconnecter</button>
      </form>
    </div>
  )
}