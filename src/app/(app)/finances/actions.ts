'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function creerTransaction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const categorie = formData.get('categorie') as string
  const lapinId = (formData.get('lapin_id') as string) || null
  const dateTransaction = formData.get('date_transaction') as string

  const { error } = await supabase.from('transactions_financieres').insert({
    user_id: user.id,
    lapin_id: categorie === 'vente_lapin' ? lapinId : null,
    type: formData.get('type'),
    categorie,
    montant: Number(formData.get('montant')),
    description: formData.get('description') || null,
    date_transaction: dateTransaction,
  })

  if (error) {
    redirect(`/finances/nouveau?error=${encodeURIComponent(error.message)}`)
  }

  // Si c'est une vente de lapin, on marque le lapin vendu — il sort
  // automatiquement du décompte "en engraissement"
  if (categorie === 'vente_lapin' && lapinId) {
    await supabase
      .from('lapins')
      .update({ statut: 'vendu', date_statut: dateTransaction })
      .eq('id', lapinId)
  }

  revalidatePath('/finances')
  revalidatePath('/lapins')
  revalidatePath('/dashboard')
  redirect('/finances')
}

export async function supprimerTransaction(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('transactions_financieres').delete().eq('id', id)

  if (error) {
    redirect(`/finances?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/finances')
  redirect('/finances')
}