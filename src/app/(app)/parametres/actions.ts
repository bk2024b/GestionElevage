'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function modifierProfil(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase
    .from('profils')
    .update({
      nom: formData.get('nom'),
      nom_elevage: formData.get('nom_elevage'),
      telephone: formData.get('telephone') || null,
      adresse: formData.get('adresse') || null,
    })
    .eq('id', user.id)

  if (error) {
    redirect(`/parametres?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/parametres')
  revalidatePath('/dashboard')
  redirect('/parametres?success=1')
}

export async function changerMotDePasse(formData: FormData) {
  const supabase = await createClient()
  const nouveauMdp = formData.get('nouveau_mot_de_passe') as string

  const { error } = await supabase.auth.updateUser({ password: nouveauMdp })

  if (error) {
    redirect(`/parametres?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/parametres?success=mdp')
}