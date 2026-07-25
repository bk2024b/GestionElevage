'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function creerLienPaiement() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profil } = await supabase.from('profils').select('nom').eq('id', user.id).single()

  const reponse = await fetch('https://api.chariow.com/v1/checkout', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.CHARIOW_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      product_id: process.env.CHARIOW_PRODUCT_ID,
      email: user.email,
      first_name: profil?.nom || 'Éleveur',
      last_name: '—',
      phone: { number: '00000000', country_code: 'BJ' },
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/parametres/abonnement?paiement=succes`,
      custom_metadata: { user_id: user.id },
    }),
  })

  const resultat = await reponse.json()

  if (resultat.data?.step === 'payment' && resultat.data.payment?.checkout_url) {
    redirect(resultat.data.payment.checkout_url)
  }

  redirect(`/acces-suspendu?error=${encodeURIComponent(resultat.message || 'Erreur lors de la création du paiement')}`)
}