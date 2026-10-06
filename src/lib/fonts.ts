import { Vazirmatn } from 'next/font/google'

// فونت وزیرمتن — پشتیبانی کامل از فارسی و لاتین
export const vazirmatn = Vazirmatn({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-vazirmatn',
  display: 'swap',
})
