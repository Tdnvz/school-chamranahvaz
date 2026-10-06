import type { Metadata, Viewport } from 'next'
import { headers } from 'next/headers'
import { vazirmatn } from '@/lib/fonts'
import { BASE_DOMAIN, getSchool, STAGE_LABELS } from '@/lib/schools'
import { extractSubdomain } from '@/lib/utils'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const host = headers().get('host') ?? ''
  const sub = extractSubdomain(host)
  const school = sub ? getSchool(sub) : null

  // داخل هر ساب‌دامنه فقط همان مدرسه معرفی می‌شود
  const description = school
    ? `${school.titleFa} چمران اهواز — ${STAGE_LABELS[school.stage]}، ${
        school.gender === 'boys' ? 'ویژهٔ پسران' : 'ویژهٔ دختران'
      }`
    : 'وب‌سایت رسمی مدارس چمران اهواز — دبستان و متوسطهٔ اول و دوم، پسرانه و دخترانه'

  return {
    metadataBase: new URL(`https://${BASE_DOMAIN}`),
    title: {
      default: school ? school.titleFa : 'مدارس چمران اهواز',
      template: `%s | ${school ? school.titleFa : 'مدارس چمران اهواز'}`,
    },
    description,
    keywords: school
      ? ['مدرسه', 'چمران', 'اهواز', school.titleFa, STAGE_LABELS[school.stage], 'کلاس', 'معلم']
      : ['مدرسه', 'چمران', 'اهواز', 'دبستان', 'متوسطه', 'کلاس', 'معلم'],
    openGraph: {
      type: 'website',
      locale: 'fa_IR',
      siteName: school ? school.titleFa : 'مدارس چمران اهواز',
      description,
    },
  }
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
