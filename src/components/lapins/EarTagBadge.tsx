export function EarTagBadge({ identifiant, sexe }: { identifiant: string; sexe: 'M' | 'F' }) {
  const bg = sexe === 'F' ? 'bg-danger/10' : 'bg-ink/10'
  const text = sexe === 'F' ? 'text-danger' : 'text-ink'

  return (
    <span className={`font-mono text-xs px-2 py-1 rounded-md ${bg} ${text}`}>
      {identifiant}
    </span>
  )
}