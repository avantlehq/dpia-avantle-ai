'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PrecheckForm } from '@/components/precheck/precheck-form'
import { PrecheckResults } from '@/components/precheck/precheck-results'
import { toast } from 'sonner'
import { Loader2, FileSearch } from 'lucide-react'
import { Question, PrecheckSubmission, PrecheckResult } from '@/lib/validations/precheck'

type ViewState = 'intro' | 'form' | 'results'

export default function PrecheckPage() {
  const router = useRouter()
  const [viewState, setViewState] = useState<ViewState>('intro')
  const [questions, setQuestions] = useState<Question[]>([])
  const [result, setResult] = useState<PrecheckResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false)

  // Load questions when starting assessment
  const loadQuestions = async () => {
    setIsLoadingQuestions(true)
    try {
      const response = await fetch('/api/precheck')
      if (!response.ok) {
        throw new Error('Failed to load questions')
      }
      const data = await response.json()
      setQuestions(data.questions)
      setViewState('form')
    } catch (error) {
      console.error('Error loading questions:', error)
      toast.error('Failed to load assessment questions')
    } finally {
      setIsLoadingQuestions(false)
    }
  }

  // Submit assessment
  const handleSubmit = async (data: PrecheckSubmission) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/precheck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Assessment failed')
      }

      const responseData = await response.json()
      setResult(responseData.result)
      setViewState('results')
      
      toast.success('Assessment completed successfully!')
    } catch (error) {
      console.error('Error submitting assessment:', error)
      toast.error(error instanceof Error ? error.message : 'Assessment failed')
    } finally {
      setIsLoading(false)
    }
  }

  // Start full DPIA
  const handleStartDPIA = async () => {
    try {
      // Create new assessment 
      const response = await fetch('/api/assessments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'DPIA Assessment (from Pre-check)',
          description: `Started from pre-check assessment with result: ${result?.result}`,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create assessment')
      }

      const data = await response.json()
      toast.success('DPIA assessment created successfully!')
      router.push(`/${data.assessment.id}`)
    } catch (error) {
      console.error('Error creating DPIA:', error)
      toast.error('Failed to create DPIA assessment')
    }
  }

  // Export report (placeholder)
  const handleExportReport = async () => {
    toast.info('Report export functionality coming soon!')
  }

  // Retake assessment
  const handleRetakeAssessment = () => {
    setViewState('intro')
    setResult(null)
  }

  if (viewState === 'intro') {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <FileSearch className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Do I Need a DPIA?</h1>
            <p className="text-lg text-muted-foreground">
              Quick assessment to determine if a Data Protection Impact Assessment is required
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>About This Assessment</CardTitle>
              <CardDescription>
                This quick assessment will help you determine whether your data processing activities 
                require a Data Protection Impact Assessment (DPIA) under GDPR Article 35.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h3 className="font-medium mb-2">What you&apos;ll get:</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Clear recommendation</li>
                    <li>• Risk assessment score</li>
                    <li>• Next steps guidance</li>
                    <li>• Option to start full DPIA</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Assessment details:</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• 8 targeted questions</li>
                    <li>• Takes 3-5 minutes</li>
                    <li>• Based on GDPR criteria</li>
                    <li>• Results saved to your account</li>
                  </ul>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  size="lg" 
                  onClick={loadQuestions}
                  disabled={isLoadingQuestions}
                  className="w-full sm:w-auto"
                >
                  {isLoadingQuestions ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading Assessment...
                    </>
                  ) : (
                    'Start Assessment'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (viewState === 'form') {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">DPIA Pre-check Assessment</h1>
          <p className="text-muted-foreground">
            Answer the following questions about your data processing activities
          </p>
        </div>

        <PrecheckForm 
          questions={questions}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    )
  }

  if (viewState === 'results' && result) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Assessment Results</h1>
          <p className="text-muted-foreground">
            Based on your answers, here&apos;s our recommendation
          </p>
        </div>

        <PrecheckResults
          result={result}
          onStartDPIA={handleStartDPIA}
          onExportReport={handleExportReport}
          onRetakeAssessment={handleRetakeAssessment}
        />
      </div>
    )
  }

  return null
}