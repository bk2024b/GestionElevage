'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function creerSoin(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const lapinId = formData.get('lapin_id') as string
  const type = formData.get('type') as string
  const libelle = formData.get('libelle') as string
  const dateSoin = formData.get('date_soin') as string
  const cout = formData.get('cout') ? Number(formData.get('cout')) : null

  const { data: soin, error } = await supabase
    .from('soins')
    .insert({
      user_id: user.id,
      lapin_id: lapinId,
      type,
      libelle,
      date_soin: dateSoin,
      cout,
      notes: formData.get('notes') || null,
    })
    .select()
    .single()

  if (error) {
    redirect(`/sante/nouveau?error=${encodeURIComponent(error.message)}`)
  }

  // Génère automatiquement la dépense correspondante si un coût est renseigné
  if (cout && cout > 0 && soin) {
    await supabase.from('transactions_financieres').insert({
      user_id: user.id,
      lapin_id: lapinId,
      soin_id: soin.id,
      type: 'depense',
      categorie: 'medicament',
      montant: cout,
      description: `${libelle} (${lapinId ? 'soin' : ''})`,
      date_transaction: dateSoin,
    })
  }

  revalidatePath('/sante')
  revalidatePath('/finances')
  revalidatePath('/dashboard')
  redirect('/sante')
}

export async function supprimerSoin(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('soins').delete().eq('id', id)

  if (error) {
    redirect(`/sante?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/sante')
  revalidatePath('/finances')
  revalidatePath('/dashboard')
  redirect('/sante')
}