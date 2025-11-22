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
import { DashboardService } from '@/lib/services/dashboard'
import { isError } from '@/lib/types/result'
import { ErrorState } from '@/components/ui/error-state'
import { EmptyState } from '@/components/ui/empty-state'
import { CreateAssessmentDialog } from '@/components/dashboard/create-assessment-dialog'
import { AssessmentActions } from '@/components/dashboard/assessment-actions'
import { OnboardingBanner } from '@/components/onboarding/onboarding-banner'
// Layout now handled at app level

// Force dynamic rendering - assessments uses cookies/sessions
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

export default async function AssessmentsPage() {
  const result = await DashboardService.loadAssessments()
  
  // Handle error states
  if (isError(result)) {
    if (result.error === 'NOT_FOUND') {
      return (
        <div>
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
        <div>
            <ErrorState 
              title="Access Denied"
              message={result.message}
              details={result.details}
            />
        </div>
      )
    }
    
    return (
      <LayoutShell>
        <div className="p-6">
          <ErrorState 
            title="Unable to load assessments"
            message={result.message}
            details={result.details}
            onRetry={() => window.location.reload()}
          />
        </div>
      </LayoutShell>
    )
  }
  
  const assessments = result.data
  
  // Handle empty state
  if (assessments.length === 0) {
    return (
      <LayoutShell>
        <div className="p-6 space-y-6">
          <OnboardingBanner />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-foreground">DPIA Builder</h1>
              <p className="text-sm sm:text-base text-muted-foreground font-light">
                Create and manage your GDPR Data Protection Impact Assessments
              </p>
            </div>
            <CreateAssessmentDialog />
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
    <div className="space-y-6">
        <OnboardingBanner />
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-foreground">DPIA Builder</h1>
            <p className="text-sm sm:text-base text-muted-foreground font-light">
              Create and manage your GDPR Data Protection Impact Assessments
            </p>
          </div>
          <CreateAssessmentDialog />
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="avantle-border bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium text-card-foreground flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary" />
                New Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Start a fresh DPIA from scratch with guided wizard
              </p>
              <CreateAssessmentDialog />
            </CardContent>
          </Card>

          <Card className="avantle-border bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium text-card-foreground flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                Pre-check First
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Check if you need a DPIA before starting
              </p>
              <Button variant="outline" asChild className="w-full">
                <Link href="/precheck">
                  Run Pre-check
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="avantle-border bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium text-card-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Start from industry-specific templates
              </p>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Assessments Table */}
        <Card className="avantle-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-card-foreground">Your Assessments</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
    </div>
  )
}