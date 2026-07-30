import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://fermef001.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard', '/lapins', '/reproduction', '/mises-bas', '/sante',
        '/alimentation', '/finances', '/statistiques', '/calendrier',
        '/rappels', '/store', '/parametres', '/admin', '/acces-suspendu',
        '/login', '/register',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}