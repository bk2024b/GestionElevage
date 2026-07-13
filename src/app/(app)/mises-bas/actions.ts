'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function creerMiseBas(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const accouplementId = (formData.get('accouplement_id') as string) || null
  let femelleId = (formData.get('femelle_id') as string) || null

  // Si aucune femelle saisie manuellement, la récupérer depuis l'accouplement lié
  if (!femelleId && accouplementId) {
    const { data: accouplement, error: errAccouplement } = await supabase
      .from('accouplements')
      .select('femelle_id')
      .eq('id', accouplementId)
      .single()

    if (errAccouplement || !accouplement) {
      redirect(`/mises-bas/nouveau?error=${encodeURIComponent('Accouplement introuvable')}`)
    }
    femelleId = accouplement!.femelle_id
  }

  if (!femelleId) {
    redirect(`/mises-bas/nouveau?error=${encodeURIComponent('Il faut choisir un accouplement ou indiquer une femelle')}`)
  }

  const { error } = await supabase.from('mises_bas').insert({
    user_id: user.id,
    accouplement_id: accouplementId,
    femelle_id: femelleId,
    date_misebas: formData.get('date_misebas'),
    nb_lapereaux: Number(formData.get('nb_lapereaux') || 0),
    nb_males: Number(formData.get('nb_males') || 0),
    nb_femelles: Number(formData.get('nb_femelles') || 0),
    nb_morts_nes: Number(formData.get('nb_morts_nes') || 0),
    observations: formData.get('observations') || null,
  })

  if (error) {
    redirect(`/mises-bas/nouveau?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/mises-bas')
  revalidatePath('/reproduction')
  redirect('/mises-bas')
}

export async function enregistrerSevrage(miseBasId: string, formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.from('sevrages').insert({
    mise_bas_id: miseBasId,
    date_sevrage: formData.get('date_sevrage'),
    poids_moyen: formData.get('poids_moyen') ? Number(formData.get('poids_moyen')) : null,
    nb_survivants: formData.get('nb_survivants') ? Number(formData.get('nb_survivants')) : null,
  })

  if (error) {
    redirect(`/mises-bas?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/mises-bas')
  redirect('/mises-bas')
}