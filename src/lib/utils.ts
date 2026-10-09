// توابع کمکی — بدون وابستگی خارجی

/** تبدیل ارقام لاتین به فارسی */
export function toPersianDigits(value: string | number): string {
  return String(value).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])
}

/** قالب‌بندی عدد با جداکنندهٔ هزارگان فارسی */
export function formatNumber(num: number): string {
  return toPersianDigits(new Intl.NumberFormat('fa-IR').format(num))
}

/** نمایش تاریخ فارسی (شمسی) */
export function formatDateFa(input: string | Date): string {
  const date = typeof input === 'string' ? new Date(input) : input
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  } catch {
    return date.toLocaleDateString('fa-IR')
  }
}

/** استخراج ساب‌دامنه از هاست */
export function extractSubdomain(host: string): string | null {
  const clean = host.replace(/:\d+$/, '').toLowerCase()
  const parts = clean.split('.')
  if (parts.length < 3) return null
  const candidate = parts[0]
  if (candidate === 'www' || candidate === 'app' || candidate === 'api' ||
      candidate === 'madrese' || candidate === 'panel') return null
  return candidate
}

/** حذف فاصله‌های اضافه و ساخت اسلاگ ساده */
export function slugify(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^؀-ۿa-zA-Z0-9-]/g, '')
    .replace(/-+/g, '-')
    .toLowerCase()
}

/** تعیین راست‌چین بودن زبان */
export function isRtl(locale: string): boolean {
  return locale.startsWith('fa')
}
