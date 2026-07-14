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
  age_premiere_saillie: number | null
  numero_cage: string | null
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

export interface MiseBas {
  id: string
  accouplement_id: string | null
  femelle_id: string
  user_id: string
  date_misebas: string
  nb_lapereaux: number
  nb_males: number
  nb_femelles: number
  nb_morts_nes: number
  observations: string | null
  date_sevrage_prevue: string
  created_at: string
  femelle?: Lapin
}

export interface Sevrage {
  id: string
  mise_bas_id: string
  date_sevrage: string
  poids_moyen: number | null
  nb_survivants: number | null
  created_at: string
}

export type TypeTransaction = 'depense' | 'revenu'
export type CategorieFinance =
  | 'aliment' | 'medicament' | 'cage' | 'materiel' | 'transport'
  | 'vente_lapin' | 'vente_viande' | 'vente_reproducteur' | 'autre'

export interface TransactionFinanciere {
  id: string
  user_id: string
  lapin_id: string | null
  type: TypeTransaction
  categorie: CategorieFinance
  montant: number
  description: string | null
  date_transaction: string
  created_at: string
}

export interface Profil {
  id: string
  nom: string
  nom_elevage: string
  telephone: string | null
  adresse: string | null
  created_at: string
}

export type TypeSoin = 'maladie' | 'traitement' | 'vaccin' | 'controle_veto'

export interface Soin {
  id: string
  lapin_id: string
  user_id: string
  type: TypeSoin
  libelle: string
  date_soin: string
  cout: number | null
  notes: string | null
  created_at: string
  lapin?: Lapin
}

