'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Save, FileText } from 'lucide-react'
import { saveAssessmentSectionAction, getAssessmentSectionAction } from '@/lib/actions/assessment-section-actions'
import { toast } from 'sonner'
import { DynamicFormGenerator } from '../dynamic-form-generator'
import templateData from '@/lib/templates/dpia-basic-eu-v1.json'

// Extract section definition from JSON template
const sectionDefinition = templateData.sections.context_scope

interface ContextScopeFormProps {
  assessmentId: string
  onComplete: () => void
  onNext: () => void
}

export function ContextScopeForm({ assessmentId, onComplete }: ContextScopeFormProps) {
  const [loading, setLoading] = useState(false)
  const [autoSaving] = useState(false)
  const [formData, setFormData] = useState<Record<string, unknown>>({})

  // Load existing data on mount
  useEffect(() => {
    loadSectionData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessmentId])

  const loadSectionData = async () => {
    setLoading(true)
    try {
      const result = await getAssessmentSectionAction(assessmentId, 'context_scope')
      if (result.success && result.data) {
        setFormData(result.data)
      }
    } catch (error) {
      console.error('Error loading section data:', error)
      toast.error('Failed to load existing form data.')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (data: Record<string, unknown>) => {
    setLoading(true)
    try {
      const result = await saveAssessmentSectionAction(assessmentId, 'context_scope', data)
      
      if (result.success) {
        toast.success('Context & Scope section has been saved successfully.')
      } else {
        throw new Error(result.error || 'Failed to save')
      }
    } catch {
      toast.error('Failed to save section. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: Record<string, unknown>) => {
    setLoading(true)
    try {
      const result = await saveAssessmentSectionAction(assessmentId, 'context_scope', data)
      
      if (result.success) {
        onComplete()
        toast.success('Context & Scope section completed successfully.')
      } else {
        throw new Error(result.error || 'Failed to save')
      }
    } catch {
      toast.error('Failed to complete section. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with status */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-5 w-5 text-dpia-orange" />
          <h2 className="text-2xl font-semibold">{sectionDefinition.title}</h2>
          {autoSaving && (
            <Badge variant="secondary" className="text-xs">
              Auto-saving...
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">
          {sectionDefinition.description}
        </p>
      </div>

      {/* Dynamic Form Generator */}
      <DynamicFormGenerator
        section={sectionDefinition}
        onSubmit={onSubmit}
        defaultValues={formData}
        loading={loading}
        submitButtonText="Complete Section"
      />

      {/* Optional Save Progress Button */}
      <div className="flex justify-start">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSave(formData)}
          disabled={loading}
        >
          <Save className="mr-2 h-4 w-4" />
          Save Progress
        </Button>
      </div>
    </div>
  )
}