'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function creerAlimentation(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase.from('alimentation').insert({
    user_id: user.id,
    type_aliment: formData.get('type_aliment'),
    quantite_kg: Number(formData.get('quantite_kg')),
    cout: formData.get('cout') ? Number(formData.get('cout')) : null,
    date_distribution: formData.get('date_distribution'),
  })

  if (error) {
    redirect(`/alimentation/nouveau?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/alimentation')
  redirect('/alimentation')
}

export async function supprimerAlimentation(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('alimentation').delete().eq('id', id)

  if (error) {
    redirect(`/alimentation?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/alimentation')
  redirect('/alimentation')
}