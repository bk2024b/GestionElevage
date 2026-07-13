import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F1E7]">
      <main className="flex-1 pb-16">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 flex border-t bg-white">
        <Link href="/dashboard" className="flex-1 text-center py-3 text-sm">Accueil</Link>
        <Link href="/lapins" className="flex-1 text-center py-3 text-sm">Lapins</Link>
        <Link href="/reproduction" className="flex-1 text-center py-3 text-sm">Reproduction</Link>
        <Link href="/parametres" className="flex-1 text-center py-3 text-sm">Réglages</Link>
      </nav>
    </div>
  )
}