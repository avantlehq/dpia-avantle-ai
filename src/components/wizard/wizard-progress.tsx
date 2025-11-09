import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import { CheckCircle } from 'lucide-react'

const steps = [
  'identification',
  'legalBasis',
  'dataTypes', 
  'purposes',
  'risks',
  'measures',
  'safeguards',
  'impact',
  'review',
  'conclusion'
] as const

interface WizardProgressProps {
  currentStep: number
  completedSteps: number[]
}

export function WizardProgress({ currentStep, completedSteps }: WizardProgressProps) {
  const t = useTranslations('wizard')

  return (
    <div className="w-64 bg-card border-r border-border p-6">
      <div className="space-y-1 mb-6">
        <h2 className="text-lg font-semibold">{t('title')}</h2>
        <p className="text-sm text-muted-foreground">
          {t('step')} {currentStep + 1} {t('of')} {steps.length}
        </p>
      </div>
      
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(index)
          const isCurrent = index === currentStep
          const isAccessible = index <= currentStep || isCompleted
          
          return (
            <div 
              key={step}
              className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                isCurrent ? 'bg-primary/10 border border-primary/20' : ''
              } ${!isAccessible ? 'opacity-50' : ''}`}
            >
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                isCompleted 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  : isCurrent
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {isCompleted ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium ${
                  isCurrent ? 'text-primary' : 'text-foreground'
                }`}>
                  {t(`steps.${step}`)}
                </div>
              </div>
              
              {isCompleted && (
                <Badge variant="outline" className="text-xs">
                  Done
                </Badge>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}