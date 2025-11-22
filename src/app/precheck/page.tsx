'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
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
    <div className="px-4 py-16 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" className="avantle-border" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Badge variant="secondary" className="avantle-border bg-card text-card-foreground">
              <CheckCircle className="mr-2 h-3 w-3" />
              DPIA Pre-check
            </Badge>
          </div>
          <h1 className="text-4xl lg:text-5xl font-light tracking-tight mb-4 text-foreground">
            Do I need a DPIA?
          </h1>
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
          <Card className="avantle-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-card-foreground">
                GDPR Article 35 Assessment
              </CardTitle>
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