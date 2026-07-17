import type { LucideIcon } from 'lucide-react'

export function FeatureCard({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <div className="bg-surface border border-line rounded-card p-5">
      <span className="w-10 h-10 flex items-center justify-center rounded-card bg-accent-soft mb-3">
        <Icon size={18} className="text-accent" strokeWidth={1.75} />
      </span>
      <h3 className="font-display font-semibold text-sm mb-1">{title}</h3>
      <p className="text-sm text-ink-soft leading-relaxed">{description}</p>
    </div>
  )
}