// تنظیمات مدرسه — متوسطهٔ دوم پسرانهٔ چمران اهواز (otv2)
export type SchoolStage = 'elementary' | 'first' | 'second'
export type SchoolGender = 'boys' | 'girls'

export interface School {
  subdomain: string
  domain: string
  stage: SchoolStage
  gender: SchoolGender
  titleFa: string
  titleEn: string
  shortFa: string
  descriptionFa: string
  color: string
}

export const BASE_DOMAIN = 'mdresx.fun'

export const SCHOOLS: School[] = [
  {
    subdomain: 'otv2',
    domain: `otv2.${BASE_DOMAIN}`,
    stage: 'second',
    gender: 'boys',
    titleFa: 'متوسطهٔ دوم پسرانه',
    titleEn: 'Boys Second Secondary',
    shortFa: 'متوسطهٔ دوم پسرانه',
    descriptionFa: 'متوسطهٔ دوم پسرانهٔ چمران اهواز — پایه‌های دهم تا دوازدهم',
    color: 'from-amber-500 to-orange-600',
  },
]

export const SUBDOMAINS = SCHOOLS.map((s) => s.subdomain)

export function getSchool(subdomain: string): School | null {
  return SCHOOLS.find((s) => s.subdomain === subdomain) ?? null
}

export const STAGE_LABELS: Record<SchoolStage, string> = {
  elementary: 'ابتدایی',
  first: 'متوسطهٔ اول',
  second: 'متوسطهٔ دوم',
}

/* ------------------------------------------------------------------ */
/* کاتالوگ پایه‌ها — هر مقطع فقط پایه‌های خودش را دارد                */
/* ------------------------------------------------------------------ */

/** کلیدهای پایه: e=ابتدایی، f=متوسطهٔ اول، s=متوسطهٔ دوم */
export type GradeKey =
  | 'e1' | 'e2' | 'e3' | 'e4' | 'e5' | 'e6'
  | 'f7' | 'f8' | 'f9'
  | 's10' | 's11' | 's12'

export const GRADE_LABELS: Record<string, string> = {
  e1: 'پایهٔ اول',
  e2: 'پایهٔ دوم',
  e3: 'پایهٔ سوم',
  e4: 'پایهٔ چهارم',
  e5: 'پایهٔ پنجم',
  e6: 'پایهٔ ششم',
  f7: 'پایهٔ هفتم',
  f8: 'پایهٔ هشتم',
  f9: 'پایهٔ نهم',
  s10: 'پایهٔ دهم',
  s11: 'پایهٔ یازدهم',
  s12: 'پایهٔ دوازدهم',
}

/** پایه‌های مجاز هر مقطع — فیلتر سایت و پنل ادمین از همین‌جا ساخته می‌شود */
export const STAGE_GRADES: Record<SchoolStage, GradeKey[]> = {
  elementary: ['e1', 'e2', 'e3', 'e4', 'e5', 'e6'],
  first: ['f7', 'f8', 'f9'],
  second: ['s10', 's11', 's12'],
}

/** رشته‌ها — فقط برای متوسطهٔ دوم (ریاضی ۱ دهم، تجربی ۲ یازدهم، …) */
export const TRACKS: string[] = [
  'ریاضی',
  'تجربی',
  'انسانی',
  'ادبیات و علوم انسانی',
  'هنر',
  'کاردانش',
  'فناوری اطلاعات',
]

/** آیا پایه به این مقطع تعلق دارد؟ (ایزولاسیون مقطعی) */
export function isGradeOfStage(grade: string, stage: SchoolStage): boolean {
  return (STAGE_GRADES[stage] as string[]).includes(grade)
}

/** مقطع یک پایه را برگرداند */
export function stageOfGrade(grade: string): SchoolStage | null {
  if ((STAGE_GRADES.elementary as string[]).includes(grade)) return 'elementary'
  if ((STAGE_GRADES.first as string[]).includes(grade)) return 'first'
  if ((STAGE_GRADES.second as string[]).includes(grade)) return 'second'
  return null
}

/** عنوان نمایشی کلاس: «پایهٔ اول کلاس ۲» یا «ریاضی ۱ — پایهٔ دهم» */
export function buildClassTitle(
  grade: string,
  classNo: number,
  track?: string | null,
): string {
  const gl = GRADE_LABELS[grade] ?? grade
  const no = String(classNo).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])
  if (track) return `${track} ${no} — ${gl}`
  return `${gl} کلاس ${no}`
}
