import Image from 'next/image'

const TAILLES = { sm: 32, md: 44, lg: 64 }

export function AppLogoMark({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const px = TAILLES[size]

  return (
    <Image
      src="/icons/icon-512.png"
      alt="Ferme F001"
      width={px}
      height={px}
      className="shrink-0 rounded-full"
      priority
    />
  )
}