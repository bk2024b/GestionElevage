import { createClient } from '@/lib/supabase/server'
import { EarTagBadge } from '@/components/lapins/EarTagBadge'
import { LABEL_TYPE_RAPPEL } from '@/lib/rappels'
import { formatFCFA } from '@/lib/finances'
import { classifierLapin } from '@/lib/lapins'
import { Card } from '@/components/ui/Card'
import { QuickAction } from '@/components/ui/QuickAction'
import Link from 'next/link'
import { MobileMenu } from '@/components/ui/MobileMenu'
import {
  Rabbit,
  Baby,
  Venus,
  Mars,
  HeartPulse,
  Stethoscope,
  Wheat,
  CalendarDays,
  BarChart3,
  Settings,
  BookOpen,
  Bell,
  TrendingUp,
  TrendingDown,
  Menu,
} from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profilComplet } = await supabase.from('profils').select('nom, nom_elevage, role').eq('id', user!.id).single()

  const debutMois = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString()
    .split('T')[0]

  const { data: lapinsActifs } = await supabase
    .from('lapins')
    .select('sexe, date_naissance, age_premiere_saillie')
    .eq('statut', 'actif')

  const { count: nbLapinsTotal } = await supabase
    .from('lapins')
    .select('*', { count: 'exact', head: true })

  const { count: nbNouveauxCeMois } = await supabase
    .from('lapins')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', debutMois)

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
    .limit(4)

  const { data: transactionsMois } = await supabase
    .from('transactions_financieres')
    .select('type, montant')
    .gte('date_transaction', debutMois)

  const revenusMois = (transactionsMois ?? []).filter((t) => t.type === 'revenu').reduce((s, t) => s + Number(t.montant), 0)
  const depensesMois = (transactionsMois ?? []).filter((t) => t.type === 'depense').reduce((s, t) => s + Number(t.montant), 0)
  const beneficeDuMois = revenusMois - depensesMois
  const totalMouvement = revenusMois + depensesMois
  const ratioRevenus = totalMouvement > 0 ? Math.round((revenusMois / totalMouvement) * 100) : 50

  return (
    <div className="max-w-md md:max-w-4xl mx-auto px-5 py-6">
      {/* En-tête léger */}
      <div className="mb-2 md:mb-6" />

      <h1 className="text-2xl font-display font-semibold leading-tight mb-1">
        Bonjour, {profilComplet?.nom || 'Éleveur'} 👋
      </h1>
      <p className="text-sm text-ink-soft mb-6">
        Voici un aperçu de {profilComplet?.nom_elevage || 'ton élevage'}.
      </p>

      {/* Cartes stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
        <div className="bg-accent text-paper rounded-card p-5 flex items-center gap-4 col-span-2 md:col-span-1">
          <Rabbit size={52} strokeWidth={1.3} className="shrink-0 -ml-1" />
          <div>
            <p className="text-sm text-paper/85">Total lapins</p>
            <p className="text-3xl font-display font-semibold leading-tight">{nbLapinsTotal ?? 0}</p>
            {(nbNouveauxCeMois ?? 0) > 0 && (
              <p className="text-xs text-paper/70 mt-0.5">+{nbNouveauxCeMois} ce mois</p>
            )}
          </div>
        </div>

        <Card>
          <Baby size={26} strokeWidth={1.6} className="text-ink mb-3" />
          <p className="text-sm text-ink-soft">Jeunes lapins</p>
          <p className="text-2xl font-display font-semibold mt-1">{nbJeunes}</p>
        </Card>

        <Card>
          <Venus size={26} strokeWidth={1.6} className="text-ink mb-3" />
          <p className="text-sm text-ink-soft">Femelles reprod.</p>
          <p className="text-2xl font-display font-semibold mt-1">{nbFemellesReproductrices}</p>
        </Card>

        <Card>
          <Mars size={26} strokeWidth={1.6} className="text-ink mb-3" />
          <p className="text-sm text-ink-soft">Mâles reprod.</p>
          <p className="text-2xl font-display font-semibold mt-1">{nbMalesReproducteurs}</p>
        </Card>
      </div>

      {(nbGestantes ?? 0) > 0 && (
        <Card className="mb-3 flex items-center justify-between bg-accent-soft border-accent/20">
          <div className="flex items-center gap-2">
            <HeartPulse size={17} className="text-accent" />
            <span className="text-sm text-ink">Gestations en cours</span>
          </div>
          <span className="text-lg font-display font-semibold text-accent">{nbGestantes}</span>
        </Card>
      )}

      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-2">
          {rappelsUrgents && rappelsUrgents.length > 0 && (
            <Card className="!p-0 overflow-hidden mb-3">
              <p className="text-sm font-medium px-5 pt-4 pb-2">Activités récentes</p>
              <div className="divide-y divide-line/60">
                {rappelsUrgents.map((r: any) => (
                  <div key={r.id} className="flex items-center gap-3 px-5 py-3">
                    <Bell size={16} className="text-ink-soft shrink-0" strokeWidth={1.6} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{LABEL_TYPE_RAPPEL[r.type] || r.message}</p>
                      {r.lapin && (
                        <div className="mt-0.5">
                          <EarTagBadge identifiant={r.lapin.identifiant} sexe={r.lapin.sexe} />
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-accent shrink-0">
                      {new Date(r.date_prevue).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Link href="/finances" className="tap block mb-3">
            <Card>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium">Finances</p>
                <span className="w-11 h-11 rounded-card bg-accent-soft text-accent flex items-center justify-center">
                  {beneficeDuMois >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                </span>
              </div>
              <p className="text-xs text-ink-soft">Solde actuel</p>
              <p className={`text-2xl font-display font-semibold mb-3 ${beneficeDuMois >= 0 ? 'text-accent' : 'text-danger'}`}>
                {formatFCFA(beneficeDuMois)}
              </p>
              <div className="h-2 rounded-pill bg-accent-soft overflow-hidden">
                <div className="h-full bg-accent rounded-pill" style={{ width: `${ratioRevenus}%` }} />
              </div>
            </Card>
          </Link>
        </div>

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
  )
}