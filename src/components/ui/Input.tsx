import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

const BASE = 'border border-line rounded-control px-3 py-2.5 text-sm bg-surface w-full focus:border-accent-green outline-none'

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={BASE} {...props} />
}

export function IconInput({ icon: Icon, ...props }: { icon: LucideIcon } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
      <input className={`${BASE} pl-9`} {...props} />
    </div>
  )
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={BASE} {...props} />
}

export function Select({ children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <select className={BASE} {...props}>
      {children}
    </select>
  )
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="text-sm text-ink-soft flex flex-col gap-1">
      {label}
      {children}
    </label>
  )
}