import { getSupabase } from './supabase'
import { readStore } from './store'

export interface ClassRow {
  id: string
  name: string
  grade: 'elementary' | 'first' | 'second'
  gender: 'boys' | 'girls'
  subdomain: string
  capacity: number
  teacher_id: string | null
  created_at?: string
}

export interface TeacherRow {
  id: string
  name: string
  subject: string
  title: string
  bio: string
  image_url: string | null
  subdomain: string
  email: string
  phone: string
  availability: string | null
  created_at?: string
}

/* ------------------------------------------------------------------ */
/* دادهٔ نمونه — وقتی Supabase تنظیم نشده باشد سایت زنده می‌ماند     */
/* ------------------------------------------------------------------ */

const SAMPLE_CLASSES: ClassRow[] = [
  ['الف', 'elementary'], ['ب', 'elementary'], ['ج', 'elementary'],
  ['د', 'elementary'], ['هـ', 'elementary'], ['و', 'elementary'],
  ['ز', 'first'], ['ح', 'first'], ['ط', 'first'], ['ی', 'first'],
  ['ک', 'second'], ['ل', 'second'], ['م', 'second'], ['ن', 'second'],
].map(([name, grade], i) => ({
  id: `sample-class-${i + 1}`,
  name: String(name),
  grade: grade as ClassRow['grade'],
  gender: 'boys' as const,
  subdomain: 'ghjs',
  capacity: 25 + (i % 4) * 3,
  teacher_id: null,
}))

const SAMPLE_TEACHERS: TeacherRow[] = [
  ['علی محمدی', 'ریاضی', 'معلم پایه'],
  ['زهرا احمدی', 'ادبیات فارسی', 'معلم پایه'],
  ['حسین کریمی', 'علوم تجربی', 'معلم پایه'],
  ['مریم رضایی', 'عربی', 'معلم پایه'],
  ['اکبر نوری', 'زبان انگلیسی', 'معلم پایه'],
  ['فاطمه صادقی', 'مطالعات اجتماعی', 'معلم پایه'],
].map(([name, subject, title], i) => ({
  id: `sample-teacher-${i + 1}`,
  name: String(name),
  subject: String(subject),
  title: String(title),
  bio: `معلم باسابقهٔ مدارس چمران اهواز در درس ${subject}.`,
  image_url: null,
  subdomain: 'ghjs',
  email: `teacher${i + 1}@chamranahvaz.ir`,
  phone: `091${String(10000000 + i * 111111).slice(0, 8)}`,
  availability: 'شنبه تا چهارشنبه ۸ تا ۱۴',
}))

/* ------------------------------------------------------------------ */
/* لایهٔ داده                                                          */
/* ------------------------------------------------------------------ */

export async function getClasses(subdomain: string): Promise<ClassRow[]> {
  // ۱) دادهٔ ویرایش‌شده در پنل ادمین (فایل محلی)
  const store = readStore(subdomain)
  if (store) return store.classes
  // ۲) Supabase
  const supabase = getSupabase()
  if (supabase) {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('subdomain', subdomain)
      .order('grade', { ascending: true })
      .order('name', { ascending: true })
    if (!error && data) return data as ClassRow[]
  }
  // بازگشت به دادهٔ نمونه با نام همان مدرسه
  return SAMPLE_CLASSES.map((c) => ({ ...c, subdomain }))
}

export async function getTeachers(subdomain: string): Promise<TeacherRow[]> {
  // ۱) دادهٔ ویرایش‌شده در پنل ادمین (فایل محلی)
  const store = readStore(subdomain)
  if (store) return store.teachers
  // ۲) Supabase
  const supabase = getSupabase()
  if (supabase) {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .eq('subdomain', subdomain)
      .order('name', { ascending: true })
    if (!error && data) return data as TeacherRow[]
  }
  return SAMPLE_TEACHERS.map((t) => ({ ...t, subdomain }))
}

/**
 * اشتراک لحظه‌ای Supabase Realtime (رویداد INSERT/UPDATE/DELETE).
 * بی‌صدا نادیده گرفته می‌شود اگر Supabase تنظیم نشده باشد.
 */
export function subscribeToChanges(
  table: 'classes' | 'teachers',
  subdomain: string,
  onChange: () => void,
): () => void {
  const supabase = getSupabase()
  if (!supabase) return () => {}

  const channel = supabase
    .channel(`realtime:${table}:${subdomain}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table, filter: `subdomain=eq.${subdomain}` },
      onChange,
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
