import { createClient } from '@/lib/supabase/server'
import { LABEL_TYPE_RAPPEL } from '@/lib/rappels'
import { calculerAutonomieStock } from '@/lib/alimentation-stock'
import { StatCardIcone, TrendCard, AlertCard, Card } from '@/components/ui/Card'
import { QuickAction } from '@/components/ui/QuickAction'
import { EarTagBadge } from '@/components/lapins/EarTagBadge'
import Link from 'next/link'
import {
  Rabbit,
  Baby,
  Stethoscope,
  Bell,
  Package,
  Package2,
  HeartPulse,
  Wheat,
  CalendarDays,
  BarChart3,
  BookOpen,
  Settings,
} from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profil } = await supabase.from('profils').select('nom, nom_elevage').eq('id', user!.id).single()

  const debutMois = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
  const aujourdhui = new Date().toISOString().split('T')[0]
  const ilYa30Jours = new Date()
  ilYa30Jours.setDate(ilYa30Jours.getDate() - 30)

  // KPIs
  const { count: nbLapinsTotal } = await supabase.from('lapins').select('*', { count: 'exact', head: true })
  const { count: nbNouveauxCeMois } = await supabase
    .from('lapins').select('*', { count: 'exact', head: true }).gte('created_at', debutMois)

  const { data: misesBasMois } = await supabase
    .from('mises_bas').select('nes_vivants').gte('date_misebas', debutMois)
  const naissancesMois = (misesBasMois ?? []).reduce((s, m) => s + m.nes_vivants, 0)

  const { count: nbEnEngraissement } = await supabase
    .from('lapins')
    .select('*', { count: 'exact', head: true })
    .eq('stade', 'engraissement')
    .eq('statut', 'actif')

  const { count: soinsAujourdhui } = await supabase
    .from('soins').select('*', { count: 'exact', head: true }).eq('date_soin', aujourdhui)

  const { joursRestants } = await calculerAutonomieStock(user!.id)

  // Graphique naissances 14 derniers jours
  const { data: misesBas30j } = await supabase
    .from('mises_bas')
    .select('date_misebas, nes_vivants')
    .gte('date_misebas', ilYa30Jours.toISOString().split('T')[0])
    .order('date_misebas', { ascending: true })

  const parJour = new Map<string, number>()
  for (const m of misesBas30j ?? []) {
    parJour.set(m.date_misebas, (parJour.get(m.date_misebas) ?? 0) + m.nes_vivants)
  }
  const donneesGraphique = Array.from({ length: 14 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (13 - i))
    return parJour.get(d.toISOString().split('T')[0]) ?? 0
  })

  // Saillies / mises bas prévues
  const { data: saillies } = await supabase
    .from('accouplements')
    .select(`date_misebas_prevue, femelle:accouplements_femelle_id_fkey(identifiant), male:accouplements_male_id_fkey(identifiant)`)
    .in('statut', ['en_cours', 'confirmee'])
    .order('date_misebas_prevue', { ascending: true })
    .limit(3)

  // Alertes / rappels
  const { data: rappels } = await supabase
    .from('rappels')
    .select(`*, lapin:lapin_id(identifiant, sexe)`)
    .eq('vu', false)
    .order('date_prevue', { ascending: true })
    .limit(3)

  function joursRestantsAffichage(date: string) {
    const diff = Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    if (diff <= 0) return "Aujourd'hui"
    if (diff === 1) return 'Demain'
    return `Dans ${diff} jours`
  }

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-6">
      <h1 className="text-2xl font-bold text-ink mb-1">Bonjour {profil?.nom || 'Éleveur'} 👋</h1>
      <p className="text-sm text-ink-soft mb-6">Voici ce qui se passe dans {profil?.nom_elevage || 'votre élevage'} aujourd'hui.</p>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
        <StatCardIcone
          icon={Rabbit}
          label="Lapins au total"
          value={nbLapinsTotal ?? 0}
          delta={(nbNouveauxCeMois ?? 0) > 0 ? `${nbNouveauxCeMois} ce mois` : undefined}
        />
        <StatCardIcone icon={Baby} label="Naissances" value={naissancesMois} delta={naissancesMois > 0 ? 'ce mois' : undefined} />
        <StatCardIcone
          icon={Package2}
          label="En engraissement"
          value={nbEnEngraissement ?? 0}
          delta={(nbEnEngraissement ?? 0) > 0 ? 'à vendre' : undefined}
        />
        <StatCardIcone icon={Stethoscope} label="Traitements aujourd'hui" value={soinsAujourdhui ?? 0} />
        <StatCardIcone
          icon={Package}
          label="Stock nourriture"
          value={joursRestants !== null ? `${joursRestants} j` : '—'}
          delta={joursRestants !== null && joursRestants > 7 ? 'Stock suffisant' : undefined}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        {/* Graphique naissances */}
        <div className="lg:col-span-1">
          <TrendCard label="Naissances (14 derniers jours)" value={naissancesMois} delta="ce mois" donnees={donneesGraphique} />
        </div>

        {/* Saillies prévues */}
        <Card className="lg:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-ink">Saillies prévues</h3>
            <Link href="/reproduction" className="text-xs text-accent-green font-medium">Voir tout</Link>
          </div>
          <div className="flex flex-col gap-3">
            {saillies?.map((s: any, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <EarTagBadge identifiant={s.femelle.identifiant} sexe="F" />
                  <span className="text-xs text-ink-soft">×</span>
                  <EarTagBadge identifiant={s.male.identifiant} sexe="M" />
                </div>
                <span className="text-xs text-accent font-medium bg-accent-soft px-2 py-1 rounded-pill">
                  {joursRestantsAffichage(s.date_misebas_prevue)}
                </span>
              </div>
            ))}
            {(!saillies || saillies.length === 0) && (
              <p className="text-xs text-ink-soft">Aucune saillie prévue.</p>
            )}
          </div>
        </Card>

        {/* Alertes */}
        <div className="lg:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-ink">Alertes</h3>
            <Link href="/rappels" className="text-xs text-accent-green font-medium">Voir tout</Link>
          </div>
          <div className="flex flex-col gap-2">
            {rappels?.map((r: any) => (
              <AlertCard
                key={r.id}
                icon={Bell}
                titre={LABEL_TYPE_RAPPEL[r.type] || r.message}
                sousTitre={r.lapin ? `${r.lapin.identifiant} — ${new Date(r.date_prevue).toLocaleDateString('fr-FR')}` : new Date(r.date_prevue).toLocaleDateString('fr-FR')}
              />
            ))}
            {(!rappels || rappels.length === 0) && (
              <p className="text-xs text-ink-soft">Aucune alerte pour le moment.</p>
            )}
          </div>
        </div>
      </div>

      {/* Accès rapides — mobile uniquement, la sidebar couvre déjà la navigation sur desktop */}
      <div className="md:hidden mt-2">
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
        <div className="grid grid-cols-3 gap-1">
          <QuickAction href="/statistiques" icon={BarChart3} label="Stats" />
          <QuickAction href="/store" icon={BookOpen} label="Ressources" />
          <QuickAction href="/parametres" icon={Settings} label="Réglages" />
        </div>
      </div>
    </div>
  )
}