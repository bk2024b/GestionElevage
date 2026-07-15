import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react'

const BASE = 'border border-line rounded-card px-3 py-2.5 text-sm bg-surface w-full focus:border-accent'

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={BASE} {...props} />
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