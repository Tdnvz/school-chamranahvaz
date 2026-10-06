import { BASE_DOMAIN, SCHOOLS } from '@/lib/schools'

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="container-page grid gap-8 py-10 sm:grid-cols-3">
        <div>
          <h3 className="text-sm font-bold">مدارس چمران اهواز</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
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
                  className="text-sm text-slate-500 transition hover:text-school-600"
                >
                  {s.shortFa}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold">ارتباط</h3>
          <ul className="mt-3 space-y-1.5 text-sm text-slate-500">
            <li>اهواز، خیابان چمران</li>
            <li>۰۶۱-۱۲۳۴۵۶۷۸</li>
            <li>info@{BASE_DOMAIN}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-100 py-4">
        <p className="container-page text-center text-xs text-slate-400">
          © {new Date().getFullYear()} مدارس چمران اهواز — تمامی حقوق محفوظ است.
        </p>
      </div>
    </footer>
  )
}
