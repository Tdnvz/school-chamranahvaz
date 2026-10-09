import Link from 'next/link'
import { headers } from 'next/headers'
import { getSchool, SCHOOLS, BASE_DOMAIN } from '@/lib/schools'
import { extractSubdomain } from '@/lib/utils'
import ThemeToggle from './ThemeToggle'
import { School } from './icons'

const NAV = [
  { href: '/', label: 'خانه' },
  { href: '/classes', label: 'کلاس‌ها' },
  { href: '/teachers', label: 'معلمین' },
]

export default function SiteHeader() {
  const host = headers().get('host') ?? ''
  const sub = extractSubdomain(host)
  const school = sub ? getSchool(sub) : null

  return (
    <header className="safe-top sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-slate-800 dark:bg-slate-950/85 dark:supports-[backdrop-filter]:bg-slate-950/70">
      <div className="container-page flex min-h-[4rem] items-center justify-between gap-3 py-2">
        {/* نشان و نام مدرسه */}
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-school-600 text-white">
            <School className="h-5 w-5" />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-sm font-bold">
              {school ? school.titleFa : 'متوسطهٔ دوم پسرانهٔ چمران اهواز'}
            </span>
            <span className="block truncate text-[11px] text-slate-500 dark:text-slate-400" dir="ltr">
              {school ? school.domain : BASE_DOMAIN}
            </span>
          </span>
        </Link>

        {/* منوی دسکتاپ */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
        </div>
      </div>

      {/* منوی موبایل — نوار افقی قابل اسکرول (هدف لمسی مناسب) */}
      <nav className="border-t border-slate-100 md:hidden dark:border-slate-800">
        <div className="container-page flex items-center gap-1 overflow-x-auto py-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* نوار مدارس روی دامنهٔ اصلی */}
      {!school && (
        <div className="border-t border-slate-100 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/70">
          <div className="container-page flex gap-2 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {SCHOOLS.map((s) => (
              <a
                key={s.subdomain}
                href={`https://${s.domain}`}
                className="shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 transition hover:text-school-600 hover:ring-school-300 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 dark:hover:text-school-400 dark:hover:ring-school-700"
              >
                {s.shortFa}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
