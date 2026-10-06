// ذخیره‌سازی محلی داده‌های پنل ادمین (فایل JSON روی سرور).
// اولویت خواندن: فایل ادمین ← Supabase ← دادهٔ نمونه.
// فقط در سمت سرور استفاده شود (fs).
import fs from 'fs'
import path from 'path'
import type { ClassRow, TeacherRow } from './data'

const DATA_DIR = path.join(process.cwd(), 'data')

export interface StoreData {
  classes: ClassRow[]
  teachers: TeacherRow[]
}

function fileFor(subdomain: string): string {
  // فقط نام‌های امن
  const safe = subdomain.replace(/[^a-z0-9-]/gi, '')
  return path.join(DATA_DIR, `${safe}.json`)
}

/** خواندن فایل ادمین — اگر نبود null برمی‌گرداند */
export function readStore(subdomain: string): StoreData | null {
  try {
    const file = fileFor(subdomain)
    if (!fs.existsSync(file)) return null
    const raw = fs.readFileSync(file, 'utf8')
    const parsed = JSON.parse(raw) as Partial<StoreData>
    return {
      classes: Array.isArray(parsed.classes) ? parsed.classes : [],
      teachers: Array.isArray(parsed.teachers) ? parsed.teachers : [],
    }
  } catch {
    return null
  }
}

/** نوشتن اتمیک (فایل موقت + rename) */
export function writeStore(subdomain: string, data: StoreData): void {
  fs.mkdirSync(DATA_DIR, { recursive: true })
  const file = fileFor(subdomain)
  const tmp = `${file}.tmp`
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8')
  fs.renameSync(tmp, file)
}
