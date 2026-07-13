import { createClient } from '@/lib/supabase/server'

export async function calculerStatistiques() {
  const supabase = await createClient()

  const { count: totalLapins } = await supabase
    .from('lapins')
    .select('*', { count: 'exact', head: true })

  const { count: totalAccouplements } = await supabase
    .from('accouplements')
    .select('*', { count: 'exact', head: true })

  const { count: accouplementsReussis } = await supabase
    .from('accouplements')
    .select('*', { count: 'exact', head: true })
    .in('statut', ['confirmee', 'terminee'])

  const { data: misesBas } = await supabase
    .from('mises_bas')
    .select('nb_lapereaux, nb_morts_nes')

  const totalNes = (misesBas ?? []).reduce((s, m) => s + m.nb_lapereaux + m.nb_morts_nes, 0)
  const totalMorts = (misesBas ?? []).reduce((s, m) => s + m.nb_morts_nes, 0)

  const { data: transactions } = await supabase
    .from('transactions_financieres')
    .select('type, montant')

  const revenus = (transactions ?? []).filter((t) => t.type === 'revenu').reduce((s, t) => s + Number(t.montant), 0)
  const depenses = (transactions ?? []).filter((t) => t.type === 'depense').reduce((s, t) => s + Number(t.montant), 0)

  const tauxReproduction = totalAccouplements ? Math.round(((accouplementsReussis ?? 0) / totalAccouplements) * 100) : 0
  const tauxMortalite = totalNes ? Math.round((totalMorts / totalNes) * 100) : 0

  return {
    totalLapins: totalLapins ?? 0,
    totalAccouplements: totalAccouplements ?? 0,
    tauxReproduction,
    totalNes,
    totalMorts,
    tauxMortalite,
    revenus,
    depenses,
    benefice: revenus - depenses,
    misesBasDetail: misesBas ?? [],
  }
}