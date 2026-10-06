import type { Metadata, Viewport } from 'next'
import { vazirmatn } from '@/lib/fonts'
import { BASE_DOMAIN } from '@/lib/schools'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(`https://${BASE_DOMAIN}`),
  title: {
    default: 'مدارس چمران اهواز',
    template: '%s | مدارس چمران اهواز',
  },
  description:
    'وب‌سایت رسمی مدارس چمران اهواز — دبستان و متوسطهٔ اول و دوم، پسرانه و دخترانه',
  keywords: ['مدرسه', 'چمران', 'اهواز', 'دبستان', 'متوسطه', 'کلاس', 'معلم'],
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    siteName: 'مدارس چمران اهواز',
  },
}

export const viewport: Viewport = {
  themeColor: [{ media: '(prefers-color-scheme: light)', color: '#1b6ef5' }, { media: '(prefers-color-scheme: dark)', color: '#0b1120' }],
  width: 'device-width',
  initialScale: 1,
}

// اعمال تم پیش از رندر اول — از پرش ناگهانی رنگ جلوگیری می‌کند
const themeInit = `
try {
  var t = localStorage.getItem('theme');
  var dark = t ? t === 'dark' : true; // پیش‌فرض: تاریک
  if (dark) document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
} catch (e) {}
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="flex min-h-screen flex-col font-sans">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}
