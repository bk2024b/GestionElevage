import type { ReactNode } from 'react'
import { Eye, Pencil } from 'lucide-react'

export function DataTable({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <div className="bg-surface border border-line rounded-card overflow-hidden overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line bg-surface-secondary/50">
            {headers.map((h) => (
              <th key={h} className="text-left px-4 py-3 text-xs font-medium text-ink-soft whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
    </div>
  )
}

export function DataRow({ children }: { children: ReactNode }) {
  return <tr className="hover:bg-surface-secondary/40">{children}</tr>
}

export function DataCell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <td className={`px-4 py-3 text-ink whitespace-nowrap ${className}`}>{children}</td>
}

export function RowActions({ onView, onEdit }: { onView?: () => void; onEdit?: () => void }) {
  return (
    <div className="flex items-center gap-2">
      {onView && (
        <button onClick={onView} className="tap text-ink-soft">
          <Eye size={16} />
        </button>
      )}
      {onEdit && (
        <button onClick={onEdit} className="tap text-ink-soft">
          <Pencil size={16} />
        </button>
      )}
    </div>
  )
}