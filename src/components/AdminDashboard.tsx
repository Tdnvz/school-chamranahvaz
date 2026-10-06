'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ClassRow, TeacherRow } from '@/lib/data'
import type { School } from '@/lib/schools'
import { GRADE_LABELS, STAGE_GRADES, STAGE_LABELS, TRACKS } from '@/lib/schools'
import { toPersianDigits } from '@/lib/utils'
import { Plus, Pencil, Trash, Lock } from './admin-icons'

type Tab = 'classes' | 'teachers'

const EMPTY_CLASS = { grade: '', classNo: 1, track: '', capacity: 25 }
const EMPTY_TEACHER = { name: '', subject: '', title: 'معلم پایه', email: '', phone: '', bio: '' }

export default function AdminDashboard({
  school,
  initialClasses,
  initialTeachers,
}: {
  school: School
  initialClasses: ClassRow[]
  initialTeachers: TeacherRow[]
}) {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('classes')
  const [classes, setClasses] = useState<ClassRow[]>(initialClasses)
  const [teachers, setTeachers] = useState<TeacherRow[]>(initialTeachers)

  // پایه‌های مجاز: فقط پایه‌های مقطع همین مدرسه
  const stageGrades = STAGE_GRADES[school.stage]
  const isSecond = school.stage === 'second'

  const [clsForm, setClsForm] = useState<{
    grade: string
    classNo: number
    track: string
    capacity: number
  }>({
    ...EMPTY_CLASS,
    grade: stageGrades[0],
  })
  const [clsEditId, setClsEditId] = useState<string | null>(null)
  const [tchForm, setTchForm] = useState(EMPTY_TEACHER)
  const [tchEditId, setTchEditId] = useState<string | null>(null)

  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null)

  function notify(kind: 'ok' | 'err', text: string) {
    setMsg({ kind, text })
    setTimeout(() => setMsg(null), 3500)
  }

  async function callApi(path: string, payload: unknown) {
    setBusy(true)
    try {
      const res = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'خطای ناشناخته')
      return data
    } finally {
      setBusy(false)
    }
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.replace('/admin/login')
    router.refresh()
  }

  /* ---------------- کلاس‌ها ---------------- */

  async function submitClass(e: React.FormEvent) {
    e.preventDefault()
    if (!clsForm.grade) return notify('err', 'پایه را انتخاب کنید.')
    if (isSecond && !clsForm.track.trim())
      return notify('err', 'برای متوسطهٔ دوم رشته را انتخاب کنید.')
    try {
      const data = await callApi('/api/admin/classes', {
        action: clsEditId ? 'update' : 'create',
        id: clsEditId ?? undefined,
        class: {
          grade: clsForm.grade,
          classNo: Number(clsForm.classNo),
          track: isSecond ? clsForm.track : null,
          capacity: Number(clsForm.capacity),
        },
      })
      setClasses(data.classes)
      setClsForm({ ...EMPTY_CLASS, grade: stageGrades[0] })
      setClsEditId(null)
      notify('ok', clsEditId ? 'کلاس به‌روزرسانی شد.' : 'کلاس اضافه شد.')
      router.refresh()
    } catch (err) {
      const text =
        err instanceof Error && err.message === 'duplicate_class'
          ? 'این کلاس (پایه + شماره + رشته) قبلاً ثبت شده است.'
          : err instanceof Error && err.message === 'grade_not_in_stage'
            ? 'این پایه به مقطع همین مدرسه تعلق ندارد.'
            : err instanceof Error
              ? err.message
              : 'خطا در ذخیره‌سازی'
      notify('err', text)
    }
  }

  async function deleteClass(id: string) {
    if (!confirm('این کلاس حذف شود؟')) return
    try {
      const data = await callApi('/api/admin/classes', { action: 'delete', id })
      setClasses(data.classes)
      notify('ok', 'کلاس حذف شد.')
      router.refresh()
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'خطا در حذف')
    }
  }

  function editClass(c: ClassRow) {
    setClsEditId(c.id)
    setClsForm({
      grade: c.grade,
      classNo: c.classNo,
      track: c.track ?? '',
      capacity: c.capacity,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /* ---------------- معلمین ---------------- */

  async function submitTeacher(e: React.FormEvent) {
    e.preventDefault()
    if (!tchForm.name.trim()) return notify('err', 'نام معلم را وارد کنید.')
    try {
      const data = await callApi('/api/admin/teachers', {
        action: tchEditId ? 'update' : 'create',
        id: tchEditId ?? undefined,
        teacher: tchForm,
      })
      setTeachers(data.teachers)
      setTchForm(EMPTY_TEACHER)
      setTchEditId(null)
      notify('ok', tchEditId ? 'مشخصات معلم به‌روزرسانی شد.' : 'معلم اضافه شد.')
      router.refresh()
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'خطا در ذخیره‌سازی')
    }
  }

  async function deleteTeacher(id: string) {
    if (!confirm('این معلم حذف شود؟')) return
    try {
      const data = await callApi('/api/admin/teachers', { action: 'delete', id })
      setTeachers(data.teachers)
      notify('ok', 'معلم حذف شد.')
      router.refresh()
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'خطا در حذف')
    }
  }

  function editTeacher(t: TeacherRow) {
    setTchEditId(t.id)
    setTchForm({
      name: t.name,
      subject: t.subject,
      title: t.title,
      email: t.email,
      phone: t.phone,
      bio: t.bio,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /* ---------------- رندر ---------------- */

  return (
    <main className="container-page flex-1 py-10">
      {/* هدر پنل */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="chip">پنل مدیریت — {school.shortFa}</span>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
            مدیریت کلاس‌ها و معلمین
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            تغییرات بلافاصله در سایت همین مقطع اعمال می‌شود.
          </p>
        </div>
        <div className="flex gap-2">
          <a href="/" className="btn-ghost">مشاهدهٔ سایت</a>
          <button onClick={logout} className="btn-primary">
            <Lock className="h-4 w-4" /> خروج
          </button>
        </div>
      </div>

      {msg && (
        <p
          className={`mt-4 rounded-xl px-4 py-2.5 text-sm font-semibold ${
            msg.kind === 'ok'
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
              : 'bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400'
          }`}
        >
          {msg.text}
        </p>
      )}

      {/* تب‌ها */}
      <div className="mt-6 flex gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
        <button
          onClick={() => setTab('classes')}
          className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
            tab === 'classes'
              ? 'bg-school-600 text-white'
              : 'bg-white text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700'
          }`}
        >
          کلاس‌ها ({toPersianDigits(classes.length)})
        </button>
        <button
          onClick={() => setTab('teachers')}
          className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
            tab === 'teachers'
              ? 'bg-school-600 text-white'
              : 'bg-white text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700'
          }`}
        >
          معلمین ({toPersianDigits(teachers.length)})
        </button>
      </div>

      {/* ---- فرم کلاس ---- */}
      {tab === 'classes' && (
        <form onSubmit={submitClass} className="card mt-6 grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-6">
          <div>
            <label className="mb-1 block text-xs font-semibold">پایه</label>
            <select
              className="input"
              value={clsForm.grade}
              onChange={(e) => setClsForm({ ...clsForm, grade: e.target.value })}
            >
              {stageGrades.map((g) => (
                <option key={g} value={g}>{GRADE_LABELS[g]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold">شمارهٔ کلاس</label>
            <input
              type="number"
              min={1}
              max={12}
              className="input"
              value={clsForm.classNo}
              onChange={(e) => setClsForm({ ...clsForm, classNo: Number(e.target.value) })}
            />
          </div>
          {isSecond && (
            <div>
              <label className="mb-1 block text-xs font-semibold">رشته</label>
              <select
                className="input"
                value={clsForm.track}
                onChange={(e) => setClsForm({ ...clsForm, track: e.target.value })}
              >
                <option value="">— انتخاب رشته —</option>
                {TRACKS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="mb-1 block text-xs font-semibold">ظرفیت</label>
            <input
              type="number"
              min={1}
              className="input"
              value={clsForm.capacity}
              onChange={(e) => setClsForm({ ...clsForm, capacity: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold">جنسیت</label>
            <input
              className="input bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-400"
              value={school.gender === 'boys' ? 'پسرانه (ثابت)' : 'دخترانه (ثابت)'}
              disabled
              readOnly
            />
          </div>
          <div className="flex items-end gap-2">
            <button type="submit" className="btn-primary w-full" disabled={busy}>
              <Plus className="h-4 w-4" />
              {clsEditId ? 'ذخیره' : 'افزودن'}
            </button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 sm:col-span-2 lg:col-span-6">
            عنوان کلاس خودکار ساخته می‌شود: مثلاً{' '}
            <b>
              {GRADE_LABELS[clsForm.grade]}
              {isSecond
                ? ` ${clsForm.track || 'ریاضی'} ${toPersianDigits(clsForm.classNo)} — ${GRADE_LABELS[clsForm.grade]}`
                : ` کلاس ${toPersianDigits(clsForm.classNo)}`}
            </b>
            {' '}— فقط پایه‌های {STAGE_LABELS[school.stage]} نمایش داده می‌شوند.
          </p>
          {clsEditId && (
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 sm:col-span-2 lg:col-span-6">
              در حال ویرایش کلاس هستید — برای انصراف دکمهٔ «افزودن جدید» را بزنید.{' '}
              <button
                type="button"
                onClick={() => { setClsEditId(null); setClsForm({ ...EMPTY_CLASS, grade: stageGrades[0] }) }}
                className="underline"
              >
                افزودن جدید
              </button>
            </p>
          )}
        </form>
      )}

      {/* ---- جدول کلاس‌ها ---- */}
      {tab === 'classes' && (
        <div className="mt-6 overflow-x-auto">
          <table className="card w-full min-w-[560px] p-0 text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-right text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <th className="p-4 font-bold">کلاس</th>
                <th className="p-4 font-bold">پایه</th>
                <th className="p-4 font-bold">شماره</th>
                {isSecond && <th className="p-4 font-bold">رشته</th>}
                <th className="p-4 font-bold">ظرفیت</th>
                <th className="p-4 font-bold">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((c) => (
                <tr key={c.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800/70">
                  <td className="p-4 font-bold">{c.name}</td>
                  <td className="p-4">{GRADE_LABELS[c.grade] ?? c.grade}</td>
                  <td className="p-4">کلاس {toPersianDigits(c.classNo)}</td>
                  {isSecond && <td className="p-4">{c.track ?? '—'}</td>}
                  <td className="p-4">{toPersianDigits(c.capacity)} نفر</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => editClass(c)}
                        className="rounded-lg p-2 text-school-600 ring-1 ring-slate-200 hover:bg-slate-50 dark:text-school-400 dark:ring-slate-700 dark:hover:bg-slate-800"
                        aria-label="ویرایش"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteClass(c.id)}
                        className="rounded-lg p-2 text-red-500 ring-1 ring-slate-200 hover:bg-red-50 dark:ring-slate-700 dark:hover:bg-red-950/50"
                        aria-label="حذف"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {classes.length === 0 && (
                <tr>
                  <td colSpan={isSecond ? 6 : 5} className="p-8 text-center text-slate-500 dark:text-slate-400">
                    هنوز کلاسی ثبت نشده است.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {/* ---- فرم معلم ---- */}
      {tab === 'teachers' && (
        <form onSubmit={submitTeacher} className="card mt-6 grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-semibold">نام و نام خانوادگی</label>
            <input
              className="input"
              value={tchForm.name}
              onChange={(e) => setTchForm({ ...tchForm, name: e.target.value })}
              placeholder="مثلاً علی محمدی"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold">درس</label>
            <input
              className="input"
              value={tchForm.subject}
              onChange={(e) => setTchForm({ ...tchForm, subject: e.target.value })}
              placeholder="مثلاً ریاضی"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold">سمت</label>
            <input
              className="input"
              value={tchForm.title}
              onChange={(e) => setTchForm({ ...tchForm, title: e.target.value })}
              placeholder="معلم پایه"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold">ایمیل</label>
            <input
              className="input"
              dir="ltr"
              value={tchForm.email}
              onChange={(e) => setTchForm({ ...tchForm, email: e.target.value })}
              placeholder="teacher@…"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold">تلفن</label>
            <input
              className="input"
              dir="ltr"
              value={tchForm.phone}
              onChange={(e) => setTchForm({ ...tchForm, phone: e.target.value })}
              placeholder="0912…"
            />
          </div>
          <div className="flex items-end gap-2">
            <button type="submit" className="btn-primary w-full" disabled={busy}>
              <Plus className="h-4 w-4" />
              {tchEditId ? 'ذخیره' : 'افزودن'}
            </button>
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="mb-1 block text-xs font-semibold">توضیح (اختیاری)</label>
            <textarea
              className="input min-h-[72px]"
              value={tchForm.bio}
              onChange={(e) => setTchForm({ ...tchForm, bio: e.target.value })}
              placeholder="سوابق و توضیحات کوتاه…"
            />
          </div>
          {tchEditId && (
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 sm:col-span-2 lg:col-span-3">
              در حال ویرایش مشخصات معلم هستید.{' '}
              <button
                type="button"
                onClick={() => { setTchEditId(null); setTchForm(EMPTY_TEACHER) }}
                className="underline"
              >
                افزودن جدید
              </button>
            </p>
          )}
        </form>
      )}

      {/* ---- جدول معلمین ---- */}
      {tab === 'teachers' && (
        <div className="mt-6 overflow-x-auto">
          <table className="card w-full min-w-[640px] p-0 text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-right text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <th className="p-4 font-bold">نام</th>
                <th className="p-4 font-bold">درس</th>
                <th className="p-4 font-bold">سمت</th>
                <th className="p-4 font-bold">تماس</th>
                <th className="p-4 font-bold">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((t) => (
                <tr key={t.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800/70">
                  <td className="p-4 font-bold">{t.name}</td>
                  <td className="p-4">{t.subject}</td>
                  <td className="p-4">{t.title}</td>
                  <td className="p-4" dir="ltr">{t.phone}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => editTeacher(t)}
                        className="rounded-lg p-2 text-school-600 ring-1 ring-slate-200 hover:bg-slate-50 dark:text-school-400 dark:ring-slate-700 dark:hover:bg-slate-800"
                        aria-label="ویرایش"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteTeacher(t.id)}
                        className="rounded-lg p-2 text-red-500 ring-1 ring-slate-200 hover:bg-red-50 dark:ring-slate-700 dark:hover:bg-red-950/50"
                        aria-label="حذف"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {teachers.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 dark:text-slate-400">
                    هنوز معلمی ثبت نشده است.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
