import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="container-page flex flex-1 flex-col items-center justify-center py-24 text-center">
      <div className="text-7xl font-extrabold text-slate-200 dark:text-slate-800">۴۰۴</div>
      <h1 className="mt-4 text-2xl font-bold">صفحه پیدا نشد</h1>
      <p className="mt-2 max-w-md text-slate-600 dark:text-slate-400">
        آدرس واردشده معتبر نیست یا ساب‌دامنهٔ موردنظر در سامانهٔ مدارس چمران ثبت نشده است.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/classes" className="btn-primary">کلاس‌ها</Link>
        <Link href="/teachers" className="btn-ghost">معلمین</Link>
      </div>
    </main>
  )
}
