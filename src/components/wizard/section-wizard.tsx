'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormField } from './form-field'
import { RiskAssessmentField } from './risk-assessment-field'
import { Save, ChevronLeft, ChevronRight } from 'lucide-react'

interface TemplateField {
  id: string
  label: string
  type: string
  required?: boolean
  placeholder?: string
  description?: string
  options?: Array<{ value: string; label: string }>
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
}

interface TemplateSection {
  id: string
  title: string
  description: string
  order: number
  fields: TemplateField[]
}

interface SectionWizardProps {
  section: TemplateSection
  answers: Record<string, any>
  onFieldChange: (fieldId: string, value: any) => void
  onFieldBlur: () => void
  onNext: () => void
  onPrevious: () => void
  onSave: () => void
  loading: boolean
  isFirstSection: boolean
  isLastSection: boolean
  canGoNext: boolean
}

export function SectionWizard({
  section,
  answers,
  onFieldChange,
  onFieldBlur,
  onNext,
  onPrevious,
  onSave,
  loading,
  isFirstSection,
  isLastSection,
  canGoNext
}: SectionWizardProps) {

  const renderField = (field: TemplateField) => {
    const value = answers[field.id] || ''
    
    // Handle special risk assessment fields
    if (field.type === 'risk_assessment') {
      return (
        <RiskAssessmentField
          key={field.id}
          field={field}
          value={value}
          onChange={(value) => onFieldChange(field.id, value)}
          onBlur={onFieldBlur}
        />
      )
    }

    // Handle regular form fields
    return (
      <FormField
        key={field.id}
        field={field}
        value={value}
        onChange={(value) => onFieldChange(field.id, value)}
        onBlur={onFieldBlur}
      />
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 p-6 overflow-y-auto">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {section.title}
              <Button
                variant="outline"
                size="sm"
                onClick={onSave}
                disabled={loading}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Progress
              </Button>
            </CardTitle>
            <CardDescription className="text-base">
              {section.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid gap-6">
              {section.fields.map(renderField)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Footer */}
      <div className="border-t bg-background p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            {!isFirstSection && (
              <Button
                variant="outline"
                onClick={onPrevious}
                disabled={loading}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Section {section.order} of 3
            </span>
          </div>

          <div>
            <Button
              onClick={onNext}
              disabled={loading || !canGoNext}
            >
              {isLastSection ? 'Submit Assessment' : 'Next Section'}
              {!isLastSection && <ChevronRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}