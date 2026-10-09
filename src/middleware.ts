import { NextResponse, type NextRequest } from 'next/server'
import { SUBDOMAINS, BASE_DOMAIN } from '@/lib/schools'
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth'

/**
 * تشخیص ساب‌دامنه از روی هاست:
 * ghjs.tdnvzgg66.shop  → ساب‌دامنهٔ معتبر
 * tdnvzgg66.shop       → دامنهٔ اصلی (لندینگ)
 *
 * محافظت پنل ادمین:
 * /admin و /api/admin (به‌جز login/logout) نشست معتبر می‌خواهند.
 */
export async function middleware(request: NextRequest) {
  const host = (request.headers.get('host') ?? '').replace(/:\d+$/, '').toLowerCase()
  const url = request.nextUrl.clone()
  const parts = host.split('.')
  const first = parts[0]
  const path = url.pathname

  // ---- محافظت پنل ادمین ----
  const isLoginApi = path === '/api/admin/login' || path === '/api/admin/logout'
  const isLoginPage = path === '/admin/login'
  const needsAuth =
    (path.startsWith('/admin') && !isLoginPage) ||
    (path.startsWith('/api/admin') && !isLoginApi)

  if (needsAuth) {
    const token = request.cookies.get(SESSION_COOKIE)?.value
    // نشست فقط برای ساب‌دامنهٔ جاری معتبر است (رفع F-004)
    const hostSub = SUBDOMAINS.includes(first) ? first : undefined
    const ok = await verifySessionToken(token, hostSub)
    if (!ok) {
      if (path.startsWith('/api/')) {
        return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
      }
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
  }

  // ---- تشخیص ساب‌دامنه ----
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
