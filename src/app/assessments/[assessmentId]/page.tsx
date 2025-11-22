import { PageHeader } from '@/components/layout/page-header'
import { Breadcrumbs } from '@/components/navigation/breadcrumbs'
import { EmptyState } from '@/components/ui/empty-state'
import { FileText, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// Force dynamic rendering to ensure proper authentication
export const dynamic = 'force-dynamic'

interface AssessmentPageProps {
  params: {
    assessmentId: string
  }
}

export default async function AssessmentPage({ params }: AssessmentPageProps) {
  const { assessmentId } = params

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Assessment ${assessmentId}`}
        description="DPIA wizard - complete your Data Protection Impact Assessment step by step."
        action={
          <Button variant="outline" asChild>
            <Link href="/assessments">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Assessments
            </Link>
          </Button>
        }
      />

      <Breadcrumbs
        items={[
          { label: "Builder", href: "/assessments" },
          { label: `Assessment ${assessmentId}`, href: `/assessments/${assessmentId}`, current: true }
        ]}
      />

      <EmptyState
        title="DPIA Wizard"
        description="The guided DPIA assessment wizard will be implemented here. This will include step-by-step forms for context, legal basis, risk assessment, and mitigation measures."
        actionLabel="Start Wizard"
        onAction={() => console.log('Start wizard clicked')}
        icon={<FileText className="h-12 w-12 text-muted-foreground" />}
      />
    </div>
  )
}