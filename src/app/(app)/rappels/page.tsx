import { createClient } from '@/lib/supabase/server'
import { EarTagBadge } from '@/components/lapins/EarTagBadge'
import { marquerRappelVu } from './actions'
import { LABEL_TYPE_RAPPEL, estEnRetard, estAujourdhui } from '@/lib/rappels'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default async function RappelsPage() {
  const supabase = await createClient()

  const { data: rappels } = await supabase
    .from('rappels')
    .select(`*, lapin:lapin_id(identifiant, sexe, nom)`)
    .eq('vu', false)
    .order('date_prevue', { ascending: true })

  const { data: rappelsVus } = await supabase
    .from('rappels')
    .select(`*, lapin:lapin_id(identifiant, sexe, nom)`)
    .eq('vu', true)
    .order('date_prevue', { ascending: false })
    .limit(10)

  return (
    <div className="max-w-md md:max-w-4xl mx-auto px-5 py-6">
      <h1 className="text-xl md:text-2xl font-display font-semibold mb-5">Rappels</h1>

      <div className="md:grid md:grid-cols-2 md:gap-3 flex flex-col gap-2 md:flex-none mb-6">
        {rappels?.map((r: any) => {
          const marquerAvecId = marquerRappelVu.bind(null, r.id)
          const retard = estEnRetard(r.date_prevue)
          const aujourdhui = estAujourdhui(r.date_prevue)

          return (
            <Card
              key={r.id}
              className={`!p-4 flex items-center gap-3 ${
                retard ? 'bg-danger/5 border-danger/30' : aujourdhui ? 'bg-accent-soft border-accent/30' : ''
              }`}
            >
              {r.lapin && <EarTagBadge identifiant={r.lapin.identifiant} sexe={r.lapin.sexe} />}
              <div className="flex-1">
                <p className="text-sm">{LABEL_TYPE_RAPPEL[r.type] || r.message}</p>
                <p className="text-xs text-ink-soft">
                  {retard ? 'En retard — ' : aujourdhui ? "Aujourd'hui — " : ''}
                  {new Date(r.date_prevue).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <form action={marquerAvecId}>
                <Button type="submit" variante="discret" className="text-xs py-1.5 px-3">
                  Vu
                </Button>
              </form>
            </Card>
          )
        })}

        {rappels?.length === 0 && (
          <div className="md:col-span-2 text-center py-16">
            <p className="text-sm text-ink-soft mb-1">Aucun rappel en attente.</p>
            <p className="text-xs text-ink-soft/70">Tout est à jour.</p>
          </div>
        )}
      </div>

      {rappelsVus && rappelsVus.length > 0 && (
        <>
          <p className="text-xs text-ink-soft mb-2">Récemment traités</p>
          <div className="md:grid md:grid-cols-2 md:gap-3 flex flex-col gap-2 md:flex-none">
            {rappelsVus.map((r: any) => (
              <Card key={r.id} className="!p-4 flex items-center gap-3 opacity-50">
                {r.lapin && <EarTagBadge identifiant={r.lapin.identifiant} sexe={r.lapin.sexe} />}
                <p className="text-sm flex-1">{LABEL_TYPE_RAPPEL[r.type] || r.message}</p>
                <p className="text-xs text-ink-soft">{new Date(r.date_prevue).toLocaleDateString('fr-FR')}</p>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}