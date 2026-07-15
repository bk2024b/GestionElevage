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
    .select('nes_vivants, nes_morts, adoptes, retires')

  // Total des naissances (vivants + morts-nés)
  const totalNes = (misesBas ?? []).reduce((s, m) => s + m.nes_vivants + m.nes_morts, 0)
  const totalMorts = (misesBas ?? []).reduce((s, m) => s + m.nes_morts, 0)

  // Cheptel jeune effectivement disponible après mise bas (vivants + adoptés - retirés)
  const totalDisponibles = (misesBas ?? []).reduce(
    (s, m) => s + m.nes_vivants + m.adoptes - m.retires,
    0
  )

  const { data: sevrages } = await supabase
    .from('sevrages')
    .select('nb_survivants')

  const totalSevres = (sevrages ?? []).reduce((s, sv) => s + (sv.nb_survivants ?? 0), 0)

  const { data: transactions } = await supabase
    .from('transactions_financieres')
    .select('type, montant')

  const revenus = (transactions ?? []).filter((t) => t.type === 'revenu').reduce((s, t) => s + Number(t.montant), 0)
  const depenses = (transactions ?? []).filter((t) => t.type === 'depense').reduce((s, t) => s + Number(t.montant), 0)

  const tauxReproduction = totalAccouplements ? Math.round(((accouplementsReussis ?? 0) / totalAccouplements) * 100) : 0
  const tauxMortaliteNaissance = totalNes ? Math.round((totalMorts / totalNes) * 100) : 0
  const tauxMortaliteSevrage = totalDisponibles
    ? Math.round(((totalDisponibles - totalSevres) / totalDisponibles) * 100)
    : 0

  return {
    totalLapins: totalLapins ?? 0,
    totalAccouplements: totalAccouplements ?? 0,
    tauxReproduction,
    totalNes,
    totalMorts,
    tauxMortalite: tauxMortaliteNaissance,
    totalDisponibles,
    totalSevres,
    tauxMortaliteSevrage,
    revenus,
    depenses,
    benefice: revenus - depenses,
  }
}

export interface StatsLapin {
  identifiant: string
  nom: string | null
  sexe: string
  nbAccouplements: number
  nbGestationsReussies: number
  nbMisesBas: number
  nbLapereauxTotal: number
  nbLapereauxMorts: number
  totalDepenses: number
}

export async function calculerStatistiquesParLapin(): Promise<StatsLapin[]> {
  const supabase = await createClient()

  const { data: lapins } = await supabase
    .from('lapins')
    .select('id, identifiant, nom, sexe')
    .order('identifiant')

  const resultats: StatsLapin[] = []

  for (const lapin of lapins ?? []) {
    const colonne = lapin.sexe === 'F' ? 'femelle_id' : 'male_id'

    const { data: accouplements } = await supabase
      .from('accouplements')
      .select('id, statut')
      .eq(colonne, lapin.id)

    const nbAccouplements = accouplements?.length ?? 0
    const nbGestationsReussies = accouplements?.filter((a) => a.statut === 'confirmee' || a.statut === 'terminee').length ?? 0

    let nbMisesBas = 0
    let nbLapereauxTotal = 0
    let nbLapereauxMorts = 0

    if (lapin.sexe === 'F') {
      const { data: misesBas } = await supabase
        .from('mises_bas')
        .select('nes_vivants, nes_morts')
        .eq('femelle_id', lapin.id)

      nbMisesBas = misesBas?.length ?? 0
      nbLapereauxTotal = (misesBas ?? []).reduce((s, m) => s + m.nes_vivants + m.nes_morts, 0)
      nbLapereauxMorts = (misesBas ?? []).reduce((s, m) => s + m.nes_morts, 0)
    }

    const { data: soins } = await supabase
      .from('soins')
      .select('cout')
      .eq('lapin_id', lapin.id)

    const totalDepenses = (soins ?? []).reduce((s, x) => s + Number(x.cout ?? 0), 0)

    resultats.push({
      identifiant: lapin.identifiant,
      nom: lapin.nom,
      sexe: lapin.sexe,
      nbAccouplements,
      nbGestationsReussies,
      nbMisesBas,
      nbLapereauxTotal,
      nbLapereauxMorts,
      totalDepenses,
    })
  }

  return resultats
}