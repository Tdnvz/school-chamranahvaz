'use client'

import { useMemo, useState, useEffect } from 'react'
import type { ClassRow } from '@/lib/data'
import type { School } from '@/lib/schools'
import { GRADE_LABELS, STAGE_GRADES } from '@/lib/schools'
import { toPersianDigits, formatNumber } from '@/lib/utils'
import { MagnifyingGlass, Users, GraduationCap } from './icons'

const PAGE_SIZE = 12

export default function ClassesExplorer({
  initialClasses,
  school,
}: {
  initialClasses: ClassRow[]
  school: School
}) {
  const [q, setQ] = useState('')
  const [grade, setGrade] = useState<string>('all')
  const [page, setPage] = useState(1)

  const [rows, setRows] = useState<ClassRow[]>(initialClasses)

  // داده در صورت تغییر لحظه‌ای (Realtime) به‌روز می‌شود
  useEffect(() => {
    setRows(initialClasses)
    setPage(1)
  }, [initialClasses])

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    return rows.filter((c) => {
      const okGrade = grade === 'all' || c.grade === grade
      const okTerm =
        !term ||
        c.name.toLowerCase().includes(term) ||
        (GRADE_LABELS[c.grade] ?? '').includes(term) ||
        (c.track ?? '').includes(term) ||
        (c.gender === 'boys' ? 'پسرانه' : 'دخترانه').includes(term)
      return okGrade && okTerm
    })
  }, [rows, q, grade])

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, pages)
  const slice = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

  return (
    <div>
      {/* ابزارهای جستجو و فیلتر */}
      <div className="card p-4 sm:p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_200px_200px]">
          <div className="relative">
            <MagnifyingGlass className="pointer-events-none absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value)
                setPage(1)
              }}
              placeholder="جستجوی نام کلاس یا مقطع…"
              className="input pr-11"
              aria-label="جستجوی کلاس"
            />
          </div>

          <select
            value={grade}
            onChange={(e) => {
              setGrade(e.target.value)
              setPage(1)
            }}
            className="input"
            aria-label="فیلتر پایه"
          >
            <option value="all">همهٔ پایه‌ها</option>
            {STAGE_GRADES[school.stage].map((g) => (
              <option key={g} value={g}>{GRADE_LABELS[g]}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => {
              setQ('')
              setGrade('all')
              setPage(1)
            }}
            className="btn-ghost w-full"
          >
            پاک‌کردن فیلترها
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
          <span>
            نمایش {toPersianDigits(slice.length)} از {toPersianDigits(filtered.length)} کلاس
          </span>
          <span className="chip">صفحهٔ {toPersianDigits(current)} از {toPersianDigits(pages)}</span>
        </div>
      </div>

      {/* کارت‌های کلاس */}
      {slice.length > 0 ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {slice.map((c) => (
            <article key={c.id} className="card animate-fadeUp p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-bold">{c.name}</h3>
                <span className="chip">{GRADE_LABELS[c.grade] ?? c.grade}</span>
              </div>
              <dl className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-school-500" />
                  <dt className="sr-only">مقطع</dt>
                  <dd>{GRADE_LABELS[c.grade] ?? c.grade} • کلاس {toPersianDigits(c.classNo)}{c.track ? ` • ${c.track}` : ''}</dd>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-school-500" />
                  <dt className="sr-only">ظرفیت</dt>
                  <dd>ظرفیت: {formatNumber(c.capacity)} نفر</dd>
                </div>
              </dl>
              <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                {c.gender === 'boys' ? 'پسرانه' : 'دخترانه'}
                {c.teacher_id ? ' • معلم تعیین‌شده' : ' • بدون معلم'}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="card mt-6 p-12 text-center text-slate-500 dark:text-slate-400">
          نتیجه‌ای پیدا نشد. عبارت دیگری را امتحان کنید.
        </div>
      )}

      {/* صفحه‌بندی */}
      {pages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            className="btn-ghost"
            disabled={current <= 1}
            onClick={() => setPage(current - 1)}
            aria-label="صفحهٔ قبلی"
          >
            قبلی
          </button>
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              aria-label={`رفتن به صفحهٔ ${p}`}
              aria-current={p === current ? 'page' : undefined}
              className={
                p === current
                  ? 'rounded-xl bg-school-600 px-3.5 py-2 text-sm font-semibold text-white'
                  : 'rounded-xl bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-700'
              }
            >
              {toPersianDigits(p)}
            </button>
          ))}
          <button
            className="btn-ghost"
            disabled={current >= pages}
            onClick={() => setPage(current + 1)}
            aria-label="صفحهٔ بعدی"
          >
            بعدی
          </button>
        </div>
      )}
    </div>
  )
}
