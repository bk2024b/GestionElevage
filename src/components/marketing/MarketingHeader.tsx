import Link from 'next/link'

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-30 bg-paper/90 backdrop-blur border-b border-line safe-top">
      <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-card bg-ink text-paper flex items-center justify-center font-display font-semibold text-xs">
            EL
          </span>
          <span className="font-display font-semibold text-sm">Élevage</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-6 text-sm text-ink-soft">
          <a href="#fonctionnalites" className="hover:text-ink">Fonctionnalités</a>
          <a href="#comment-ca-marche" className="hover:text-ink">Comment ça marche</a>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/login" className="tap text-sm text-ink px-3 py-2 rounded-card border border-line hidden sm:block">
            Connexion
          </Link>
          <Link href="/register" className="tap text-sm bg-ink text-paper px-4 py-2 rounded-card">
            Commencer
          </Link>
        </div>
      </div>
    </header>
  )
}