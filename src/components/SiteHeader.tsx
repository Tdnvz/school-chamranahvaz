import Link from 'next/link'
import { headers } from 'next/headers'
import { getSchool, SCHOOLS, BASE_DOMAIN } from '@/lib/schools'
import { extractSubdomain } from '@/lib/utils'
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
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-school-600 text-white">
            <School className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold">
              {school ? school.titleFa : 'مدارس چمران اهواز'}
            </span>
            <span className="block text-[11px] text-slate-500">
              {school ? school.domain : BASE_DOMAIN}
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* نوار مدارس روی دامنهٔ اصلی */}
      {!school && (
        <div className="border-t border-slate-100 bg-slate-50/70">
          <div className="container-page flex gap-2 overflow-x-auto py-2">
            {SCHOOLS.map((s) => (
              <a
                key={s.subdomain}
                href={`https://${s.domain}`}
                className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 transition hover:text-school-600 hover:ring-school-300"
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
