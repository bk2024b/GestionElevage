import Image from 'next/image'

export function HeroIllustration() {
  return (
    <div className="relative w-full max-w-xs mx-auto">
      <svg viewBox="0 0 320 320" className="w-full h-auto">
        <defs>
          <pattern id="mesh-hutch" width="18" height="18" patternUnits="userSpaceOnUse">
            <path d="M0 0H18M0 0V18" stroke="#8B6F47" strokeWidth="1" opacity="0.3" />
          </pattern>
        </defs>
        {/* Toit du clapier */}
        <path d="M20 130 L160 28 L300 130 L300 152 L20 152 Z" fill="#1F2B22" />
        {/* Corps grillagé */}
        <rect x="28" y="152" width="264" height="138" rx="18" fill="#F5F3EA" />
        <rect x="28" y="152" width="264" height="138" rx="18" fill="url(#mesh-hutch)" />
        <rect x="28" y="152" width="264" height="138" rx="18" fill="none" stroke="#8B6F47" strokeWidth="2.5" />
        {/* Pieds */}
        <rect x="44" y="288" width="16" height="22" rx="4" fill="#8B6F47" />
        <rect x="260" y="288" width="16" height="22" rx="4" fill="#8B6F47" />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center pt-4">
        <Image src="/icons/icon-512.png" alt="" width={130} height={130} priority />
      </div>

      <svg className="absolute -top-3 -right-3 w-9 h-9 text-accent-green" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C7 6 5 11 8 16c2 3 6 4 9 2-1-5-2-9-5-16z" />
      </svg>
      <svg className="absolute -bottom-2 -left-3 w-7 h-7 text-accent" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C7 6 5 11 8 16c2 3 6 4 9 2-1-5-2-9-5-16z" />
      </svg>
    </div>
  )
}