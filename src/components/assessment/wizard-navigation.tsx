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
              className="inline-flex items-center justify-center bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl border border-gray-300 hover:border-gray-400 transform hover:scale-102 transition-all duration-300 px-6 py-3 font-semibold rounded-lg cursor-pointer"
              style={{
                backgroundColor: '#ffffff',
                borderColor: '#9ca3af',
                borderRadius: '8px',
                color: '#4b5563',
                fontSize: '16px',
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
            className="inline-flex items-center justify-center bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl border border-gray-300 hover:border-gray-400 transform hover:scale-102 transition-all duration-300 px-6 py-3 font-semibold rounded-lg cursor-pointer"
            style={{
              backgroundColor: '#ffffff',
              borderColor: '#9ca3af',
              borderRadius: '8px',
              color: '#4b5563',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            <FileText className="mr-2 h-4 w-4" />
            Save Draft
          </Button>

          {/* Next/Complete Button */}
          {isLastSection ? (
            <Button 
              asChild
              className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl border border-green-500 hover:border-green-400 transform hover:scale-102 transition-all duration-300 px-6 py-3 font-semibold rounded-lg cursor-pointer"
              style={{
                backgroundColor: '#16a34a',
                borderColor: '#22c55e',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              <Link href={`/api/export?assessment_id=${assessmentId}&format=pdf`}>
                <Download className="mr-2 h-4 w-4" />
                Export DPIA
              </Link>
            </Button>
          ) : (
            <Button 
              onClick={onNext}
              disabled={!canProceed}
              className="inline-flex items-center justify-center bg-orange-600 hover:bg-orange-700 shadow-lg hover:shadow-xl border border-orange-500 hover:border-orange-400 transform hover:scale-102 transition-all duration-300 px-6 py-3 font-semibold rounded-lg cursor-pointer"
              style={{
                backgroundColor: canProceed ? '#ea580c' : '#9ca3af',
                borderColor: canProceed ? '#f97316' : '#9ca3af',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: '600'
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