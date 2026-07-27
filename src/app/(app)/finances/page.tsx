import { createClient } from '@/lib/supabase/server'
import { supprimerTransaction } from './actions'
import { CATEGORIES_DEPENSE, CATEGORIES_REVENU, formatFCFA } from '@/lib/finances'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { TrendingUp, TrendingDown, Scale, Plus } from 'lucide-react'
import Link from 'next/link'

export default async function FinancesPage() {
  const supabase = await createClient()

  const { data: transactions } = await supabase
    .from('transactions_financieres')
    .select('*')
    .order('date_transaction', { ascending: false })

  const revenus = transactions?.filter((t) => t.type === 'revenu').reduce((s, t) => s + Number(t.montant), 0) ?? 0
  const depenses = transactions?.filter((t) => t.type === 'depense').reduce((s, t) => s + Number(t.montant), 0) ?? 0
  const benefice = revenus - depenses

  return (
    <div className="max-w-md md:max-w-4xl mx-auto px-5 py-6">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl md:text-2xl font-bold">Finances</h1>
        <div className="flex gap-2">
          <Link href="/finances/nouveau?type=revenu">
            <Button variante="secondaire" className="!border-accent-green !text-accent-green text-xs flex items-center gap-1">
              <Plus size={14} />
              Revenu
            </Button>
          </Link>
          <Link href="/finances/nouveau?type=depense">
            <Button variante="secondaire" className="!border-danger !text-danger text-xs flex items-center gap-1">
              <Plus size={14} />
              Dépense
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card className="!p-4">
          <span className="w-9 h-9 rounded-control bg-accent-green-soft text-accent-green flex items-center justify-center mb-2">
            <TrendingUp size={16} />
          </span>
          <p className="text-xs text-ink-soft">Revenus</p>
          <p className="text-sm md:text-lg font-bold text-accent-green">{formatFCFA(revenus)}</p>
        </Card>
        <Card className="!p-4">
          <span className="w-9 h-9 rounded-control bg-danger/10 text-danger flex items-center justify-center mb-2">
            <TrendingDown size={16} />
          </span>
          <p className="text-xs text-ink-soft">Dépenses</p>
          <p className="text-sm md:text-lg font-bold text-danger">{formatFCFA(depenses)}</p>
        </Card>
        <Card className="!p-4">
          <span className="w-9 h-9 rounded-control bg-accent-soft text-accent flex items-center justify-center mb-2">
            <Scale size={16} />
          </span>
          <p className="text-xs text-ink-soft">Bénéfice</p>
          <p className={`text-sm md:text-lg font-bold ${benefice >= 0 ? 'text-accent-green' : 'text-danger'}`}>{formatFCFA(benefice)}</p>
        </Card>
      </div>

      <div className="md:grid md:grid-cols-2 md:gap-3 flex flex-col gap-2 md:flex-none">
        {transactions?.map((t) => {
          const supprimerAvecId = supprimerTransaction.bind(null, t.id)
          const label = t.type === 'revenu' ? CATEGORIES_REVENU[t.categorie] : CATEGORIES_DEPENSE[t.categorie]
          const estAutomatique = t.soin_id || t.alimentation_id

          return (
            <Card key={t.id} className="!p-4 flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm">{label || t.categorie}</p>
                  {estAutomatique && <Badge ton="neutre">auto</Badge>}
                </div>
                <p className="text-xs text-ink-soft">
                  {new Date(t.date_transaction).toLocaleDateString('fr-FR')}
                  {t.description ? ` — ${t.description}` : ''}
                </p>
              </div>
              <span className={`text-sm font-medium ${t.type === 'revenu' ? 'text-accent-green' : 'text-danger'}`}>
                {t.type === 'revenu' ? '+' : '-'}{formatFCFA(Number(t.montant))}
              </span>
              {!estAutomatique && (
                <form action={supprimerAvecId}>
                  <button type="submit" className="tap text-ink-soft/50">✕</button>
                </form>
              )}
            </Card>
          )
        })}

        {transactions?.length === 0 && (
          <div className="md:col-span-2 text-center py-16">
            <p className="text-sm text-ink-soft mb-1">Aucune transaction enregistrée.</p>
            <p className="text-xs text-ink-soft/70">Ajoute un revenu ou une dépense pour commencer.</p>
          </div>
        )}
      </div>
    </div>
  )
}