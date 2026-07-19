import { Rabbit, Tag } from 'lucide-react'

export function AppLogoMark({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dimensions = { sm: 'w-8 h-8', md: 'w-11 h-11', lg: 'w-16 h-16' }[size]
  const iconSize = { sm: 16, md: 22, lg: 32 }[size]
  const badgeSize = { sm: 'w-3.5 h-3.5', md: 'w-5 h-5', lg: 'w-7 h-7' }[size]
  const badgeIcon = { sm: 8, md: 11, lg: 16 }[size]

  return (
    <div className={`relative ${dimensions} shrink-0`}>
      <div className={`${dimensions} rounded-full bg-paper flex items-center justify-center`}>
        <Rabbit size={iconSize} className="text-ink" strokeWidth={2} />
      </div>
      <span className={`absolute -bottom-0.5 -right-0.5 ${badgeSize} rounded-full bg-accent flex items-center justify-center border-2 border-ink`}>
        <Tag size={badgeIcon} className="text-paper" strokeWidth={2.5} />
      </span>
    </div>
  )
}