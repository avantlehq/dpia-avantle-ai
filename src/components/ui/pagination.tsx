/**
 * Pagination Component
 *
 * Reusable pagination control for tables and lists.
 * Displays "Page X of Y" with Previous/Next navigation.
 */

import React from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ currentPage, totalPages, onPageChange, className = '' }: PaginationProps) {
  const t = useTranslations('common.pagination')

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  // Don't show pagination if there are no pages
  if (totalPages === 0) {
    return null
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        aria-label={t('previous')}
        className="gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        {t('previous')}
      </Button>

      <span className="text-sm text-muted-foreground px-2">
        {t('page')} {currentPage} {t('of')} {totalPages}
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label={t('next')}
        className="gap-1"
      >
        {t('next')}
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
