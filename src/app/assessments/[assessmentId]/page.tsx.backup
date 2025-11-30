import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// Force dynamic rendering to ensure proper authentication
export const dynamic = 'force-dynamic'

interface AssessmentPageProps {
  params: {
    assessmentId: string
  }
}

export default function AssessmentPage({ params }: AssessmentPageProps) {
  const { assessmentId } = params

  // Debug logging - simplified
  console.log('🚀 Assessment page LOADED with ID:', assessmentId)
  
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Assessment Page Working!</h1>
        <p className="text-lg mb-4">Assessment ID: <code className="bg-muted px-2 py-1 rounded">{assessmentId}</code></p>
        
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-2">✅ Success!</h2>
          <p className="text-muted-foreground mb-4">
            The assessment page is now loading correctly. We can add the DPIA wizard back once this is working.
          </p>
          
          <div className="space-y-2">
            <p><strong>Assessment ID:</strong> {assessmentId}</p>
            <p><strong>ID Length:</strong> {assessmentId?.length}</p>
            <p><strong>Route:</strong> /assessments/{assessmentId}</p>
          </div>
          
          <div className="mt-4">
            <Link href="/dashboard">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}