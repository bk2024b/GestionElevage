import { createClient } from '@/lib/supabase/server'

export async function calculerAutonomieStock(userId: string) {
  const supabase = await createClient()

  const { data: stocks } = await supabase
    .from('stock_aliments')
    .select('type_aliment, quantite_kg')
    .eq('user_id', userId)

  const stockTotal = (stocks ?? []).reduce((s, r) => s + Number(r.quantite_kg), 0)

  const il30j = new Date()
  il30j.setDate(il30j.getDate() - 30)

  const { data: distributions } = await supabase
    .from('alimentation')
    .select('quantite_kg')
    .gte('date_distribution', il30j.toISOString().split('T')[0])

  const totalDistribue = (distributions ?? []).reduce((s, d) => s + Number(d.quantite_kg), 0)
  const consommationMoyenneJour = totalDistribue / 30

  const joursRestants = consommationMoyenneJour > 0
    ? Math.round(stockTotal / consommationMoyenneJour)
    : null

  return { stockTotal, joursRestants, stocks: stocks ?? [] }
}