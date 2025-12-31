'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { DynamicDashboardContent } from '@/components/dashboard/dynamic-dashboard-content'

// v3.10.47: Hybrid static/dynamic dashboard to show real assessments safely

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header - Static server component */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Overview</h1>
          <p className="text-muted-foreground">
            Manage your DPIA assessments and compliance activities
          </p>
        </div>
        <div className="flex items-center" style={{ gap: '32px' }}>
          {/* Secondary CTA - Start Pre-check */}
          <Link href="/precheck">
            <Button 
              variant="secondary" 
              size="md"
              title="Quick pre-assessment to check if full DPIA is required"
            >
              <span style={{ fontSize: '12px' }}>✓</span>
              Start Pre-check
            </Button>
          </Link>
          
          {/* Primary CTA - New Assessment (single prominent action) */}
          <Link href="/assessments/new">
            <Button 
              variant="primary" 
              size="lg"
              className="min-w-[200px]"
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