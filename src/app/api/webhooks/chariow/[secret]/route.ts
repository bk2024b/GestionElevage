import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ secret: string }> }
) {
  const { secret } = await params

  // Première ligne de défense : secret dans l'URL, jamais deviné par un tiers
  if (secret !== process.env.CHARIOW_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const body = await req.json()
  const { event, sale } = body

  if (event !== 'successful.sale' || !sale?.id) {
    return NextResponse.json({ received: true })
  }

  // Deuxième ligne de défense : on ne fait jamais confiance au contenu du
  // webhook seul — on revérifie la vente directement auprès de Chariow
  // avec notre clé API secrète avant de mettre à jour l'accès.
  const verification = await fetch(`https://api.chariow.com/v1/sales/${sale.id}`, {
    headers: { Authorization: `Bearer ${process.env.CHARIOW_API_KEY}` },
  })

  if (!verification.ok) {
    return NextResponse.json({ error: 'Vente introuvable' }, { status: 400 })
  }

  const { data: venteVerifiee } = await verification.json()

  if (venteVerifiee.status !== 'completed') {
    return NextResponse.json({ received: true })
  }

  const userId = venteVerifiee.custom_metadata?.user_id
  if (!userId) {
    return NextResponse.json({ received: true })
  }

  const { data: abonnementActuel } = await supabaseAdmin
    .from('abonnements')
    .select('date_fin')
    .eq('user_id', userId)
    .single()

  const dateBase = abonnementActuel && new Date(abonnementActuel.date_fin) > new Date()
    ? new Date(abonnementActuel.date_fin)
    : new Date()

  const nouvelleDateFin = new Date(dateBase)
  nouvelleDateFin.setDate(nouvelleDateFin.getDate() + 30)

  await supabaseAdmin
    .from('abonnements')
    .update({
      statut: 'actif',
      date_fin: nouvelleDateFin.toISOString().split('T')[0],
    })
    .eq('user_id', userId)

  return NextResponse.json({ received: true })
}