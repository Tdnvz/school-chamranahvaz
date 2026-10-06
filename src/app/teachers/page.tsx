"""Teachers page component with filtering and search."""
'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { supabaseClient } from '@/lib/supabase'
import { getPersianDigits, formatNumber } from '@/lib/utils'
import type { Teacher } from '@/types/supabase'
import { motion } from 'framer-motion'

interface TeachersPageProps {
  subdomain: string
  locale: 'en' | 'fa'
}

export default function TeachersPage({ subdomain, locale }: TeachersPageProps) {
  const t = useTranslations('TeachersPage')
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [subjectFilter, setSubjectFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const teachersPerPage = 12

  // Fetch teachers for the subdomain
  useEffect(() => {
    async function fetchTeachers() {
      try {
        const { data, error } = await supabaseClient
          .from('teachers')
          .select('*')
          .eq('subdomain', subdomain)
          .order('name')
        
        if (error) throw error
        setTeachers(data || [])
      } catch (error) {
        console.error('Error fetching teachers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeachers()
  }, [subdomain])

  // Filter teachers based on search and subject filter
  useEffect(() => {
    let filtered = teachers

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (teacher) => 
          teacher.name.toLowerCase().includes(searchLower) ||
          teacher.subject.toLowerCase().includes(searchLower) ||
          teacher.title.toLowerCase().includes(searchLower) ||
          teacher.bio.toLowerCase().includes(searchLower)
      )
    }

    // Subject filter
    if (subjectFilter !== 'all') {
      filtered = filtered.filter((teacher) => teacher.subject === subjectFilter)
    }

    setFilteredTeachers(filtered)
    setPage(1) // Reset to first page
  }, [teachers, searchTerm, subjectFilter])

  // Get unique subjects for filter options
  const uniqueSubjects = Array.from(
    new Set(teachers.map(teacher => teacher.subject))
  )

  // Pagination
  const totalPages = Math.ceil(filteredTeachers.length / teachersPerPage)
  const startIndex = (page - 1) * teachersPerPage
  const paginatedTeachers = filteredTeachers.slice(startIndex, startIndex + teachersPerPage)

  return (
    <div className="p-6" dir={locale === 'fa' ? 'rtl' : 'ltr'}>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        {t('title')}
      </h1>
      
      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              {t('subject')}
            </label>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{t('allSubjects')}</option>
              {uniqueSubjects.map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              &nbsp;
            </label>
            <button
              onClick={() => {
                setSearchTerm('')
                setSubjectFilter('all')
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

      {/* Teachers Count */}
      {!loading && (
        <div className="mb-4 text-sm text-gray-600">
          {t('showingCount', { count: filteredTeachers.length })}
        </div>
      )}

      {/* Teachers Grid */}
      {!loading && filteredTeachers.length > 0 && (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {paginatedTeachers.map((teacher) => (
            <motion.div
              key={teacher.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4"
            >
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-3 bg-gray-200 rounded-full overflow-hidden">
                  {teacher.image_url ? (
                    <img 
                      src={teacher.image_url} 
                      alt={teacher.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-100">
                      <span className="text-blue-600 text-xl font-bold">
                        {teacher.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {teacher.name}
                </h3>
                
                <p className="text-sm text-blue-600 font-medium mb-2">
                  {teacher.title}
                </p>
                
                <p className="text-sm text-gray-600 mb-3">
                  {teacher.subject}
                </p>
                
                <div className="text-xs text-gray-500 space-y-1">
                  <p>{teacher.email}</p>
                  <p>{teacher.phone}</p>
                  {teacher.availability && (
                    <p className="text-blue-500">
                      {teacher.availability}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* No Results */}
      {!loading && filteredTeachers.length === 0 && (
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
              className="px-4 py-2 rounded-md bg-white text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {pageNum}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}