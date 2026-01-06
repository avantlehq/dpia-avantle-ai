'use client'

import React, { useState, useEffect } from 'react'
import { Shield, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import { saveAssessmentSectionAction, getAssessmentSectionAction } from '@/lib/actions/assessment-section-actions'
import { toast } from 'sonner'
import { DynamicFormGenerator } from '../dynamic-form-generator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { submitAssessmentAction } from '@/lib/actions/assessment-actions'
import { useRouter } from 'next/navigation'
import templateData from '@/lib/templates/dpia-basic-eu-v1.json'
import { DatabaseService } from '@/lib/services/database'

// Extract section definition from JSON template
const sectionDefinition = templateData.sections.mitigation_measures

interface MitigationMeasuresFormProps {
  assessmentId: string
  onComplete: () => void
  onNext?: () => void
}

export function MitigationForm({ assessmentId, onComplete }: MitigationMeasuresFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Record<string, unknown>>({})
  const [residualRiskEvaluation, setResidualRiskEvaluation] = useState<{
    residual_likelihood: number
    residual_impact: number
    residual_score: number
    residual_level: string
    calculated_at: string
  } | null>(null)
  const [isCompleting, setIsCompleting] = useState(false)
  const router = useRouter()

  // Load existing data on mount
  useEffect(() => {
    if (assessmentId) {
      loadSectionData()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessmentId])

  const loadSectionData = async () => {
    setLoading(true)
    try {
      const result = await getAssessmentSectionAction(assessmentId, 'mitigation_measures')
      
      if (result.success && result.data) {
        setFormData(result.data)
      }
      
      // Load residual risk evaluation if it exists
      await loadResidualRiskEvaluation()
    } catch (error) {
      console.error('Error loading section data:', error)
      toast.error('Failed to load existing form data.')
    } finally {
      setLoading(false)
    }
  }
  
  const loadResidualRiskEvaluation = async () => {
    try {
      const db = await DatabaseService.create()
      const assessment = await db.getAssessment(assessmentId)
      
      if (assessment && assessment.data && typeof assessment.data === 'object') {
        const data = assessment.data as Record<string, unknown>
        const riskEval = data.risk_evaluation as {
          residual_likelihood?: number
          residual_impact?: number
          residual_score?: number
          residual_level?: string
          calculated_at?: string
        } | undefined
        
        if (riskEval && riskEval.residual_likelihood && riskEval.residual_impact) {
          setResidualRiskEvaluation({
            residual_likelihood: riskEval.residual_likelihood,
            residual_impact: riskEval.residual_impact,
            residual_score: riskEval.residual_score || 0,
            residual_level: riskEval.residual_level || 'Unknown',
            calculated_at: riskEval.calculated_at || new Date().toISOString()
          })
        }
      }
    } catch (error) {
      console.error('Error loading residual risk evaluation:', error)
    }
  }

  const onSubmit = async (data: Record<string, unknown>) => {
    setLoading(true)
    try {
      const result = await saveAssessmentSectionAction(assessmentId, 'mitigation_measures', data)
      
      if (result.success) {
        // Reload residual risk evaluation after saving
        await loadResidualRiskEvaluation()
        onComplete()
        toast.success('Mitigation Measures section completed successfully.')
      } else {
        throw new Error(result.error || 'Failed to save')
      }
    } catch {
      toast.error('Failed to complete section. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteAssessment = async () => {
    setIsCompleting(true)
    try {
      const result = await submitAssessmentAction(assessmentId)
      
      if (result.success) {
        toast.success('Assessment completed successfully!')
        
        // Navigate back to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        toast.error('Failed to complete assessment')
      }
    } catch (error) {
      console.error('Error completing assessment:', error)
      toast.error('Error completing assessment')
    } finally {
      setIsCompleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-5 w-5 text-dpia-green" />
          <h2 className="text-2xl font-semibold">{sectionDefinition.title}</h2>
        </div>
        <p className="text-muted-foreground">
          {sectionDefinition.description}
        </p>
      </div>

      {/* Residual Risk Evaluation Display */}
      {residualRiskEvaluation && (
        <Card className="avantle-border bg-card/50 backdrop-blur-sm border-l-4 border-l-dpia-green">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {residualRiskEvaluation.residual_level === 'Low' && <CheckCircle className="h-5 w-5 text-green-500" />}
              {residualRiskEvaluation.residual_level === 'Medium' && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
              {(residualRiskEvaluation.residual_level === 'High' || residualRiskEvaluation.residual_level === 'Very High') && <XCircle className="h-5 w-5 text-red-500" />}
              <span style={{ color: 'var(--color-green)' }}>Computed Residual Risk Assessment</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{residualRiskEvaluation.residual_likelihood}</div>
              <div className="text-sm text-muted-foreground">Residual Likelihood</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{residualRiskEvaluation.residual_impact}</div>
              <div className="text-sm text-muted-foreground">Residual Impact</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{residualRiskEvaluation.residual_score}</div>
              <div className="text-sm text-muted-foreground">Score (L×I)</div>
            </div>
            <div className="text-center">
              <Badge 
                className={`
                  ${residualRiskEvaluation.residual_level === 'Low' ? 'bg-green-100 text-green-800 border-green-300' : ''}
                  ${residualRiskEvaluation.residual_level === 'Medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : ''}
                  ${residualRiskEvaluation.residual_level === 'High' ? 'bg-red-100 text-red-800 border-red-300' : ''}
                  ${residualRiskEvaluation.residual_level === 'Very High' ? 'bg-red-200 text-red-900 border-red-400' : ''}
                `}
              >
                {residualRiskEvaluation.residual_level}
              </Badge>
              <div className="text-sm text-muted-foreground mt-1">Residual Risk Level</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dynamic Form Generator */}
      <DynamicFormGenerator
        key={`form-${assessmentId}-${Object.keys(formData).length}`}
        section={sectionDefinition}
        onSubmit={onSubmit}
        defaultValues={formData}
        loading={loading}
        submitButtonText="Complete Section"
      />

      {/* Complete Assessment Button */}
      <Card className="avantle-border bg-card/50 backdrop-blur-sm border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            Complete DPIA Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Once you have completed all mitigation measures documentation, you can finalize the entire DPIA assessment.
          </p>
          <Button 
            onClick={handleCompleteAssessment}
            disabled={isCompleting}
            className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl border border-green-500 hover:border-green-400 transform hover:scale-102 transition-all duration-300 px-6 py-3 font-semibold rounded-lg cursor-pointer"
            style={{
              backgroundColor: isCompleting ? '#9ca3af' : '#16a34a',
              borderColor: isCompleting ? '#9ca3af' : '#22c55e',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            {isCompleting ? 'Completing...' : 'Complete Assessment'}
          </Button>
        </CardContent>
      </Card>

      {/* Mitigation Assessment Guide */}
      <Card className="avantle-border bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base" style={{ color: 'var(--color-green)' }}>Mitigation Measures Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <strong>Residual Risk = Risk after implementing mitigation measures</strong>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <div className="font-semibold mb-1">Technical Measures</div>
              <div>Encryption, access controls, monitoring</div>
            </div>
            <div>
              <div className="font-semibold mb-1">Organisational Measures</div>
              <div>Policies, training, incident response</div>
            </div>
            <div>
              <div className="font-semibold mb-1">Privacy by Design</div>
              <div>Data minimization, default settings</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}