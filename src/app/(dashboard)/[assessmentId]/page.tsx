'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { SectionWizard } from '@/components/wizard/section-wizard'
import { WizardProgress } from '@/components/wizard/wizard-progress'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

// Import DPIA template
import dpiaTemplate from '@/lib/templates/dpia-basic-eu-v1.json'

export default function AssessmentPage() {
  const params = useParams()
  const assessmentId = params.assessmentId as string
  
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [completedSections, setCompletedSections] = useState<string[]>([])
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null)

  // Get sections from template (first 3 sections for Phase 1B)
  const sections = dpiaTemplate.template.sections.slice(0, 3)
  const currentSection = sections[currentSectionIndex]

  // Auto-save functionality (30s + onBlur)
  const scheduleAutoSave = () => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer)
    }
    
    const timer = setTimeout(() => {
      saveAnswers(true) // silent save
    }, 30000) // 30 seconds
    
    setAutoSaveTimer(timer)
  }

  // Save answers to API
  const saveAnswers = async (silent = false) => {
    setLoading(!silent)
    try {
      const response = await fetch(`/api/assessments/${assessmentId}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section_id: currentSection.id,
          answers: assessmentAnswers[currentSection.id] || {}
        })
      })

      if (!response.ok) throw new Error('Save failed')
      
      if (!silent) {
        toast.success('Progress saved')
      }
    } catch (error) {
      if (!silent) {
        toast.error('Failed to save progress')
      }
    } finally {
      setLoading(false)
    }
  }

  // Handle field changes
  const handleFieldChange = (fieldId: string, value: any) => {
    setAssessmentAnswers(prev => ({
      ...prev,
      [currentSection.id]: {
        ...prev[currentSection.id],
        [fieldId]: value
      }
    }))
    
    // Schedule auto-save
    scheduleAutoSave()
  }

  // Handle field blur (immediate save)
  const handleFieldBlur = () => {
    saveAnswers(true)
  }

  // Navigation handlers
  const handleNext = () => {
    if (currentSectionIndex < sections.length - 1) {
      // Mark current section as completed
      if (!completedSections.includes(currentSection.id)) {
        setCompletedSections([...completedSections, currentSection.id])
      }
      setCurrentSectionIndex(currentSectionIndex + 1)
    } else {
      // Submit assessment
      submitAssessment()
    }
  }

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1)
    }
  }

  // Submit assessment
  const submitAssessment = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/assessments/${assessmentId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'in_review',
          completed_sections: [...completedSections, currentSection.id]
        })
      })

      if (!response.ok) throw new Error('Submit failed')
      
      toast.success('Assessment submitted for review')
      // TODO: Redirect to review page
    } catch (error) {
      toast.error('Failed to submit assessment')
    } finally {
      setLoading(false)
    }
  }

  // Load existing answers on mount
  useEffect(() => {
    const loadAssessment = async () => {
      try {
        const response = await fetch(`/api/assessments/${assessmentId}`)
        if (response.ok) {
          const data = await response.json()
          setAssessmentAnswers(data.answers || {})
          setCompletedSections(data.completed_sections || [])
          
          // Resume from last incomplete section
          const lastIncompleteIndex = sections.findIndex(s => 
            !data.completed_sections?.includes(s.id)
          )
          if (lastIncompleteIndex >= 0) {
            setCurrentSectionIndex(lastIncompleteIndex)
          }
        }
      } catch (error) {
        console.error('Failed to load assessment:', error)
      }
    }

    loadAssessment()
  }, [assessmentId])

  // Cleanup auto-save timer
  useEffect(() => {
    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer)
      }
    }
  }, [autoSaveTimer])

  return (
    <div className="h-full flex">
      <div className="absolute top-4 left-4 z-10">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
      
      <WizardProgress 
        currentStep={currentSectionIndex}
        completedSteps={completedSections.map((_, index) => index)}
        steps={sections.map(s => ({
          id: s.id,
          title: s.title,
          description: s.description
        }))}
      />
      
      <SectionWizard
        section={currentSection}
        answers={assessmentAnswers[currentSection.id] || {}}
        onFieldChange={handleFieldChange}
        onFieldBlur={handleFieldBlur}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSave={() => saveAnswers()}
        loading={loading}
        isFirstSection={currentSectionIndex === 0}
        isLastSection={currentSectionIndex === sections.length - 1}
        canGoNext={true} // TODO: Validate section completion
      />
    </div>
  )
}