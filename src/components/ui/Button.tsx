import Link from 'next/link'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variante = 'primaire' | 'secondaire' | 'danger' | 'discret'

const STYLES: Record<Variante, string> = {
  primaire: 'bg-ink text-paper',
  secondaire: 'border border-ink text-ink bg-transparent',
  danger: 'text-danger bg-transparent',
  discret: 'bg-line/60 text-ink-soft',
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
      className={`tap rounded-card py-2.5 px-4 text-sm font-medium text-center ${STYLES[variante]} ${className}`}
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
      className={`tap block rounded-card py-2.5 px-4 text-sm font-medium text-center ${STYLES[variante]} ${className}`}
    >
      {children}
    </Link>
  )
}