import { createClient } from '@/lib/supabase/server'
import { supprimerRessource, togglePublication } from './actions'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Plus, X } from 'lucide-react'
import Link from 'next/link'

export default async function AdminRessourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const supabase = await createClient()

  const { data: ressources } = await supabase
    .from('ressources')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="px-5 py-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-sm text-ink-soft">← Admin</Link>
          <h1 className="text-xl font-display font-semibold">Ressources</h1>
        </div>
        <Link href="/admin/ressources/nouveau" className="tap flex items-center gap-1 text-sm bg-ink text-paper px-3 py-2 rounded-card">
          <Plus size={16} />
          Ajouter
        </Link>
      </div>

      {error && (
        <p className="text-sm text-danger bg-danger/10 rounded-card px-3 py-2 mb-3">{error}</p>
      )}

      <div className="flex flex-col gap-2">
        {ressources?.map((r) => {
          const supprimerAvecId = supprimerRessource.bind(null, r.id)
          const togglerAvecId = togglePublication.bind(null, r.id, r.publie)

          return (
            <Card key={r.id} className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className="text-sm font-medium truncate">{r.titre}</p>
                  <Badge ton={r.gratuit ? 'success' : 'accent'}>{r.gratuit ? 'Gratuit' : 'Payant'}</Badge>
                  {!r.publie && <Badge ton="neutre">Brouillon</Badge>}
                </div>
                <p className="text-xs text-ink-soft">{r.type === 'cours' ? 'Formation' : 'Document'} {r.categorie ? `· ${r.categorie}` : ''}</p>
              </div>
              <form action={togglerAvecId}>
                <Button type="submit" variante="discret" className="text-xs py-1.5 px-2">
                  {r.publie ? 'Dépublier' : 'Publier'}
                </Button>
              </form>
              <form action={supprimerAvecId}>
                <button type="submit" className="tap text-ink-soft/50">
                  <X size={14} />
                </button>
              </form>
            </Card>
          )
        })}

        {ressources?.length === 0 && (
          <p className="text-sm text-ink-soft text-center py-12">Aucune ressource pour l'instant.</p>
        )}
      </div>
    </div>
  )
}