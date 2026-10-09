/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // حذف هدر X-Powered-By (hardening آدیت 2026-10-09): انگشت‌نگاری نسخهٔ فریم‌ورک ارسال نشود
  poweredByHeader: false,
  images: {
    // اصلاح آدیت 2026-10-09 (F-001): بهینه‌ساز تصویر خاموش — هیچ <Image> استفاده نشده؛
    // این سطح حمله (RCE/DoS بدون احراز هویت در GHSA-2xp9-vwfh-vxw4) تا آپدیت Next بسته می‌شود
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: '**.supabase.in' },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, stale-while-revalidate=600',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
