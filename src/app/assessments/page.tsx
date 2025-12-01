import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, FileText } from 'lucide-react'
import Link from 'next/link'
import { OnboardingBanner } from '@/components/onboarding/onboarding-banner'
import { PageHeader } from '@/components/layout/page-header'
import { Breadcrumbs } from '@/components/navigation/breadcrumbs'

// v3.10.44: Static page to prevent Application Errors

export default function AssessmentsPage() {
  // Static page to prevent Application Error - similar to dashboard approach
  return (
    <div className="space-y-6">
      <OnboardingBanner />
      
      <Breadcrumbs
        items={[
          { label: "DPIA Builder", href: "/assessments", current: true }
        ]}
      />
      
      <PageHeader
        title="DPIA Builder"
        description="Create and manage your GDPR Data Protection Impact Assessments"
        action={
          <Link href="/assessments/new">
            <Button className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl border border-blue-500 hover:border-blue-400 transform hover:scale-102 transition-all duration-300 px-8 py-4 font-semibold rounded-lg cursor-pointer"
              style={{
                backgroundColor: '#2563eb',
                borderColor: '#3b82f6',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '18px',
                fontWeight: '600'
              }}>
              <Plus className="mr-2 h-4 w-4" />
              New Assessment
            </Button>
          </Link>
        }
      />

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="avantle-border bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-card-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
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

      {/* Empty State for Assessments */}
      <Card className="avantle-border bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-card-foreground">Your Assessments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <Card className="w-full max-w-md avantle-border bg-card/50 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-muted/50">
                    <FileText className="h-12 w-12 text-muted-foreground" />
                  </div>
                </div>
                <CardTitle className="text-card-foreground">No assessments yet</CardTitle>
                <CardContent className="text-center pt-0">
                  <p className="text-muted-foreground">
                    Get started by creating your first DPIA assessment using the "New Assessment" button above.
                  </p>
                </CardContent>
              </CardHeader>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}