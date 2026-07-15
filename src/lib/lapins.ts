import { createClient } from '@/lib/supabase/server'
import type { SexeLapin } from '@/types/database.types'

export async function genererIdentifiant(userId: string, sexe: SexeLapin) {
  const supabase = await createClient()
  const prefixe = sexe === 'F' ? 'F' : 'M'

  const { data, error } = await supabase
    .from('lapins')
    .select('identifiant')
    .eq('user_id', userId)
    .like('identifiant', `${prefixe}%`)
    .order('identifiant', { ascending: false })
    .limit(1)

  if (error) throw error

  let prochainNumero = 1
  if (data && data.length > 0) {
    const dernier = data[0].identifiant // ex: "F007"
    const numero = parseInt(dernier.slice(1), 10)
    if (!isNaN(numero)) prochainNumero = numero + 1
  }

  return `${prefixe}${String(prochainNumero).padStart(3, '0')}`
}

export function classifierLapin(lapin: { date_naissance: string | null; age_premiere_saillie: number | null }) {
  if (!lapin.date_naissance) return 'reproducteur' // âge inconnu = considéré adulte par défaut

  const seuilMois = lapin.age_premiere_saillie ?? 6
  const naissance = new Date(lapin.date_naissance)
  const maintenant = new Date()
  const ageMois =
    (maintenant.getFullYear() - naissance.getFullYear()) * 12 +
    (maintenant.getMonth() - naissance.getMonth())

  return ageMois >= seuilMois ? 'reproducteur' : 'jeune'
}