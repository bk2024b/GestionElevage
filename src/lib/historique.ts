import { createClient } from '@/lib/supabase/server'

export interface EvenementHistorique {
  date: string
  type: 'naissance' | 'accouplement' | 'palpation' | 'misebas' | 'sevrage' | 'soin' | 'statut'
  label: string
  detail?: string
}

export async function recupererHistoriqueLapin(lapinId: string, sexe: 'M' | 'F', dateNaissance: string | null, dateStatut: string | null, statut: string) {
  const supabase = await createClient()
  const evenements: EvenementHistorique[] = []

  if (dateNaissance) {
    evenements.push({ date: dateNaissance, type: 'naissance', label: 'Naissance' })
  }

  // Accouplements — en tant que femelle ou mâle
  const colonne = sexe === 'F' ? 'femelle_id' : 'male_id'
  const { data: accouplements } = await supabase
    .from('accouplements')
    .select(`*, femelle:accouplements_femelle_id_fkey(identifiant), male:accouplements_male_id_fkey(identifiant)`)
    .eq(colonne, lapinId)

  for (const a of accouplements ?? []) {
    const partenaire = sexe === 'F' ? (a as any).male?.identifiant : (a as any).femelle?.identifiant
    evenements.push({
      date: a.date_accouplement,
      type: 'accouplement',
      label: 'Accouplement',
      detail: partenaire ? `avec ${partenaire}` : undefined,
    })

    if (a.statut === 'confirmee' || a.statut === 'terminee') {
      evenements.push({
        date: a.date_nid_prevue,
        type: 'palpation',
        label: 'Palpation confirmée (gestante)',
      })
    } else if (a.statut === 'echouee') {
      evenements.push({
        date: a.date_nid_prevue,
        type: 'palpation',
        label: 'Palpation — non gestante',
      })
    }
  }

  // Mises bas — uniquement si femelle
  if (sexe === 'F') {
    const { data: misesBas } = await supabase
      .from('mises_bas')
      .select(`*, sevrages(*)`)
      .eq('femelle_id', lapinId)

    for (const m of misesBas ?? []) {
      evenements.push({
        date: m.date_misebas,
        type: 'misebas',
        label: 'Mise bas',
        detail: `${m.nes_vivants} vivant(s), ${m.nes_morts} mort-né(s)`,
      })

      for (const s of (m as any).sevrages ?? []) {
        evenements.push({
          date: s.date_sevrage,
          type: 'sevrage',
          label: 'Sevrage',
          detail: s.nb_survivants != null ? `${s.nb_survivants} survivant(s)` : undefined,
        })
      }
    }
  }

  // Soins
  const { data: soins } = await supabase
    .from('soins')
    .select('*')
    .eq('lapin_id', lapinId)

  for (const s of soins ?? []) {
    evenements.push({
      date: s.date_soin,
      type: 'soin',
      label: s.libelle,
    })
  }

  // Changement de statut (vendu/décédé)
  if (statut !== 'actif' && dateStatut) {
    evenements.push({
      date: dateStatut,
      type: 'statut',
      label: statut === 'vendu' ? 'Vendu' : 'Décédé',
    })
  }

  // Tri chronologique, plus récent en premier
  evenements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return evenements
}

export const COULEUR_EVENEMENT_HISTORIQUE: Record<string, string> = {
  naissance: 'bg-gray-400',
  accouplement: 'bg-blue-500',
  palpation: 'bg-amber-500',
  misebas: 'bg-rose-500',
  sevrage: 'bg-green-500',
  soin: 'bg-purple-500',
  statut: 'bg-red-500',
}