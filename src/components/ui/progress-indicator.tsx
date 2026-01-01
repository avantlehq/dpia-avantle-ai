'use client'

import { Progress } from '@/components/ui/progress'
import { CheckCircle, Circle } from 'lucide-react'

interface ProgressStep {
  id: string
  title: string
  status: 'pending' | 'current' | 'completed'
}

interface ProgressIndicatorProps {
  steps: ProgressStep[]
  progress?: number
  showPercentage?: boolean
}

export function ProgressIndicator({ 
  steps, 
  progress, 
  showPercentage = false 
}: ProgressIndicatorProps) {
  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      {progress !== undefined && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-foreground">Progress</span>
            {showPercentage && (
              <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
            )}
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {/* Step List */}
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-3">
            {/* Step Icon */}
            <div className="flex-shrink-0">
              {step.status === 'completed' ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : step.status === 'current' ? (
                <div className="h-5 w-5 rounded-full bg-primary border-2 border-primary animate-pulse" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
            </div>

            {/* Step Content */}
            <div className="flex-1 min-w-0">
              <p 
                className={`text-sm font-medium truncate ${
                  step.status === 'completed' 
                    ? 'text-green-600' 
                    : step.status === 'current'
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                {step.title}
              </p>
              {step.status === 'current' && (
                <p className="text-xs text-muted-foreground">
                  In progress...
                </p>
              )}
            </div>

            {/* Step Number */}
            <div className="flex-shrink-0">
              <span 
                className={`text-xs px-2 py-1 rounded-full ${
                  step.status === 'completed'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : step.status === 'current'
                    ? 'bg-primary/10 text-primary'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                }`}
              >
                {index + 1}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Pre-configured progress indicators for common workflows
export function AssessmentProgressIndicator({ currentStep = 0 }: { currentStep?: number }) {
  const steps: ProgressStep[] = [
    {
      id: 'basic-info',
      title: 'Basic Information',
      status: currentStep > 0 ? 'completed' : currentStep === 0 ? 'current' : 'pending'
    },
    {
      id: 'data-processing',
      title: 'Data Processing Details',
      status: currentStep > 1 ? 'completed' : currentStep === 1 ? 'current' : 'pending'
    },
    {
      id: 'risk-assessment',
      title: 'Risk Assessment',
      status: currentStep > 2 ? 'completed' : currentStep === 2 ? 'current' : 'pending'
    },
    {
      id: 'measures-consultation',
      title: 'Measures & Consultation',
      status: currentStep > 3 ? 'completed' : currentStep === 3 ? 'current' : 'pending'
    }
  ]

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <ProgressIndicator 
      steps={steps} 
      currentStep={currentStep} 
      progress={progress}
      showPercentage
    />
  )
}

export function SaveProgressIndicator({ isSaving = false }: { isSaving?: boolean }) {
  const steps: ProgressStep[] = [
    {
      id: 'validation',
      title: 'Validating form data',
      status: isSaving ? 'current' : 'pending'
    },
    {
      id: 'saving',
      title: 'Saving to database',
      status: 'pending'
    },
    {
      id: 'complete',
      title: 'Save complete',
      status: 'pending'
    }
  ]

  return (
    <div className="p-4 bg-card border border-border rounded-lg">
      <ProgressIndicator steps={steps} />
    </div>
  )
}