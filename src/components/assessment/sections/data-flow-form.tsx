'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Badge } from '@/components/ui/badge'
import { Network, Check, Clock } from 'lucide-react'
import { saveAssessmentSectionAction, getAssessmentSectionAction } from '@/lib/actions/assessment-section-actions'
import { toast } from 'sonner'
import { DynamicFormGenerator } from '../dynamic-form-generator'
import templateData from '@/lib/templates/dpia-basic-eu-v1.json'

// Extract section definition from JSON template
const sectionDefinition = templateData.sections.data_flow_processing

interface DataFlowFormProps {
  assessmentId: string
  onComplete: () => void
  onNext: () => void
}

export function DataFlowForm({ assessmentId, onComplete }: DataFlowFormProps) {
  const [loading, setLoading] = useState(false)
  const [autoSaving, setAutoSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [formData, setFormData] = useState<Record<string, unknown>>({})
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Load existing data on mount
  useEffect(() => {
    if (assessmentId) {
      loadSectionData()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessmentId])

  const loadSectionData = async () => {
    setLoading(true)
    try {
      const result = await getAssessmentSectionAction(assessmentId, 'data_flow_processing')
      
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

  // Auto-save functionality
  const autoSave = useCallback(async (data: Record<string, unknown>) => {
    setAutoSaving(true)
    try {
      const result = await saveAssessmentSectionAction(assessmentId, 'data_flow_processing', data)
      
      if (result.success) {
        setLastSaved(new Date())
        setHasUnsavedChanges(false)
        setFormData(data)
      }
    } catch (error) {
      console.error('Auto-save failed:', error)
    } finally {
      setAutoSaving(false)
    }
  }, [assessmentId])

  // Trigger auto-save on form data changes (debounced)
  useEffect(() => {
    if (hasUnsavedChanges && Object.keys(formData).length > 0) {
      const timer = setTimeout(() => {
        autoSave(formData)
      }, 2000) // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timer)
    }
  }, [formData, hasUnsavedChanges, autoSave])

  const onSubmit = async (data: Record<string, unknown>) => {
    setLoading(true)
    try {
      const result = await saveAssessmentSectionAction(assessmentId, 'data_flow_processing', data)
      
      if (result.success) {
        onComplete()
        toast.success('Section completed! Moving to next step.')
      } else {
        throw new Error(result.error || 'Failed to save')
      }
    } catch {
      toast.error('Failed to complete section. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Helper function to get save status display
  const getSaveStatus = () => {
    if (autoSaving) {
      return { icon: Clock, text: 'Saving...', className: 'text-orange-600' }
    }
    if (lastSaved) {
      const now = new Date()
      const diffMinutes = Math.floor((now.getTime() - lastSaved.getTime()) / 60000)
      
      if (diffMinutes === 0) {
        return { icon: Check, text: 'Saved · just now', className: 'text-green-600' }
      } else if (diffMinutes === 1) {
        return { icon: Check, text: 'Saved · 1 minute ago', className: 'text-green-600' }
      } else {
        return { icon: Check, text: `Saved · ${diffMinutes} minutes ago`, className: 'text-green-600' }
      }
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header with auto-save status */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Network className="h-5 w-5 text-dpia-orange" />
            <h2 className="text-2xl font-semibold">{sectionDefinition.title}</h2>
          </div>
          
          {/* Auto-save status indicator */}
          {getSaveStatus() && (
            <div className={`flex items-center gap-1 text-sm ${getSaveStatus()?.className}`}>
              {React.createElement(getSaveStatus()?.icon || Check, { className: "h-4 w-4" })}
              <span>{getSaveStatus()?.text}</span>
            </div>
          )}
        </div>
        <p className="text-muted-foreground">
          {sectionDefinition.description}
        </p>
      </div>

      {/* Dynamic Form Generator with auto-save */}
      <DynamicFormGenerator
        key={`form-${assessmentId}-${Object.keys(formData).length}`}
        section={sectionDefinition}
        onSubmit={onSubmit}
        defaultValues={formData}
        loading={loading}
        submitButtonText="Complete Section"
        onChange={(data) => {
          setFormData(data)
          setHasUnsavedChanges(true)
        }}
      />
    </div>
  )
}