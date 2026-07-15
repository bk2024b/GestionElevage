import { createClient } from '@/lib/supabase/server'
import { signOut } from '../../(auth)/actions'
import { EarTagBadge } from '@/components/lapins/EarTagBadge'
import { LABEL_TYPE_RAPPEL } from '@/lib/rappels'
import { formatFCFA } from '@/lib/finances'
import { classifierLapin } from '@/lib/lapins'
import { Card } from '@/components/ui/Card'
import { QuickAction } from '@/components/ui/QuickAction'
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
  LogOut,
} from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profil } = await supabase.from('profils').select('nom, nom_elevage').eq('id', user!.id).single()

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

  const initiales = (profil?.nom_elevage ?? 'EL')
    .split(' ')
    .map((m: string) => m[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const dateAujourdhui = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div className="px-5 py-6 max-w-md mx-auto">
      {/* En-tête élevage */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 shrink-0 rounded-card bg-ink text-paper flex items-center justify-center font-display font-semibold text-sm">
            {initiales}
          </span>
          <div>
            <h1 className="text-lg font-display font-semibold leading-tight">
              {profil?.nom_elevage ?? 'Mon élevage'}
            </h1>
            <p className="text-xs text-ink-soft capitalize">
              Bonjour {profil?.nom ?? ''} · {dateAujourdhui}
            </p>
          </div>
        </div>
        <form action={signOut}>
          <button type="submit" className="tap w-9 h-9 flex items-center justify-center rounded-card border border-line text-ink-soft">
            <LogOut size={16} />
          </button>
        </form>
      </div>

      {/* Panneau de synthèse */}
      <Card className="mb-6 !p-0 overflow-hidden">
        <div className="grid grid-cols-2">
          <div className="px-4 py-3 border-b border-r border-line">
            <p className="text-xs text-ink-soft">Total lapins</p>
            <p className="text-xl font-display font-semibold">{nbLapinsTotal ?? 0}</p>
          </div>
          <div className="px-4 py-3 border-b border-line">
            <p className="text-xs text-ink-soft">Jeunes lapins</p>
            <p className="text-xl font-display font-semibold">{nbJeunes}</p>
          </div>
          <div className="px-4 py-3 border-r border-line">
            <p className="text-xs text-ink-soft">Femelles reprod.</p>
            <p className="text-xl font-display font-semibold">{nbFemellesReproductrices}</p>
          </div>
          <div className="px-4 py-3">
            <p className="text-xs text-ink-soft">Mâles reprod.</p>
            <p className="text-xl font-display font-semibold">{nbMalesReproducteurs}</p>
          </div>
        </div>
      </Card>

      {(nbGestantes ?? 0) > 0 && (
        <Card className="mb-6 flex items-center justify-between bg-accent-soft border-accent/20">
          <span className="text-sm text-ink">Gestations en cours</span>
          <span className="text-lg font-display font-semibold text-accent">{nbGestantes}</span>
        </Card>
      )}

      {/* Rappels */}
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

      {/* Finances rapide */}
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

      {/* Actions rapides */}
      <p className="text-xs text-ink-soft mb-1">Élevage</p>
      <div className="grid grid-cols-3 gap-1 mb-4">
        <QuickAction href="/lapins" icon={Rabbit} label="Lapins" />
        <QuickAction href="/reproduction" icon={HeartPulse} label="Reprod." />
        <QuickAction href="/mises-bas" icon={Baby} label="Naissances" />
        <QuickAction href="/sante" icon={Stethoscope} label="Santé" />
        <QuickAction href="/alimentation" icon={Wheat} label="Aliment." />
        <QuickAction href="/calendrier" icon={CalendarDays} label="Calendrier" />
      </div>

      <p className="text-xs text-ink-soft mb-1">Gestion</p>
      <div className="grid grid-cols-3 gap-1">
        <QuickAction href="/statistiques" icon={BarChart3} label="Statistiques" />
        <QuickAction href="/parametres" icon={Settings} label="Paramètres" />
      </div>
    </div>
  )
}