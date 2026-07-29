import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/Card'

export function FeatureCard({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <Card>
      <span className="w-10 h-10 flex items-center justify-center rounded-control bg-accent-green-soft mb-3">
        <Icon size={18} className="text-accent-green" strokeWidth={2} />
      </span>
      <h3 className="font-semibold text-sm mb-1 text-ink">{title}</h3>
      <p className="text-sm text-ink-soft leading-relaxed">{description}</p>
    </Card>
  )
}