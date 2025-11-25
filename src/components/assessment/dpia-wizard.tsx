'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ContextScopeForm } from './sections/context-scope-form'
import { DataFlowForm } from './sections/data-flow-form' 
import { RiskAssessmentForm } from './sections/risk-assessment-form'
import { MitigationForm } from './sections/mitigation-form'
import { WizardNavigation } from './wizard-navigation'
// import { dpiaWizardSteps } from '@/lib/state/navigation'
import { Loader2 } from 'lucide-react'

interface DPIAWizardProps {
  assessmentId: string
}

type SectionId = 'context' | 'data-flow' | 'risk-assessment' | 'mitigation'

export function DPIAWizard({ assessmentId }: DPIAWizardProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentSection, setCurrentSection] = useState<SectionId>('context')
  const [loading] = useState(false)
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set())

  // Initialize current section from URL or default to first
  useEffect(() => {
    const step = searchParams.get('step')
    if (step && ['context', 'data-flow', 'risk-assessment', 'mitigation'].includes(step)) {
      setCurrentSection(step as SectionId)
    }
  }, [searchParams])

  // Update URL when section changes
  const handleSectionChange = (sectionId: SectionId) => {
    setCurrentSection(sectionId)
    router.push(`/assessments/${assessmentId}?step=${sectionId}`, { scroll: false })
  }

  // Handle section completion
  const handleSectionComplete = (sectionId: string) => {
    setCompletedSections(prev => new Set([...prev, sectionId]))
  }

  // Get current section component
  const renderCurrentSection = () => {
    const commonProps = {
      assessmentId,
      onComplete: () => handleSectionComplete(currentSection),
      onNext: () => handleNext(),
    }

    switch (currentSection) {
      case 'context':
        return <ContextScopeForm {...commonProps} />
      case 'data-flow':
        return <DataFlowForm {...commonProps} />
      case 'risk-assessment':
        return <RiskAssessmentForm {...commonProps} />
      case 'mitigation':
        return <MitigationForm {...commonProps} />
      default:
        return <ContextScopeForm {...commonProps} />
    }
  }

  // Navigation handlers
  const handleNext = () => {
    const currentIndex = getSectionIndex(currentSection)
    const sections: SectionId[] = ['context', 'data-flow', 'risk-assessment', 'mitigation']
    
    if (currentIndex < sections.length - 1) {
      handleSectionChange(sections[currentIndex + 1])
    }
  }

  const handlePrevious = () => {
    const currentIndex = getSectionIndex(currentSection)
    const sections: SectionId[] = ['context', 'data-flow', 'risk-assessment', 'mitigation']
    
    if (currentIndex > 0) {
      handleSectionChange(sections[currentIndex - 1])
    }
  }

  const getSectionIndex = (sectionId: SectionId): number => {
    const sections: SectionId[] = ['context', 'data-flow', 'risk-assessment', 'mitigation']
    return sections.indexOf(sectionId)
  }

  const isFirstSection = currentSection === 'context'
  const isLastSection = currentSection === 'mitigation'
  const canProceed = completedSections.has(currentSection)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading assessment...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Section Content */}
      <div className="flex-1 p-6">
        {renderCurrentSection()}
      </div>

      {/* Navigation */}
      <div className="border-t border-border p-6">
        <WizardNavigation
          onPrevious={isFirstSection ? undefined : handlePrevious}
          onNext={isLastSection ? undefined : handleNext}
          canProceed={canProceed}
          isLastSection={isLastSection}
          assessmentId={assessmentId}
        />
      </div>
    </div>
  )
}