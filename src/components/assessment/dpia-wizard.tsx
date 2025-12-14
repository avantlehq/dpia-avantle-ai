'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ContextScopeForm } from './sections/context-scope-form'
import { DataFlowForm } from './sections/data-flow-form' 
import { RiskAssessmentForm } from './sections/risk-assessment-form'
import { MitigationForm } from './sections/mitigation-measures-form'
import { WizardNavigation } from './wizard-navigation'
import { ValidationPanel } from '@/components/validation/validation-panel'
import { SectionValidationIndicator } from '@/components/validation/section-validation-indicator'
import { useTemplateValidation } from '@/hooks/use-template-validation'
// import { dpiaWizardSteps } from '@/lib/state/navigation'
import { Loader2, ChevronRight } from 'lucide-react'

interface DPIAWizardProps {
  assessmentId: string
}

type SectionId = 'context_scope' | 'data_flow_processing' | 'risk_assessment' | 'mitigation_measures'

export function DPIAWizard({ assessmentId }: DPIAWizardProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentSection, setCurrentSection] = useState<SectionId>('context_scope')
  const [loading] = useState(false)
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set())
  const [showValidation, setShowValidation] = useState(false)
  
  // Template validation hook
  const {
    validationResult,
    sectionValidations,
    isValidating,
    refreshValidation,
    completionPercentage
  } = useTemplateValidation({ assessmentId, autoValidate: true })

  // Initialize current section from URL or default to first
  useEffect(() => {
    const step = searchParams.get('step')
    if (step && ['context_scope', 'data_flow_processing', 'risk_assessment', 'mitigation_measures'].includes(step)) {
      setCurrentSection(step as SectionId)
    }
  }, [searchParams])

  // Update URL when section changes
  const handleSectionChange = (sectionId: SectionId) => {
    setCurrentSection(sectionId)
    router.push(`/assessment?id=${assessmentId}&step=${sectionId}`, { scroll: false })
  }

  // Handle section completion
  const handleSectionComplete = (sectionId: string) => {
    setCompletedSections(prev => new Set([...prev, sectionId]))
    // Refresh validation after section completion
    setTimeout(() => refreshValidation(), 500)
  }

  // Get current section component
  const renderCurrentSection = () => {
    const commonProps = {
      assessmentId,
      onComplete: () => handleSectionComplete(currentSection),
      onNext: () => handleNext(),
    }

    switch (currentSection) {
      case 'context_scope':
        return <ContextScopeForm {...commonProps} />
      case 'data_flow_processing':
        return <DataFlowForm {...commonProps} />
      case 'risk_assessment':
        return <RiskAssessmentForm {...commonProps} />
      case 'mitigation_measures':
        return <MitigationForm {...commonProps} />
      default:
        return <ContextScopeForm {...commonProps} />
    }
  }

  // Navigation handlers
  const handleNext = () => {
    const currentIndex = getSectionIndex(currentSection)
    const sections: SectionId[] = ['context_scope', 'data_flow_processing', 'risk_assessment', 'mitigation_measures']
    
    if (currentIndex < sections.length - 1) {
      handleSectionChange(sections[currentIndex + 1])
    }
  }

  const handlePrevious = () => {
    const currentIndex = getSectionIndex(currentSection)
    const sections: SectionId[] = ['context_scope', 'data_flow_processing', 'risk_assessment', 'mitigation_measures']
    
    if (currentIndex > 0) {
      handleSectionChange(sections[currentIndex - 1])
    }
  }

  const getSectionIndex = (sectionId: SectionId): number => {
    const sections: SectionId[] = ['context_scope', 'data_flow_processing', 'risk_assessment', 'mitigation_measures']
    return sections.indexOf(sectionId)
  }

  const isFirstSection = currentSection === 'context_scope'
  const isLastSection = currentSection === 'mitigation_measures'
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
    <div className="flex gap-6 h-full">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Section Progress */}
        <div className="bg-muted/30 border-b p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">DPIA Progress</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {completionPercentage}% Complete
              </span>
              <button
                onClick={() => setShowValidation(!showValidation)}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                {showValidation ? 'Hide' : 'Show'} Validation
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {['context_scope', 'data_flow_processing', 'risk_assessment', 'mitigation_measures'].map((sectionId, index) => (
              <React.Fragment key={sectionId}>
                <button
                  onClick={() => handleSectionChange(sectionId as SectionId)}
                  className={`flex items-center gap-1 px-2 py-1 rounded ${
                    currentSection === sectionId ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <span className={`text-xs ${currentSection === sectionId ? 'font-medium' : ''}`}>
                    {getSectionDisplayName(sectionId)}
                  </span>
                  <SectionValidationIndicator 
                    sectionValidation={sectionValidations[sectionId] || null}
                    className="scale-75"
                  />
                </button>
                {index < 3 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
              </React.Fragment>
            ))}
          </div>
        </div>

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

      {/* Validation Panel (Collapsible) */}
      {showValidation && (
        <div className="w-80 border-l">
          <ValidationPanel 
            validationResult={validationResult}
            isValidating={isValidating}
            className="h-full border-0 rounded-none"
          />
        </div>
      )}
    </div>
  )
}

function getSectionDisplayName(sectionId: string): string {
  const sectionNames: Record<string, string> = {
    'context_scope': 'Context',
    'data_flow_processing': 'Data Flow',
    'risk_assessment': 'Risk',
    'mitigation_measures': 'Mitigation'
  }
  return sectionNames[sectionId] || sectionId
}