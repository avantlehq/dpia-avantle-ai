import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { DynamicDashboardContent } from '@/components/dashboard/dynamic-dashboard-content'

// v3.10.47: Hybrid static/dynamic dashboard to show real assessments safely

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header - Static server component */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your DPIA assessments and compliance activities
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/precheck">
            <Button 
              variant="outline" 
              className="border-border/50 hover:border-border hover:bg-muted/50 text-foreground hover:text-foreground font-medium px-4 py-2 rounded-lg transition-all duration-200"
            >
              Start Pre-check
            </Button>
          </Link>
          <Link href="/assessments/new">
            <Button 
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            >
              New Assessment
            </Button>
          </Link>
        </div>
      </div>

      {/* Dynamic content - Client component that fetches real data */}
      <DynamicDashboardContent />
    </div>
  )
}