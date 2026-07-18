import { createClient } from '@/lib/supabase/server'
import { signOut } from '../../(auth)/actions'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Lock } from 'lucide-react'

export default async function AccesSuspenduPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 max-w-sm mx-auto text-center">
      <span className="w-14 h-14 mx-auto rounded-card bg-accent-soft flex items-center justify-center mb-4">
        <Lock size={22} className="text-accent" />
      </span>
      <h1 className="text-xl font-display font-semibold mb-2">Période d'essai terminée</h1>
      <p className="text-sm text-ink-soft mb-6 leading-relaxed">
        Ton accès gratuit de 2 mois est arrivé à son terme. Pour continuer à utiliser l'application,
        contacte-nous pour activer ton abonnement — 2 000 FCFA/mois.
      </p>

      <Card className="mb-6 text-left">
        <p className="text-xs text-ink-soft mb-1">Compte</p>
        <p className="text-sm font-medium">{user?.email}</p>
      </Card>

      <a
        href="https://wa.me/22940545270"
        target="_blank"
        rel="noopener noreferrer"
        className="tap block bg-ink text-paper rounded-card py-2.5 text-sm font-medium mb-3"
      >
        Contacter sur WhatsApp
      </a>

      <form action={signOut}>
        <Button type="submit" variante="discret" className="w-full">
          Se déconnecter
        </Button>
      </form>
    </div>
  )
}