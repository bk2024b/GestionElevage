import { createClient } from '@/lib/supabase/server'
import { calculerStatistiques, calculerStatistiquesParLapin } from '@/lib/statistiques'
import { formatFCFA } from '@/lib/finances'
import { ExportButtons } from '@/components/statistiques/ExportButtons'
import { ExportReproducteurs } from '@/components/statistiques/ExportReproducteurs'
import { Card } from '@/components/ui/Card'
import { Heart, Skull, Baby, Rabbit } from 'lucide-react'

export default async function StatistiquesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profil } = await supabase.from('profils').select('nom_elevage').eq('id', user!.id).single()

  const stats = await calculerStatistiques()
  const statsParLapin = await calculerStatistiquesParLapin()

  return (
    <div className="max-w-md md:max-w-4xl mx-auto px-5 py-6">
      <h1 className="text-xl md:text-2xl font-display font-semibold mb-5">Statistiques</h1>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <Card className="!p-4">
          <Heart size={20} strokeWidth={1.6} className="text-ink mb-2" />
          <p className="text-xs text-ink-soft">Reproduction</p>
          <p className="text-xl font-display font-semibold">{stats.tauxReproduction}%</p>
          <p className="text-xs text-ink-soft/70 hidden md:block">{stats.totalAccouplements} accouplements</p>
        </Card>
        <Card className="!p-4">
          <Skull size={20} strokeWidth={1.6} className="text-ink mb-2" />
          <p className="text-xs text-ink-soft">Mort. naissance</p>
          <p className="text-xl font-display font-semibold">{stats.tauxMortalite}%</p>
          <p className="text-xs text-ink-soft/70 hidden md:block">{stats.totalMorts} / {stats.totalNes} nés</p>
        </Card>
        <Card className="!p-4">
          <Baby size={20} strokeWidth={1.6} className="text-ink mb-2" />
          <p className="text-xs text-ink-soft">Mort. sevrage</p>
          <p className="text-xl font-display font-semibold">{stats.tauxMortaliteSevrage}%</p>
          <p className="text-xs text-ink-soft/70 hidden md:block">{stats.totalSevres} / {stats.totalDisponibles} sevrés</p>
        </Card>
      </div>

      <div className="md:grid md:grid-cols-2 md:gap-4">
        <Card className="mb-4 md:mb-0">
          <p className="text-xs text-ink-soft mb-3">Rentabilité</p>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-ink-soft">Revenus</span>
            <span className="text-success font-medium">{formatFCFA(stats.revenus)}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-ink-soft">Dépenses</span>
            <span className="text-danger font-medium">{formatFCFA(stats.depenses)}</span>
          </div>
          <div className="flex justify-between text-sm border-t border-line pt-2 mt-1">
            <span className="text-ink-soft">Bénéfice</span>
            <span className={`font-medium ${stats.benefice >= 0 ? 'text-success' : 'text-danger'}`}>
              {formatFCFA(stats.benefice)}
            </span>
          </div>
        </Card>

        <Card className="mb-6 md:mb-0 flex flex-col justify-center items-center text-center">
          <Rabbit size={32} strokeWidth={1.4} className="text-ink mb-2" />
          <p className="text-xs text-ink-soft">Cheptel total</p>
          <p className="text-3xl font-display font-semibold">{stats.totalLapins}</p>
        </Card>
      </div>

      <div className="mt-6">
        <ExportButtons stats={stats} nomElevage={profil?.nom_elevage ?? 'Mon élevage'} />
      </div>

      <div className="mt-8">
        <p className="text-sm font-medium text-ink-soft mb-2">Performance par reproducteur</p>
        <ExportReproducteurs stats={statsParLapin} nomElevage={profil?.nom_elevage ?? 'Mon élevage'} />
      </div>
    </div>
  )
}