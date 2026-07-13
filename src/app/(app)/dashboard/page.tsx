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

  return (
    <div className="px-6 py-8">
      <h1 className="text-xl font-medium mb-1">Bienvenue</h1>
      <p className="text-sm text-gray-500 mb-6">{user?.email}</p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white border rounded-md px-4 py-3">
          <p className="text-xs text-gray-500">Lapins</p>
          <p className="text-2xl font-medium">{nbLapins ?? 0}</p>
        </div>
        <div className="bg-white border rounded-md px-4 py-3">
          <p className="text-xs text-gray-500">Actifs</p>
          <p className="text-2xl font-medium">{nbActifs ?? 0}</p>
        </div>
      </div>

      <Link
        href="/lapins"
        className="block text-center bg-[#1F2B22] text-white rounded-md py-2 mb-6"
      >
        Voir mes lapins
      </Link>

      <form action={signOut}>
        <button type="submit" className="text-sm text-red-600">Se déconnecter</button>
      </form>
    </div>
  )
}