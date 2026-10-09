import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'سیاست کوکی',
  description:
    'سیاست کوکی وب‌سایت متوسطهٔ دوم پسرانهٔ چمران اهواز — فهرست کوکی‌هایی که این سایت استفاده می‌کند و توضیح بنر رضایت.',
}

export default function CookiesPage() {
  return (
    <main className="container-page flex-1 py-12">
      <div className="mx-auto max-w-3xl">
        <span className="chip">قوانین</span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight">سیاست کوکی</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          آخرین به‌روزرسانی: مهر ۱۴۰۵
        </p>

        <div className="mt-8 space-y-8 text-sm leading-7 text-slate-700 dark:text-slate-300">
          <section>
            <h2 className="text-lg font-bold">چرا بنر رضایت کوکی نمی‌بینید؟</h2>
            <p className="mt-2">
              بنر رضایت کوکی (مطابق GDPR اروپا و قانون مشابه کشورها) زمانی لازم است که سایت کوکی{' '}
              <b>غیرضروری</b> — تبلیغاتی، ردیابی یا شخص ثالث — روی دستگاه شما بگذارد. این وب‌سایت هیچ کوکی
              غیرضروری استفاده نمی‌کند، به همین دلیل بنر رضایت نمایش داده نمی‌شود و نیازی به رضایت شما برای
              کارکرد سایت نیست.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold">کوکی‌های این سایت</h2>
            <div className="mt-3 overflow-x-auto">
              <table className="card w-full min-w-[560px] p-0 text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-right text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                    <th className="p-4 font-bold">نام</th>
                    <th className="p-4 font-bold">کاربرد</th>
                    <th className="p-4 font-bold">مدت</th>
                    <th className="p-4 font-bold">نوع</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100 last:border-0 dark:border-slate-800/70">
                    <td className="p-4 font-bold" dir="ltr">chamran_admin</td>
                    <td className="p-4">نشست ورود مدیر مدرسه — فقط بعد از ورود به پنل مدیریت ساخته می‌شود</td>
                    <td className="p-4">۱۲ ساعت</td>
                    <td className="p-4">ضروری</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3">
              این کوکی اطلاعاتی شخصی ندارد (فقط شناسهٔ تصادفی امضاشده) و بدون ورود به پنل مدیریت اصلاً ساخته
              نمی‌شود.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold">حافظهٔ مرورگر (localStorage)</h2>
            <p className="mt-2">
              یک مورد در localStorage مرورگر خودتان ذخیره می‌شود (نه کوکی است و به سرور ارسال نمی‌شود):
            </p>
            <ul className="mt-2 list-disc space-y-1.5 pe-5">
              <li>
                <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800" dir="ltr">
                  theme
                </code>{' '}
                — انتخاب روشن/تاریک شما، تا دفعهٔ بعد که وارد سایت می‌شوید حفظ شود.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold">آنالیتیکس</h2>
            <p className="mt-2">
              آمار بازدید با <b>Cloudflare Web Analytics</b> جمع می‌شود که بدون کوکی و بدون انگشت‌نگاری
              کاربر کار می‌کند؛ آمار تجمیعی دارد و پروفایل کاربری نمی‌سازد.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold">حذف کوکی‌ها</h2>
            <p className="mt-2">
              می‌توانید در هر زمان از تنظیمات مرورگر خود، کوکی‌ها و دادهٔ سایت را پاک کنید — سایت بدون هیچ
              کوکی‌ای هم به‌درستی کار می‌کند.
            </p>
          </section>
        </div>

        <div className="mt-10 flex gap-3 border-t border-slate-100 pt-6 dark:border-slate-800">
          <Link href="/" className="btn-ghost">بازگشت به خانه</Link>
          <Link href="/privacy" className="btn-ghost">حریم خصوصی</Link>
        </div>
      </div>
    </main>
  )
}
