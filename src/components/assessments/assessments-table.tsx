'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AssessmentActions } from '@/components/dashboard/assessment-actions'
import { Target, Plus } from 'lucide-react'
import Link from 'next/link'

interface Assessment {
  id: string
  title: string
  status: string
  created_at: string
  updated_at: string
  risk_score?: number
}

interface AssessmentsTableProps {
  locale: string
}

export function AssessmentsTable({ locale }: AssessmentsTableProps) {
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        label: locale === 'sk' ? 'Návrh' : 'Draft', 
        className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200' 
      },
      in_progress: { 
        label: locale === 'sk' ? 'Prebieha' : 'In Progress', 
        className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
      },
      completed: { 
        label: locale === 'sk' ? 'Dokončené' : 'Completed', 
        className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
      },
      review: { 
        label: locale === 'sk' ? 'Na kontrole' : 'Under Review', 
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
            {locale === 'sk' ? 'Načítavam hodnotenia...' : 'Loading assessments...'}
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
          {locale === 'sk' ? 'Chyba pri načítaní' : 'Error loading assessments'}
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {error}
        </p>
        <Button onClick={fetchAssessments} variant="outline">
          {locale === 'sk' ? 'Skúsiť znova' : 'Try Again'}
        </Button>
      </div>
    )
  }

  if (assessments.length === 0) {
    return (
      <div className="text-center py-12">
        <Target className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          {locale === 'sk' ? 'Pripravené na hodnotenie vplyvu na súkromie' : 'Ready to assess privacy impact'}
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {locale === 'sk' 
            ? 'Začnite kontrolou na určenie, či potrebujete úplnú DPIA, alebo vytvorte komplexné hodnotenie priamo.'
            : 'Start with a pre-check to determine if you need a full DPIA, or create a comprehensive assessment directly.'
          }
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center" style={{ gap: '32px' }}>
          <Link href={`/${locale}/precheck`}>
            <Button variant="secondary" size="md">
              {locale === 'sk' ? 'Začať kontrolu' : 'Start Pre-check'}
            </Button>
          </Link>
          <Link href={`/${locale}/assessments/new`}>
            <Button variant="primary" size="lg">
              {locale === 'sk' ? 'Nové DPIA' : 'New DPIA'}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                {locale === 'sk' ? 'Názov' : 'Name'}
              </th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                {locale === 'sk' ? 'Stav' : 'Status'}
              </th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                {locale === 'sk' ? 'Vytvorené' : 'Created'}
              </th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                {locale === 'sk' ? 'Upravené' : 'Updated'}
              </th>
              <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                {locale === 'sk' ? 'Akcie' : 'Actions'}
              </th>
            </tr>
          </thead>
          <tbody>
            {assessments.map((assessment) => (
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
          {locale === 'sk' 
            ? `Zobrazuje sa ${assessments.length} hodnotení` 
            : `Showing ${assessments.length} assessments`
          }
        </p>
        <Link href={`/${locale}/assessments/new`}>
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            {locale === 'sk' ? 'Pridať nové' : 'Add New'}
          </Button>
        </Link>
      </div>
    </div>
  )
}