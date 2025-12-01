import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, FileText, Clock, CheckCircle, AlertCircle, Sparkles } from 'lucide-react'
import Link from 'next/link'

// Static dashboard page to prevent server-side crashes
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your DPIA assessments and compliance activities
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/precheck">
            <Button variant="outline" className="gap-2">
              <Sparkles className="h-4 w-4" />
              New Precheck
            </Button>
          </Link>
          <Link href="/assessments/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Assessment
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="avantle-border bg-card backdrop-blur-sm border-l-4 border-l-dpia-blue shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-2 rounded-lg bg-icon-blue hover:bg-icon-blue-hover transition-colors duration-200">
              <FileText style={{ color: 'var(--color-blue)' }} className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between w-full">
                <p className="text-sm font-medium text-muted-foreground">Total Assessments</p>
                <p className="text-2xl font-bold text-foreground">0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="avantle-border bg-card backdrop-blur-sm border-l-4 border-l-dpia-green shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-2 rounded-lg bg-icon-green hover:bg-icon-green-hover transition-colors duration-200">
              <CheckCircle style={{ color: 'var(--color-green)' }} className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between w-full">
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-foreground">0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="avantle-border bg-card backdrop-blur-sm border-l-4 border-l-dpia-orange shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-2 rounded-lg bg-icon-orange hover:bg-icon-orange-hover transition-colors duration-200">
              <Clock style={{ color: 'var(--color-orange)' }} className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between w-full">
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-foreground">0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="avantle-border bg-card backdrop-blur-sm border-l-4 border-l-dpia-gray shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-2 rounded-lg bg-icon-gray hover:bg-icon-gray-hover transition-colors duration-200">
              <AlertCircle style={{ color: 'var(--color-gray)' }} className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between w-full">
                <p className="text-sm font-medium text-muted-foreground">Drafts</p>
                <p className="text-2xl font-bold text-foreground">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Empty State */}
      <Card className="avantle-border bg-card backdrop-blur-sm shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            All Assessments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No assessments yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Get started by creating your first DPIA assessment or running a quick pre-check to see if you need one.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/precheck">
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                  <Sparkles className="h-4 w-4" />
                  Quick Pre-check
                </Button>
              </Link>
              <Link href="/assessments/new">
                <Button 
                  className="gap-2 w-full sm:w-auto"
                  style={{
                    backgroundColor: '#2563eb',
                    fontSize: '18px',
                    fontWeight: '600'
                  }}
                >
                  <Plus className="h-4 w-4" />
                  New DPIA Assessment
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}