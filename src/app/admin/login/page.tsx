'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { School } from '@/components/icons'
import { Lock } from '@/components/admin-icons'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (res.ok) {
        router.replace('/admin')
        router.refresh()
      } else {
        setError('نام کاربری یا رمز عبور اشتباه است.')
      }
    } catch {
      setError('خطا در ارتباط با سرور. دوباره تلاش کنید.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container-page flex flex-1 flex-col items-center justify-center py-16">
      <div className="card w-full max-w-md p-8">
        <div className="flex flex-col items-center text-center">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-school-600 text-white">
            <School className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-xl font-extrabold">پنل مدیریت مدرسه</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            برای افزودن و ویرایش کلاس‌ها و معلمین وارد شوید
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-7 space-y-4">
          <div>
            <label htmlFor="username" className="mb-1.5 block text-sm font-semibold">
              نام کاربری
            </label>
            <input
              id="username"
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              dir="ltr"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-semibold">
              رمز عبور
            </label>
            <input
              id="password"
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              dir="ltr"
              required
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 dark:bg-red-950/60 dark:text-red-400">
              {error}
            </p>
          )}

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            <Lock className="h-4 w-4" />
            {loading ? 'در حال ورود…' : 'ورود به پنل'}
          </button>
        </form>
      </div>
    </main>
  )
}
