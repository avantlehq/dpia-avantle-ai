'use client'

import { useSearchParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function AssessmentPage() {
  const searchParams = useSearchParams()
  const [assessmentId, setAssessmentId] = useState<string | null>(null)

  useEffect(() => {
    const id = searchParams.get('id')
    console.log('🚀 Assessment page LOADED with ID from params:', id)
    setAssessmentId(id)
  }, [searchParams])

  if (!assessmentId) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Loading Assessment...</h1>
          <p>Getting assessment ID from URL parameters...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Assessment Page Working! 🎉</h1>
        <p className="text-lg mb-4">Assessment ID: <code className="bg-muted px-2 py-1 rounded">{assessmentId}</code></p>
        
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-2">✅ Success!</h2>
          <p className="text-muted-foreground mb-4">
            The assessment page is now loading correctly using URL parameters instead of dynamic routing.
          </p>
          
          <div className="space-y-2">
            <p><strong>Assessment ID:</strong> {assessmentId}</p>
            <p><strong>ID Length:</strong> {assessmentId?.length}</p>
            <p><strong>Route:</strong> /assessment?id={assessmentId}</p>
          </div>
          
          <div className="mt-4 space-x-4">
            <Link href="/dashboard">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <Button className="bg-dpia-orange hover:bg-dpia-orange/90 text-white">
              Continue with DPIA →
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}