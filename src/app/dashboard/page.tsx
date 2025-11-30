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
import { Plus, FileText, Clock, CheckCircle, AlertCircle, Edit3, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/navigation/breadcrumbs'
import { DashboardService } from '@/lib/services/dashboard'
import { isError } from '@/lib/types/result'
import { ErrorState } from '@/components/ui/error-state'
import { EmptyState } from '@/components/ui/empty-state'
// import { CreateAssessmentDialog } from '@/components/dashboard/create-assessment-dialog'
import { AssessmentActions } from '@/components/dashboard/assessment-actions'
import { RefreshButton } from '@/components/dashboard/refresh-button'
import { OnboardingBanner } from '@/components/onboarding/onboarding-banner'
// Layout now handled at app level

// Force dynamic rendering - dashboard uses cookies/sessions
export const dynamic = 'force-dynamic'
export const revalidate = 0 // Disable caching completely

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
  // TEMPORARY: Force show test data to debug display issues
  const testAssessments = [
    {
      id: 'test-1',
      workspace_id: '00000000-0000-0000-0000-000000000002',
      created_by: null,
      name: 'Test Assessment 1',
      description: 'Test assessment for debugging',
      status: 'completed',
      schema_version: '1.0',
      data: {},
      completed_sections: ['context', 'data_flow', 'risk_assessment', 'mitigation'],
      precheck_result: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'test-2', 
      workspace_id: '00000000-0000-0000-0000-000000000002',
      created_by: null,
      name: 'Test Assessment 2',
      description: 'Another test assessment',
      status: 'draft',
      schema_version: '1.0',
      data: {},
      completed_sections: [],
      precheck_result: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]

  // Load real data but also try with test data
  const result = await DashboardService.loadAssessments()
  console.log('Dashboard: Real result:', result)
  
  // Combine test data with real data if available
  let assessments = testAssessments
  if (!isError(result)) {
    console.log('Dashboard: Found real assessments:', result.data.length)
    // Add real assessments to test data for debugging
    assessments = [...testAssessments, ...result.data]
  } else {
    console.log('Dashboard: Error loading real assessments:', result.error, result.message)
  }
  
  const stats = DashboardService.calculateStats(assessments)
  
  // Handle error states for real data (but still show test data)
  if (isError(result)) {
    console.log('Dashboard: Using test data due to error:', result)
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
  
  // TEMPORARY: Comment out real data usage
  // const assessments = result.data
  // const stats = DashboardService.calculateStats(assessments)
  
  // Handle empty state for real data (test data will always have items)
  if (false && assessments.length === 0) {
    return (
      <div className="space-y-3">
        <OnboardingBanner />
        
        <Breadcrumbs
          items={[
            { label: "Home", href: "/dashboard", current: true }
          ]}
        />
        
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
    <div className="space-y-3">
        <OnboardingBanner />
        
        <Breadcrumbs
          items={[
            { label: "Home", href: "/dashboard", current: true }
          ]}
        />
        
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
          <div className="flex flex-row items-center" style={{ gap: '2rem' }}>
            <div style={{ marginRight: '2rem' }}>
              <Link href="/precheck">
                <Button 
                  className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl border border-green-500 hover:border-green-400 transform hover:scale-102 transition-all duration-300 px-6 py-3 font-semibold rounded-lg cursor-pointer"
                  style={{
                    backgroundColor: '#16a34a',
                    borderColor: '#22c55e',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '600',
                    marginRight: '32px'
                  }}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  New Precheck
                </Button>
              </Link>
            </div>
            <div>
              <Link href="/assessments/new">
                <Button 
                  className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl border border-blue-500 hover:border-blue-400 transform hover:scale-102 transition-all duration-300 px-6 py-3 font-semibold rounded-lg cursor-pointer"
                  style={{
                    backgroundColor: '#2563eb',
                    borderColor: '#3b82f6',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Assessment
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="avantle-border bg-card backdrop-blur-sm border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-icon-gradient-blue">
                    <FileText className="h-4 w-4" style={{ color: 'var(--color-blue)' }} />
                  </div>
                  <span className="text-sm font-medium text-card-foreground">Total Assessments</span>
                </div>
                <div className="text-2xl font-bold" style={{ color: 'var(--color-blue)' }}>{stats.totalAssessments}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="avantle-border bg-card backdrop-blur-sm border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-icon-gradient-orange">
                    <Clock className="h-4 w-4" style={{ color: 'var(--color-orange)' }} />
                  </div>
                  <span className="text-sm font-medium text-card-foreground">In Progress</span>
                </div>
                <div className="text-2xl font-bold" style={{ color: 'var(--color-orange)' }}>{stats.inProgress}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="avantle-border bg-card backdrop-blur-sm border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-icon-gradient-green">
                    <CheckCircle className="h-4 w-4" style={{ color: 'var(--color-green)' }} />
                  </div>
                  <span className="text-sm font-medium text-card-foreground">Completed</span>
                </div>
                <div className="text-2xl font-bold" style={{ color: 'var(--color-green)' }}>{stats.completed}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="avantle-border bg-card backdrop-blur-sm border-l-4 border-l-gray-500 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-icon-gradient-gray">
                    <Edit3 className="h-4 w-4" style={{ color: 'var(--color-gray)' }} />
                  </div>
                  <span className="text-sm font-medium text-card-foreground">Drafts</span>
                </div>
                <div className="text-2xl font-bold" style={{ color: 'var(--color-gray)' }}>{stats.drafts}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="avantle-border bg-card backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <CardTitle className="text-card-foreground">All Assessments</CardTitle>
                <div className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                  TEST DATA v3.10.9
                </div>
              </div>
              <RefreshButton />
            </div>
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
                    <Button
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
                          href={`/assessment?id=${assessment.id}`}
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