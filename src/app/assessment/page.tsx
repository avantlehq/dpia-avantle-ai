'use client'

import { useSearchParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useMemo, Suspense } from 'react'
import { DPIAWizard } from '@/components/assessment/dpia-wizard'

function AssessmentContent() {
  const searchParams = useSearchParams()
  
  const assessmentId = useMemo(() => {
    const id = searchParams.get('id')
    console.log('🚀 Assessment page LOADED with ID from params:', id)
    return id
  }, [searchParams])

  if (!assessmentId) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">No Assessment ID Found</h1>
          <p className="mb-4">This page requires an assessment ID parameter.</p>
          <div className="bg-muted p-4 rounded-lg">
            <p><strong>Expected URL format:</strong> /assessment?id=assessment-xxxxx</p>
            <p><strong>Current URL params:</strong> {searchParams.toString() || 'none'}</p>
          </div>
          <div className="mt-4">
            <Link href="/dashboard">
              <Button 
                variant="outline"
                className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl border border-blue-500 hover:border-blue-400 transform hover:scale-102 transition-all duration-300 px-8 py-4 font-semibold rounded-lg cursor-pointer"
                style={{
                  backgroundColor: '#2563eb',
                  borderColor: '#3b82f6',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '18px',
                  fontWeight: '600'
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <DPIAWizard assessmentId={assessmentId} />
  )
}

export default function AssessmentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Loading Assessment...</h1>
          <p>Getting assessment details...</p>
        </div>
      </div>
    }>
      <AssessmentContent />
    </Suspense>
  )
}