import Link from 'next/link'
import { BASE_DOMAIN, SCHOOLS } from '@/lib/schools'

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="container-page grid gap-8 py-10 sm:grid-cols-3">
        <div>
          <h3 className="text-sm font-bold">مدارس چمران اهواز</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            آموزش با کیفیت در مقاطع ابتدایی، متوسطهٔ اول و متوسطهٔ دوم،
            در دو بخش پسرانه و دخترانه.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold">بخش‌ها</h3>
          <ul className="mt-3 space-y-1.5">
            {SCHOOLS.map((s) => (
              <li key={s.subdomain}>
                <a
                  href={`https://${s.domain}`}
                  className="text-sm text-slate-500 transition hover:text-school-600 dark:text-slate-400 dark:hover:text-school-400"
                >
                  {s.shortFa}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold">ارتباط</h3>
          <ul className="mt-3 space-y-1.5 text-sm text-slate-500 dark:text-slate-400">
            <li>اهواز، خیابان چمران</li>
            <li>۰۶۱-۱۲۳۴۵۶۷۸</li>
            <li>info@{BASE_DOMAIN}</li>
          </ul>
          <Link
            href="/admin"
            className="mt-3 inline-block text-sm font-semibold text-school-600 transition hover:text-school-700 dark:text-school-400 dark:hover:text-school-300"
          >
            پنل مدیریت ←
          </Link>
        </div>
      </div>

      <div className="border-t border-slate-100 py-4 dark:border-slate-800">
        <p className="container-page text-center text-xs text-slate-400 dark:text-slate-500">
          © {new Date().getFullYear()} مدارس چمران اهواز — تمامی حقوق محفوظ است.
        </p>
      </div>
    </footer>
  )
}
