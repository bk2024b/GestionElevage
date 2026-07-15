import { createClient } from '@/lib/supabase/server'
import { calculerStatistiques, calculerStatistiquesParLapin } from '@/lib/statistiques'
import { formatFCFA } from '@/lib/finances'
import { ExportButtons } from '@/components/statistiques/ExportButtons'
import { ExportReproducteurs } from '@/components/statistiques/ExportReproducteurs'
import { Card, StatCard } from '@/components/ui/Card'

export default async function StatistiquesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profil } = await supabase.from('profils').select('nom_elevage').eq('id', user!.id).single()

  const stats = await calculerStatistiques()
  const statsParLapin = await calculerStatistiquesParLapin()

  return (
    <div className="px-5 py-6 max-w-md mx-auto">
      <h1 className="text-xl font-display font-semibold mb-5">Statistiques</h1>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <StatCard label="Reproduction" value={`${stats.tauxReproduction}%`} sub={`${stats.totalAccouplements} accouplements`} />
        <StatCard label="Mortalité naissance" value={`${stats.tauxMortalite}%`} sub={`${stats.totalMorts} / ${stats.totalNes} nés`} />
        <StatCard label="Mortalité sevrage" value={`${stats.tauxMortaliteSevrage}%`} sub={`${stats.totalSevres} / ${stats.totalDisponibles} sevrés`} />
      </div>

      <Card className="mb-4">
        <p className="text-xs text-ink-soft mb-2">Rentabilité</p>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-ink-soft">Revenus</span>
          <span className="text-success font-medium">{formatFCFA(stats.revenus)}</span>
        </div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-ink-soft">Dépenses</span>
          <span className="text-danger font-medium">{formatFCFA(stats.depenses)}</span>
        </div>
        <div className="flex justify-between text-sm border-t border-line pt-1 mt-1">
          <span className="text-ink-soft">Bénéfice</span>
          <span className={`font-medium ${stats.benefice >= 0 ? 'text-success' : 'text-danger'}`}>
            {formatFCFA(stats.benefice)}
          </span>
        </div>
      </Card>

      <Card className="mb-6">
        <p className="text-xs text-ink-soft mb-2">Cheptel</p>
        <div className="flex justify-between text-sm">
          <span className="text-ink-soft">Total lapins</span>
          <span className="font-medium">{stats.totalLapins}</span>
        </div>
      </Card>

      <ExportButtons stats={stats} nomElevage={profil?.nom_elevage ?? 'Mon élevage'} />

      <div className="mt-8">
        <p className="text-sm font-medium text-ink-soft mb-2">Performance par reproducteur</p>
        <ExportReproducteurs stats={statsParLapin} nomElevage={profil?.nom_elevage ?? 'Mon élevage'} />
      </div>
    </div>
  )
}