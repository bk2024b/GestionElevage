'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function creerAlimentation(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const typeAliment = formData.get('type_aliment') as string
  const quantiteKg = Number(formData.get('quantite_kg'))
  const cout = formData.get('cout') ? Number(formData.get('cout')) : null
  const dateDistribution = formData.get('date_distribution') as string

  const { data: distribution, error } = await supabase
    .from('alimentation')
    .insert({
      user_id: user.id,
      type_aliment: typeAliment,
      quantite_kg: quantiteKg,
      cout,
      date_distribution: dateDistribution,
    })
    .select()
    .single()

  if (error) {
    redirect(`/alimentation/nouveau?error=${encodeURIComponent(error.message)}`)
  }

  // Génère automatiquement la dépense correspondante si un coût est renseigné
  if (cout && cout > 0 && distribution) {
    await supabase.from('transactions_financieres').insert({
      user_id: user.id,
      alimentation_id: distribution.id,
      type: 'depense',
      categorie: 'aliment',
      montant: cout,
      description: `${typeAliment} — ${quantiteKg} kg`,
      date_transaction: dateDistribution,
    })
  }

  revalidatePath('/alimentation')
  revalidatePath('/finances')
  revalidatePath('/dashboard')
  redirect('/alimentation')
}

export async function supprimerAlimentation(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('alimentation').delete().eq('id', id)

  if (error) {
    redirect(`/alimentation?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/alimentation')
  revalidatePath('/finances')
  revalidatePath('/dashboard')
  redirect('/alimentation')
}