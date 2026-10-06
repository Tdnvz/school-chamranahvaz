'use client'

import { useEffect, useState } from 'react'

/**
 * دکمهٔ تعویض حالت روشن/تاریک.
 * حالت در localStorage ذخیره می‌شود و اسکریپت inline در layout
 * پیش از رندر اول، کلاس dark را روی <html> اعمال می‌کند (بدون فلش).
 */
export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggle = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light')
    } catch {
      /* حالت ناشناس — نادیده گرفته می‌شود */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'تغییر به حالت روشن' : 'تغییر به حالت تاریک'}
      title={isDark ? 'حالت روشن' : 'حالت تاریک'}
      className="grid h-9 w-9 place-items-center rounded-xl text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-100 hover:text-school-600 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-800 dark:hover:text-school-400"
    >
      {isDark ? (
        // خورشید
        <svg {...svgProps} className="h-5 w-5">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        // ماه
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
