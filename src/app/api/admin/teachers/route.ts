import { NextResponse, type NextRequest } from 'next/server'
import { SUBDOMAINS } from '@/lib/schools'
import { extractSubdomain } from '@/lib/utils'
import { readStore, writeStore } from '@/lib/store'
import { getClasses, getTeachers, type TeacherRow } from '@/lib/data'

/** GET /api/admin/teachers — فهرست معلمین مقطع جاری */
export async function GET(request: NextRequest) {
  const sub = extractSubdomain(request.headers.get('host') ?? '')
  if (!sub || !SUBDOMAINS.includes(sub)) {
    return NextResponse.json({ error: 'invalid_school' }, { status: 400 })
  }
  const teachers = await getTeachers(sub)
  return NextResponse.json({ subdomain: sub, teachers })
}

/**
 * POST /api/admin/teachers — ایجاد/به‌روزرسانی/حذف معلم
 * بدنه: { action: 'create'|'update'|'delete', teacher?: Partial<TeacherRow>, id?: string }
 */
export async function POST(request: NextRequest) {
  const host = request.headers.get('host') ?? ''
  const sub = extractSubdomain(host)
  if (!sub || !SUBDOMAINS.includes(sub)) {
    return NextResponse.json({ error: 'invalid_school' }, { status: 400 })
  }

  let body: {
    action?: 'create' | 'update' | 'delete'
    teacher?: Partial<TeacherRow>
    id?: string
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 })
  }

  const store = readStore(sub) ?? {
    classes: await getClasses(sub),
    teachers: await getTeachers(sub),
  }

  const action = body.action
  const now = new Date().toISOString()

  if (action === 'create') {
    const t = body.teacher ?? {}
    if (!t.name?.trim()) {
      return NextResponse.json({ error: 'name_required' }, { status: 400 })
    }
    const row: TeacherRow = {
      id: `tch-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: t.name.trim(),
      subject: t.subject ?? '',
      title: t.title ?? 'معلم پایه',
      bio: t.bio ?? '',
      image_url: t.image_url ?? null,
      subdomain: sub,
      email: t.email ?? '',
      phone: t.phone ?? '',
      availability: t.availability ?? null,
      created_at: now,
    }
    store.teachers = [...store.teachers, row]
    writeStore(sub, store)
    return NextResponse.json({ ok: true, teachers: store.teachers })
  }

  if (action === 'update') {
    const id = body.id
    if (!id) return NextResponse.json({ error: 'id_required' }, { status: 400 })
    let found = false
    store.teachers = store.teachers.map((t) => {
      if (t.id !== id) return t
      found = true
      const p = body.teacher ?? {}
      return {
        ...t,
        ...(p.name !== undefined ? { name: String(p.name).trim() } : {}),
        ...(p.subject !== undefined ? { subject: p.subject } : {}),
        ...(p.title !== undefined ? { title: p.title } : {}),
        ...(p.bio !== undefined ? { bio: p.bio } : {}),
        ...(p.email !== undefined ? { email: p.email } : {}),
        ...(p.phone !== undefined ? { phone: p.phone } : {}),
        ...(p.availability !== undefined ? { availability: p.availability } : {}),
      }
    })
    if (!found) return NextResponse.json({ error: 'not_found' }, { status: 404 })
    writeStore(sub, store)
    return NextResponse.json({ ok: true, teachers: store.teachers })
  }

  if (action === 'delete') {
    const id = body.id
    if (!id) return NextResponse.json({ error: 'id_required' }, { status: 400 })
    const before = store.teachers.length
    store.teachers = store.teachers.filter((t) => t.id !== id)
    if (store.teachers.length === before) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 })
    }
    writeStore(sub, store)
    return NextResponse.json({ ok: true, teachers: store.teachers })
  }

  return NextResponse.json({ error: 'unknown_action' }, { status: 400 })
}
