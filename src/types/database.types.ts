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