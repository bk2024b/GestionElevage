import { createClient } from '@/lib/supabase/server'
import { signOut } from '../../(auth)/actions'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="px-6 py-8">
      <h1 className="text-xl font-medium">Bienvenue {user?.email}</h1>
      <form action={signOut}>
        <button type="submit" className="mt-4 text-sm text-red-600">Se déconnecter</button>
      </form>
    </div>
  )
}