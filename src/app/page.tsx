import Link from 'next/link'
import { headers } from 'next/headers'
import { getSchool, SCHOOLS, BASE_DOMAIN } from '@/lib/schools'
import { extractSubdomain } from '@/lib/utils'
import { School, BookOpen, ChevronLeft } from '@/components/icons'

export default function HomePage() {
  const host = headers().get('host') ?? ''
  const subdomain = extractSubdomain(host)
  const school = subdomain ? getSchool(subdomain) : null

  // وقتی روی ساب‌دامنه‌ایم، لندینگ ساده با لینک به دو بخش
  if (school) {
    return (
      <main className="container-page flex flex-1 flex-col justify-center py-16">
        <div className="animate-fadeUp mx-auto max-w-2xl text-center">
          <span className="chip mx-auto mb-6">{school.stage === 'elementary' ? 'ابتدایی' : school.stage === 'first' ? 'متوسطهٔ اول' : 'متوسطهٔ دوم'}</span>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            {school.titleFa}
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-400">{school.descriptionFa}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/classes" className="btn-primary">
              <BookOpen className="h-5 w-5" />
              کلاس‌ها
            </Link>
            <Link href="/teachers" className="btn-ghost">
              <School className="h-5 w-5" />
              معلمین
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
    )
  }

  // دامنهٔ اصلی → معرفی ۶ مدرسه
  return (
    <main className="container-page flex-1 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <span className="chip mx-auto mb-6">وب‌سایت رسمی</span>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          متوسطهٔ دوم پسرانهٔ چمران اهواز
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-400">
          وب‌سایت اختصاصی مدرسه — کلاس‌ها و معلمین، پایه‌های دهم تا دوازدهم.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SCHOOLS.map((s) => (
          <Link
            key={s.subdomain}
            href={`https://${s.domain}`}
            className="card group overflow-hidden p-0"
          >
            <div className={`h-1.5 w-full bg-gradient-to-r ${s.color}`} />
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold">{s.titleFa}</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{s.titleEn}</p>
                </div>
                <span className="chip">{s.stage === 'elementary' ? 'ابتدایی' : s.stage === 'first' ? 'اول' : 'دوم'}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{s.descriptionFa}</p>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                <code className="text-xs text-slate-500 dark:text-slate-400">{s.domain}</code>
                <span className="text-sm font-semibold text-school-600 group-hover:translate-x-[-4px] transition dark:text-school-400">
                  ورود ←
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-10 text-center text-xs text-slate-500 dark:text-slate-400">
        دامنهٔ اصلی: {BASE_DOMAIN}
      </p>
    </main>
  )
}
