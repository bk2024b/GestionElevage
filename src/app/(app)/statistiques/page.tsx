import { createClient } from '@/lib/supabase/server'
import { calculerStatistiques } from '@/lib/statistiques'
import { formatFCFA } from '@/lib/finances'
import { ExportButtons } from '@/components/statistiques/ExportButtons'

export default async function StatistiquesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profil } = await supabase.from('profils').select('nom_elevage').eq('id', user!.id).single()

  const stats = await calculerStatistiques()

  return (
    <div className="px-6 py-6">
      <h1 className="text-xl font-medium mb-4">Statistiques</h1>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white border rounded-md px-4 py-3">
          <p className="text-xs text-gray-500">Taux de reproduction</p>
          <p className="text-2xl font-medium">{stats.tauxReproduction}%</p>
          <p className="text-xs text-gray-400">{stats.totalAccouplements} accouplements</p>
        </div>
        <div className="bg-white border rounded-md px-4 py-3">
          <p className="text-xs text-gray-500">Taux de mortalité</p>
          <p className="text-2xl font-medium">{stats.tauxMortalite}%</p>
          <p className="text-xs text-gray-400">{stats.totalMorts} / {stats.totalNes} nés</p>
        </div>
      </div>

      <div className="bg-white border rounded-md px-4 py-3 mb-4">
        <p className="text-xs text-gray-500 mb-2">Rentabilité</p>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-500">Revenus</span>
          <span className="text-green-700 font-medium">{formatFCFA(stats.revenus)}</span>
        </div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-500">Dépenses</span>
          <span className="text-red-700 font-medium">{formatFCFA(stats.depenses)}</span>
        </div>
        <div className="flex justify-between text-sm border-t pt-1 mt-1">
          <span className="text-gray-600">Bénéfice</span>
          <span className={`font-medium ${stats.benefice >= 0 ? 'text-green-700' : 'text-red-700'}`}>
            {formatFCFA(stats.benefice)}
          </span>
        </div>
      </div>

      <div className="bg-white border rounded-md px-4 py-3 mb-6">
        <p className="text-xs text-gray-500 mb-2">Cheptel</p>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Total lapins</span>
          <span className="font-medium">{stats.totalLapins}</span>
        </div>
      </div>

      <ExportButtons stats={stats} nomElevage={profil?.nom_elevage ?? 'Mon élevage'} />
    </div>
  )
}