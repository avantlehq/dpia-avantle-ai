'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ChevronLeft, ChevronRight, FileText, Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

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
              className="px-4 py-2 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors"
              style={{
                borderColor: '#9ca3af',
                color: '#6b7280',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Save Draft */}
          <Button 
            variant="ghost" 
            size="sm"
            style={{
              color: '#6b7280',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <FileText className="mr-2 h-4 w-4" />
            Save Draft
          </Button>

          {/* Next/Complete Button */}
          {isLastSection ? (
            <Button 
              asChild
              className="px-4 py-2 shadow-sm hover:shadow-md transition-shadow"
              style={{
                backgroundColor: '#16a34a',
                borderColor: '#16a34a',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              <Link href={`/assessments/${assessmentId}/export`}>
                <Download className="mr-2 h-4 w-4" />
                Export DPIA
              </Link>
            </Button>
          ) : (
            <Button 
              onClick={onNext}
              disabled={!canProceed}
              className="px-4 py-2 shadow-sm hover:shadow-md transition-shadow"
              style={{
                backgroundColor: canProceed ? '#ea580c' : '#9ca3af',
                borderColor: canProceed ? '#ea580c' : '#9ca3af',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '500'
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