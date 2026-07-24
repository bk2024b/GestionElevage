export function AppLogoMark({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dimensions = { sm: 'w-8 h-8', md: 'w-11 h-11', lg: 'w-16 h-16' }[size]

  return (
    <div className={`${dimensions} shrink-0 relative`}>
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <path
          d="M75 20 Q75 8 90 8 L110 8 Q125 8 125 20 L125 45 Q125 55 138 68 L155 90 Q165 102 165 118 L165 165 Q165 178 152 178 L48 178 Q35 178 35 165 L35 118 Q35 102 45 90 L62 68 Q75 55 75 45 Z"
          fill="#C97B3D"
          stroke="#1F2B22"
          strokeWidth="6"
        />
        <circle cx="100" cy="30" r="12" fill="#F5F3EA" stroke="#1F2B22" strokeWidth="5" />
        <path d="M78 95 Q75 60 88 62 Q96 64 96 90" fill="#F5F3EA" />
        <path d="M122 95 Q125 60 112 62 Q104 64 104 90" fill="#F5F3EA" />
        <circle cx="100" cy="105" r="32" fill="#F5F3EA" />
        <circle cx="88" cy="100" r="4" fill="#1F2B22" />
        <circle cx="112" cy="100" r="4" fill="#1F2B22" />
        <path d="M96 112 L104 112 L100 118 Z" fill="#C97B3D" />
        <rect x="68" y="128" width="64" height="34" rx="6" fill="#F5F3EA" />
        <text x="100" y="152" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="20" fill="#1F2B22">F001</text>
      </svg>
    </div>
  )
}