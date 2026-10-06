import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let client: SupabaseClient | null = null

/**
 * کلاینت Supabase (اختیاری).
 * اگر متغیرهای محیطی تنظیم نشده باشند، صفر برمی‌گرداند و لایهٔ داده
 * از داده‌های نمونهٔ داخلی استفاده می‌کند تا سایت همیشه بالا بماند.
 */
export function getSupabase(): SupabaseClient | null {
  if (!url || !anonKey) return null
  if (!client) {
    client = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }
  return client
}

export function isSupabaseConfigured(): boolean {
  return Boolean(url && anonKey)
}
