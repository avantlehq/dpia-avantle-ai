import { PageHeader } from '@/components/layout/page-header'
import { Breadcrumbs } from '@/components/navigation/breadcrumbs'
import { SidebarSteps } from '@/components/layout/sidebar-steps'
import { DPIAWizard } from '@/components/assessment/dpia-wizard'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { notFound } from 'next/navigation'

// Force dynamic rendering to ensure proper authentication
export const dynamic = 'force-dynamic'

interface AssessmentPageProps {
  params: {
    assessmentId: string
  }
}

export default async function AssessmentPage({ params }: AssessmentPageProps) {
  const { assessmentId } = params

  // Validate assessmentId format (basic check)
  if (!assessmentId || assessmentId.length < 5) {
    return notFound()
  }

  return (
    <div className="flex h-full">
      {/* Steps Sidebar */}
      <SidebarSteps 
        assessmentId={assessmentId}
        className="h-full"
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="p-6 border-b border-border">
          <PageHeader
            title={`Assessment ${assessmentId}`}
            description="Complete your Data Protection Impact Assessment step by step."
            action={
              <Button variant="outline" asChild>
                <Link href="/assessments">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Assessments
                </Link>
              </Button>
            }
          />

          <div className="mt-4">
            <Breadcrumbs
              items={[
                { label: "Builder", href: "/assessments" },
                { label: `Assessment ${assessmentId}`, href: `/assessments/${assessmentId}`, current: true }
              ]}
            />
          </div>
        </div>

        {/* Wizard Content */}
        <div className="flex-1 overflow-auto">
          <DPIAWizard assessmentId={assessmentId} />
        </div>
      </div>
    </div>
  )
}