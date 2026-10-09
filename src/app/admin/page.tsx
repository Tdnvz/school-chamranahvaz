import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getSchool } from '@/lib/schools'
import { extractSubdomain } from '@/lib/utils'
import { getClasses, getTeachers } from '@/lib/data'
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth'
import AdminDashboard from '@/components/AdminDashboard'

export const metadata: Metadata = { title: 'پنل مدیریت' }
export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const host = (await headers()).get('host') ?? ''
  const sub = extractSubdomain(host)
  const school = sub ? getSchool(sub) : null
  if (!sub || !school) redirect('/admin/login')
  // دفاع در عمق — middleware هم جداگانه چک می‌کند؛ نشست مقید به ساب‌دامنه (رفع F-004)
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (!(await verifySessionToken(token, sub))) redirect('/admin/login')

  const [classes, teachers] = await Promise.all([getClasses(sub), getTeachers(sub)])

  return <AdminDashboard school={school} initialClasses={classes} initialTeachers={teachers} />
}
