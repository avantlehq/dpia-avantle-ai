import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, ArrowRight, Save } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface WizardStepProps {
  title: string
  description?: string
  children: React.ReactNode
  canProceed?: boolean
  isFirstStep?: boolean
  isLastStep?: boolean
  onPrevious?: () => void
  onNext?: () => void
  onSave?: () => void
  loading?: boolean
}

export function WizardStep({
  title,
  description,
  children,
  canProceed = true,
  isFirstStep = false,
  isLastStep = false,
  onPrevious,
  onNext,
  onSave,
  loading = false
}: WizardStepProps) {
  const t = useTranslations('common')

  return (
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            {description && (
              <CardDescription>{description}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {children}
            
            <div className="flex items-center justify-between pt-6 border-t">
              <div>
                {!isFirstStep && (
                  <Button 
                    variant="outline" 
                    onClick={onPrevious}
                    disabled={loading}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t('back')}
                  </Button>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline"
                  onClick={onSave}
                  disabled={loading}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {t('save')}
                </Button>
                
                {!isLastStep ? (
                  <Button 
                    onClick={onNext}
                    disabled={!canProceed || loading}
                  >
                    {t('next')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    onClick={onNext}
                    disabled={!canProceed || loading}
                  >
                    Complete Assessment
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}