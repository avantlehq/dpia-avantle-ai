'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle } from 'lucide-react'
import { Breadcrumbs } from '@/components/navigation/breadcrumbs'
import { PrecheckForm } from '@/components/precheck/precheck-form'
import { PrecheckResults } from '@/components/precheck/precheck-results'
import { PrecheckService } from '@/lib/services/precheck'
import type { PrecheckResult } from '@/lib/validations/precheck'
import { isError, isSuccess } from '@/lib/types/result'
import { ErrorState } from '@/components/ui/error-state'
import { LoadingSkeleton } from '@/components/ui/loading-skeleton'
import type { PrecheckSubmission } from '@/lib/validations/precheck'

export default function PrecheckPage() {
  const [results, setResults] = useState<PrecheckResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: PrecheckSubmission) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await PrecheckService.submitAssessment(data.answers)
      
      if (isError(result)) {
        setError(result.message)
        return
      }
      
      if (isSuccess(result)) {
        setResults(result.data)
      }
    } catch (error) {
      console.error('Error submitting precheck:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
        <Breadcrumbs
          items={[
            { label: "Pre-check", href: "/precheck", current: true }
          ]}
        />
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Badge variant="secondary" className="avantle-border bg-icon-green border-dpia-green" style={{ color: 'var(--color-green)' }}>
              <CheckCircle className="mr-2 h-3 w-3" style={{ color: 'var(--color-green)' }} />
              DPIA Pre-check
            </Badge>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'var(--color-green)' }}></div>
            <h1 className="text-4xl lg:text-5xl font-light tracking-tight text-foreground">
              Do I need a DPIA?
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl font-light leading-relaxed">
            Quick 8-question evaluation to determine if your project requires a Data Protection Impact Assessment under GDPR Article 35.
          </p>
        </div>

        {/* Content */}
        {error ? (
          <ErrorState 
            title="Assessment Failed"
            message={error}
            onRetry={() => setError(null)}
            showHomeButton={false}
          />
        ) : !results ? (
          <Card className="avantle-border bg-card backdrop-blur-sm border-l-4 border-l-dpia-green shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-icon-green hover:bg-icon-green-hover transition-colors duration-200">
                  <CheckCircle className="h-5 w-5" style={{ color: 'var(--color-green)' }} />
                </div>
                <CardTitle className="text-card-foreground">
                  GDPR Article 35 Assessment
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <LoadingSkeleton 
                  title="Processing assessment..."
                  description="Analyzing your answers against GDPR Article 35 criteria"
                />
              ) : (
                <PrecheckForm
                  questions={PrecheckService.getQuestions()}
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                />
              )}
            </CardContent>
          </Card>
        ) : (
          <PrecheckResults 
            result={results}
            onStartDPIA={() => window.location.href = '/onboarding'}
            onRetakeAssessment={() => {
              setResults(null)
              setError(null)
            }}
          />
        )}

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground font-light">
            Assessment based on GDPR Article 35 and supervisory authority guidance
          </p>
        </div>
      </div>
  )
}