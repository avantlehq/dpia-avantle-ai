'use client'

import { LoadingSpinner } from '@/components/ui/skeleton'
import { LucideIcon } from 'lucide-react'

interface PageLoadingProps {
  title?: string
  description?: string
  icon?: LucideIcon
  size?: 'sm' | 'md' | 'lg'
}

export function PageLoading({ 
  title = 'Loading...', 
  description, 
  icon: Icon,
  size = 'md' 
}: PageLoadingProps) {
  const containerClasses = {
    sm: 'py-8',
    md: 'py-16', 
    lg: 'py-24'
  }

  const iconClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  }

  const titleClasses = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl'
  }

  return (
    <div className={`flex flex-col items-center justify-center text-center ${containerClasses[size]}`}>
      <div className="space-y-4">
        {/* Icon or Spinner */}
        <div className="flex items-center justify-center">
          {Icon ? (
            <Icon className={`${iconClasses[size]} text-muted-foreground animate-pulse`} />
          ) : (
            <LoadingSpinner size={size === 'sm' ? 'md' : 'lg'} className="text-primary" />
          )}
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h3 className={`font-medium text-foreground ${titleClasses[size]}`}>
            {title}
          </h3>
          
          {/* Description */}
          {description && (
            <p className="text-sm text-muted-foreground max-w-md">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// Pre-configured loading states for common use cases
export function DashboardLoading() {
  return (
    <PageLoading 
      title="Loading Dashboard..."
      description="Fetching your assessments and overview data"
      size="md"
    />
  )
}

export function AssessmentLoading() {
  return (
    <PageLoading 
      title="Loading Assessment..."
      description="Preparing your DPIA assessment form"
      size="md"
    />
  )
}

export function FormLoading() {
  return (
    <PageLoading 
      title="Processing..."
      description="Please wait while we save your changes"
      size="sm"
    />
  )
}