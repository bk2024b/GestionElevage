import { createClient } from '@/lib/supabase/server'
import { supprimerTransaction } from './actions'
import { CATEGORIES_DEPENSE, CATEGORIES_REVENU, formatFCFA } from '@/lib/finances'
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
    <div className="px-6 py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-medium">Finances</h1>
        <div className="flex gap-2">
          <Link href="/finances/nouveau?type=revenu" className="text-xs bg-green-100 text-green-800 px-2 py-2 rounded-md">+ Revenu</Link>
          <Link href="/finances/nouveau?type=depense" className="text-xs bg-red-100 text-red-800 px-2 py-2 rounded-md">+ Dépense</Link>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="bg-white border rounded-md px-2 py-3">
          <p className="text-xs text-gray-500">Revenus</p>
          <p className="text-sm font-medium text-green-700">{formatFCFA(revenus)}</p>
        </div>
        <div className="bg-white border rounded-md px-2 py-3">
          <p className="text-xs text-gray-500">Dépenses</p>
          <p className="text-sm font-medium text-red-700">{formatFCFA(depenses)}</p>
        </div>
        <div className="bg-white border rounded-md px-2 py-3">
          <p className="text-xs text-gray-500">Bénéfice</p>
          <p className={`text-sm font-medium ${benefice >= 0 ? 'text-green-700' : 'text-red-700'}`}>{formatFCFA(benefice)}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {transactions?.map((t) => {
          const supprimerAvecId = supprimerTransaction.bind(null, t.id)
          const label = t.type === 'revenu' ? CATEGORIES_REVENU[t.categorie] : CATEGORIES_DEPENSE[t.categorie]
          const estAutomatique = t.soin_id || t.alimentation_id

          return (
            <div key={t.id} className="flex items-center gap-3 bg-white border rounded-md px-3 py-2">
              <div className="flex-1">
                <p className="text-sm">
                  {label || t.categorie}
                  {estAutomatique && <span className="text-xs text-gray-400 ml-1">(auto)</span>}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(t.date_transaction).toLocaleDateString('fr-FR')}
                  {t.description ? ` — ${t.description}` : ''}
                </p>
              </div>
              <span className={`text-sm font-medium ${t.type === 'revenu' ? 'text-green-700' : 'text-red-700'}`}>
                {t.type === 'revenu' ? '+' : '-'}{formatFCFA(Number(t.montant))}
              </span>
              {!estAutomatique && (
                <form action={supprimerAvecId}>
                  <button type="submit" className="text-xs text-gray-400">✕</button>
                </form>
              )}
            </div>
          )
        })}

        {transactions?.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-8">
            Aucune transaction enregistrée.
          </p>
        )}
      </div>
    </div>
  )
}