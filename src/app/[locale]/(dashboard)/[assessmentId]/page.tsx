'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { WizardProgress } from '@/components/wizard/wizard-progress'
import { WizardStep } from '@/components/wizard/wizard-step'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Link } from '../../../../../i18n/routing'
import { toast } from 'sonner'

interface AssessmentData {
  identification: {
    processing_name: string
    controller: string
    data_protection_officer: string
  }
  legal_basis: {
    lawfulness_basis: string
    description: string
  }
  data_types: {
    personal_data: string[]
    special_categories: string[]
    criminal_data: boolean
  }
  // Add more steps as needed
}

export default function AssessmentPage() {
  const t = useTranslations('wizard')
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [assessmentData, setAssessmentData] = useState<Partial<AssessmentData>>({})

  const handleNext = () => {
    if (currentStep < 9) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep])
      }
      setCurrentStep(currentStep + 1)
    } else {
      // Complete assessment
      toast.success('Assessment completed successfully')
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // TODO: Save to API
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Progress saved')
    } catch (error) {
      toast.error('Failed to save progress')
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <WizardStep
            title={t('steps.identification')}
            description="Identify the data processing activity and key stakeholders"
            onNext={handleNext}
            onSave={handleSave}
            loading={loading}
            isFirstStep
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="processing_name">Processing Name *</Label>
                <Input
                  id="processing_name"
                  placeholder="e.g., Employee Performance Management"
                  value={assessmentData.identification?.processing_name || ''}
                  onChange={(e) => setAssessmentData({
                    ...assessmentData,
                    identification: {
                      ...assessmentData.identification,
                      processing_name: e.target.value
                    } as any
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="controller">Data Controller *</Label>
                <Input
                  id="controller"
                  placeholder="Organization name"
                  value={assessmentData.identification?.controller || ''}
                  onChange={(e) => setAssessmentData({
                    ...assessmentData,
                    identification: {
                      ...assessmentData.identification,
                      controller: e.target.value
                    } as any
                  })}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="dpo">Data Protection Officer</Label>
                <Input
                  id="dpo"
                  placeholder="DPO name or contact information"
                  value={assessmentData.identification?.data_protection_officer || ''}
                  onChange={(e) => setAssessmentData({
                    ...assessmentData,
                    identification: {
                      ...assessmentData.identification,
                      data_protection_officer: e.target.value
                    } as any
                  })}
                />
              </div>
            </div>
          </WizardStep>
        )

      case 1:
        return (
          <WizardStep
            title={t('steps.legalBasis')}
            description="Establish the lawful basis for processing personal data"
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSave={handleSave}
            loading={loading}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="lawfulness_basis">Lawfulness Basis *</Label>
                <Select
                  value={assessmentData.legal_basis?.lawfulness_basis || ''}
                  onValueChange={(value) => setAssessmentData({
                    ...assessmentData,
                    legal_basis: {
                      ...assessmentData.legal_basis,
                      lawfulness_basis: value
                    } as any
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select legal basis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consent">Consent</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="legal_obligation">Legal obligation</SelectItem>
                    <SelectItem value="vital_interests">Vital interests</SelectItem>
                    <SelectItem value="public_task">Public task</SelectItem>
                    <SelectItem value="legitimate_interests">Legitimate interests</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="legal_description">Description *</Label>
                <Textarea
                  id="legal_description"
                  placeholder="Describe how this legal basis applies to your processing..."
                  rows={4}
                  value={assessmentData.legal_basis?.description || ''}
                  onChange={(e) => setAssessmentData({
                    ...assessmentData,
                    legal_basis: {
                      ...assessmentData.legal_basis,
                      description: e.target.value
                    } as any
                  })}
                />
              </div>
            </div>
          </WizardStep>
        )

      default:
        return (
          <WizardStep
            title={`Step ${currentStep + 1} - ${t(`steps.${['identification', 'legalBasis', 'dataTypes', 'purposes', 'risks', 'measures', 'safeguards', 'impact', 'review', 'conclusion'][currentStep]}`)}`}
            description={`This step will be implemented in the next phase. (Step ${currentStep + 1}/10)`}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSave={handleSave}
            loading={loading}
            isLastStep={currentStep === 9}
          >
            <div className="text-center py-12">
              <div className="text-lg text-muted-foreground mb-4">
                Step {currentStep + 1} - Coming Soon
              </div>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                This step will contain the form fields and validation logic for {t(`steps.${['identification', 'legalBasis', 'dataTypes', 'purposes', 'risks', 'measures', 'safeguards', 'impact', 'review', 'conclusion'][currentStep]}`).toLowerCase()}.
                The complete wizard implementation will be added in the next development phase.
              </p>
            </div>
          </WizardStep>
        )
    }
  }

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
        currentStep={currentStep} 
        completedSteps={completedSteps}
      />
      
      {renderStep()}
    </div>
  )
}