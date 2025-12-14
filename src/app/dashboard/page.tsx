import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, Sparkles } from 'lucide-react'
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
        <div className="flex items-center gap-3">
          {/* Secondary CTA - Start Pre-check (ghost/outline variant) */}
          <Link href="/precheck">
            <Button 
              variant="ghost"
              className="border border-border/30 hover:border-border/50 hover:bg-muted/30 text-muted-foreground hover:text-foreground font-medium px-4 py-3 rounded-lg transition-all duration-200"
              title="Quick pre-assessment to check if full DPIA is required"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Start Pre-check
            </Button>
          </Link>
          
          {/* Primary CTA - New Assessment (full fill) */}
          <Link href="/assessments/new">
            <Button 
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Plus className="mr-2 h-4 w-4" />
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