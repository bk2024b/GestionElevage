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