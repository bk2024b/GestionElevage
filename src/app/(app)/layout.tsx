import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/ui/Sidebar'
import { BottomNav } from '@/components/ui/BottomNav'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="min-h-screen flex bg-paper">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 pb-20 md:pb-6 safe-top">{children}</main>
        <BottomNav />
      </div>
    </div>
  )
}