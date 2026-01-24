'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/ui/pagination'
import { AssessmentActions } from '@/components/dashboard/assessment-actions'
import { Target, Plus } from 'lucide-react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'

interface Assessment {
  id: string
  title: string
  status: string
  created_at: string
  updated_at: string
  risk_score?: number
}

export function AssessmentsTable() {
  const locale = useLocale()
  const t = useTranslations('privacy.assessments')

  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3

  useEffect(() => {
    fetchAssessments()
  }, [])

  const fetchAssessments = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/assessments')
      const data = await response.json()
      
      if (response.ok) {
        setAssessments(data.assessments || [])
      } else {
        setError(data.error || 'Failed to fetch assessments')
      }
    } catch (err) {
      setError('Network error while fetching assessments')
      console.error('Error fetching assessments:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === 'sk' ? 'sk-SK' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      draft: {
        label: t('statusDraft'),
        className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
      },
      in_progress: {
        label: t('statusInProgress'),
        className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      },
      completed: {
        label: t('statusCompleted'),
        className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      },
      review: {
        label: t('statusReview'),
        className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      }
    }

    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.draft

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {t('loading')}
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Target className="h-16 w-16 mx-auto text-red-500/50 mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          {t('errorTitle')}
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {error}
        </p>
        <Button onClick={fetchAssessments} variant="outline">
          {t('tryAgain')}
        </Button>
      </div>
    )
  }

  if (assessments.length === 0) {
    return (
      <div className="text-center py-12">
        <Target className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          {t('emptyTitle')}
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {t('emptyDescription')}
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center" style={{ gap: '32px' }}>
          <Link href={`/${locale}/precheck`}>
            <Button variant="secondary" size="md">
              {t('startPrecheck')}
            </Button>
          </Link>
          <Link href={`/${locale}/assessments/new`}>
            <Button variant="primary" size="lg">
              {t('newDpia')}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Pagination logic
  const totalPages = Math.ceil(assessments.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedAssessments = assessments.slice(startIndex, endIndex)

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                {t('tableHeaderName')}
              </th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                {t('tableHeaderStatus')}
              </th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                {t('tableHeaderCreated')}
              </th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                {t('tableHeaderUpdated')}
              </th>
              <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                {t('tableHeaderActions')}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedAssessments.map((assessment) => (
              <tr key={assessment.id} className="border-b border-border hover:bg-muted/50">
                <td className="py-3 px-4">
                  <Link 
                    href={`/${locale}/assessment?id=${assessment.id}`}
                    className="font-medium text-foreground hover:text-blue-600 transition-colors"
                  >
                    {assessment.title || `Assessment ${assessment.id.slice(0, 8)}`}
                  </Link>
                </td>
                <td className="py-3 px-4">
                  {getStatusBadge(assessment.status)}
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  {formatDate(assessment.created_at)}
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  {formatDate(assessment.updated_at)}
                </td>
                <td className="py-3 px-4 text-right">
                  <AssessmentActions
                    assessmentId={assessment.id}
                    assessmentName={assessment.title || `Assessment ${assessment.id.slice(0, 8)}`}
                    status={assessment.status}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Table Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          {t('showingAssessments', { count: assessments.length })}
        </p>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}