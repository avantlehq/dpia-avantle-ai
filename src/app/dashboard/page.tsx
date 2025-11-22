import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { DashboardService, Assessment } from '@/lib/services/dashboard'
import { isSuccess, isError } from '@/lib/types/result'
import { ErrorState } from '@/components/ui/error-state'
import { EmptyState } from '@/components/ui/empty-state'
import { CreateAssessmentDialog } from '@/components/dashboard/create-assessment-dialog'
import { AssessmentActions } from '@/components/dashboard/assessment-actions'
import { OnboardingBanner } from '@/components/onboarding/onboarding-banner'
import { LayoutShell } from '@/components/layout/layout-shell'

// Force dynamic rendering - dashboard uses cookies/sessions
export const dynamic = 'force-dynamic'

function getStatusIcon(status: string) {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case 'in_progress':
      return <Clock className="h-4 w-4 text-blue-600" />
    case 'submitted':
      return <AlertCircle className="h-4 w-4 text-orange-600" />
    default:
      return <FileText className="h-4 w-4 text-gray-600" />
  }
}

function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case 'completed':
      return 'default'
    case 'in_progress':
      return 'secondary'
    case 'submitted':
      return 'outline'
    default:
      return 'outline'
  }
}

export default async function DashboardPage() {
  const result = await DashboardService.loadAssessments()
  
  // Handle error states
  if (isError(result)) {
    if (result.error === 'NOT_FOUND') {
      return (
        <LayoutShell>
          <div className="p-6">
            <OnboardingBanner />
            <EmptyState 
              title="No workspace found"
              description="Please complete the onboarding process to get started"
              actionLabel="Start Onboarding"
              onAction={() => window.location.href = '/onboarding'}
            />
          </div>
        </LayoutShell>
      )
    }
    
    if (result.error === 'UNAUTHORIZED') {
      return (
        <LayoutShell>
          <div className="p-6">
            <ErrorState 
              title="Access Denied"
              message={result.message}
              details={result.details}
            />
          </div>
        </LayoutShell>
      )
    }
    
    return (
      <LayoutShell>
        <div className="p-6">
          <ErrorState 
            title="Unable to load dashboard"
            message={result.message}
            details={result.details}
            onRetry={() => window.location.reload()}
          />
        </div>
      </LayoutShell>
    )
  }
  
  const assessments = result.data
  const stats = DashboardService.calculateStats(assessments)
  
  // Handle empty state
  if (assessments.length === 0) {
    return (
      <LayoutShell>
        <div className="p-6 space-y-6">
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
      </LayoutShell>
    )
  }

  return (
    <LayoutShell>
      <div className="p-6 space-y-6">
        <OnboardingBanner />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-foreground">DPIA Dashboard</h1>
            <p className="text-sm sm:text-base text-muted-foreground font-light">
              Manage your GDPR compliance assessments with European privacy values
            </p>
          </div>
          <CreateAssessmentDialog />
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="avantle-border bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Total Assessments
              </CardTitle>
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-light text-foreground">{stats.totalAssessments}</div>
            </CardContent>
          </Card>
          
          <Card className="avantle-border bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                In Progress
              </CardTitle>
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-light text-foreground">
                {stats.inProgress}
              </div>
            </CardContent>
          </Card>
          
          <Card className="avantle-border bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Completed
              </CardTitle>
              <div className="p-2 rounded-lg bg-primary/10">
                <CheckCircle className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-light text-foreground">
                {stats.completed}
              </div>
            </CardContent>
          </Card>
          
          <Card className="avantle-border bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Drafts
              </CardTitle>
              <div className="p-2 rounded-lg bg-primary/10">
                <AlertCircle className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-light text-foreground">
                {stats.drafts}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="avantle-border bg-card/50 backdrop-blur-sm">
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
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assessments.map((assessment) => (
                    <TableRow key={assessment.id}>
                      <TableCell className="font-medium">
                        <Link 
                          href={`/${assessment.id}`}
                          className="hover:underline"
                        >
                          {assessment.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(assessment.status)} className="flex items-center gap-1 w-fit">
                          {getStatusIcon(assessment.status)}
                          {assessment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{assessment.created_at}</TableCell>
                      <TableCell>{assessment.updated_at}</TableCell>
                      <TableCell>
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
    </LayoutShell>
  )
}