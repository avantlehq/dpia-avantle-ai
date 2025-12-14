import { Button } from '@/components/ui/button'
import { Plus, Sparkles } from 'lucide-react'
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
            <Button className="avantle-border bg-icon-green hover:bg-icon-green-hover border-dpia-green gap-2 transition-colors duration-200">
              <Sparkles className="h-4 w-4" style={{ color: 'var(--color-green)' }} />
              <span style={{ color: 'var(--color-green)' }}>New Pre-check</span>
            </Button>
          </Link>
          <Link href="/assessments/new">
            <Button className="bg-icon-blue hover:bg-icon-blue-hover border-dpia-blue gap-2 transition-colors duration-200">
              <Plus className="h-4 w-4" style={{ color: 'var(--color-blue)' }} />
              <span style={{ color: 'var(--color-blue)' }}>New Assessment</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Dynamic content - Client component that fetches real data */}
      <DynamicDashboardContent />
    </div>
  )
}