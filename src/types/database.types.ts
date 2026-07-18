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
  nes_vivants: number
  nes_morts: number
  adoptes: number
  retires: number
  lapereaux_identifies: boolean
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
  soin_id: string | null
  alimentation_id: string | null
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

export type TypeRessource = 'document' | 'cours'

export interface Ressource {
  id: string
  titre: string
  description: string | null
  type: TypeRessource
  categorie: string | null
  gratuit: boolean
  url_acces: string | null
  chariow_url: string | null
  image_url: string | null
  ordre: number
  publie: boolean
  created_at: string
}

export type StatutAbonnement = 'essai' | 'actif' | 'expire'

export interface Abonnement {
  id: string
  user_id: string
  statut: StatutAbonnement
  date_fin: string
  confirme_par: string | null
  date_confirmation: string | null
  notes: string | null
  created_at: string
}