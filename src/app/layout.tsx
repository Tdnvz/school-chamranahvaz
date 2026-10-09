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
    : 'وب‌سایت رسمی متوسطهٔ دوم پسرانهٔ چمران اهواز — پایه‌های دهم تا دوازدهم'

  return {
    metadataBase: new URL(`https://${BASE_DOMAIN}`),
    title: {
      default: school ? school.titleFa : 'متوسطهٔ دوم پسرانهٔ چمران اهواز',
      template: `%s | ${school ? school.titleFa : 'متوسطهٔ دوم پسرانهٔ چمران اهواز'}`,
    },
    description,
    keywords: school
      ? ['مدرسه', 'چمران', 'اهواز', school.titleFa, STAGE_LABELS[school.stage], 'کلاس', 'معلم']
      : ['مدرسه', 'چمران', 'اهواز', 'متوسطهٔ دوم', 'پسرانه', 'کلاس', 'معلم'],
    openGraph: {
      type: 'website',
      locale: 'fa_IR',
      siteName: school ? school.titleFa : 'متوسطهٔ دوم پسرانهٔ چمران اهواز',
      description,
    },
  }
}

export const viewport: Viewport = {
  // رنگ پیش‌فرض نوار مرورگر (بلافاصله با اسکریپت زیر با تم سایت هم‌رنگ می‌شود)
  themeColor: '#0b1120',
  width: 'device-width',
  initialScale: 1,
  // پشتیبانی از ناحیهٔ امن گوشی‌های ناچ‌دار و حالت تمام‌صفحه
  viewportFit: 'cover',
}

// اعمال تم پیش از رندر اول — از پرش ناگهانی رنگ جلوگیری می‌کند
// و رنگ نوار مرورگر (استاتوس‌بار iOS / نوار آدرس اندروید) را هم با تم سایت هم‌رنگ می‌کند
const THEME_BG_DARK = '#0b1120'
const THEME_BG_LIGHT = '#f6f8fb'
const themeInit = `
try {
  var t = localStorage.getItem('theme');
  var dark = t ? t === 'dark' : true; // پیش‌فرض: تاریک
  var root = document.documentElement;
  if (dark) root.classList.add('dark'); else root.classList.remove('dark');
  var m = document.querySelector('meta[name="theme-color"]');
  if (!m) {
    m = document.createElement('meta');
    m.setAttribute('name', 'theme-color');
    document.head.appendChild(m);
  }
  m.setAttribute('content', dark ? '${THEME_BG_DARK}' : '${THEME_BG_LIGHT}');
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
