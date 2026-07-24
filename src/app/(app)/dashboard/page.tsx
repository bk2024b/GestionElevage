import { createClient } from '@/lib/supabase/server'
import { EarTagBadge } from '@/components/lapins/EarTagBadge'
import { LABEL_TYPE_RAPPEL } from '@/lib/rappels'
import { formatFCFA } from '@/lib/finances'
import { classifierLapin } from '@/lib/lapins'
import { Card } from '@/components/ui/Card'
import { QuickAction } from '@/components/ui/QuickAction'
import Link from 'next/link'
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
  Wallet,
  TrendingUp,
  TrendingDown,
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
    .limit(4)

  const debutMois = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString()
    .split('T')[0]

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-display font-semibold leading-tight">
            Bonjour, {profilComplet?.nom || 'Éleveur'} 👋
          </h1>
          <p className="text-xs text-ink-soft mt-0.5">
            Voici un aperçu de {profilComplet?.nom_elevage || 'ton élevage'}.
          </p>
        </div>
        <Link href="/rappels" className="tap relative w-10 h-10 flex items-center justify-center rounded-full bg-surface border border-line">
          <Bell size={17} className="text-ink" />
          {(nbRappels ?? 0) > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent text-paper text-[9px] flex items-center justify-center font-medium">
              {nbRappels}
            </span>
          )}
        </Link>
      </div>

      {/* Cartes stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-accent text-paper rounded-card p-4">
          <span className="w-9 h-9 rounded-full bg-paper/20 flex items-center justify-center mb-3">
            <Rabbit size={17} />
          </span>
          <p className="text-2xl font-display font-semibold">{nbLapinsTotal ?? 0}</p>
          <p className="text-xs text-paper/80 mt-0.5">Total lapins</p>
        </div>

        <Card className="!p-4">
          <span className="w-9 h-9 rounded-full bg-accent-soft text-accent flex items-center justify-center mb-3">
            <Baby size={17} />
          </span>
          <p className="text-2xl font-display font-semibold">{nbJeunes}</p>
          <p className="text-xs text-ink-soft mt-0.5">Jeunes lapins</p>
        </Card>

        <Card className="!p-4">
          <span className="w-9 h-9 rounded-full bg-accent-soft text-accent flex items-center justify-center mb-3">
            <Venus size={17} />
          </span>
          <p className="text-2xl font-display font-semibold">{nbFemellesReproductrices}</p>
          <p className="text-xs text-ink-soft mt-0.5">Femelles reprod.</p>
        </Card>

        <Card className="!p-4">
          <span className="w-9 h-9 rounded-full bg-accent-soft text-accent flex items-center justify-center mb-3">
            <Mars size={17} />
          </span>
          <p className="text-2xl font-display font-semibold">{nbMalesReproducteurs}</p>
          <p className="text-xs text-ink-soft mt-0.5">Mâles reprod.</p>
        </Card>
      </div>

      {(nbGestantes ?? 0) > 0 && (
        <Card className="mb-4 flex items-center justify-between bg-accent-soft border-accent/20">
          <div className="flex items-center gap-2">
            <HeartPulse size={16} className="text-accent" />
            <span className="text-sm text-ink">Gestations en cours</span>
          </div>
          <span className="text-lg font-display font-semibold text-accent">{nbGestantes}</span>
        </Card>
      )}

      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-2">
          {/* Activités récentes / rappels */}
          {rappelsUrgents && rappelsUrgents.length > 0 && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium">Activités récentes</p>
                {nbRappels ? <span className="text-xs text-ink-soft">{nbRappels} au total</span> : null}
              </div>
              <Card className="!p-0 overflow-hidden divide-y divide-line">
                {rappelsUrgents.map((r: any) => (
                  <div key={r.id} className="flex items-center gap-3 px-4 py-3">
                    <span className="w-8 h-8 shrink-0 rounded-full bg-accent-soft flex items-center justify-center">
                      <Bell size={14} className="text-accent" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{LABEL_TYPE_RAPPEL[r.type] || r.message}</p>
                      {r.lapin && (
                        <div className="mt-0.5">
                          <EarTagBadge identifiant={r.lapin.identifiant} sexe={r.lapin.sexe} />
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-ink-soft shrink-0">
                      {new Date(r.date_prevue).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                ))}
              </Card>
              <Link href="/rappels" className="text-xs text-ink-soft mt-2 inline-block">
                Voir tous les rappels →
              </Link>
            </div>
          )}

          {/* Finances */}
          <Link href="/finances" className="tap block mb-4">
            <Card>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-ink-soft">Finances — ce mois</p>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center ${beneficeDuMois >= 0 ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                  {beneficeDuMois >= 0 ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
                </span>
              </div>
              <p className={`text-2xl font-display font-semibold mb-3 ${beneficeDuMois >= 0 ? 'text-success' : 'text-danger'}`}>
                {formatFCFA(beneficeDuMois)}
              </p>
              <div className="h-1.5 rounded-pill bg-line overflow-hidden">
                <div className="h-full bg-accent rounded-pill" style={{ width: `${ratioRevenus}%` }} />
              </div>
              <div className="flex justify-between text-xs text-ink-soft mt-1.5">
                <span>Revenus {formatFCFA(revenusMois)}</span>
                <span>Dépenses {formatFCFA(depensesMois)}</span>
              </div>
            </Card>
          </Link>
        </div>

        {/* Accès rapides — mobile uniquement */}
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