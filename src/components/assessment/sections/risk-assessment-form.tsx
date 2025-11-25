'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface RiskAssessmentFormProps {
  assessmentId: string
  onComplete: () => void
  onNext: () => void
}

export function RiskAssessmentForm({ assessmentId, onComplete, onNext }: RiskAssessmentFormProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Target className="h-5 w-5 text-dpia-red" />
          <h2 className="text-2xl font-semibold">Risk Assessment</h2>
          <Badge variant="secondary">Coming Soon</Badge>
        </div>
        <p className="text-muted-foreground">
          Identify, assess and score privacy risks to data subjects.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Section Under Development
          </CardTitle>
          <CardDescription>
            This section will include forms for:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Risk identification and categorization</li>
            <li>• Likelihood assessment (1-5 scale)</li>
            <li>• Impact evaluation (1-5 scale)</li>
            <li>• Risk scoring (likelihood × impact)</li>
            <li>• Affected rights and freedoms</li>
            <li>• Risk scenarios and threat modeling</li>
          </ul>
          
          <div className="mt-6">
            <Button 
              onClick={() => {
                onComplete()
                onNext()
              }}
              variant="outline"
            >
              Skip for Now (Development)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}