export function HutchPattern({ className = '' }: { className?: string }) {
  return (
    <svg className={className} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="clapier-mesh" width="26" height="26" patternUnits="userSpaceOnUse">
          <path d="M0 0H26M0 0V26" stroke="#8B6F47" strokeWidth="1" opacity="0.18" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#clapier-mesh)" />
    </svg>
  )
}