export const CATEGORIES_DEPENSE: Record<string, string> = {
  aliment: 'Aliment',
  medicament: 'Médicament',
  cage: 'Cage',
  materiel: 'Matériel',
  transport: 'Transport',
  autre: 'Autre',
}

export const CATEGORIES_REVENU: Record<string, string> = {
  vente_lapin: 'Vente de lapin',
  vente_viande: 'Vente de viande',
  vente_reproducteur: 'Vente de reproducteur',
  autre: 'Autre',
}

export function formatFCFA(montant: number) {
  return new Intl.NumberFormat('fr-FR').format(montant) + ' F'
}