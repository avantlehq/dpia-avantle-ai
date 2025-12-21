'use client'

import Link from 'next/link'
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
        <div className="flex flex-col items-end gap-3">
          {/* Primary CTA - New Assessment (single prominent action) */}
          <Link href="/assessments/new">
            <button
              className="primary-cta-button group"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '14px 28px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                minWidth: '200px',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)'
              }}
            >
              <span style={{ fontSize: '18px', fontWeight: '400' }}>+</span>
              New Assessment
            </button>
          </Link>
          
          {/* Secondary helper - micro-hierarchy */}
          <div className="flex items-center text-sm text-gray-400">
            <span>or</span>
            <Link href="/precheck" className="ml-2">
              <button
                className="ghost-button group"
                style={{
                  background: 'transparent',
                  color: '#9ca3af',
                  border: '1px dashed #4b5563',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#d1d5db'
                  e.currentTarget.style.borderColor = '#6b7280'
                  e.currentTarget.style.background = 'rgba(75, 85, 99, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#9ca3af'
                  e.currentTarget.style.borderColor = '#4b5563'
                  e.currentTarget.style.background = 'transparent'
                }}
                title="Quick pre-assessment to check if full DPIA is required"
              >
                <span style={{ fontSize: '12px' }}>✓</span>
                start with pre-check →
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Dynamic content - Client component that fetches real data */}
      <DynamicDashboardContent />
    </div>
  )
}