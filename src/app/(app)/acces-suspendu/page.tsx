import { createClient } from '@/lib/supabase/server'
import { signOut } from '../../(auth)/actions'
import { creerLienPaiement } from '../parametres/abonnement/actions'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { AppLogoMark } from '@/components/ui/AppLogoMark'
import { Lock } from 'lucide-react'

export default async function AccesSuspenduPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 max-w-sm mx-auto text-center">
      <AppLogoMark size="lg" />
      <h1 className="text-xl font-display font-semibold mt-4 mb-2">Période d'essai terminée</h1>
      <p className="text-sm text-ink-soft mb-6 leading-relaxed">
        Ton accès gratuit de 2 mois est arrivé à son terme. Active ton abonnement pour
        continuer à utiliser Ferme F001 — 2000 FCFA/mois.
      </p>

      {error && (
        <p className="text-sm text-danger bg-danger/10 rounded-card px-3 py-2 mb-4">{error}</p>
      )}

      <Card className="mb-6 text-left">
        <p className="text-xs text-ink-soft mb-1">Compte</p>
        <p className="text-sm font-medium">{user?.email}</p>
      </Card>

      <form action={creerLienPaiement} className="mb-3">
        <Button type="submit" variante="primaire" className="w-full">
          Payer maintenant — 2000 FCFA
        </Button>
      </form>

      
        href="https://wa.me/22940545270"
        target="_blank"
        rel="noopener noreferrer"
        className="tap block border border-line text-ink rounded-card py-2.5 text-sm font-medium mb-3"
      >
        Besoin d'aide ? Contacter sur WhatsApp
      </a>

      <form action={signOut}>
        <Button type="submit" variante="discret" className="w-full">
          Se déconnecter
        </Button>
      </form>
    </div>
  )
}