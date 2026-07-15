import { createClient } from '@/lib/supabase/server'
import { signOut } from '../../(auth)/actions'
import { EarTagBadge } from '@/components/lapins/EarTagBadge'
import { LABEL_TYPE_RAPPEL } from '@/lib/rappels'
import { formatFCFA } from '@/lib/finances'
import { classifierLapin } from '@/lib/lapins'
import { StatCard, Card } from '@/components/ui/Card'
import { ButtonLink, Button } from '@/components/ui/Button'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

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

  return (
    <div className="px-5 py-6 max-w-md mx-auto">
      <h1 className="text-xl font-display font-semibold mb-1">Bienvenue</h1>
      <p className="text-sm text-ink-soft mb-6">{user?.email}</p>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <StatCard label="Total lapins" value={nbLapinsTotal ?? 0} />
        <StatCard label="Jeunes lapins" value={nbJeunes} />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard label="Femelles reproductrices" value={nbFemellesReproductrices} />
        <StatCard label="Mâles reproducteurs" value={nbMalesReproducteurs} />
      </div>

      {(nbGestantes ?? 0) > 0 && (
        <div className="mb-6">
          <StatCard label="Gestantes en cours" value={nbGestantes ?? 0} />
        </div>
      )}

      {rappelsUrgents && rappelsUrgents.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-ink-soft">À faire</p>
            {nbRappels ? <span className="text-xs text-ink-soft/70">{nbRappels} au total</span> : null}
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

      <p className="text-xs text-ink-soft/70 mb-2">Élevage</p>
      <div className="flex flex-col gap-2 mb-6">
        <ButtonLink href="/lapins" variante="primaire">Voir mes lapins</ButtonLink>
        <ButtonLink href="/reproduction" variante="secondaire">Voir la reproduction</ButtonLink>
        <ButtonLink href="/mises-bas" variante="secondaire">Naissances et sevrages</ButtonLink>
        <ButtonLink href="/sante" variante="secondaire">Santé et soins</ButtonLink>
        <ButtonLink href="/alimentation" variante="secondaire">Alimentation</ButtonLink>
        <ButtonLink href="/calendrier" variante="secondaire">Calendrier</ButtonLink>
      </div>

      <p className="text-xs text-ink-soft/70 mb-2">Gestion</p>
      <div className="flex flex-col gap-2 mb-6">
        <Link
          href="/finances"
          className="tap flex items-center justify-between border border-ink text-ink rounded-card py-2.5 px-4 text-sm"
        >
          <span>Finances</span>
          <span className={`font-medium ${beneficeDuMois >= 0 ? '' : 'text-danger'}`}>
            {formatFCFA(beneficeDuMois)} ce mois
          </span>
        </Link>
        <ButtonLink href="/statistiques" variante="secondaire">Statistiques et export</ButtonLink>
        <ButtonLink href="/parametres" variante="secondaire">Paramètres</ButtonLink>
      </div>

      <form action={signOut}>
        <Button variante="danger" className="w-full">Se déconnecter</Button>
      </form>
    </div>
  )
}