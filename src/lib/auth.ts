// احراز هویت پنل ادمین — فقط سمت سرور (Node و Edge middleware)
// رمز خام هرگز در کد/مخزن ذخیره نمی‌شود؛ فقط هش SHA-256.

const SESSION_COOKIE = 'chamran_admin'
const SESSION_TTL_SECONDS = 60 * 60 * 12 // ۱۲ ساعت

// sha256("Tahanvz00") — هم نام کاربری و هم رمز عبور
const CREDENTIAL_HASH = '3926b128ceb027ac5f5aad0b66ded6464977d8cef7060c6f8e0763eda45a6066'

const SECRET =
  process.env.ADMIN_SESSION_SECRET || 'chamran-school-session-secret-change-me'

const enc = new TextEncoder()

async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', enc.encode(text))
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

async function hmacHex(text: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(text))
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/** بررسی نام کاربری و رمز عبور (مقایسهٔ هش) */
export async function checkCredentials(
  username: string,
  password: string,
): Promise<boolean> {
  const [u, p] = await Promise.all([sha256Hex(username), sha256Hex(password)])
  return u === CREDENTIAL_HASH && p === CREDENTIAL_HASH
}

/** ساخت توکن نشست امضاشده: `<exp>.<hmac>` */
export async function createSessionToken(): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  const sig = await hmacHex(`admin:${exp}`)
  return `${exp}.${sig}`
}

/** اعتبارسنجی توکن نشست (انقضا + امضا) */
export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false
  const [expStr, sig] = token.split('.')
  const exp = Number(expStr)
  if (!expStr || !sig || !Number.isFinite(exp)) return false
  if (exp * 1000 < Date.now()) return false
  const expected = await hmacHex(`admin:${exp}`)
  // مقایسهٔ زمان‌ثابت
  if (expected.length !== sig.length) return false
  let diff = 0
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i)
  return diff === 0
}

export { SESSION_COOKIE }
