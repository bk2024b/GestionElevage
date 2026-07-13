'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function creerSoin(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase.from('soins').insert({
    user_id: user.id,
    lapin_id: formData.get('lapin_id'),
    type: formData.get('type'),
    libelle: formData.get('libelle'),
    date_soin: formData.get('date_soin'),
    cout: formData.get('cout') ? Number(formData.get('cout')) : null,
    notes: formData.get('notes') || null,
  })

  if (error) {
    redirect(`/sante/nouveau?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/sante')
  redirect('/sante')
}

export async function supprimerSoin(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('soins').delete().eq('id', id)

  if (error) {
    redirect(`/sante?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/sante')
  redirect('/sante')
}