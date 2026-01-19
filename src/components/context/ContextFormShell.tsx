/**
 * Context Form Shell - Shared Layout Component
 *
 * Provides consistent header, back navigation, and footer layout
 * for all Context module form pages (Create/Edit).
 */

'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

interface ContextFormShellProps {
  title: string
  description?: string
  backUrl: string
  backLabel?: string
  children: React.ReactNode
}

export function ContextFormShell({
  title,
  description,
  backUrl,
  backLabel,
  children,
}: ContextFormShellProps) {
  const t = useTranslations('common')

  const defaultBackLabel = backLabel || t('back')

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header with back button */}
      <div className="mb-6">
        <Link href={backUrl}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {defaultBackLabel}
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold mt-4" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h1>
        {description && (
          <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
            {description}
          </p>
        )}
      </div>

      {/* Form content */}
      {children}
    </div>
  )
}
