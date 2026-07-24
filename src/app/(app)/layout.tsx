import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/ui/Sidebar'
import { BottomNav } from '@/components/ui/BottomNav'
import { MobileTopBar } from '@/components/ui/MobileTopBar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profil } = await supabase.from('profils').select('role').eq('id', user.id).single()

  const { count: nbRappels } = await supabase
    .from('rappels')
    .select('*', { count: 'exact', head: true })
    .eq('vu', false)

  const isAdmin = profil?.role === 'admin'

  return (
    <div className="min-h-screen flex bg-paper">
      <Sidebar isAdmin={isAdmin} />
      <div className="flex-1 flex flex-col min-w-0">
        <MobileTopBar isAdmin={isAdmin} nbRappels={nbRappels ?? 0} />
        <main className="flex-1 pb-20 md:pb-6">{children}</main>
        <BottomNav />
      </div>
    </div>
  )
}