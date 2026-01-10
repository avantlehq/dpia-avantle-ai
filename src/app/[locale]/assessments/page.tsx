import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, FileText } from 'lucide-react'
import Link from 'next/link'
import { OnboardingBanner } from '@/components/onboarding/onboarding-banner'
import { PageHeader } from '@/components/layout/page-header'
import { Breadcrumbs } from '@/components/navigation/breadcrumbs'

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AssessmentsPage({ params }: Props) {
  const { locale } = await params;
  
  // Static page to prevent Application Error - similar to dashboard approach
  return (
    <div className="space-y-6">
      <OnboardingBanner />
      
      <Breadcrumbs
        items={[
          { label: "DPIA Builder", href: `/${locale}/assessments`, current: true }
        ]}
      />

      <PageHeader
        title="DPIA Assessments" 
        description="Create and manage Data Protection Impact Assessments"
        action={
          <Link href={`/${locale}/assessments/new`}>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Assessment
            </Button>
          </Link>
        }
      />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Assessment History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No assessments yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start your first Data Protection Impact Assessment to ensure GDPR compliance.
              </p>
              <Link href={`/${locale}/assessments/new`}>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Assessment
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}