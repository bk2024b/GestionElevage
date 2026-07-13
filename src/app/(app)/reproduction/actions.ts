'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function creerAccouplement(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase.from('accouplements').insert({
    user_id: user.id,
    femelle_id: formData.get('femelle_id'),
    male_id: formData.get('male_id'),
    date_accouplement: formData.get('date_accouplement'),
    notes: formData.get('notes') || null,
  })

  if (error) {
    redirect(`/reproduction/nouveau?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/reproduction')
  redirect('/reproduction')
}

export async function modifierStatutAccouplement(id: string, formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('accouplements')
    .update({ statut: formData.get('statut') })
    .eq('id', id)

  if (error) {
    redirect(`/reproduction?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/reproduction')
  redirect('/reproduction')
}