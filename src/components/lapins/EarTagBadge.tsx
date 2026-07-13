export function EarTagBadge({ identifiant, sexe }: { identifiant: string; sexe: 'M' | 'F' }) {
  const bg = sexe === 'F' ? 'bg-rose-100' : 'bg-blue-100'
  const text = sexe === 'F' ? 'text-rose-800' : 'text-blue-800'

  return (
    <span className={`font-mono text-xs px-2 py-1 rounded-md ${bg} ${text}`}>
      {identifiant}
    </span>
  )
}