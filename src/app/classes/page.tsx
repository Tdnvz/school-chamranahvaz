"""Classes page component with search and filtering."""
'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { supabaseClient } from '@/lib/supabase'
import { getPersianDigits, formatNumber } from '@/lib/utils'
import type { Class } from '@/types/supabase'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ClassesPageProps {
  subdomain: string
  locale: 'en' | 'fa'
}

export default function ClassesPage({ subdomain, locale }: ClassesPageProps) {
  const t = useTranslations('ClassesPage')
  const [classes, setClasses] = useState<Class[]>([])
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [gradeFilter, setGradeFilter] = useState<string>('all')
  const [genderFilter, setGenderFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const classesPerPage = 10

  // Fetch classes for the subdomain
  useEffect(() => {
    async function fetchClasses() {
      try {
        const { data, error } = await supabaseClient
          .from('classes')
          .select('*')
          .eq('subdomain', subdomain)
          .order('grade')
          .order('name')
        
        if (error) throw error
        setClasses(data || [])
      } catch (error) {
        console.error('Error fetching classes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchClasses()
  }, [subdomain])

  // Filter classes based on search and filters
  useEffect(() => {
    let filtered = classes

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (cls) => 
          cls.name.toLowerCase().includes(searchLower) ||
          cls.grade.toLowerCase().includes(searchLower) ||
          cls.gender.toLowerCase().includes(searchLower)
      )
    }

    // Grade filter
    if (gradeFilter !== 'all') {
      filtered = filtered.filter((cls) => cls.grade === gradeFilter)
    }

    // Gender filter
    if (genderFilter !== 'all') {
      filtered = filtered.filter((cls) => cls.gender === genderFilter)
    }

    setFilteredClasses(filtered)
    setPage(1) // Reset to first page
  }, [classes, searchTerm, gradeFilter, genderFilter])

  // Pagination
  const totalPages = Math.ceil(filteredClasses.length / classesPerPage)
  const startIndex = (page - 1) * classesPerPage
  const paginatedClasses = filteredClasses.slice(startIndex, startIndex + classesPerPage)

  const getGradeLabel = (grade: string) => {
    const labels: Record<string, string> = {
      'elementary': locale === 'fa' ? 'ابتدایی' : 'Elementary',
      'first': locale === 'fa' ? 'اول' : 'First',
      'second': locale === 'fa' ? 'دوم' : 'Second',
    }
    return labels[grade] || grade
  }

  const getGenderLabel = (gender: string) => {
    const labels: Record<string, string> = {
      'boys': locale === 'fa' ? 'پسرانه' : 'Boys',
      'girls': locale === 'fa' ? 'دخترانه' : 'Girls',
    }
    return labels[gender] || gender
  }

  return (
    <div className="p-6" dir={locale === 'fa' ? 'rtl' : 'ltr'}>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        {t('title')}
      </h1>
      
      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('search')}
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('grade')}
            </label>
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{t('allGrades')}</option>
              <option value="elementary">{getGradeLabel('elementary')}</option>
              <option value="first">{getGradeLabel('first')}</option>
              <option value="second">{getGradeLabel('second')}</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('gender')}
            </label>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{t('allGenders')}</option>
              <option value="boys">{getGenderLabel('boys')}</option>
              <option value="girls">{getGenderLabel('girls')}</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              &nbsp;
            </label>
            <button
              onClick={() => {
                setSearchTerm('')
                setGradeFilter('all')
                setGenderFilter('all')
              }}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              {t('clearFilters')}
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">{t('loading')}</p>
        </div>
      )}

      {/* Classes Count */}
      {!loading && (
        <div className="mb-4 text-sm text-gray-600">
          {t('showingCount', { count: filteredClasses.length })}
        </div>
      )}

      {/* Classes Grid */}
      {!loading && filteredClasses.length > 0 && (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {paginatedClasses.map((cls) => (
            <motion.div
              key={cls.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {cls.name}
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium">{t('grade')}:</span>{' '}
                  {getGradeLabel(cls.grade)}
                </p>
                <p>
                  <span className="font-medium">{t('gender')}:</span>{' '}
                  {getGenderLabel(cls.gender)}
                </p>
                <p>
                  <span className="font-medium">{t('capacity')}:</span>{' '}
                  {formatNumber(cls.capacity)}
                </p>
                {cls.teacher_id && (
                  <p classn="text-blue-600">
                    <span className="font-medium">{t('teacherAssigned')}:</span> {cls.teacher_id}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* No Results */}
      {!loading && filteredClasses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {t('noResults')}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center space-x-2 rtl:space-x-reverse">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={cn(
                'px-4 py-2 rounded-md transition-colors',
                page === pageNum
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              )}
            >
              {pageNum}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}