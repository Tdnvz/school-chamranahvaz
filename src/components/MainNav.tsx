"""Main navigation component for the Chamran Ahvaz School website."""
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/classes', label: 'classes', key: 'classes' },
  { href: '/teachers', label: 'teachers', key: 'teachers' },
]

interface MainNavProps {
  subdomain: string
  locale: 'en' | 'fa'
}

export default function MainNav({ subdomain, locale }: MainNavProps) {
  const t = useTranslations('Navigation')
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow-lg" dir={locale === 'fa' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href={`/${locale}/${subdomain}`} className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">م</span>
              </div>
              <span className="font-bold text-xl text-gray-800">مدارس چمران</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={`/${locale}/${subdomain}${item.href}`}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  pathname === `/${locale}/${subdomain}${item.href}`
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                )}
              >
                {t(item.label)}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Link
              href={`/${locale}/${subdomain}?lang=en`}
              className="px-3 py-1 text-sm rounded transition-colors text-gray-600 hover:text-gray-900"
            >
              EN
            </Link>
            <span className="text-gray-400">|</span>
            <Link
              href={`/${locale}/${subdomain}?lang=fa`}
              className="px-3 py-1 text-sm rounded transition-colors text-gray-600 hover:text-gray-900"
            >
              FA
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}