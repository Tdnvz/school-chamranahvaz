import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { getSchool } from '@/lib/schools'
import { extractSubdomain } from '@/lib/utils'
import { getTeachers } from '@/lib/data'
import TeachersExplorer from '@/components/TeachersExplorer'

export const metadata: Metadata = { title: 'معلمین' }
export const dynamic = 'force-dynamic'

export default async function TeachersPage() {
  const host = headers().get('host') ?? ''
  const sub = extractSubdomain(host) ?? 'ghjs'
  const school = getSchool(sub)
  const teachers = await getTeachers(sub)

  return (
    <main className="container-page flex-1 py-10">
      <div className="mb-8">
        <span className="chip">{school?.titleFa ?? 'معلمین'}</span>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight">معلمین</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          اعضای هیئت علمی {school?.titleFa ?? 'مدرسه'} به همراه درس، سابقه و راه‌های تماس.
        </p>
      </div>

      <TeachersExplorer initialTeachers={teachers} />
    </main>
  )
}
