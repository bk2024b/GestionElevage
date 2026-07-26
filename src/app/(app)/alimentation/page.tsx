import { createClient } from '@/lib/supabase/server'
import { supprimerAlimentation, reapprovisionnerStock } from './actions'
import { calculerAutonomieStock } from '@/lib/alimentation-stock'
import { formatFCFA } from '@/lib/finances'
import { Card } from '@/components/ui/Card'
import { Input, Select, Field } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Plus, X, Wheat, Coins, Package } from 'lucide-react'
import Link from 'next/link'

export default async function AlimentationPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: distributions } = await supabase
    .from('alimentation')
    .select('*')
    .order('date_distribution', { ascending: false })

  const debutMois = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
  const distributionsMois = (distributions ?? []).filter((d) => d.date_distribution >= debutMois)

  const totalKgMois = distributionsMois.reduce((s, d) => s + Number(d.quantite_kg), 0)
  const totalCoutMois = distributionsMois.reduce((s, d) => s + Number(d.cout ?? 0), 0)

  const { stockTotal, joursRestants, stocks } = await calculerAutonomieStock(user!.id)

  return (
    <div className="max-w-md md:max-w-4xl mx-auto px-5 py-6">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl md:text-2xl font-bold">Alimentation</h1>
        <Link href="/alimentation/nouveau" className="tap flex items-center gap-1 text-sm bg-accent-green text-white px-4 py-2.5 rounded-control">
          <Plus size={16} />
          Ajouter
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <Card>
          <Wheat size={22} strokeWidth={2} className="text-ink mb-3" />
          <p className="text-sm text-ink-soft">Ce mois</p>
          <p className="text-2xl font-bold mt-1">{totalKgMois.toFixed(1)} kg</p>
        </Card>
        <Card>
          <Coins size={22} strokeWidth={2} className="text-ink mb-3" />
          <p className="text-sm text-ink-soft">Coût ce mois</p>
          <p className="text-2xl font-bold mt-1">{formatFCFA(totalCoutMois)}</p>
        </Card>
        <Card className={joursRestants !== null && joursRestants <= 5 ? 'bg-accent-soft border-accent/30' : ''}>
          <Package size={22} strokeWidth={2} className={joursRestants !== null && joursRestants <= 5 ? 'text-accent mb-3' : 'text-ink mb-3'} />
          <p className="text-sm text-ink-soft">Stock — autonomie</p>
          <p className="text-2xl font-bold mt-1">{joursRestants !== null ? `${joursRestants} j` : '—'}</p>
          <p className="text-xs text-ink-soft/70 mt-0.5">{stockTotal.toFixed(1)} kg en stock</p>
        </Card>
      </div>

      {/* Réapprovisionnement */}
      <Card className="mb-6">
        <h3 className="text-sm font-semibold mb-3">Réapprovisionner le stock</h3>
        <form action={reapprovisionnerStock} className="flex flex-col sm:flex-row gap-2">
          <Field label="Type d'aliment">
            <Select name="type_aliment" required>
              <option value="Granulés">Granulés</option>
              <option value="Foin">Foin</option>
              <option value="Verdure">Verdure</option>
              <option value="Complément">Complément</option>
              <option value="Autre">Autre</option>
            </Select>
          </Field>
          <Field label="Quantité ajoutée (kg)">
            <Input name="quantite_kg" type="number" step="0.1" required />
          </Field>
          <div className="flex items-end">
            <Button type="submit" variante="secondaire" className="whitespace-nowrap">
              Ajouter au stock
            </Button>
          </div>
        </form>

        {stocks.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-line">
            {stocks.map((s: any) => (
              <span key={s.type_aliment} className="text-xs bg-surface-secondary text-ink-soft px-2.5 py-1 rounded-pill">
                {s.type_aliment} : {Number(s.quantite_kg).toFixed(1)} kg
              </span>
            ))}
          </div>
        )}
      </Card>

      <div className="md:grid md:grid-cols-2 md:gap-3 flex flex-col gap-2 md:flex-none">
        {distributions?.map((d) => {
          const supprimerAvecId = supprimerAlimentation.bind(null, d.id)

          return (
            <Card key={d.id} className="!p-4 flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm">{d.type_aliment} — {Number(d.quantite_kg)} kg</p>
                <p className="text-xs text-ink-soft">
                  {new Date(d.date_distribution).toLocaleDateString('fr-FR')}
                  {d.cout ? ` — ${formatFCFA(Number(d.cout))}` : ''}
                </p>
              </div>
              <form action={supprimerAvecId}>
                <button type="submit" className="tap text-ink-soft/50">
                  <X size={14} />
                </button>
              </form>
            </Card>
          )
        })}

        {distributions?.length === 0 && (
          <div className="md:col-span-2 text-center py-16">
            <p className="text-sm text-ink-soft mb-1">Aucune distribution enregistrée.</p>
            <p className="text-xs text-ink-soft/70">Enregistre ta première distribution d'aliment.</p>
          </div>
        )}
      </div>
    </div>
  )
}