'use server'

import { createClient } from '@/lib/supabase/server'
import { genererIdentifiant } from '@/lib/lapins'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function creerMiseBas(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const accouplementId = (formData.get('accouplement_id') as string) || null
  let femelleId = (formData.get('femelle_id') as string) || null

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
    nes_vivants: Number(formData.get('nes_vivants') || 0),
    nes_morts: Number(formData.get('nes_morts') || 0),
    adoptes: Number(formData.get('adoptes') || 0),
    retires: Number(formData.get('retires') || 0),
    observations: formData.get('observations') || null,
  })

  if (error) {
    redirect(`/mises-bas/nouveau?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/mises-bas')
  revalidatePath('/reproduction')
  revalidatePath('/dashboard')
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
  revalidatePath('/dashboard')
  redirect('/mises-bas')
}

export async function identifierLapereaux(miseBasId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: miseBas, error: errMiseBas } = await supabase
    .from('mises_bas')
    .select('*, accouplement:accouplement_id(male_id)')
    .eq('id', miseBasId)
    .single()

  if (errMiseBas || !miseBas) {
    redirect(`/mises-bas?error=${encodeURIComponent('Mise bas introuvable')}`)
  }

  if (miseBas!.lapereaux_identifies) {
    redirect(`/mises-bas?error=${encodeURIComponent('Lapereaux déjà identifiés')}`)
  }

  const nbMales = Number(formData.get('nb_males') || 0)
  const nbFemelles = Number(formData.get('nb_femelles') || 0)
  const disponibles = miseBas!.nes_vivants + miseBas!.adoptes - miseBas!.retires

  if (nbMales + nbFemelles !== disponibles) {
    redirect(`/mises-bas?error=${encodeURIComponent(`Le total (${nbMales + nbFemelles}) doit correspondre aux lapereaux disponibles (${disponibles})`)}`)
  }

  const pereId = (miseBas as any).accouplement?.male_id ?? null
  const mereId = miseBas!.femelle_id
  const dateNaissance = miseBas!.date_misebas

  const nouveauxLapins: { identifiant: string; sexe: 'M' | 'F' }[] = []

  for (let i = 0; i < nbMales; i++) {
    const identifiant = await genererIdentifiant(user.id, 'M', i)
    nouveauxLapins.push({ identifiant, sexe: 'M' })
  }
  for (let i = 0; i < nbFemelles; i++) {
    const identifiant = await genererIdentifiant(user.id, 'F', i)
    nouveauxLapins.push({ identifiant, sexe: 'F' })
  }

  if (nouveauxLapins.length > 0) {
    const { error: errInsert } = await supabase.from('lapins').insert(
      nouveauxLapins.map((l) => ({
        user_id: user.id,
        identifiant: l.identifiant,
        sexe: l.sexe,
        mere_id: mereId,
        pere_id: pereId,
        date_naissance: dateNaissance,
        statut: 'actif',
      }))
    )

    if (errInsert) {
      redirect(`/mises-bas?error=${encodeURIComponent(errInsert.message)}`)
    }
  }

  await supabase.from('mises_bas').update({ lapereaux_identifies: true }).eq('id', miseBasId)

  revalidatePath('/mises-bas')
  revalidatePath('/lapins')
  revalidatePath('/dashboard')
  redirect('/mises-bas')
}