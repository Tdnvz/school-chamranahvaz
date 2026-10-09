import { NextResponse, type NextRequest } from 'next/server'
import {
  checkCredentials,
  createSessionToken,
  SESSION_COOKIE,
} from '@/lib/auth'
import { extractSubdomain } from '@/lib/utils'

/** POST /api/admin/login — ورود با نام کاربری و رمز عبور */
export async function POST(request: NextRequest) {
  let body: { username?: string; password?: string } = {}
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 })
  }

  const username = (body.username ?? '').trim()
  const password = body.password ?? ''

  if (!username || !password) {
    return NextResponse.json({ error: 'missing_credentials' }, { status: 400 })
  }

  const ok = await checkCredentials(username, password)
  if (!ok) {
    return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 })
  }

  // نشست مقید به ساب‌دامنهٔ مدرسهٔ جاری (رفع F-004)
  const sub = extractSubdomain((request.headers.get('host') ?? ''))
  const token = await createSessionToken(sub ?? '')
  const isSecure = request.nextUrl.protocol === 'https:'
  const res = NextResponse.json({ ok: true })
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isSecure,
    path: '/',
    maxAge: 60 * 60 * 12,
  })
  return res
}
