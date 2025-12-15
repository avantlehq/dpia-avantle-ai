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
          <h1 className="text-2xl font-semibold text-foreground">Overview</h1>
          <p className="text-muted-foreground">
            Manage your DPIA assessments and compliance activities
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Secondary CTA - Start Pre-check (subtle ghost style) */}
          <Link href="/precheck">
            <button 
              className="text-muted-foreground hover:text-foreground font-medium transition-colors duration-200"
              title="Quick pre-assessment to check if full DPIA is required"
              style={{
                background: 'none',
                border: 'none',
                padding: '8px 0',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Start Pre-check
            </button>
          </Link>
          
          {/* Primary CTA - New Assessment (visually dominant) */}
          <Link href="/assessments/new">
            <button
              style={{
                backgroundColor: '#4A90E2',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                boxShadow: '0 2px 4px rgba(74, 144, 226, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#357ABD'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#4A90E2'
              }}
            >
              New Assessment
            </button>
          </Link>
        </div>
      </div>

      {/* Dynamic content - Client component that fetches real data */}
      <DynamicDashboardContent />
    </div>
  )
}