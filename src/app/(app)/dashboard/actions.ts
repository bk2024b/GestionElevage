'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function marquerTourTermine() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('profils').update({ tour_complete: true }).eq('id', user.id)
  revalidatePath('/dashboard')
}