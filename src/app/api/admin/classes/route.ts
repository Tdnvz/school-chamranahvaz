import { NextResponse, type NextRequest } from 'next/server'
import { SUBDOMAINS, getSchool, isGradeOfStage, buildClassTitle } from '@/lib/schools'
import { extractSubdomain } from '@/lib/utils'
import { readStore, writeStore } from '@/lib/store'
import { getClasses, getTeachers, isolateClasses, type ClassRow } from '@/lib/data'

/** GET /api/admin/classes — فقط کلاس‌های همین مقطع/همین جنسیت */
export async function GET(request: NextRequest) {
  const sub = extractSubdomain(request.headers.get('host') ?? '')
  if (!sub || !SUBDOMAINS.includes(sub)) {
    return NextResponse.json({ error: 'invalid_school' }, { status: 400 })
  }
  const classes = await getClasses(sub)
  return NextResponse.json({ subdomain: sub, classes })
}

/**
 * POST /api/admin/classes — ایجاد/به‌روزرسانی/حذف کلاس
 * ایزولاسیون: پایه باید مال همین مقطع باشد و جنسیت همیشه جنسیت مدرسه است.
 */
export async function POST(request: NextRequest) {
  const host = request.headers.get('host') ?? ''
  const sub = extractSubdomain(host)
  if (!sub || !SUBDOMAINS.includes(sub)) {
    return NextResponse.json({ error: 'invalid_school' }, { status: 400 })
  }
  const school = getSchool(sub)!
  const stage = school.stage
  const validGrades = isGradeOfStage
  const thisSub: string = sub

  let body: {
    action?: 'create' | 'update' | 'delete'
    class?: Partial<ClassRow>
    id?: string
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 })
  }

  // اطمینان از وجود فایل ادمین؛ در نبودِ آن از دادهٔ فعلی seed می‌شود
  const store = readStore(sub) ?? {
    classes: await getClasses(sub),
    teachers: await getTeachers(sub),
  }

  /** نرمال‌سازی ورودی با الزامات مقطع جاری */
  function normalizeIn(c: Partial<ClassRow>): { error?: string; row?: ClassRow } {
    const grade = String(c.grade ?? '').trim()
    if (!grade) return { error: 'grade_required' }
    if (!validGrades(grade, stage)) return { error: 'grade_not_in_stage' }

    const classNo = Number(c.classNo)
    if (!Number.isFinite(classNo) || classNo < 1 || classNo > 12) {
      return { error: 'invalid_class_number' }
    }

    // رشته فقط برای متوسطهٔ دوم؛ برای بقیه همیشه null
    const track =
      stage === 'second'
        ? String(c.track ?? '').trim() || null
        : null

    const capacity = Math.min(100, Math.max(1, Number(c.capacity) || 25))
    return {
      row: {
        id: '',
        name: buildClassTitle(grade, classNo, track),
        grade,
        classNo,
        track,
        gender: school.gender, // جنسیت قفل روی جنسیت مدرسه
        subdomain: thisSub,
        capacity,
        teacher_id: c.teacher_id ?? null,
      },
    }
  }

  const action = body.action
  const now = new Date().toISOString()

  if (action === 'create') {
    const { error, row } = normalizeIn(body.class ?? {})
    if (error || !row) {
      return NextResponse.json({ error: error ?? 'bad_request' }, { status: 400 })
    }
    const dup = store.classes.some(
      (c) =>
        c.grade === row!.grade &&
        c.classNo === row!.classNo &&
        (c.track ?? null) === (row!.track ?? null),
    )
    if (dup) {
      return NextResponse.json({ error: 'duplicate_class' }, { status: 409 })
    }
    const finalRow: ClassRow = {
      ...row,
      id: `cls-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      created_at: now,
    }
    store.classes = [...store.classes, finalRow]
    writeStore(sub, store)
    return NextResponse.json({
      ok: true,
      classes: isolateClasses(store.classes, sub),
    })
  }

  if (action === 'update') {
    const id = body.id
    if (!id) return NextResponse.json({ error: 'id_required' }, { status: 400 })
    const target = store.classes.find((c) => c.id === id)
    if (!target) return NextResponse.json({ error: 'not_found' }, { status: 404 })

    // ادغام روی ردیف فعلی سپس اعتبارسنجی کامل
    const merged: Partial<ClassRow> = { ...target, ...(body.class ?? {}) }
    const { error, row } = normalizeIn(merged)
    if (error || !row) {
      return NextResponse.json({ error: error ?? 'bad_request' }, { status: 400 })
    }
    const dup = store.classes.some(
      (c) =>
        c.id !== id &&
        c.grade === row!.grade &&
        c.classNo === row!.classNo &&
        (c.track ?? null) === (row!.track ?? null),
    )
    if (dup) {
      return NextResponse.json({ error: 'duplicate_class' }, { status: 409 })
    }
    store.classes = store.classes.map((c) => (c.id === id ? { ...c, ...row, id } : c))
    writeStore(sub, store)
    return NextResponse.json({
      ok: true,
      classes: isolateClasses(store.classes, sub),
    })
  }

  if (action === 'delete') {
    const id = body.id
    if (!id) return NextResponse.json({ error: 'id_required' }, { status: 400 })
    const before = store.classes.length
    store.classes = store.classes.filter((c) => c.id !== id)
    if (store.classes.length === before) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 })
    }
    writeStore(sub, store)
    return NextResponse.json({
      ok: true,
      classes: isolateClasses(store.classes, sub),
    })
  }

  return NextResponse.json({ error: 'unknown_action' }, { status: 400 })
}
