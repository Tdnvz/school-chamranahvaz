"""Main layout component for the Chamran Ahvaz School website."""
import MainNav from '@/components/MainNav'
import { getLocaleFromPath, getDirection } from '@/lib/i18n/config'
import type { Locale } from 'next-intl'

interface MainLayoutProps {
  children: React.ReactNode
  locale: Locale
  subdomain: string
}

export default function MainLayout({ children, locale, subdomain }: MainLayoutProps) {
  const direction = getDirection(locale)

  return (
    <div className="min-h-screen bg-gray-50" dir={direction}>
      <MainNav locale={locale} subdomain={subdomain} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm min-h-[calc(100vh-64px)]">
          {children}
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white py-8 mt-auto" dir={direction === 'rtl' ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">مدارس چمران اهواز</h3>
              <p className="text-gray-300 text-sm">
                وب سایت رسمی مدارس چمران اهواز - ارائه خدمات آموزشی با کیفیت در مقاطع مختلف
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">لینک‌های سریع</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="/classes" className="hover:text-white transition-colors">لیست کلاس‌ها</a></li>
                <li><a href="/teachers" className="hover:text-white transition-colors">لیست معلمین</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">تماس با ما</h3>
              <div className="text-sm text-gray-300 space-y-1">
                <p>شماره تماس: ۶۱۲۳۴۵۶۷۸۹</p>
                <p>ایمیل: info@chamranahvaz.ir</p>
                <p>آدرس: اهواز، خیابان چمران</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} مدارس چمران اهواز. همه حقوق محفوظ است.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}