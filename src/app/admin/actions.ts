'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function confirmerPaiement(userId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const dureeJours = Number(formData.get('duree_jours') || 30)
  const notes = formData.get('notes') as string

  const nouvelleDateFin = new Date()
  nouvelleDateFin.setDate(nouvelleDateFin.getDate() + dureeJours)

  const { error } = await supabase
    .from('abonnements')
    .update({
      statut: 'actif',
      date_fin: nouvelleDateFin.toISOString().split('T')[0],
      confirme_par: user.id,
      date_confirmation: new Date().toISOString(),
      notes: notes || null,
    })
    .eq('user_id', userId)

  if (error) {
    redirect(`/admin?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/admin')
  redirect('/admin')
}

export async function suspendreCompte(userId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('abonnements')
    .update({ statut: 'expire' })
    .eq('user_id', userId)

  if (error) {
    redirect(`/admin?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/admin')
  redirect('/admin')
}