'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ChevronLeft, ChevronRight, FileText, Download } from 'lucide-react'

interface WizardNavigationProps {
  onPrevious?: () => void
  onNext?: () => void
  canProceed?: boolean
  isLastSection?: boolean
  assessmentId: string
}

export function WizardNavigation({ 
  onPrevious, 
  onNext, 
  canProceed = false, 
  isLastSection = false,
  assessmentId
}: WizardNavigationProps) {
  return (
    <div className="space-y-4">
      {/* Progress Indicator */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-2">
          Assessment Progress
        </p>
        <Progress value={25} className="h-2" />
        <p className="text-xs text-muted-foreground mt-1">
          Section 1 of 4 complete
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <div>
          {onPrevious && (
            <Button 
              variant="outline" 
              onClick={onPrevious}
              className="inline-flex items-center justify-center shadow-[--shadow-lg] hover:shadow-[--shadow-xl] transform hover:scale-102 transition-[--transition-all] px-[--space-6] py-[--space-3] font-semibold rounded-[--radius-lg] cursor-pointer"
              style={{
                backgroundColor: 'var(--surface-1)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-base)',
                fontWeight: '600'
              }}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Save Draft */}
          <Button 
            variant="outline"
            className="inline-flex items-center justify-center shadow-[--shadow-lg] hover:shadow-[--shadow-xl] transform hover:scale-102 transition-[--transition-all] px-[--space-6] py-[--space-3] font-semibold rounded-[--radius-lg] cursor-pointer"
            style={{
              backgroundColor: 'var(--surface-1)',
              borderColor: 'var(--border-default)',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-base)',
              fontWeight: '600'
            }}
          >
            <FileText className="mr-2 h-4 w-4" />
            Save Draft
          </Button>

          {/* Next/Complete Button */}
          {isLastSection ? (
            <Button 
              onClick={() => window.open(`/api/export?assessment_id=${assessmentId}&format=pdf`, '_blank')}
              className="inline-flex items-center justify-center shadow-[--shadow-lg] hover:shadow-[--shadow-xl] transform hover:scale-102 transition-[--transition-all] px-[--space-6] py-[--space-3] font-semibold rounded-[--radius-lg] cursor-pointer"
              style={{
                backgroundColor: 'var(--status-success)',
                borderColor: 'var(--status-success-border)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-base)',
                fontWeight: '600'
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Export DPIA
            </Button>
          ) : (
            <Button 
              onClick={onNext}
              disabled={!canProceed}
              className="inline-flex items-center justify-center shadow-[--shadow-lg] hover:shadow-[--shadow-xl] transform hover:scale-102 transition-[--transition-all] px-[--space-6] py-[--space-3] font-semibold rounded-[--radius-lg] cursor-pointer"
              style={{
                backgroundColor: canProceed ? 'var(--brand-primary)' : 'var(--text-muted)',
                borderColor: canProceed ? 'var(--brand-primary-border)' : 'var(--border-muted)',
                color: 'var(--text-on-primary)',
                fontSize: 'var(--text-base)',
                fontWeight: '600',
                border: `1px solid ${canProceed ? 'var(--brand-primary-border)' : 'var(--border-muted)'}`
              }}
            >
              Next Section
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Help Text */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          {!canProceed 
            ? 'Complete the current section to proceed' 
            : 'You can proceed to the next section'
          }
        </p>
      </div>
    </div>
  )
}