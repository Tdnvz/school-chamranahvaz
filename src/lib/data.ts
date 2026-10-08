import { getSupabase } from './supabase'
import { readStore } from './store'
import {
  getSchool,
  STAGE_GRADES,
  GRADE_LABELS,
  isGradeOfStage,
  buildClassTitle,
  type SchoolStage,
  type GradeKey,
} from './schools'

export interface ClassRow {
  id: string
  /** عنوان نمایشی — خودکار از پایه/شماره/رشته ساخته می‌شود */
  name: string
  /** پایهٔ مشخص (e1…e6, f7…f9, s10…s12) — نه مقطع کلی */
  grade: string
  /** شمارهٔ کلاس داخل پایه: پایهٔ اول کلاس ۲ */
  classNo: number
  /** رشته — فقط متوسطهٔ دوم (ریاضی/تجربی/…) */
  track: string | null
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
/* دادهٔ نمونه — برای هر مقطع، با پایه‌های همان مقطع                  */
/* ------------------------------------------------------------------ */

/** [پایه، شمارهٔ کلاس، رشته (فقط دوم)] */
type ClassSeed = [GradeKey, number, string | null]

const SEED_BY_STAGE: Record<SchoolStage, ClassSeed[]> = {
  // دبستان: ۶ پایه، هر پایه کلاس‌های متفاوت (پایهٔ اول کلاس ۲، پایهٔ ششم کلاس ۱)
  elementary: [
    ['e1', 1, null], ['e1', 2, null],
    ['e2', 1, null], ['e2', 2, null],
    ['e3', 1, null], ['e3', 2, null],
    ['e4', 1, null],
    ['e5', 1, null], ['e5', 2, null],
    ['e6', 1, null],
  ],
  // متوسطهٔ اول: هفتم تا نهم (پایهٔ نهم کلاس ۲)
  first: [
    ['f7', 1, null], ['f7', 2, null],
    ['f8', 1, null],
    ['f9', 1, null], ['f9', 2, null],
  ],
  // متوسطهٔ دوم: پایه + رشته (ریاضی ۱ دهم، تجربی ۲ یازدهم، ریاضی ۲ دوازدهم)
  second: [
    ['s10', 1, 'ریاضی'], ['s10', 1, 'تجربی'], ['s10', 2, 'تجربی'],
    ['s11', 1, 'ریاضی'], ['s11', 2, 'تجربی'],
    ['s12', 1, 'ریاضی'], ['s12', 2, 'ریاضی'],
  ],
}

function sampleClasses(subdomain: string): ClassRow[] {
  const school = getSchool(subdomain)
  if (!school) return []
  const seeds = SEED_BY_STAGE[school.stage]
  return seeds.map(([grade, classNo, track], i) => ({
    id: `sample-class-${subdomain}-${i + 1}`,
    name: buildClassTitle(grade, classNo, track),
    grade,
    classNo,
    track,
    gender: school.gender,
    subdomain,
    capacity: 25 + (i % 4) * 3,
    teacher_id: null,
  }))
}

/**
 * دادهٔ نمونهٔ کلاس — فقط ساختار کلاس‌بندی هر مقطع (نه دادهٔ واقعی).
 * توجه: معلمین نمونه نداریم — نام/تلفن/ایمیل جعلی نمایش داده نمی‌شود؛
 * تا وقتی مدیر معلم واقعی ثبت نکند، بخش معلمین خالی است.
 */
const SAMPLE_TEACHERS: TeacherRow[] = []

/* ------------------------------------------------------------------ */
/* ایزولاسیون: هر مدرسه فقط کلاس‌های پایه‌های مقطع خودش + جنسیت خودش */
/* ------------------------------------------------------------------ */

export function isolateClasses(rows: ClassRow[], subdomain: string): ClassRow[] {
  const school = getSchool(subdomain)
  if (!school) return []
  return rows.filter(
    (c) =>
      c.subdomain === subdomain &&
      c.gender === school.gender &&
      isGradeOfStage(c.grade, school.stage),
  )
}

/** نرمال‌سازی ردیف‌های قدیمی (grade سطح-مقطعی مثل «elementary») */
function normalizeClass(c: ClassRow, subdomain: string): ClassRow {
  const school = getSchool(subdomain)
  const grade = isGradeOfStage(c.grade, school?.stage ?? 'elementary')
    ? c.grade
    : (STAGE_GRADES[school?.stage ?? 'elementary'][0] as string)
  const classNo = Number(c.classNo) > 0 ? Number(c.classNo) : 1
  const track = school?.stage === 'second' ? (c.track ?? null) : null
  return {
    ...c,
    grade,
    classNo,
    track,
    subdomain,
    gender: school?.gender ?? c.gender,
    name: c.name?.trim() || buildClassTitle(grade, classNo, track),
  }
}

/* ------------------------------------------------------------------ */
/* لایهٔ داده                                                          */
/* ------------------------------------------------------------------ */

export async function getClasses(subdomain: string): Promise<ClassRow[]> {
  const school = getSchool(subdomain)
  if (!school) return []
  // ۱) دادهٔ ویرایش‌شده در پنل ادمین (فایل محلی)
  const store = readStore(subdomain)
  if (store) return isolateClasses(store.classes.map((c) => normalizeClass(c, subdomain)), subdomain)
  // ۲) Supabase
  const supabase = getSupabase()
  if (supabase) {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('subdomain', subdomain)
      .eq('gender', school.gender)
      .order('grade', { ascending: true })
      .order('name', { ascending: true })
    if (!error && data) {
      const rows = (data as ClassRow[]).map((c) => normalizeClass(c, subdomain))
      return isolateClasses(rows, subdomain)
    }
  }
  // ۳) دادهٔ نمونهٔ همان مقطع
  return sampleClasses(subdomain)
}

export async function getTeachers(subdomain: string): Promise<TeacherRow[]> {
  const school = getSchool(subdomain)
  if (!school) return []
  // ۱) دادهٔ ویرایش‌شده در پنل ادمین (فایل محلی)
  const store = readStore(subdomain)
  if (store) return store.teachers.filter((t) => t.subdomain === subdomain)
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

export { GRADE_LABELS }
