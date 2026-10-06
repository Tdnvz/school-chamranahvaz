// آیکون‌های سبک (SVG) — بدون وابستگی خارجی
type P = { className?: string }

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  viewBox: '0 0 24 24',
}

export const School = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M12 3 3 8l9 5 9-5-9-5Z" />
    <path d="M6 10.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-5.5" />
  </svg>
)

export const BookOpen = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M12 6.5C10.5 5 8.5 4.5 4 4.5v13c4.5 0 6.5.5 8 2 1.5-1.5 3.5-2 8-2v-13c-4.5 0-6.5.5-8 2Z" />
    <path d="M12 6.5v14" />
  </svg>
)

export const MagnifyingGlass = ({ className }: P) => (
  <svg {...base} className={className}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
)

export const ChevronLeft = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="m14 6-6 6 6 6" />
  </svg>
)

export const ChevronRight = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="m10 6 6 6-6 6" />
  </svg>
)

export const Users = ({ className }: P) => (
  <svg {...base} className={className}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 19c.6-3 2.8-4.5 5.5-4.5S14 16 14.6 19" />
    <path d="M16 5.5a3 3 0 0 1 0 5.8" />
    <path d="M17.5 14.5c2 .7 3.2 2.2 3.6 4.5" />
  </svg>
)

export const Envelope = ({ className }: P) => (
  <svg {...base} className={className}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3.5 7 8.5 6 8.5-6" />
  </svg>
)

export const Phone = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5L14 12.5 18 14v3a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 4 6.2 2 2 0 0 1 5 4Z" />
  </svg>
)

export const Clock = ({ className }: P) => (
  <svg {...base} className={className}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 1.8" />
  </svg>
)

export const GraduationCap = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M2.5 9 12 4.5 21.5 9 12 13.5 2.5 9Z" />
    <path d="M6.5 11v4.5c0 1.4 2.5 2.5 5.5 2.5s5.5-1.1 5.5-2.5V11" />
  </svg>
)
