'use client'

import { useEffect, useMemo, useState } from 'react'
import type { TeacherRow } from '@/lib/data'
import { toPersianDigits } from '@/lib/utils'
import { MagnifyingGlass, Envelope, Phone, Clock, GraduationCap } from './icons'

export default function TeachersExplorer({ initialTeachers }: { initialTeachers: TeacherRow[] }) {
  const [q, setQ] = useState('')
  const [subject, setSubject] = useState('all')
  const [rows, setRows] = useState<TeacherRow[]>(initialTeachers)

  useEffect(() => setRows(initialTeachers), [initialTeachers])

  const subjects = useMemo(
    () => Array.from(new Set(rows.map((t) => t.subject))).sort(),
    [rows],
  )

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    return rows.filter((t) => {
      const okSubject = subject === 'all' || t.subject === subject
      const okTerm =
        !term ||
        t.name.toLowerCase().includes(term) ||
        t.subject.toLowerCase().includes(term) ||
        t.title.toLowerCase().includes(term) ||
        t.bio.toLowerCase().includes(term)
      return okSubject && okTerm
    })
  }, [rows, q, subject])

  const initials = (name: string) =>
    name.split(' ').map((n) => n[0]).slice(0, 2).join('')

  return (
    <div>
      {/* جستجو و فیلتر درس */}
      <div className="card p-4 sm:p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_220px_180px]">
          <div className="relative">
            <MagnifyingGlass className="pointer-events-none absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="جستجوی نام یا درس معلم…"
              className="input pr-11"
              aria-label="جستجوی معلم"
            />
          </div>

          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="input"
            aria-label="فیلتر درس"
          >
            <option value="all">همهٔ درس‌ها</option>
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => {
              setQ('')
              setSubject('all')
            }}
            className="btn-ghost w-full"
          >
            پاک‌کردن
          </button>
        </div>

        <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          نمایش {toPersianDigits(filtered.length)} از {toPersianDigits(rows.length)} معلم
        </div>
      </div>

      {/* کارت‌های معلم */}
      {filtered.length > 0 ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((t) => (
            <article key={t.id} className="card animate-fadeUp p-5 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-school-500 to-indigo-600 text-lg font-bold text-white">
                {initials(t.name)}
              </div>
              <h3 className="mt-3 text-base font-bold">{t.name}</h3>
              <p className="text-sm font-semibold text-school-600">{t.title}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t.subject}</p>
              <p className="mt-3 text-xs leading-5 text-slate-600 line-clamp-3 dark:text-slate-400">{t.bio}</p>

              <ul className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-right text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <Envelope className="h-4 w-4 shrink-0 text-school-500" />
                  <span className="truncate">{t.email}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-school-500" />
                  <span>{t.phone}</span>
                </li>
                {t.availability && (
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4 shrink-0 text-school-500" />
                    <span>{t.availability}</span>
                  </li>
                )}
                <li className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 shrink-0 text-school-500" />
                  <span>چمران اهواز</span>
                </li>
              </ul>
            </article>
          ))}
        </div>
      ) : (
        <div className="card mt-6 p-12 text-center text-slate-500 dark:text-slate-400">
          معلمی با این مشخصات پیدا نشد.
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            فهرست معلمین توسط مدیر مدرسه به‌روزرسانی می‌شود — برای موارد فوری از اطلاعات تماس در فوتر استفاده کنید.
          </p>
        </div>
      )}
    </div>
  )
}
