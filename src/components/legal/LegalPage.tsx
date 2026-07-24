import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export function LegalPage({ title, majAt, children }: { title: string; majAt: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-2xl mx-auto px-5 py-10">
        <Link href="/" className="tap inline-flex items-center gap-1.5 text-sm text-ink-soft mb-6">
          <ArrowLeft size={14} />
          Retour
        </Link>
        <h1 className="text-2xl font-display font-semibold mb-1">{title}</h1>
        <p className="text-xs text-ink-soft/70 mb-8">Dernière mise à jour : {majAt}</p>
        <div className="flex flex-col gap-6 text-sm text-ink leading-relaxed [&_h2]:font-display [&_h2]:font-semibold [&_h2]:text-base [&_h2]:mb-2 [&_p]:text-ink-soft [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-ink-soft [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1">
          {children}
        </div>
      </div>
    </div>
  )
}