import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { MarketingHeader } from '@/components/marketing/MarketingHeader'
import { FeatureCard } from '@/components/marketing/FeatureCard'
import { AppLogoMark } from '@/components/ui/AppLogoMark'
import { BrandName } from '@/components/ui/BrandName'
import { ButtonLink } from '@/components/ui/Button'
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

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Ferme F001 : gestion d'élevage cunicole pour éleveurs au Bénin",
  description: "Ferme F001 est l'application de gestion d'élevage cunicole pour les éleveurs béninois : fiches, reproduction automatisée, rappels, finances et statistiques. Essai gratuit de 2 mois.",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Ferme F001 : gestion d'élevage cunicole pour éleveurs au Bénin",
    description: "L'application qui remplace le cahier : fiches individuelles, reproduction automatisée, rappels intelligents, finances et statistiques pour votre élevage de lapins.",
    url: '/',
    siteName: 'Ferme F001',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Ferme F001 — gestion d\'élevage cunicole' }],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Ferme F001 : gestion d'élevage cunicole pour éleveurs au Bénin",
    description: "L'application qui remplace le cahier pour gérer votre élevage de lapins au Bénin.",
    images: ['/og-image.png'],
  },
}

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-paper">
      <MarketingHeader />

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-5 pt-16 pb-12 text-center">
        <span className="inline-flex items-center gap-1.5 text-xs text-accent-green bg-accent-green-soft px-3 py-1 rounded-pill mb-5">
          <Sparkles size={12} />
          Fait pour les éleveurs cunicoles
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-ink leading-tight mb-4">
          Toute la gestion de votre élevage de lapins, dans votre poche
        </h1>
        <p className="text-ink-soft text-base leading-relaxed mb-8 max-w-xl mx-auto">
          Fiches individuelles, reproduction, naissances, santé, finances et statistiques —
          une seule application pour suivre votre cheptel, sans carnet ni tableur.
        </p>
        <div className="flex items-center justify-center gap-3">
          <ButtonLink href="/register" variante="primaire" className="px-5 py-3">
            Commencer gratuitement
          </ButtonLink>
          <ButtonLink href="/login" variante="secondaire" className="px-5 py-3">
            Se connecter
          </ButtonLink>
        </div>
      </section>

      {/* Bandeau rapide */}
      <section className="max-w-3xl mx-auto px-5 pb-16">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xl font-bold text-ink">Automatique</p>
            <p className="text-xs text-ink-soft">Dates de mise bas et sevrage calculées seules</p>
          </div>
          <div>
            <p className="text-xl font-bold text-ink">Sans papier</p>
            <p className="text-xs text-ink-soft">Fini le carnet et les tableurs éparpillés</p>
          </div>
          <div>
            <p className="text-xl font-bold text-ink">Partout</p>
            <p className="text-xs text-ink-soft">Sur ton téléphone, même hors connexion</p>
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section id="fonctionnalites" className="max-w-5xl mx-auto px-5 py-16 border-t border-line">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-ink mb-2">Tout ce qu'il faut, rien de superflu</h2>
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
        <h2 className="text-2xl font-bold text-ink text-center mb-10">Comment ça marche</h2>
        <div className="flex flex-col gap-6">
          {[
            { icon: UserPlus, title: 'Crée ton compte', text: "Renseigne le nom de ton élevage, c'est prêt en une minute." },
            { icon: Rabbit, title: 'Ajoute tes lapins', text: 'Chaque lapin reçoit un identifiant automatique — plus besoin de le choisir toi-même.' },
            { icon: ClipboardList, title: 'Laisse l\'appli suivre', text: 'Accouplements, naissances, soins — l\'appli calcule les dates et te rappelle au bon moment.' },
          ].map((etape, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <span className="w-10 h-10 shrink-0 rounded-control bg-ink text-white flex items-center justify-center font-semibold text-sm">
                {idx + 1}
              </span>
              <div>
                <h3 className="font-semibold text-sm mb-1 text-ink">{etape.title}</h3>
                <p className="text-sm text-ink-soft leading-relaxed">{etape.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
          {/* Pourquoi Ferme F001 */}
      <section className="max-w-3xl mx-auto px-5 py-16 border-t border-line">
        <h2 className="text-2xl font-bold text-ink text-center mb-6">Pourquoi une application spécialisée ?</h2>
        <div className="flex flex-col gap-4 text-ink-soft text-sm leading-relaxed">
          <p>
            La plupart des outils de gestion agricole sont pensés pour un usage
            généraliste : ils gèrent du bétail, des cultures ou des stocks de
            façon interchangeable, sans jamais entrer dans le détail d'une
            filière précise. Ferme F001 fait le choix inverse.
          </p>
          <p>
            Chaque calcul de l'application est spécifique à la cuniculture : la
            durée de gestation (31 jours), le délai avant sevrage (42 jours), le
            moment de la palpation (15 jours après l'accouplement), ou encore la
            distinction entre lapereaux nés vivants, morts-nés, adoptés ou
            retirés d'une portée. Ce sont des détails qu'un outil généraliste ne
            prend jamais en compte, et qui font toute la différence pour un
            éleveur au quotidien.
          </p>
          <p>
            L'application a été conçue au Bénin, pour des éleveurs béninois —
            en français, en francs CFA, avec une attention particulière portée à
            la connexion internet parfois limitée sur le terrain. Ce n'est pas
            une application internationale traduite après coup : c'est un outil
            pensé depuis le départ pour cette réalité précise.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-5 py-16 border-t border-line">
        <h2 className="text-2xl font-bold text-ink text-center mb-10">Questions fréquentes</h2>
        <div className="flex flex-col gap-6">
          {[
            {
              q: "Combien coûte Ferme F001 ?",
              r: "L'application est gratuite pendant 2 mois complets, sans carte bancaire à renseigner. Passé ce délai, l'abonnement est de 2000 FCFA par mois pour continuer à utiliser toutes les fonctionnalités.",
            },
            {
              q: "Dois-je installer une application depuis un store ?",
              r: "Non. Ferme F001 est une application web progressive (PWA) : elle s'installe directement depuis ton navigateur, en un tap, et fonctionne ensuite comme une application classique sur ton téléphone, sans passer par le Play Store ou l'App Store.",
            },
            {
              q: "Est-ce que ça fonctionne avec une connexion limitée ?",
              r: "L'application est conçue pour rester légère et accessible même avec une connexion internet modeste, ce qui correspond à la réalité de nombreux éleveurs sur le terrain.",
            },
            {
              q: "Mes données sont-elles en sécurité ?",
              r: "Chaque éleveur ne peut voir que ses propres données — lapins, finances, historique. Les informations sont hébergées de façon sécurisée et ne sont jamais partagées avec d'autres utilisateurs de l'application.",
            },
            {
              q: "Puis-je utiliser Ferme F001 sur ordinateur en plus du téléphone ?",
              r: "Oui, l'application s'adapte à la taille de l'écran : elle reste pleinement utilisable sur ordinateur, avec une navigation adaptée au grand écran, en plus de l'expérience mobile.",
            },
            {
              q: "Que se passe-t-il si j'ai déjà des lapins et un historique avant de commencer ?",
              r: "Tu peux ajouter tes lapins existants directement dans l'application avec leurs informations connues (date de naissance, race, poids...) — l'historique se construit ensuite au fur et à mesure de ton utilisation.",
            },
          ].map((item, idx) => (
            <div key={idx}>
              <h3 className="font-semibold text-sm text-ink mb-1.5">{item.q}</h3>
              <p className="text-sm text-ink-soft leading-relaxed">{item.r}</p>
            </div>
          ))}
        </div>
      </section>
      {/* CTA final */}
      <section className="max-w-3xl mx-auto px-5 py-16 border-t border-line text-center">
        <h2 className="text-2xl font-bold text-ink mb-3">Prêt à digitaliser ton élevage ?</h2>
        <p className="text-ink-soft text-sm mb-6">Gratuit pendant 2 mois, aucune carte bancaire requise.</p>
        <ButtonLink href="/register" variante="primaire" className="inline-block px-6 py-3">
          Créer mon compte
        </ButtonLink>
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