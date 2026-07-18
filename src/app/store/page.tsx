import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { FileText, GraduationCap, ExternalLink, Download } from 'lucide-react'

export default async function StorePage() {
  const supabase = await createClient()

  const { data: ressources } = await supabase
    .from('ressources')
    .select('*')
    .order('ordre', { ascending: true })
    .order('created_at', { ascending: false })

  const documents = ressources?.filter((r) => r.type === 'document') ?? []
  const cours = ressources?.filter((r) => r.type === 'cours') ?? []

  return (
    <div className="px-5 py-6 max-w-md mx-auto">
      <h1 className="text-xl font-display font-semibold mb-1">Ressources</h1>
      <p className="text-sm text-ink-soft mb-6">Guides, documents et formations pour ton élevage.</p>

      {documents.length > 0 && (
        <div className="mb-8">
          <p className="text-xs text-ink-soft mb-2">Documents</p>
          <div className="flex flex-col gap-3">
            {documents.map((r) => (
              <RessourceCard key={r.id} ressource={r} />
            ))}
          </div>
        </div>
      )}

      {cours.length > 0 && (
        <div className="mb-8">
          <p className="text-xs text-ink-soft mb-2">Formations</p>
          <div className="flex flex-col gap-3">
            {cours.map((r) => (
              <RessourceCard key={r.id} ressource={r} />
            ))}
          </div>
        </div>
      )}

      {(ressources?.length ?? 0) === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-ink-soft">Aucune ressource disponible pour le moment.</p>
        </div>
      )}
    </div>
  )
}

function RessourceCard({ ressource }: { ressource: any }) {
  const Icon = ressource.type === 'cours' ? GraduationCap : FileText
  const lien = ressource.gratuit ? ressource.url_acces : ressource.chariow_url

  return (
    <Card className="!p-0 overflow-hidden">
      {ressource.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={ressource.image_url} alt={ressource.titre} className="w-full h-32 object-cover" />
      )}
      <div className="p-4">
        <div className="flex items-start gap-2 mb-2">
          <span className="w-8 h-8 shrink-0 flex items-center justify-center rounded-card bg-accent-soft">
            <Icon size={16} className="text-accent" />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-tight">{ressource.titre}</p>
            {ressource.categorie && (
              <p className="text-xs text-ink-soft mt-0.5">{ressource.categorie}</p>
            )}
          </div>
          <Badge ton={ressource.gratuit ? 'success' : 'accent'}>
            {ressource.gratuit ? 'Gratuit' : 'Payant'}
          </Badge>
        </div>

        {ressource.description && (
          <p className="text-xs text-ink-soft leading-relaxed mb-3 line-clamp-2">{ressource.description}</p>
        )}

        {lien ? (
          <a
            href={lien}
            target="_blank"
            rel="noopener noreferrer"
            className="tap flex items-center justify-center gap-1.5 text-xs font-medium bg-ink text-paper rounded-card py-2"
          >
            {ressource.gratuit ? (
              <>
                <Download size={14} />
                Consulter
              </>
            ) : (
              <>
                <ExternalLink size={14} />
                Voir sur Chariow
              </>
            )}
          </a>
        ) : (
          <p className="text-xs text-ink-soft/60 text-center py-2">Lien indisponible</p>
        )}
      </div>
    </Card>
  )
}