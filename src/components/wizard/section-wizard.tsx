'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Loader2, Save, Check, ArrowLeft, ArrowRight } from 'lucide-react'
import { UniversalFormField } from './form-field'
import { FormSection, SectionStatus, FieldValue } from '@/lib/validations/dpia'
import { z } from 'zod'

interface SectionWizardProps {
  section: FormSection
  initialData?: Record<string, FieldValue>
  onSave: (sectionId: string, data: Record<string, FieldValue>) => Promise<void>
  onNext?: () => void
  onPrevious?: () => void
  isLoading?: boolean
  isFirstSection?: boolean
  isLastSection?: boolean
  status?: SectionStatus
  completionPercent?: number
}

export function SectionWizard({
  section,
  initialData = {},
  onSave,
  onNext,
  onPrevious,
  isLoading = false,
  isFirstSection = false,
  isLastSection = false,
  status = 'not_started',
  completionPercent = 0,
}: SectionWizardProps) {
  const [isSaving, setIsSaving] = useState(false)

  // Create dynamic schema based on section fields
  const createSectionSchema = () => {
    const schemaFields: Record<string, z.ZodTypeAny> = {}
    
    section.fields.forEach(field => {
      let fieldSchema: z.ZodTypeAny
      
      switch (field.type) {
        case 'text':
        case 'textarea':
          if (field.required) {
            fieldSchema = z.string().min(1, `${field.label} is required`)
          } else {
            fieldSchema = z.string().optional()
          }
          break
          
        case 'select':
        case 'radio':
          if (field.required) {
            fieldSchema = z.string().min(1, `${field.label} is required`)
          } else {
            fieldSchema = z.string().optional()
          }
          break
          
        case 'checkboxGroup':
          if (field.required) {
            fieldSchema = z.array(z.string()).min(1, `Select at least one option for ${field.label}`)
          } else {
            fieldSchema = z.array(z.string()).optional()
          }
          break
          
        case 'riskAssessment':
          const riskSchema = z.object({
            likelihood: z.number().min(1).max(5),
            impact: z.number().min(1).max(5),
            score: z.number().min(1).max(25),
            level: z.enum(['low', 'medium', 'high', 'critical']),
            description: z.string().optional(),
          })
          fieldSchema = field.required ? riskSchema : riskSchema.optional()
          break
          
        default:
          fieldSchema = z.any()
      }
      
      schemaFields[field.id] = fieldSchema
    })
    
    return z.object(schemaFields)
  }

  const form = useForm({
    resolver: zodResolver(createSectionSchema()),
    defaultValues: initialData,
  })

  const handleSave = async (data: Record<string, FieldValue>) => {
    setIsSaving(true)
    try {
      await onSave(section.id, data)
    } catch (error) {
      console.error('Error saving section:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleFormSubmit = async (data: Record<string, unknown>) => {
    await handleSave(data as Record<string, FieldValue>)
  }

  const handleSaveAndNext = async () => {
    const isValid = await form.trigger()
    if (isValid) {
      const data = form.getValues() as Record<string, FieldValue>
      await handleSave(data)
      if (onNext) {
        onNext()
      }
    }
  }

  const handleAutoSave = async () => {
    const data = form.getValues() as Record<string, FieldValue>
    await handleSave(data)
  }

  const getStatusBadge = () => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><Check className="h-3 w-3 mr-1" />Completed</Badge>
      case 'in_progress':
        return <Badge variant="secondary">In Progress</Badge>
      case 'not_started':
        return <Badge variant="outline">Not Started</Badge>
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Section Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{section.title}</h1>
            {section.description && (
              <p className="text-muted-foreground mt-1">{section.description}</p>
            )}
          </div>
          {getStatusBadge()}
        </div>
        
        {/* Progress */}
        {status !== 'not_started' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Section Progress</span>
              <span>{Math.round(completionPercent)}%</span>
            </div>
            <Progress value={completionPercent} className="w-full" />
          </div>
        )}
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Section Details</CardTitle>
              <CardDescription>
                Complete all required fields to proceed to the next section
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {section.fields.map((field) => (
                <UniversalFormField
                  key={field.id}
                  field={field}
                  control={form.control}
                  disabled={isLoading}
                />
              ))}
            </CardContent>
          </Card>

          {/* Auto-save and Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {!isFirstSection && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onPrevious}
                  disabled={isLoading}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleAutoSave}
                disabled={isSaving || isLoading}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-1" />
                    Save Progress
                  </>
                )}
              </Button>

              {isLastSection ? (
                <Button
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Complete Section
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSaveAndNext}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Save & Next
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}