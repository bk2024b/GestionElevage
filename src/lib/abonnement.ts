export function estActif(abonnement: { statut: string; date_fin: string } | null) {
  if (!abonnement) return false
  const dansLaPeriode = new Date(abonnement.date_fin) >= new Date(new Date().toDateString())
  return (abonnement.statut === 'essai' || abonnement.statut === 'actif') && dansLaPeriode
}

export function joursRestants(dateFin: string) {
  const diff = new Date(dateFin).getTime() - new Date().getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}