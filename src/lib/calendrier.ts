import { createClient } from '@/lib/supabase/server'

export interface EvenementCalendrier {
  date: string
  type: 'accouplement' | 'nid' | 'misebas' | 'sevrage' | 'soin'
  label: string
  lapinIdentifiant?: string
}

export async function recupererEvenements(): Promise<EvenementCalendrier[]> {
  const supabase = await createClient()
  const evenements: EvenementCalendrier[] = []

  const { data: accouplements } = await supabase
    .from('accouplements')
    .select(`date_accouplement, date_nid_prevue, date_misebas_prevue, femelle:accouplements_femelle_id_fkey(identifiant)`)

  for (const a of accouplements ?? []) {
    const femelle = (a as any).femelle
    evenements.push({ date: a.date_accouplement, type: 'accouplement', label: 'Accouplement', lapinIdentifiant: femelle?.identifiant })
    evenements.push({ date: a.date_nid_prevue, type: 'nid', label: 'Préparation du nid', lapinIdentifiant: femelle?.identifiant })
    evenements.push({ date: a.date_misebas_prevue, type: 'misebas', label: 'Mise bas prévue', lapinIdentifiant: femelle?.identifiant })
  }

  const { data: misesBas } = await supabase
    .from('mises_bas')
    .select(`date_misebas, date_sevrage_prevue, femelle:femelle_id(identifiant)`)

  for (const m of misesBas ?? []) {
    const femelle = (m as any).femelle
    evenements.push({ date: m.date_misebas, type: 'misebas', label: 'Mise bas', lapinIdentifiant: femelle?.identifiant })
    evenements.push({ date: m.date_sevrage_prevue, type: 'sevrage', label: 'Sevrage prévu', lapinIdentifiant: femelle?.identifiant })
  }

  const { data: soins } = await supabase
    .from('soins')
    .select(`date_soin, libelle, lapin:lapin_id(identifiant)`)

  for (const s of soins ?? []) {
    const lapin = (s as any).lapin
    evenements.push({ date: s.date_soin, type: 'soin', label: s.libelle, lapinIdentifiant: lapin?.identifiant })
  }

  return evenements
}

export const COULEUR_EVENEMENT: Record<string, string> = {
  accouplement: 'bg-blue-500',
  nid: 'bg-amber-500',
  misebas: 'bg-rose-500',
  sevrage: 'bg-green-500',
  soin: 'bg-purple-500',
}

export const LABEL_LEGENDE: Record<string, string> = {
  accouplement: 'Accouplement',
  nid: 'Nid',
  misebas: 'Mise bas',
  sevrage: 'Sevrage',
  soin: 'Soin',
}