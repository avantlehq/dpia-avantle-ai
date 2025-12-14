'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { submitAssessmentAction } from '@/lib/actions/assessment-actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface MitigationFormProps {
  assessmentId: string
  onComplete: () => void
  onNext: () => void
}

export function MitigationForm({ assessmentId, onComplete }: MitigationFormProps) {
  const [isCompleting, setIsCompleting] = useState(false)
  const router = useRouter()

  const handleComplete = async () => {
    setIsCompleting(true)
    try {
      const result = await submitAssessmentAction(assessmentId)
      
      if (result.success) {
        onComplete()
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
          <h2 className="text-2xl font-semibold">Mitigation Measures</h2>
          <Badge variant="secondary">Coming Soon</Badge>
        </div>
        <p className="text-muted-foreground">
          Define technical and organizational measures to mitigate identified risks.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-green-500" />
            Section Under Development
          </CardTitle>
          <CardDescription>
            This section will include forms for:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Technical safeguards and controls</li>
            <li>• Organizational measures and policies</li>
            <li>• Privacy-by-design implementations</li>
            <li>• Monitoring and review procedures</li>
            <li>• Residual risk assessment</li>
            <li>• Compliance demonstration measures</li>
          </ul>
          
          <div className="mt-6">
            <Button 
              onClick={handleComplete}
              disabled={isCompleting}
              className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl border border-green-500 hover:border-green-400 transform hover:scale-102 transition-all duration-300 px-6 py-3 font-semibold rounded-lg cursor-pointer"
              style={{
                backgroundColor: isCompleting ? '#9ca3af' : '#16a34a',
                borderColor: isCompleting ? '#9ca3af' : '#22c55e',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              {isCompleting ? 'Completing...' : 'Complete Assessment'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}