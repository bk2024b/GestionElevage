type Ton = 'accent' | 'success' | 'danger' | 'neutre'

const STYLES: Record<Ton, string> = {
  accent: 'bg-accent-soft text-accent',
  success: 'bg-success/10 text-success',
  danger: 'bg-danger/10 text-danger',
  neutre: 'bg-line/60 text-ink-soft',
}

export function Badge({ ton = 'neutre', children }: { ton?: Ton; children: React.ReactNode }) {
  return (
    <span className={`text-xs px-2 py-1 rounded-pill font-medium ${STYLES[ton]}`}>
      {children}
    </span>
  )
}