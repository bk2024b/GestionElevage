'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function creerAccouplement(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase.from('accouplements').insert({
    user_id: user.id,
    femelle_id: formData.get('femelle_id'),
    male_id: formData.get('male_id'),
    date_accouplement: formData.get('date_accouplement'),
    notes: formData.get('notes') || null,
  })

  if (error) {
    redirect(`/reproduction/nouveau?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/reproduction')
  redirect('/reproduction')
}

export async function modifierStatutAccouplement(id: string, formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('accouplements')
    .update({ statut: formData.get('statut') })
    .eq('id', id)

  if (error) {
    redirect(`/reproduction?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/reproduction')
  redirect('/reproduction')
}

export async function confirmerPalpation(accouplementId: string, resultat: 'oui' | 'non') {
  const supabase = await createClient()

  const { data: accouplement } = await supabase
    .from('accouplements')
    .select('femelle_id, date_accouplement')
    .eq('id', accouplementId)
    .single()

  if (!accouplement) {
    redirect(`/reproduction?error=${encodeURIComponent('Accouplement introuvable')}`)
  }

  const nouveauStatut = resultat === 'oui' ? 'confirmee' : 'echouee'

  const { error } = await supabase
    .from('accouplements')
    .update({ statut: nouveauStatut })
    .eq('id', accouplementId)

  if (error) {
    redirect(`/reproduction?error=${encodeURIComponent(error.message)}`)
  }

  const datePalpationPrevue = new Date(accouplement!.date_accouplement)
  datePalpationPrevue.setDate(datePalpationPrevue.getDate() + 15)

  await supabase
    .from('rappels')
    .update({ vu: true })
    .eq('lapin_id', accouplement!.femelle_id)
    .eq('type', 'palpation')
    .eq('date_prevue', datePalpationPrevue.toISOString().split('T')[0])

  revalidatePath('/reproduction')
  revalidatePath('/rappels')
  redirect('/reproduction')
}