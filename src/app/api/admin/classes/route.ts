import { NextResponse, type NextRequest } from 'next/server'
import { SUBDOMAINS } from '@/lib/schools'
import { extractSubdomain } from '@/lib/utils'
import { readStore, writeStore } from '@/lib/store'
import { getClasses, getTeachers, type ClassRow } from '@/lib/data'

/** GET /api/admin/classes — فهرست کلاس‌های مقطع جاری */
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
 * بدنه: { action: 'create'|'update'|'delete', class?: Partial<ClassRow>, id?: string }
 */
export async function POST(request: NextRequest) {
  const host = request.headers.get('host') ?? ''
  const sub = extractSubdomain(host)
  if (!sub || !SUBDOMAINS.includes(sub)) {
    return NextResponse.json({ error: 'invalid_school' }, { status: 400 })
  }

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

  const action = body.action
  const now = new Date().toISOString()

  if (action === 'create') {
    const c = body.class ?? {}
    if (!c.name?.trim()) {
      return NextResponse.json({ error: 'name_required' }, { status: 400 })
    }
    const row: ClassRow = {
      id: `cls-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: c.name.trim(),
      grade: c.grade ?? 'elementary',
      gender: c.gender ?? 'boys',
      subdomain: sub,
      capacity: Number(c.capacity) || 25,
      teacher_id: c.teacher_id ?? null,
      created_at: now,
    }
    store.classes = [...store.classes, row]
    writeStore(sub, store)
    return NextResponse.json({ ok: true, classes: store.classes })
  }

  if (action === 'update') {
    const id = body.id
    if (!id) return NextResponse.json({ error: 'id_required' }, { status: 400 })
    let found = false
    store.classes = store.classes.map((c) => {
      if (c.id !== id) return c
      found = true
      return {
        ...c,
        ...(body.class?.name !== undefined ? { name: String(body.class.name).trim() } : {}),
        ...(body.class?.grade !== undefined ? { grade: body.class.grade } : {}),
        ...(body.class?.gender !== undefined ? { gender: body.class.gender } : {}),
        ...(body.class?.capacity !== undefined
          ? { capacity: Number(body.class.capacity) || c.capacity }
          : {}),
        ...(body.class?.teacher_id !== undefined ? { teacher_id: body.class.teacher_id } : {}),
      }
    })
    if (!found) return NextResponse.json({ error: 'not_found' }, { status: 404 })
    writeStore(sub, store)
    return NextResponse.json({ ok: true, classes: store.classes })
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
    return NextResponse.json({ ok: true, classes: store.classes })
  }

  return NextResponse.json({ error: 'unknown_action' }, { status: 400 })
}
