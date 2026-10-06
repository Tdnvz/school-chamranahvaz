import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { getSchool } from '@/lib/schools'
import { extractSubdomain } from '@/lib/utils'
import { getClasses } from '@/lib/data'
import ClassesExplorer from '@/components/ClassesExplorer'

export const metadata: Metadata = { title: 'کلاس‌ها' }
export const dynamic = 'force-dynamic'

export default async function ClassesPage() {
  const host = headers().get('host') ?? ''
  const sub = extractSubdomain(host) ?? 'ghjs'
  const school = getSchool(sub)
  const classes = await getClasses(sub)

  return (
    <main className="container-page flex-1 py-10">
      <div className="mb-8">
        <span className="chip">{school?.titleFa ?? 'کلاس‌ها'}</span>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight">کلاس‌ها</h1>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
          فهرست کامل کلاس‌های {school?.titleFa ?? 'مدرسه'}؛ با جستجوی متنی و فیلتر مقطع و کلاس.
        </p>
      </div>

      <ClassesExplorer initialClasses={classes} />
    </main>
  )
}
