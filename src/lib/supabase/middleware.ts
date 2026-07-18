import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') ||
                      request.nextUrl.pathname.startsWith('/register')

  const isAppRoute = request.nextUrl.pathname.startsWith('/dashboard') ||
                      request.nextUrl.pathname.startsWith('/lapins') ||
                      request.nextUrl.pathname.startsWith('/reproduction') ||
                      request.nextUrl.pathname.startsWith('/mises-bas') ||
                      request.nextUrl.pathname.startsWith('/sante') ||
                      request.nextUrl.pathname.startsWith('/alimentation') ||
                      request.nextUrl.pathname.startsWith('/finances') ||
                      request.nextUrl.pathname.startsWith('/statistiques') ||
                      request.nextUrl.pathname.startsWith('/calendrier') ||
                      request.nextUrl.pathname.startsWith('/rappels') ||
                      request.nextUrl.pathname.startsWith('/store')

  if (user && isAppRoute && !request.nextUrl.pathname.startsWith('/acces-suspendu')) {
    const { data: abonnement } = await supabase
      .from('abonnements')
      .select('statut, date_fin')
      .eq('user_id', user.id)
      .single()

    const actif = abonnement &&
      (abonnement.statut === 'essai' || abonnement.statut === 'actif') &&
      new Date(abonnement.date_fin) >= new Date(new Date().toDateString())

    if (!actif) {
      const url = request.nextUrl.clone()
      url.pathname = '/acces-suspendu'
      return NextResponse.redirect(url)
    }
  }

  return response
}