"""i18n configuration for Persian and English support."""
import { notFound } from 'next/navigation'

export const locales = ['en', 'fa'] as const
type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'fa'

export function getDirection(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'fa' ? 'rtl' : 'ltr'
}

export function getLocaleFromPath(pathname: string): Locale {
  const segments = pathname.split('/')
  const localeSegment = segments[1]
  
  if (locales.includes(localeSegment as Locale)) {
    return localeSegment as Locale
  }
  
  return defaultLocale
}

export function getPathWithLocale(pathname: string, locale: Locale): string {
  const segments = pathname.split('/')
  segments[1] = locale
  return segments.join('/')
}

export const i18nConfig = {
  locales,
  defaultLocale,
  getDirection,
  getLocaleFromPath,
  getPathWithLocale,
}