// احراز هویت پنل ادمین — فقط سمت سرور (Node و Edge middleware)
// امنیت (اصلاح آدیت 2026-10-09):
//  - کلید امضای نشست فقط از env خوانده می‌شود؛ بدون fallback (نبودِ آن = رد کل نشست‌ها)
//  - رمز ادمین با scrypt salted از env — هش/رمز خام هرگز در مخزن نیست
//  - نشست به ساب‌دامنهٔ مدرسه مقید است (مقطع جاری در توکن + verify با Host)

const SESSION_COOKIE = 'chamran_admin'
const SESSION_TTL_SECONDS = 60 * 60 * 12 // ۱۲ ساعت

// کلید امضای نشست — بدون fallback (رفع F-003)
const SECRET = process.env.ADMIN_SESSION_SECRET

// اعتبارنامهٔ ادمین — هش scrypt salted از env (رفع F-002)
const PASSWORD_HASH_B64 = process.env.ADMIN_PASSWORD_HASH || ''
const PASSWORD_SALT_B64 = process.env.ADMIN_PASSWORD_SALT || ''

const enc = new TextEncoder()

async function hmacHex(text: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(SECRET ?? ''),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(text))
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function b64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

/** تأیید زمان‌ثابت دو رشتهٔ hex */
function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

/**
 * بررسی نام کاربری و رمز عبور.
 * - کلید امضای نشست تنظیم نشده → همیشه رد (fail closed، رفع F-003)
 * - رمز: scrypt salted — مقایسهٔ زمان‌ثابت (رفع F-002)
 */
export async function checkCredentials(
  username: string,
  password: string,
): Promise<boolean> {
  if (!SECRET) return false
  if (!PASSWORD_HASH_B64 || !PASSWORD_SALT_B64) return false
  const expectedUser = process.env.ADMIN_USERNAME ?? ''
  if (!expectedUser || username !== expectedUser) return false

  // scrypt در runtime Node — برای Edge (middleware) این تابع صدا زده نمی‌شود
  try {
    const { scryptSync, timingSafeEqual } = await import('crypto')
    const salt = b64ToBytes(PASSWORD_SALT_B64)
    const expectedHash = b64ToBytes(PASSWORD_HASH_B64)
    const actual = scryptSync(password, salt, expectedHash.length)
    return timingSafeEqual(actual, expectedHash)
  } catch {
    return false
  }
}

/** ساخت توکن نشست امضاشده: `<school>.<exp>.<hmac>` — مقید به ساب‌دامنه (رفع F-004) */
export async function createSessionToken(school: string): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  const sig = await hmacHex(`admin:${school}:${exp}`)
  return `${school}.${exp}.${sig}`
}

/**
 * اعتبارسنجی توکن نشست (ساب‌دامنه + انقضا + امضا).
 * hostSub = ساب‌دامنهٔ جاری از Host header — توکن فقط برای همان مدرسه معتبر است.
 */
export async function verifySessionToken(
  token: string | undefined,
  hostSub?: string,
): Promise<boolean> {
  if (!token || !SECRET) return false
  const parts = token.split('.')
  if (parts.length !== 3) return false
  const [school, expStr, sig] = parts
  const exp = Number(expStr)
  if (!school || !expStr || !sig || !Number.isFinite(exp)) return false
  if (exp * 1000 < Date.now()) return false
  // نشست فقط برای ساب‌دامنهٔ صادرشده معتبر است (رفع F-004)
  if (hostSub && school !== hostSub) return false
  const expected = await hmacHex(`admin:${school}:${exp}`)
  return timingSafeEqualHex(expected, sig)
}

export { SESSION_COOKIE }
