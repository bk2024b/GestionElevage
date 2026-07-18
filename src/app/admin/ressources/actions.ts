'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function creerRessource(formData: FormData) {
  const supabase = await createClient()

  const gratuit = formData.get('gratuit') === 'on'

  const { error } = await supabase.from('ressources').insert({
    titre: formData.get('titre'),
    description: formData.get('description') || null,
    type: formData.get('type'),
    categorie: formData.get('categorie') || null,
    gratuit,
    url_acces: gratuit ? (formData.get('url_acces') || null) : null,
    chariow_url: !gratuit ? (formData.get('chariow_url') || null) : null,
    image_url: formData.get('image_url') || null,
    ordre: formData.get('ordre') ? Number(formData.get('ordre')) : 0,
    publie: formData.get('publie') === 'on',
  })

  if (error) {
    redirect(`/admin/ressources/nouveau?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/admin/ressources')
  revalidatePath('/store')
  redirect('/admin/ressources')
}

export async function supprimerRessource(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('ressources').delete().eq('id', id)

  if (error) {
    redirect(`/admin/ressources?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/admin/ressources')
  revalidatePath('/store')
  redirect('/admin/ressources')
}

export async function togglePublication(id: string, publieActuel: boolean) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('ressources')
    .update({ publie: !publieActuel })
    .eq('id', id)

  if (error) {
    redirect(`/admin/ressources?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/admin/ressources')
  revalidatePath('/store')
  redirect('/admin/ressources')
}