import { NextResponse, type NextRequest } from 'next/server'
import { SUBDOMAINS, BASE_DOMAIN } from '@/lib/schools'

/**
 * تشخیص ساب‌دامنه از روی هاست:
 * ghjs.tdnvzgg66.shop  → ساب‌دامنهٔ معتبر
 * tdnvzgg66.shop       → دامنهٔ اصلی (لندینگ)
 */
export function middleware(request: NextRequest) {
  const host = (request.headers.get('host') ?? '').replace(/:\d+$/, '').toLowerCase()
  const url = request.nextUrl.clone()
  const parts = host.split('.')
  const first = parts[0]

  // ساب‌دامنهٔ معتبر → ادامه با هدر سفارشی
  if (SUBDOMAINS.includes(first)) {
    const headers = new Headers(request.headers)
    headers.set('x-school-subdomain', first)
    return NextResponse.next({ request: { headers } })
  }

  // دامنهٔ اصلی یا www → لندینگ
  const isBase =
    host === BASE_DOMAIN || host === `www.${BASE_DOMAIN}` || first === 'localhost' || first === '127'

  if (isBase) {
    return NextResponse.next()
  }

  // ساب‌دامنهٔ ناشناخته → صفحهٔ ۴۰۴
  if (parts.length > 2 && first !== 'www') {
    url.pathname = '/404'
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
}
