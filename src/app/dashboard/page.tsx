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
        <div className="flex flex-col items-center gap-3">
          {/* Primary CTA - New Assessment (single prominent action) */}
          <Button 
            variant="primary" 
            size="lg"
            className="min-w-[200px]"
            asChild
          >
            <Link href="/assessments/new">
              <span style={{ fontSize: '18px', fontWeight: '400' }}>+</span>
              New Assessment
            </Link>
          </Button>
          
          {/* Secondary helper - micro-hierarchy */}
          <div className="flex items-center text-sm text-gray-400">
            <span>or</span>
            <Button 
              variant="outline" 
              size="sm"
              className="ml-2 border-dashed text-gray-400 hover:text-gray-300"
              asChild
              title="Quick pre-assessment to check if full DPIA is required"
            >
              <Link href="/precheck">
                <span style={{ fontSize: '12px' }}>✓</span>
                start with pre-check →
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Dynamic content - Client component that fetches real data */}
      <DynamicDashboardContent />
    </div>
  )
}