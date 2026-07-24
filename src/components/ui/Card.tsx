import type { HTMLAttributes, ReactNode } from 'react'

export function Card({
  children,
  className = '',
  ...props
}: { children: ReactNode; className?: string } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`bg-surface border border-line/60 rounded-card p-5 ${className}`} {...props}>
      {children}
    </div>
  )
}

export function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <Card className="p-5">
      <p className="text-xs text-ink-soft">{label}</p>
      <p className="text-2xl font-display font-semibold">{value}</p>
      {sub && <p className="text-xs text-ink-soft/70">{sub}</p>}
    </Card>
  )
}