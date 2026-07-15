import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1F2B22',
        'ink-soft': '#4B5A4E',
        paper: '#F5F3EA',
        surface: '#FFFFFF',
        line: '#E4E0D3',
        accent: {
          DEFAULT: '#C97B3D',
          soft: '#F3DCC4',
        },
        success: '#5B8C5A',
        danger: '#B5482E',
      },
      fontFamily: {
        display: ['var(--font-sora)', 'sans-serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'monospace'],
      },
      borderRadius: {
        card: '18px',
        pill: '999px',
      },
    },
  },
  plugins: [],
}
export default config