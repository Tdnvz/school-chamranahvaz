import type { Metadata } from 'next'
import Link from 'next/link'
import { BASE_DOMAIN } from '@/lib/schools'

export const metadata: Metadata = {
  title: 'قوانین و مقررات',
  description:
    'قوانین و مقررات استفاده از وب‌سایت مدارس چمران اهواز — شرایط استفاده از اطلاعات سایت و پنل مدیریت.',
}

export default function TermsPage() {
  return (
    <main className="container-page flex-1 py-12">
      <div className="mx-auto max-w-3xl">
        <span className="chip">قوانین</span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight">قوانین و مقررات</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          آخرین به‌روزرسانی: مهر ۱۴۰۵ — با استفاده از این وب‌سایت، این قوانین را می‌پذیرید.
        </p>

        <div className="mt-8 space-y-8 text-sm leading-7 text-slate-700 dark:text-slate-300">
          <section>
            <h2 className="text-lg font-bold">۱. دربارهٔ این وب‌سایت</h2>
            <p className="mt-2">
              این وب‌سایت برای انتشار فهرست کلاس‌ها و معلمین مدارس چمران اهواز در شش بخش (دبستان، متوسطهٔ
              اول و متوسطهٔ دوم — پسرانه و دخترانه) ساخته شده است. محتوای هر بخش فقط از طریق پنل مدیریت همان
              بخش و توسط مدیر مدرسه به‌روزرسانی می‌شود.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold">۲. استفادهٔ مجاز</h2>
            <ul className="mt-2 list-disc space-y-1.5 pe-5">
              <li>مشاهدهٔ فهرست کلاس‌ها و معلمین برای اولیای امور و مراجعان، آزاد است.</li>
              <li>کپی یا بازنشر اطلاعات سایت برای مقاصد غیرتجاری با ذکر منبع، مجاز است.</li>
              <li>هرگونه تلاش برای نفوذ به پنل مدیریت، دسترسی غیرمجاز به داده‌ها یا اختلال در سرویس، ممنوع است.</li>
              <li>استفاده از اطلاعات تماس موجود در سایت برای ارسال تبلیغ یا پیام انبوه، ممنوع است.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold">۳. پنل مدیریت</h2>
            <p className="mt-2">
              دسترسی به پنل مدیریت هر بخش فقط برای مدیر همان مدرسه است. مسئولیت صحت اطلاعاتی که در پنل ثبت
              می‌شود (نام کلاس‌ها، ظرفیت، مشخصات معلمین و اطلاعات تماس) با مدیر همان مدرسه است. هر مدرسه فقط
              به دادهٔ همان مقطع و جنسیت خودش دسترسی دارد.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold">۴. صحت اطلاعات</h2>
            <p className="mt-2">
              اطلاعات این سایت توسط مدیر مدارس به‌روزرسانی می‌شود، اما ممکن است در بازهٔ کوتاهی بین تغییر
              واقعی مدرسه و به‌روزرسانی سایت، اختلاف وجود داشته باشد. برای موارد مهم (ثبت‌نام، ظرفیت کلاس‌ها)
              با مدرسه تماس بگیرید.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold">۵. فروش و پرداخت</h2>
            <p className="mt-2">
              در این وب‌سایت <b>هیچ کالا یا خدماتی فروخته نمی‌شود و هیچ پرداخت آنلاینی دریافت نمی‌شود</b>؛
              به همین دلیل شرایط بازگشت پول موضوعیت ندارد. اگر در آینده بخشی از سایت خدمات قابل فروش ارائه
              دهد، این صفحه پیش از شروع فروش به‌روزرسانی خواهد شد.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold">۶. مالکیت معنوی</h2>
            <p className="mt-2">
              نام و محتوای مدارس چمران اهواز متعلق به همان مجموعه است. قالب وب‌سایت، کد و طراحی آن متعلق به
              مالک سایت است. فونت وزیرمتن با مجوز آزاد (OFL) استفاده شده است.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold">۷. تغییر قوانین</h2>
            <p className="mt-2">
              این قوانین ممکن است به‌روزرسانی شود؛ نسخهٔ جدید با تغییر تاریخ بالای همین صفحه منتشر می‌شود.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold">۸. تماس</h2>
            <p className="mt-2">
              برای هر پرسش دربارهٔ این قوانین، از اطلاعات تماس در فوتر استفاده کنید یا به{' '}
              <span dir="ltr">info@{BASE_DOMAIN}</span> ایمیل بزنید.
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
