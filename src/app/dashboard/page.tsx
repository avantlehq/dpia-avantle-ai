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
          <Link href="/assessments/new">
            <Button 
              variant="primary" 
              size="lg"
              className="min-w-[200px]"
            >
              <span style={{ fontSize: '18px', fontWeight: '400' }}>+</span>
              New Assessment
            </Button>
          </Link>
          
          {/* Secondary helper - micro-hierarchy */}
          <div className="flex items-center text-sm text-gray-400">
            <span>or</span>
            <Link href="/precheck">
              <Button 
                variant="secondary" 
                size="sm"
                className="ml-2"
                title="Quick pre-assessment to check if full DPIA is required"
              >
                <span style={{ fontSize: '12px' }}>✓</span>
                start with pre-check →
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Dynamic content - Client component that fetches real data */}
      <DynamicDashboardContent />
    </div>
  )
}