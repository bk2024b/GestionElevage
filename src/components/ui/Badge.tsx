type Ton = 'success' | 'attention' | 'danger' | 'neutre'

const STYLES: Record<Ton, string> = {
  success: 'bg-accent-green-soft text-accent-green',
  attention: 'bg-accent-soft text-accent',
  danger: 'bg-danger/10 text-danger',
  neutre: 'bg-surface-secondary text-ink-soft',
}

export function Badge({ ton = 'neutre', children }: { ton?: Ton; children: React.ReactNode }) {
  return (
    <span className={`text-xs px-2.5 py-1 rounded-pill font-medium ${STYLES[ton]}`}>
      {children}
    </span>
  )
}