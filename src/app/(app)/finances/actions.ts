'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function creerTransaction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase.from('transactions_financieres').insert({
    user_id: user.id,
    lapin_id: (formData.get('lapin_id') as string) || null,
    type: formData.get('type'),
    categorie: formData.get('categorie'),
    montant: Number(formData.get('montant')),
    description: formData.get('description') || null,
    date_transaction: formData.get('date_transaction'),
  })

  if (error) {
    redirect(`/finances/nouveau?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/finances')
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
  revalidatePath('/dashboard')
  redirect('/finances')
}