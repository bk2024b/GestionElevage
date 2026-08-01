import { createClient } from '@/lib/supabase/server'
import type { SexeLapin } from '@/types/database.types'

export async function genererIdentifiant(userId: string, sexe: SexeLapin) {
  const supabase = await createClient()
  const prefixe = sexe === 'F' ? 'F' : 'M'

  const { data: numero, error } = await supabase.rpc('prochain_numero_identifiant', {
    p_user_id: userId,
    p_sexe: prefixe,
  })

  if (error) throw error

  return `${prefixe}${String(numero).padStart(3, '0')}`
}

export function classifierLapin(lapin: { date_naissance: string | null; age_premiere_saillie: number | null }) {
  if (!lapin.date_naissance) return 'reproducteur'

  const seuilMois = lapin.age_premiere_saillie ?? 6
  const naissance = new Date(lapin.date_naissance)
  const maintenant = new Date()
  const ageMois =
    (maintenant.getFullYear() - naissance.getFullYear()) * 12 +
    (maintenant.getMonth() - naissance.getMonth())

  return ageMois >= seuilMois ? 'reproducteur' : 'jeune'
}

export const LABEL_STADE: Record<string, string> = {
  jeune: 'Jeune',
  engraissement: 'En engraissement',
  reproducteur: 'Reproducteur',
}

export const TON_STADE: Record<string, 'neutre' | 'attention' | 'success'> = {
  jeune: 'neutre',
  engraissement: 'attention',
  reproducteur: 'success',
}