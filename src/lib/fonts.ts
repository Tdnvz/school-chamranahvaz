"""Persian font configurations for Next.js."""
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const vazirmatn = localFont({
  src: './fonts/Vazirmatn-Thin.woff2',
  weight: '100',
  style: 'normal',
  variable: '--font-vazirmatn',
  display: 'swap',
  fallback: ['Arial', 'Helvetica', 'sans-serif'],
})