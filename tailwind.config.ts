import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-vazirmatn)', 'Tahoma', 'Arial', 'sans-serif'],
      },
      colors: {
        school: {
          50: '#eef7ff',
          100: '#d9edff',
          200: '#bce0ff',
          300: '#8ecdff',
          400: '#59b0ff',
          500: '#338eff',
          600: '#1b6ef5',
          700: '#1457e1',
          800: '#1747b6',
          900: '#193f8f',
          950: '#142857',
        },
      },
      boxShadow: {
        card: '0 1px 3px rgba(16,24,40,.06), 0 8px 24px -12px rgba(16,24,40,.16)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp .5s ease-out both',
      },
    },
  },
  plugins: [],
}

export default config
