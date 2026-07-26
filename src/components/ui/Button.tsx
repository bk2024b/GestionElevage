import Link from 'next/link'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variante = 'primaire' | 'secondaire' | 'alerte' | 'danger' | 'discret'

const STYLES: Record<Variante, string> = {
  primaire: 'bg-accent-green text-white',
  secondaire: 'border border-line text-ink bg-white',
  alerte: 'border border-accent text-accent bg-white',
  danger: 'text-danger bg-transparent',
  discret: 'bg-surface-secondary text-ink-soft',
}

interface BoutonBaseProps {
  variante?: Variante
  children: ReactNode
  className?: string
}

export function Button({
  variante = 'primaire',
  children,
  className = '',
  ...props
}: BoutonBaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`tap rounded-control py-2.5 px-4 text-sm font-medium text-center ${STYLES[variante]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function ButtonLink({
  href,
  variante = 'primaire',
  children,
  className = '',
}: BoutonBaseProps & { href: string }) {
  return (
    <Link
      href={href}
      className={`tap block rounded-control py-2.5 px-4 text-sm font-medium text-center ${STYLES[variante]} ${className}`}
    >
      {children}
    </Link>
  )
}