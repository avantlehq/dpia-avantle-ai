'use client'

import React, { useState, useEffect } from 'react'
import { Target, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { saveAssessmentSectionAction, getAssessmentSectionAction } from '@/lib/actions/assessment-section-actions'
import { toast } from 'sonner'
import { DynamicFormGenerator } from '../dynamic-form-generator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import templateData from '@/lib/templates/dpia-basic-eu-v1.json'
import { DatabaseService } from '@/lib/services/database'

// Extract section definition from JSON template
const sectionDefinition = templateData.sections.risk_assessment

interface RiskAssessmentFormProps {
  assessmentId: string
  onComplete: () => void
  onNext?: () => void
}

export function RiskAssessmentForm({ assessmentId, onComplete }: RiskAssessmentFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Record<string, unknown>>({})
  const [riskEvaluation, setRiskEvaluation] = useState<{
    likelihood: number
    impact: number
    score: number
    level: string
    calculated_at: string
  } | null>(null)

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
      const result = await getAssessmentSectionAction(assessmentId, 'risk_assessment')
      
      if (result.success && result.data) {
        setFormData(result.data)
      }
      
      // Load risk evaluation if it exists
      await loadRiskEvaluation()
    } catch (error) {
      console.error('Error loading section data:', error)
      toast.error('Failed to load existing form data.')
    } finally {
      setLoading(false)
    }
  }
  
  const loadRiskEvaluation = async () => {
    try {
      const db = await DatabaseService.create()
      const assessment = await db.getAssessment(assessmentId)
      
      if (assessment && assessment.data && typeof assessment.data === 'object') {
        const data = assessment.data as Record<string, unknown>
        const riskEval = data.risk_evaluation as {
          likelihood: number
          impact: number
          score: number
          level: string
          calculated_at: string
        } | undefined
        
        if (riskEval) {
          setRiskEvaluation(riskEval)
        }
      }
    } catch (error) {
      console.error('Error loading risk evaluation:', error)
    }
  }

  const onSubmit = async (data: Record<string, unknown>) => {
    setLoading(true)
    try {
      const result = await saveAssessmentSectionAction(assessmentId, 'risk_assessment', data)
      
      if (result.success) {
        // Reload risk evaluation after saving
        await loadRiskEvaluation()
        onComplete()
        toast.success('Risk Assessment section completed successfully.')
      } else {
        throw new Error(result.error || 'Failed to save')
      }
    } catch {
      toast.error('Failed to complete section. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Target className="h-5 w-5 text-dpia-green" />
          <h2 className="text-2xl font-semibold">{sectionDefinition.title}</h2>
        </div>
        <p className="text-muted-foreground">
          {sectionDefinition.description}
        </p>
      </div>

      {/* Risk Evaluation Display */}
      {riskEvaluation && (
        <Card className="avantle-border bg-card/50 backdrop-blur-sm border-l-4 border-l-dpia-red">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {riskEvaluation.level === 'Low' && <CheckCircle className="h-5 w-5 text-green-500" />}
              {riskEvaluation.level === 'Medium' && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
              {(riskEvaluation.level === 'High' || riskEvaluation.level === 'Very High') && <XCircle className="h-5 w-5 text-red-500" />}
              <span style={{ color: 'var(--color-green)' }}>Computed Risk Assessment</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{riskEvaluation.likelihood}</div>
              <div className="text-sm text-muted-foreground">Likelihood</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{riskEvaluation.impact}</div>
              <div className="text-sm text-muted-foreground">Impact</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{riskEvaluation.score}</div>
              <div className="text-sm text-muted-foreground">Score (L×I)</div>
            </div>
            <div className="text-center">
              <Badge 
                className={`
                  ${riskEvaluation.level === 'Low' ? 'bg-green-100 text-green-800 border-green-300' : ''}
                  ${riskEvaluation.level === 'Medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : ''}
                  ${riskEvaluation.level === 'High' ? 'bg-red-100 text-red-800 border-red-300' : ''}
                  ${riskEvaluation.level === 'Very High' ? 'bg-red-200 text-red-900 border-red-400' : ''}
                `}
              >
                {riskEvaluation.level}
              </Badge>
              <div className="text-sm text-muted-foreground mt-1">Risk Level</div>
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
      {/* Risk Assessment Guide */}
      <Card className="avantle-border bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base" style={{ color: 'var(--color-green)' }}>Risk Calculation Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <strong>Risk Score = Likelihood × Impact</strong>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <Badge className="bg-green-100 text-green-800 border-green-300 mb-1">Low</Badge>
              <div>Score: 1-5</div>
            </div>
            <div>
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 mb-1">Medium</Badge>
              <div>Score: 6-12</div>
            </div>
            <div>
              <Badge className="bg-red-100 text-red-800 border-red-300 mb-1">High</Badge>
              <div>Score: 13-20</div>
            </div>
            <div>
              <Badge className="bg-red-200 text-red-900 border-red-400 mb-1">Very High</Badge>
              <div>Score: 21-25</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}