'use client'

import { useCallback, useEffect, useState } from 'react'

const BG_DARK = '#0b1120'
const BG_LIGHT = '#f6f8fb'

/** رنگ نوار مرورگر (استاتوس‌بار iOS / نوار آدرس اندروید) را با تم سایت هم‌رنگ می‌کند */
function syncBrowserChrome(isDark: boolean) {
  try {
    let m = document.querySelector('meta[name="theme-color"]')
    if (!m) {
      m = document.createElement('meta')
      m.setAttribute('name', 'theme-color')
      document.head.appendChild(m)
    }
    m.setAttribute('content', isDark ? BG_DARK : BG_LIGHT)
  } catch {
    /* نادیده گرفته می‌شود */
  }
}

/**
 * دکمهٔ تعویض حالت روشن/تاریک.
 * - تم در localStorage ذخیره می‌شود و اسکریپت inline در layout پیش از رندر اول اعمالش می‌کند.
 * - رنگ نوار مرورگر موبایل هم با تم هم‌رنگ می‌شود (رفع سیاه‌ماندن نوار بالا در حالت روز).
 * - اندازهٔ دکمه استاندارد هدف لمسی (۴۴px) — مناسب iOS/Android/دسکتاپ.
 */
export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const dark = document.documentElement.classList.contains('dark')
    setIsDark(dark)
    setMounted(true)
    syncBrowserChrome(dark)
  }, [])

  const toggle = useCallback(() => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    syncBrowserChrome(next)
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light')
    } catch {
      /* حالت ناشناس — نادیده گرفته می‌شود */
    }
  }, [isDark])

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'تغییر به حالت روشن' : 'تغییر به حالت تاریک'}
      aria-pressed={isDark}
      title={isDark ? 'حالت روشن' : 'حالت تاریک'}
      suppressHydrationWarning
      className="tap-target grid shrink-0 place-items-center rounded-xl bg-white text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-100 hover:text-school-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-school-500 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-700 dark:hover:text-school-400"
    >
      {!mounted ? (
        // جای‌گیر ثابت تا از جابه‌جایی چیدمان جلوگیری شود
        <span className="h-5 w-5" />
      ) : isDark ? (
        // خورشید — نمایش در حالت تاریک (برای رفتن به روشن)
        <svg {...svgProps} className="h-5 w-5">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        // ماه — نمایش در حالت روشن (برای رفتن به تاریک)
        <svg {...svgProps} className="h-5 w-5">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
        </svg>
      )}
    </button>
  )
}

const svgProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  viewBox: '0 0 24 24',
}
