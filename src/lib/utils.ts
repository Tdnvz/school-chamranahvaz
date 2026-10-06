"""Utility functions for the Chamran Ahvaz School website."""
import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { fa } from 'date-fns-jalali/locale'
import type { Locale } from 'next-intl'

export function formatDate(date: string | Date, locale: Locale = 'fa'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  
  if (locale === 'fa') {
    return format(dateObj, 'PPP', { locale: fa })
  }
  
  return format(dateObj, 'PPP')
}

export function formatRelativeTime(date: string | Date, locale: Locale = 'fa'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  
  if (locale === 'fa') {
    return formatDistanceToNow(dateObj, { addSuffix: true, locale: fa })
  }
  
  return formatDistanceToNow(dateObj, { addSuffix: true })
}

export function getPersianDigits(str: string): string {
  return str.replace(/\d/g, (digit) => {
    return '۰۱۲۳۴۵۶۷۸۹'[parseInt(digit)]
  })
}

export function formatNumber(num: number): string {
  return getPersianDigits(num.toString())
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function isPersian(text: string): boolean {
  return /[؀-ۿ]/.test(text)
}

export function extractSubdomain(hostname: string): string {
  const domain = hostname.split('.')[0]
  return domain === 'www' ? 'chamranahvaz' : domain
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-')
}