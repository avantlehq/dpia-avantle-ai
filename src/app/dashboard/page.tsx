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
import { DatabaseService } from '@/lib/services/database'
import { CreateAssessmentDialog } from '@/components/dashboard/create-assessment-dialog'
import { AssessmentActions } from '@/components/dashboard/assessment-actions'
import { OnboardingBanner } from '@/components/onboarding/onboarding-banner'

async function getAssessments() {
  try {
    const db = await DatabaseService.create()
    const workspaceId = await db.getDefaultWorkspace()
    const assessments = await db.getAssessments(workspaceId)
    return assessments
  } catch (error) {
    console.error('Error fetching assessments:', error)
    // Fallback to mock data
    return [
      {
        id: '1',
        name: 'Employee Data Processing',
        status: 'completed',
        created_at: '2024-01-15',
        updated_at: '2024-01-20'
      },
      {
        id: '2', 
        name: 'Customer CRM System',
        status: 'in_progress',
        created_at: '2024-01-18',
        updated_at: '2024-01-19'
      },
      {
        id: '3',
        name: 'Marketing Analytics',
        status: 'draft',
        created_at: '2024-01-20',
        updated_at: '2024-01-20'
      }
    ]
  }
}

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
  const assessments = await getAssessments()
  return (
    <div className="min-h-screen avantle-gradient">
      <div className="container mx-auto p-6 space-y-6">
        <OnboardingBanner />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-foreground">DPIA Dashboard</h1>
            <p className="text-muted-foreground font-light">
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
              <div className="text-2xl font-light text-foreground">{assessments.length}</div>
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
                {assessments.filter(a => a.status === 'in_progress').length}
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
                {assessments.filter(a => a.status === 'completed').length}
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
                {assessments.filter(a => a.status === 'draft').length}
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
    </div>
  )
}