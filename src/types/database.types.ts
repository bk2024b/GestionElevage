export type SexeLapin = 'M' | 'F'
export type StatutLapin = 'actif' | 'vendu' | 'decede'

export interface Lapin {
  id: string
  user_id: string
  identifiant: string
  nom: string | null
  sexe: SexeLapin
  race: string | null
  date_naissance: string | null
  poids_actuel: number | null
  couleur: string | null
  mere_id: string | null
  pere_id: string | null
  statut: StatutLapin
  date_statut: string | null
  notes: string | null
  created_at: string
}

export type StatutReproduction = 'en_cours' | 'confirmee' | 'echouee' | 'terminee'

export interface Accouplement {
  id: string
  user_id: string
  femelle_id: string
  male_id: string
  date_accouplement: string
  date_nid_prevue: string
  date_misebas_prevue: string
  statut: StatutReproduction
  notes: string | null
  created_at: string
  femelle?: Lapin
  male?: Lapin
}