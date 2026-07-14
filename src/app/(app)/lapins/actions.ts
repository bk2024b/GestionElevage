'use server'

import { createClient } from '@/lib/supabase/server'
import { genererIdentifiant } from '@/lib/lapins'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function creerLapin(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const sexe = formData.get('sexe') as 'M' | 'F'
  const identifiant = await genererIdentifiant(user.id, sexe)

  const { error } = await supabase.from('lapins').insert({
    user_id: user.id,
    identifiant,
    nom: formData.get('nom') || null,
    sexe,
    race: formData.get('race') || null,
    date_naissance: formData.get('date_naissance') || null,
    poids_actuel: formData.get('poids_actuel') ? Number(formData.get('poids_actuel')) : null,
    couleur: formData.get('couleur') || null,
    mere_id: formData.get('mere_id') || null,
    pere_id: formData.get('pere_id') || null,
    notes: formData.get('notes') || null,
    age_premiere_saillie: formData.get('age_premiere_saillie') ? Number(formData.get('age_premiere_saillie')) : null,
    numero_cage: formData.get('numero_cage') || null,
  })

  if (error) {
    redirect(`/lapins/nouveau?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/lapins')
  redirect('/lapins')
}

export async function modifierLapin(id: string, formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('lapins')
    .update({
      nom: formData.get('nom') || null,
      race: formData.get('race') || null,
      date_naissance: formData.get('date_naissance') || null,
      poids_actuel: formData.get('poids_actuel') ? Number(formData.get('poids_actuel')) : null,
      couleur: formData.get('couleur') || null,
      statut: formData.get('statut'),
      notes: formData.get('notes') || null,
      age_premiere_saillie: formData.get('age_premiere_saillie') ? Number(formData.get('age_premiere_saillie')) : null,
      numero_cage: formData.get('numero_cage') || null,
    })
    .eq('id', id)

  if (error) {
    redirect(`/lapins/${id}?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/lapins')
  revalidatePath(`/lapins/${id}`)
  redirect(`/lapins/${id}`)
}

export async function supprimerLapin(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('lapins').delete().eq('id', id)

  if (error) {
    redirect(`/lapins/${id}?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/lapins')
  redirect('/lapins')
}