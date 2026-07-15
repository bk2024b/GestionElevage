import { createClient } from '@/lib/supabase/server'
import { supprimerTransaction } from './actions'
import { CATEGORIES_DEPENSE, CATEGORIES_REVENU, formatFCFA } from '@/lib/finances'
import { Card, StatCard } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Plus, X } from 'lucide-react'
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
    <div className="px-5 py-6 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-display font-semibold">Finances</h1>
        <div className="flex gap-2">
          <Link href="/finances/nouveau?type=revenu" className="tap text-xs bg-success/10 text-success px-3 py-2 rounded-card">
            + Revenu
          </Link>
          <Link href="/finances/nouveau?type=depense" className="tap text-xs bg-danger/10 text-danger px-3 py-2 rounded-card">
            + Dépense
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        <Card className="px-2 py-3">
          <p className="text-xs text-ink-soft">Revenus</p>
          <p className="text-sm font-medium text-success">{formatFCFA(revenus)}</p>
        </Card>
        <Card className="px-2 py-3">
          <p className="text-xs text-ink-soft">Dépenses</p>
          <p className="text-sm font-medium text-danger">{formatFCFA(depenses)}</p>
        </Card>
        <Card className="px-2 py-3">
          <p className="text-xs text-ink-soft">Bénéfice</p>
          <p className={`text-sm font-medium ${benefice >= 0 ? 'text-success' : 'text-danger'}`}>{formatFCFA(benefice)}</p>
        </Card>
      </div>

      <div className="flex flex-col gap-2">
        {transactions?.map((t) => {
          const supprimerAvecId = supprimerTransaction.bind(null, t.id)
          const label = t.type === 'revenu' ? CATEGORIES_REVENU[t.categorie] : CATEGORIES_DEPENSE[t.categorie]
          const estAutomatique = t.soin_id || t.alimentation_id

          return (
            <Card key={t.id} className="flex items-center gap-3">
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
              <span className={`text-sm font-medium ${t.type === 'revenu' ? 'text-success' : 'text-danger'}`}>
                {t.type === 'revenu' ? '+' : '-'}{formatFCFA(Number(t.montant))}
              </span>
              {!estAutomatique && (
                <form action={supprimerAvecId}>
                  <button type="submit" className="tap text-ink-soft/50">
                    <X size={14} />
                  </button>
                </form>
              )}
            </Card>
          )
        })}

        {transactions?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-ink-soft mb-1">Aucune transaction enregistrée.</p>
            <p className="text-xs text-ink-soft/70">Ajoute un revenu ou une dépense pour commencer.</p>
          </div>
        )}
      </div>
    </div>
  )
}