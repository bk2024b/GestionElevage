import { createClient } from '@/lib/supabase/server'
import { EarTagBadge } from '@/components/lapins/EarTagBadge'
import { LABEL_TYPE_RAPPEL } from '@/lib/rappels'
import { formatFCFA } from '@/lib/finances'
import { classifierLapin } from '@/lib/lapins'
import { Card } from '@/components/ui/Card'
import { QuickAction } from '@/components/ui/QuickAction'
import { AppLogoMark } from '@/components/ui/AppLogoMark'
import Link from 'next/link'
import {
  Rabbit,
  HeartPulse,
  Baby,
  Stethoscope,
  Wheat,
  CalendarDays,
  Wallet,
  BarChart3,
  Settings,
  BookOpen,
  Bell,
} from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profilComplet } = await supabase.from('profils').select('nom, nom_elevage, role').eq('id', user!.id).single()

  const { data: lapinsActifs } = await supabase
    .from('lapins')
    .select('sexe, date_naissance, age_premiere_saillie')
    .eq('statut', 'actif')

  const { count: nbLapinsTotal } = await supabase
    .from('lapins')
    .select('*', { count: 'exact', head: true })

  let nbFemellesReproductrices = 0
  let nbMalesReproducteurs = 0
  let nbJeunes = 0

  for (const l of lapinsActifs ?? []) {
    const categorie = classifierLapin(l)
    if (categorie === 'jeune') {
      nbJeunes++
    } else if (l.sexe === 'F') {
      nbFemellesReproductrices++
    } else {
      nbMalesReproducteurs++
    }
  }

  const { count: nbGestantes } = await supabase
    .from('accouplements')
    .select('*', { count: 'exact', head: true })
    .in('statut', ['en_cours', 'confirmee'])

  const { count: nbRappels } = await supabase
    .from('rappels')
    .select('*', { count: 'exact', head: true })
    .eq('vu', false)

  const { data: rappelsUrgents } = await supabase
    .from('rappels')
    .select(`*, lapin:lapin_id(identifiant, sexe)`)
    .eq('vu', false)
    .order('date_prevue', { ascending: true })
    .limit(3)

  const debutMois = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString()
    .split('T')[0]

  const { data: transactionsMois } = await supabase
    .from('transactions_financieres')
    .select('type, montant')
    .gte('date_transaction', debutMois)

  const beneficeDuMois = (transactionsMois ?? []).reduce(
    (s, t) => s + (t.type === 'revenu' ? Number(t.montant) : -Number(t.montant)),
    0
  )

  const dateAujourdhui = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div>
      {/* En-tête incurvé */}
      <div className="bg-ink rounded-b-[2.5rem] pb-14 pt-3 px-5 relative">
        <div className="max-w-md md:max-w-none mx-auto flex items-center justify-between mb-4">
          <span className="text-paper/50 text-xs">{dateAujourdhui}</span>
          <Link href="/rappels" className="tap relative w-9 h-9 flex items-center justify-center rounded-full bg-paper/10">
            <Bell size={16} className="text-paper" />
            {(nbRappels ?? 0) > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent text-paper text-[9px] flex items-center justify-center font-medium">
                {nbRappels}
              </span>
            )}
          </Link>
        </div>

        <div className="flex flex-col items-center text-center">
          <AppLogoMark size="lg" />
          <h1 className="text-lg font-display font-semibold text-paper mt-3 leading-tight">
            {profilComplet?.nom_elevage ?? 'Mon élevage'}
          </h1>
          <p className="text-xs text-paper/50 mt-0.5">Bonjour {profilComplet?.nom ?? ''}</p>
        </div>
      </div>

      {/* Contenu, chevauchant légèrement l'en-tête */}
      <div className="max-w-md md:max-w-4xl mx-auto px-5 -mt-8 relative z-10">
        <Card className="mb-6 !p-0 overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4">
            <div className="px-4 py-3 border-b md:border-b-0 border-r border-line">
              <p className="text-xs text-ink-soft">Total lapins</p>
              <p className="text-xl font-display font-semibold">{nbLapinsTotal ?? 0}</p>
            </div>
            <div className="px-4 py-3 border-b md:border-b-0 md:border-r border-line">
              <p className="text-xs text-ink-soft">Jeunes lapins</p>
              <p className="text-xl font-display font-semibold">{nbJeunes}</p>
            </div>
            <div className="px-4 py-3 border-r md:border-r border-line">
              <p className="text-xs text-ink-soft">Femelles reprod.</p>
              <p className="text-xl font-display font-semibold">{nbFemellesReproductrices}</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-xs text-ink-soft">Mâles reprod.</p>
              <p className="text-xl font-display font-semibold">{nbMalesReproducteurs}</p>
            </div>
          </div>
        </Card>

        <div className="md:max-w-2xl">
          {(nbGestantes ?? 0) > 0 && (
            <Card className="mb-6 flex items-center justify-between bg-accent-soft border-accent/20">
              <span className="text-sm text-ink">Gestations en cours</span>
              <span className="text-lg font-display font-semibold text-accent">{nbGestantes}</span>
            </Card>
          )}

          {rappelsUrgents && rappelsUrgents.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium">À faire</p>
                {nbRappels ? <span className="text-xs text-ink-soft">{nbRappels} au total</span> : null}
              </div>
              <div className="flex flex-col gap-2">
                {rappelsUrgents.map((r: any) => (
                  <Card key={r.id} className="flex items-center gap-2 py-2">
                    {r.lapin && <EarTagBadge identifiant={r.lapin.identifiant} sexe={r.lapin.sexe} />}
                    <span className="text-sm flex-1">{LABEL_TYPE_RAPPEL[r.type] || r.message}</span>
                    <span className="text-xs text-ink-soft">{new Date(r.date_prevue).toLocaleDateString('fr-FR')}</span>
                  </Card>
                ))}
              </div>
              <Link href="/rappels" className="text-xs text-ink-soft mt-2 inline-block">
                Voir tous les rappels →
              </Link>
            </div>
          )}

          <Link href="/finances" className="tap block mb-6">
            <Card className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet size={18} className="text-ink-soft" />
                <span className="text-sm">Bénéfice ce mois</span>
              </div>
              <span className={`text-sm font-medium ${beneficeDuMois >= 0 ? 'text-success' : 'text-danger'}`}>
                {formatFCFA(beneficeDuMois)}
              </span>
            </Card>
          </Link>

          {/* Grille d'actions rapides — mobile uniquement, la sidebar couvre déjà la navigation sur desktop */}
          <div className="md:hidden">
            <p className="text-xs text-ink-soft mb-1">Élevage</p>
            <div className="grid grid-cols-3 gap-1 mb-4">
              <QuickAction href="/lapins" icon={Rabbit} label="Lapins" />
              <QuickAction href="/reproduction" icon={HeartPulse} label="Reprod." accent />
              <QuickAction href="/mises-bas" icon={Baby} label="Naissances" />
              <QuickAction href="/sante" icon={Stethoscope} label="Santé" />
              <QuickAction href="/alimentation" icon={Wheat} label="Aliment." />
              <QuickAction href="/calendrier" icon={CalendarDays} label="Calendrier" />
            </div>

            <p className="text-xs text-ink-soft mb-1">Gestion</p>
            <div className="grid grid-cols-3 gap-1 mb-4">
              <QuickAction href="/statistiques" icon={BarChart3} label="Stats" />
              <QuickAction href="/store" icon={BookOpen} label="Ressources" />
              <QuickAction href="/parametres" icon={Settings} label="Réglages" />
            </div>

            {profilComplet?.role === 'admin' && (
              <Link
                href="/admin"
                className="tap block text-center border border-accent text-accent rounded-card py-2.5 text-sm font-medium"
              >
                Interface admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}