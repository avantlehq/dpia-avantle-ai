'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react'
import { type ValidationResult, type ValidationError, type ValidationWarning } from '@/lib/validation/template-validator'

interface ValidationPanelProps {
  validationResult: ValidationResult | null
  isValidating?: boolean
  className?: string
}

export function ValidationPanel({ validationResult, isValidating, className }: ValidationPanelProps) {
  if (isValidating) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            Validating Assessment...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!validationResult) {
    return null
  }

  const { isValid, errors, warnings, completionPercentage, missingSections, missingRequiredFields } = validationResult

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isValid && errors.length === 0 ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : errors.length > 0 ? (
              <XCircle className="h-5 w-5 text-red-500" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            )}
            <span>Assessment Validation</span>
          </div>
          <Badge variant={isValid && errors.length === 0 ? "secondary" : errors.length > 0 ? "destructive" : "secondary"}>
            {completionPercentage}% Complete
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Completion Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Completion Progress</span>
            <span className="text-sm text-muted-foreground">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-red-500">{errors.length}</div>
            <div className="text-sm text-muted-foreground">Errors</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-500">{warnings.length}</div>
            <div className="text-sm text-muted-foreground">Warnings</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-500">{4 - missingSections.length}</div>
            <div className="text-sm text-muted-foreground">Complete Sections</div>
          </div>
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-red-600">Errors</h4>
            {errors.map((error, index) => (
              <ValidationErrorItem key={index} error={error} />
            ))}
          </div>
        )}

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-yellow-600">Warnings</h4>
            {warnings.map((warning, index) => (
              <ValidationWarningItem key={index} warning={warning} />
            ))}
          </div>
        )}

        {/* Missing Sections */}
        {missingSections.length > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Incomplete sections: {missingSections.map(getSectionDisplayName).join(', ')}
            </AlertDescription>
          </Alert>
        )}

        {/* Missing Required Fields */}
        {missingRequiredFields.length > 0 && missingRequiredFields.length <= 10 && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="mb-1">Missing required fields:</div>
              <ul className="text-xs space-y-1">
                {missingRequiredFields.slice(0, 10).map(field => (
                  <li key={field}>• {formatFieldName(field)}</li>
                ))}
              </ul>
              {missingRequiredFields.length > 10 && (
                <div className="text-xs mt-1">... and {missingRequiredFields.length - 10} more</div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Success Message */}
        {isValid && errors.length === 0 && warnings.length === 0 && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Assessment validation passed! All sections are complete and valid.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

function ValidationErrorItem({ error }: { error: ValidationError }) {
  return (
    <Alert variant="destructive" className="py-2">
      <XCircle className="h-4 w-4" />
      <AlertDescription>
        <span className="font-medium">{getSectionDisplayName(error.sectionId)}</span>
        {error.fieldId && <span className="text-xs"> → {error.fieldId}</span>}
        <br />
        {error.message}
      </AlertDescription>
    </Alert>
  )
}

function ValidationWarningItem({ warning }: { warning: ValidationWarning }) {
  return (
    <Alert className="border-yellow-200 bg-yellow-50 py-2">
      <AlertTriangle className="h-4 w-4 text-yellow-600" />
      <AlertDescription>
        <span className="font-medium text-yellow-800">{getSectionDisplayName(warning.sectionId)}</span>
        {warning.fieldId && <span className="text-xs"> → {warning.fieldId}</span>}
        <br />
        <span className="text-yellow-800">{warning.message}</span>
        {warning.suggestion && (
          <>
            <br />
            <span className="text-xs text-yellow-700">Suggestion: {warning.suggestion}</span>
          </>
        )}
      </AlertDescription>
    </Alert>
  )
}

function getSectionDisplayName(sectionId: string): string {
  const sectionNames: Record<string, string> = {
    'context_scope': 'Context & Scope',
    'data_flow_processing': 'Data Flow & Processing',
    'risk_assessment': 'Risk Assessment',
    'mitigation_measures': 'Mitigation Measures'
  }
  return sectionNames[sectionId] || sectionId
}

function formatFieldName(fieldPath: string): string {
  const [sectionId, fieldId] = fieldPath.split('.')
  return `${getSectionDisplayName(sectionId)} → ${fieldId.replace(/_/g, ' ')}`
}