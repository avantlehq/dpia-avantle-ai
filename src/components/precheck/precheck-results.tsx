'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, AlertCircle, XCircle, ArrowRight, FileText } from 'lucide-react'
import { PrecheckResult } from '@/lib/validations/precheck'

interface PrecheckResultsProps {
  result: PrecheckResult
  onStartDPIA: () => void
  onExportReport?: () => void
  onRetakeAssessment: () => void
}

export function PrecheckResults({ 
  result, 
  onStartDPIA, 
  onExportReport, 
  onRetakeAssessment 
}: PrecheckResultsProps) {
  
  const getResultIcon = () => {
    switch (result.result) {
      case 'required':
        return <AlertCircle className="h-12 w-12 text-red-500" />
      case 'recommended':
        return <CheckCircle className="h-12 w-12 text-yellow-500" />
      case 'not_required':
        return <XCircle className="h-12 w-12 text-green-500" />
    }
  }

  const getResultBadge = () => {
    switch (result.result) {
      case 'required':
        return <Badge variant="destructive" className="text-sm">Required</Badge>
      case 'recommended':
        return <Badge variant="secondary" className="text-sm bg-yellow-100 text-yellow-800">Recommended</Badge>
      case 'not_required':
        return <Badge variant="secondary" className="text-sm bg-green-100 text-green-800">Not Required</Badge>
    }
  }

  const shouldShowDPIAButton = result.result === 'required' || result.result === 'recommended'

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Main result card */}
      <Card>
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            {getResultIcon()}
          </div>
          <div className="space-y-2">
            {getResultBadge()}
            <CardTitle className="text-2xl">{result.title}</CardTitle>
            <CardDescription className="text-base max-w-2xl mx-auto">
              {result.description}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score display */}
          <div className="text-center py-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-primary">{result.score}</div>
            <div className="text-sm text-muted-foreground">Assessment Score (out of 24)</div>
          </div>

          {/* Recommendation */}
          <div>
            <h3 className="font-semibold mb-2">Recommendation</h3>
            <p className="text-muted-foreground">{result.recommendation}</p>
          </div>

          {/* Next steps */}
          <div>
            <h3 className="font-semibold mb-3">Next Steps</h3>
            <ul className="space-y-2">
              {result.next_steps.map((step, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {shouldShowDPIAButton && (
          <Button size="lg" onClick={onStartDPIA} className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4" />
            Start Full DPIA Assessment
          </Button>
        )}
        
        {onExportReport && (
          <Button variant="outline" size="lg" onClick={onExportReport} className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Export Report
          </Button>
        )}
      </div>

      {/* Secondary actions */}
      <div className="flex justify-center pt-4">
        <Button variant="ghost" onClick={onRetakeAssessment}>
          Retake Assessment
        </Button>
      </div>

      {/* Disclaimer */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <p className="text-xs text-muted-foreground text-center">
            <strong>Disclaimer:</strong> This assessment provides general guidance only and should not be considered legal advice. 
            The final determination of whether a DPIA is required depends on the specific circumstances of your data processing activities. 
            Consider consulting with your Data Protection Officer or legal counsel for definitive guidance.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}