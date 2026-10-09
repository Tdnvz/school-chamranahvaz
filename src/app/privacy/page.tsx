import type { Metadata } from 'next'
import Link from 'next/link'
import { BASE_DOMAIN } from '@/lib/schools'

export const metadata: Metadata = {
  title: 'حریم خصوصی',
  description:
    'سیاست حریم خصوصی وب‌سایت متوسطهٔ دوم پسرانهٔ چمران اهواز — اینترنت کجا چه داده‌ای جمع می‌شود و چگونه استفاده می‌شود.',
}

export default function PrivacyPage() {
  return (
    <main className="container-page flex-1 py-12">
      <div className="mx-auto max-w-3xl">
        <span className="chip">قوانین</span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight">حریم خصوصی</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          آخرین به‌روزرسانی: مهر ۱۴۰۵ — این صفحه بر اساس کاری که این وب‌سایت واقعاً انجام می‌دهد نوشته شده است.
        </p>

        <div className="mt-8 space-y-8 text-sm leading-7 text-slate-700 dark:text-slate-300">
          <section>
            <h2 className="text-lg font-bold">۱. چه داده‌ای جمع می‌کنیم؟</h2>
            <p className="mt-2">
              این وب‌سایت <b>هیچ فرم تماس، ثبت‌نام یا جمع‌آوری داده از بازدیدکنندگان عادی ندارد</b>. تنها
              داده‌ای که ذخیره می‌شود، اطلاعاتی است که مدیر مدرسه در پنل مدیریت وارد می‌کند (فهرست کلاس‌ها و
              مشخصات معلمین همان مقطع) و روی همین سرور نگهداری می‌شود.
            </p>
            <p className="mt-2">
              مشخصات تماس معلمین (ایمیل و تلفن) فقط برای ارتباط اولیای امور و مراجعان با مدرسه نمایش داده
              می‌شود و از هیچ منبع شخص ثالثی جمع‌آوری نشده است.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold">۲. کوکی‌ها</h2>
            <p className="mt-2">
              این وب‌سایت فقط از کوکی‌های <b>ضروری</b> استفاده می‌کند:
            </p>
            <ul className="mt-2 list-disc space-y-1.5 pe-5">
              <li>
                <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800" dir="ltr">
                  chamran_admin
                </code>{' '}
                — کوکی نشست ورود مدیر مدرسه؛ فقط بعد از ورود به پنل مدیریت ساخته می‌شود، ۱۲ ساعته است و
                اطلاعات شخصی ندارد.
              </li>
              <li>
                <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800" dir="ltr">
                  theme
                </code>{' '}
                — ذخیرهٔ انتخاب روشن/تاریک شما در حافظهٔ مرورگر خودتان (localStorage)؛ به هیچ سروری ارسال
                نمی‌شود.
              </li>
            </ul>
            <p className="mt-2">
              هیچ کوکی تبلیغاتی، ردیابی یا شخص ثالثی استفاده نمی‌شود؛ به همین دلیل بنر رضایت کوکی نمایش داده
              نمی‌شود. برای جزئیات بیشتر صفحهٔ{' '}
              <Link href="/cookies" className="font-semibold text-school-600 underline dark:text-school-400">
                سیاست کوکی
              </Link>{' '}
              را ببینید.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold">۳. سرویس‌های شخص ثالث</h2>
            <ul className="mt-2 list-disc space-y-1.5 pe-5">
              <li>
                <b>Cloudflare Web Analytics</b> — آمار بازدید بدون کوکی و بدون جمع‌آوری دادهٔ شخصی (بدون
                انگشت‌نگاری کاربر). این سرویس مطابق اعلام Cloudflare مورد نیاز رضایت کوکی نیست.
              </li>
              <li>
                <b>Supabase</b> — زیرساخت اختیاری پایگاه داده؛ فقط در صورت فعال بودن، دادهٔ کلاس‌ها و
                معلمین در آن نگهداری می‌شود. داده‌ای از بازدیدکنندگان عادی دریافت یا ذخیره نمی‌شود.
              </li>
            </ul>
            <p className="mt-2">
              هیچ امبد یوتیوب، نقشه، پیکسل تبلیغاتی یا ویجت چت در این وب‌سایت وجود ندارد.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold">۴. امنیت داده</h2>
            <p className="mt-2">
              ارتباط با سایت از طریق HTTPS رمزنگاری می‌شود. رمز عبور پنل مدیریت فقط به‌صورت هش ذخیره می‌شود
              و نشست مدیر با کوکی امضاشده محافظت می‌شود.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold">۵. حقوق شما</h2>
            <p className="mt-2">
              چون هیچ دادهٔ شخصی از بازدیدکنندگان عادی جمع نمی‌شود، هیچ پروفایلی از شما ساخته نمی‌شود. اگر
              شما از معلمین هستید و مایل به حذف مشخصات تماس خود از سایت هستید، از طریق اطلاعات تماس موجود در
              فوتر با مدرسه در ارتباط باشید.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold">۶. تماس</h2>
            <p className="mt-2">
              برای هر پرسش دربارهٔ این سیاست، از اطلاعات تماس در فوتر استفاده کنید یا به{' '}
              <span dir="ltr">info@{BASE_DOMAIN}</span> ایمیل بزنید.
            </p>
          </section>
        </div>

        <div className="mt-10 flex gap-3 border-t border-slate-100 pt-6 dark:border-slate-800">
          <Link href="/" className="btn-ghost">بازگشت به خانه</Link>
          <Link href="/terms" className="btn-ghost">قوانین و مقررات</Link>
        </div>
      </div>
    </main>
  )
}
