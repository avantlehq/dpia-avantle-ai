'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, AlertTriangle, XCircle, Circle } from 'lucide-react'
import { type SectionValidationResult } from '@/lib/validation/template-validator'
import { cn } from '@/lib/utils'

interface SectionValidationIndicatorProps {
  sectionValidation: SectionValidationResult | null
  className?: string
  showDetails?: boolean
}

export function SectionValidationIndicator({ 
  sectionValidation, 
  className,
  showDetails = false 
}: SectionValidationIndicatorProps) {
  if (!sectionValidation) {
    return (
      <Badge variant="secondary" className={cn("flex items-center gap-1", className)}>
        <Circle className="h-3 w-3" />
        Not Started
      </Badge>
    )
  }

  const { isComplete, requiredFieldsCount, completedFieldsCount, errors, warnings } = sectionValidation
  const hasErrors = errors.length > 0
  const hasWarnings = warnings.length > 0

  if (hasErrors) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          {errors.length} Error{errors.length !== 1 ? 's' : ''}
        </Badge>
        {showDetails && (
          <span className="text-sm text-muted-foreground">
            {completedFieldsCount}/{requiredFieldsCount} required fields
          </span>
        )}
      </div>
    )
  }

  if (!isComplete) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Circle className="h-3 w-3" />
          In Progress
        </Badge>
        {showDetails && (
          <span className="text-sm text-muted-foreground">
            {completedFieldsCount}/{requiredFieldsCount} required fields
          </span>
        )}
      </div>
    )
  }

  if (hasWarnings) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Badge className="flex items-center gap-1 bg-yellow-100 text-yellow-800 border-yellow-300">
          <AlertTriangle className="h-3 w-3" />
          {warnings.length} Warning{warnings.length !== 1 ? 's' : ''}
        </Badge>
        {showDetails && (
          <span className="text-sm text-muted-foreground">
            Complete with suggestions
          </span>
        )}
      </div>
    )
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Badge className="flex items-center gap-1 bg-green-100 text-green-800 border-green-300">
        <CheckCircle className="h-3 w-3" />
        Complete
      </Badge>
      {showDetails && (
        <span className="text-sm text-muted-foreground">
          All required fields completed
        </span>
      )}
    </div>
  )
}

export function SectionValidationSummary({ 
  sectionValidation, 
  className 
}: { 
  sectionValidation: SectionValidationResult | null
  className?: string 
}) {
  if (!sectionValidation) {
    return null
  }

  const { requiredFieldsCount, completedFieldsCount, errors, warnings } = sectionValidation
  const completionPercentage = requiredFieldsCount > 0 
    ? Math.round((completedFieldsCount / requiredFieldsCount) * 100) 
    : 0

  return (
    <div className={cn("text-sm space-y-1", className)}>
      <div className="flex items-center justify-between">
        <span>Completion</span>
        <span className="font-medium">{completionPercentage}%</span>
      </div>
      <div className="flex items-center justify-between">
        <span>Required Fields</span>
        <span>{completedFieldsCount}/{requiredFieldsCount}</span>
      </div>
      {errors.length > 0 && (
        <div className="flex items-center justify-between text-red-600">
          <span>Errors</span>
          <span>{errors.length}</span>
        </div>
      )}
      {warnings.length > 0 && (
        <div className="flex items-center justify-between text-yellow-600">
          <span>Warnings</span>
          <span>{warnings.length}</span>
        </div>
      )}
    </div>
  )
}