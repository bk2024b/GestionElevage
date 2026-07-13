import { createClient } from '@/lib/supabase/server'
import { EarTagBadge } from '@/components/lapins/EarTagBadge'
import Link from 'next/link'

export default async function LapinsPage() {
  const supabase = await createClient()
  const { data: lapins } = await supabase
    .from('lapins')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="px-6 py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-medium">Mes lapins</h1>
        <Link href="/lapins/nouveau" className="text-sm bg-[#1F2B22] text-white px-3 py-2 rounded-md">
          + Ajouter
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {lapins?.map((lapin) => (
          <Link
            key={lapin.id}
            href={`/lapins/${lapin.id}`}
            className="flex items-center gap-3 border rounded-md px-3 py-2 bg-white"
          >
            <EarTagBadge identifiant={lapin.identifiant} sexe={lapin.sexe} />
            <span className="flex-1 text-sm">{lapin.nom || '—'}</span>
            <span className="text-xs text-gray-500">{lapin.statut}</span>
          </Link>
        ))}

        {lapins?.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-8">
            Aucun lapin enregistré. Ajoute ton premier lapin.
          </p>
        )}
      </div>
    </div>
  )
}