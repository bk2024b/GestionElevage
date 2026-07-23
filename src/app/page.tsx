import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { MarketingHeader } from '@/components/marketing/MarketingHeader'
import { FeatureCard } from '@/components/marketing/FeatureCard'
import { AppLogoMark } from '@/components/ui/AppLogoMark'
import { BrandName } from '@/components/ui/BrandName'
import {
  Rabbit,
  HeartPulse,
  Baby,
  Bell,
  Wallet,
  BarChart3,
  ClipboardList,
  UserPlus,
  Sparkles,
} from 'lucide-react'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-paper">
      <MarketingHeader />

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-5 pt-16 pb-12 text-center">
        <span className="inline-flex items-center gap-1.5 text-xs text-accent bg-accent-soft px-3 py-1 rounded-pill mb-5">
          <Sparkles size={12} />
          Fait pour les éleveurs cunicoles
        </span>
        <h1 className="text-3xl sm:text-4xl font-display font-semibold leading-tight mb-4">
  <BrandName /> — l'élevage sans oublis
</h1>
        <p className="text-ink-soft text-base leading-relaxed mb-8 max-w-xl mx-auto">
          Fiches individuelles, reproduction, naissances, santé, finances et statistiques —
          une seule application pour suivre votre cheptel, sans carnet ni tableur.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/register" className="tap bg-ink text-paper px-5 py-3 rounded-card text-sm font-medium">
            Commencer gratuitement
          </Link>
          <Link href="/login" className="tap border border-line text-ink px-5 py-3 rounded-card text-sm font-medium">
            Se connecter
          </Link>
        </div>
      </section>

      {/* Bandeau rapide */}
      <section className="max-w-3xl mx-auto px-5 pb-16">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xl font-display font-semibold">Automatique</p>
            <p className="text-xs text-ink-soft">Dates de mise bas et sevrage calculées seules</p>
          </div>
          <div>
            <p className="text-xl font-display font-semibold">Sans papier</p>
            <p className="text-xs text-ink-soft">Fini le carnet et les tableurs éparpillés</p>
          </div>
          <div>
            <p className="text-xl font-display font-semibold">Partout</p>
            <p className="text-xs text-ink-soft">Sur ton téléphone, même hors connexion</p>
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section id="fonctionnalites" className="max-w-5xl mx-auto px-5 py-16 border-t border-line">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-display font-semibold mb-2">Tout ce qu'il faut, rien de superflu</h2>
          <p className="text-ink-soft text-sm">Pensé pour le quotidien d'un élevage, pas pour un tableau Excel.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FeatureCard
            icon={Rabbit}
            title="Fiches individuelles"
            description="Chaque lapin a son identifiant, sa cage, son historique complet — accouplements, soins, statut."
          />
          <FeatureCard
            icon={HeartPulse}
            title="Reproduction suivie"
            description="Enregistre un accouplement, l'appli calcule le nid, la mise bas et prévient pour la palpation."
          />
          <FeatureCard
            icon={Baby}
            title="Naissances et sevrages"
            description="Nés vivants, morts-nés, adoptés — puis identification individuelle des lapereaux au bon moment."
          />
          <FeatureCard
            icon={Bell}
            title="Rappels intelligents"
            description="Palpation, mise bas, sevrage — les rappels arrivent seuls, au bon jour, pour le bon lapin."
          />
          <FeatureCard
            icon={Wallet}
            title="Finances centralisées"
            description="Dépenses et revenus, y compris ceux générés automatiquement par tes soins et distributions."
          />
          <FeatureCard
            icon={BarChart3}
            title="Statistiques et export"
            description="Taux de reproduction, mortalité, rentabilité — exportables en PDF ou Excel en un clic."
          />
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="comment-ca-marche" className="max-w-3xl mx-auto px-5 py-16 border-t border-line">
        <h2 className="text-2xl font-display font-semibold text-center mb-10">Comment ça marche</h2>
        <div className="flex flex-col gap-6">
          {[
            { icon: UserPlus, title: 'Crée ton compte', text: "Renseigne le nom de ton élevage, c'est prêt en une minute." },
            { icon: Rabbit, title: 'Ajoute tes lapins', text: 'Chaque lapin reçoit un identifiant automatique — plus besoin de le choisir toi-même.' },
            { icon: ClipboardList, title: 'Laisse l\'appli suivre', text: 'Accouplements, naissances, soins — l\'appli calcule les dates et te rappelle au bon moment.' },
          ].map((etape, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <span className="w-10 h-10 shrink-0 rounded-card bg-ink text-paper flex items-center justify-center font-display font-semibold text-sm">
                {idx + 1}
              </span>
              <div>
                <h3 className="font-display font-semibold text-sm mb-1">{etape.title}</h3>
                <p className="text-sm text-ink-soft leading-relaxed">{etape.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="max-w-3xl mx-auto px-5 py-16 border-t border-line text-center">
        <h2 className="text-2xl font-display font-semibold mb-3">Prêt à digitaliser ton élevage ?</h2>
        <p className="text-ink-soft text-sm mb-6">Gratuit pour commencer, aucune carte bancaire requise.</p>
        <Link href="/register" className="tap inline-block bg-ink text-paper px-6 py-3 rounded-card text-sm font-medium">
          Créer mon compte
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-line py-8">
  <div className="max-w-5xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-3">
    <div className="flex items-center gap-2">
      <AppLogoMark size="sm" />
      <BrandName className="text-xs text-ink-soft" />
    </div>
    <div className="flex flex-col items-center sm:items-end gap-1">
      <div className="flex gap-3 text-xs text-ink-soft">
        <Link href="/conditions-utilisation" className="hover:text-ink">Conditions</Link>
        <Link href="/confidentialite" className="hover:text-ink">Confidentialité</Link>
      </div>
      <p className="text-xs text-ink-soft/70">© {new Date().getFullYear()} Ferme F001. Tous droits réservés.</p>
    </div>
  </div>
</footer>
    </div>
  )
}