import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, FileText, Clock, CheckCircle, AlertCircle, Edit3 } from 'lucide-react'
import Link from 'next/link'
import { DashboardService } from '@/lib/services/dashboard'
import { isError } from '@/lib/types/result'
import { ErrorState } from '@/components/ui/error-state'
import { EmptyState } from '@/components/ui/empty-state'
// import { CreateAssessmentDialog } from '@/components/dashboard/create-assessment-dialog'
import { AssessmentActions } from '@/components/dashboard/assessment-actions'
import { OnboardingBanner } from '@/components/onboarding/onboarding-banner'
// Layout now handled at app level

// Force dynamic rendering - dashboard uses cookies/sessions
export const dynamic = 'force-dynamic'

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return dateString
  }
}


function getStatusBadge(status: string) {
  const baseClasses = "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
  
  switch (status) {
    case 'completed':
      return (
        <span className={`${baseClasses} text-white`} style={{backgroundColor: 'var(--dashboard-green)'}}>
          <CheckCircle className="h-3 w-3" />
          Completed
        </span>
      )
    case 'in_progress':
      return (
        <span className={`${baseClasses} text-white`} style={{backgroundColor: 'var(--dashboard-orange)'}}>
          <Clock className="h-3 w-3" />
          In Progress
        </span>
      )
    case 'submitted':
      return (
        <span className={`${baseClasses} text-white`} style={{backgroundColor: 'var(--dashboard-orange)'}}>
          <AlertCircle className="h-3 w-3" />
          Submitted
        </span>
      )
    default:
      return (
        <span className={`${baseClasses} text-white`} style={{backgroundColor: 'var(--dashboard-gray)'}}>
          <Edit3 className="h-3 w-3" />
          Draft
        </span>
      )
  }
}

export default async function DashboardPage() {
  const result = await DashboardService.loadAssessments()
  
  // Handle error states
  if (isError(result)) {
    if (result.error === 'NOT_FOUND') {
      return (
        <div className="p-6">
          <OnboardingBanner />
          <EmptyState 
            title="No workspace found"
            description="Please complete the onboarding process to get started"
            actionLabel="Start Onboarding"
            onAction={() => window.location.href = '/onboarding'}
          />
        </div>
      )
    }
    
    if (result.error === 'UNAUTHORIZED') {
      return (
        <div className="p-6">
          <ErrorState 
            title="Access Denied"
            message={result.message}
            details={result.details}
          />
        </div>
      )
    }
    
    return (
      <div className="p-6">
        <ErrorState 
          title="Unable to load dashboard"
          message={result.message}
          details={result.details}
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }
  
  const assessments = result.data
  const stats = DashboardService.calculateStats(assessments)
  
  // Handle empty state
  if (assessments.length === 0) {
    return (
      <div className="space-y-6">
        <OnboardingBanner />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-foreground">DPIA Dashboard</h1>
            <p className="text-sm sm:text-base text-muted-foreground font-light">
              Manage your GDPR compliance assessments with European privacy values
            </p>
          </div>
        </div>
        <EmptyState 
          title="No assessments yet"
          description="Get started by creating your first DPIA assessment"
          actionLabel="Create Assessment"
          onAction={() => document.getElementById('create-assessment-trigger')?.click()}
          icon={<FileText className="h-12 w-12 text-muted-foreground" />}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
        <OnboardingBanner />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"></div>
              <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-foreground">DPIA Dashboard</h1>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground font-light">
              Manage your GDPR compliance assessments with European privacy values
            </p>
          </div>
          <Link href="/assessments/new">
            <Button className="avantle-glow">
              <Plus className="mr-2 h-4 w-4" />
              New Assessment
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="avantle-border bg-card backdrop-blur-sm border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Total Assessments
              </CardTitle>
              <div className="p-2 rounded-lg bg-icon-gradient-blue">
                <FileText className="h-4 w-4" style={{ color: 'var(--color-blue)' }} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-light" style={{ color: 'var(--color-blue)' }}>{stats.totalAssessments}</div>
            </CardContent>
          </Card>
          
          <Card className="avantle-border bg-card backdrop-blur-sm border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                In Progress
              </CardTitle>
              <div className="p-2 rounded-lg bg-icon-gradient-orange">
                <Clock className="h-4 w-4" style={{ color: 'var(--color-orange)' }} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-light" style={{ color: 'var(--color-orange)' }}>
                {stats.inProgress}
              </div>
            </CardContent>
          </Card>
          
          <Card className="avantle-border bg-card backdrop-blur-sm border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Completed
              </CardTitle>
              <div className="p-2 rounded-lg bg-icon-gradient-green">
                <CheckCircle className="h-4 w-4" style={{ color: 'var(--color-green)' }} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-light" style={{ color: 'var(--color-green)' }}>
                {stats.completed}
              </div>
            </CardContent>
          </Card>
          
          <Card className="avantle-border bg-card backdrop-blur-sm border-l-4 border-l-gray-500 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Drafts
              </CardTitle>
              <div className="p-2 rounded-lg bg-icon-gradient-gray">
                <Edit3 className="h-4 w-4" style={{ color: 'var(--color-gray)' }} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-light" style={{ color: 'var(--color-gray)' }}>
                {stats.drafts}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="avantle-border bg-card backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-card-foreground">Recent Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            {assessments.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-semibold">No assessments yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Get started by creating your first assessment
                </p>
                <div className="mt-6">
                  <Link href="/precheck">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      New Assessment
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="py-4 text-base font-semibold w-[30%]">Name</TableHead>
                    <TableHead className="py-4 text-base font-semibold w-[25%]">Status</TableHead>
                    <TableHead className="py-4 text-base font-semibold w-[15%]">Created</TableHead>
                    <TableHead className="py-4 text-base font-semibold w-[15%]">Updated</TableHead>
                    <TableHead className="py-4 text-base font-semibold w-[15%]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assessments.map((assessment) => (
                    <TableRow key={assessment.id} className="border-b hover:bg-accent/5">
                      <TableCell className="font-medium py-4 text-base align-top">
                        <Link 
                          href={`/${assessment.id}`}
                          className="hover:underline text-primary hover:text-primary/80 block"
                        >
                          {assessment.name}
                        </Link>
                      </TableCell>
                      <TableCell className="py-4 align-top">
                        <div className="flex items-start">
                          {getStatusBadge(assessment.status)}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-base text-muted-foreground align-top">
                        {formatDate(assessment.created_at)}
                      </TableCell>
                      <TableCell className="py-4 text-base text-muted-foreground align-top">
                        {formatDate(assessment.updated_at)}
                      </TableCell>
                      <TableCell className="py-4 align-top">
                        <AssessmentActions
                          assessmentId={assessment.id}
                          assessmentName={assessment.name}
                          status={assessment.status}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
    </div>
  )
}