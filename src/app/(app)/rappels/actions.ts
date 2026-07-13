'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function marquerRappelVu(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('rappels')
    .update({ vu: true })
    .eq('id', id)

  if (error) {
    redirect(`/rappels?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/rappels')
  revalidatePath('/dashboard')
}