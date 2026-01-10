'use client'

import React, { useState, useEffect } from 'react'
import { 
  Database,
  Activity,
  MapPin,
  Users,
  GitBranch
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { contextApiService } from '@/lib/context-api-service'

type ContextStats = {
  systems_total: number
  systems_critical: number
  processing_activities_total: number
  processing_activities_review_overdue: number
  vendors_total: number
  vendors_no_dpa: number
  data_flows_total: number
  data_flows_cross_border: number
  locations_total: number
  locations_not_adequate: number
}

export default function ContextOverviewPage() {
  const locale = 'en' // Default to English for now
  const [stats, setStats] = useState<ContextStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch Context statistics from real API service
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const contextStats = await contextApiService.getContextStats()
        setStats(contextStats)
      } catch (error) {
        console.error('Failed to fetch context stats:', error)
        setStats(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])
  
  return (
    <div className="space-y-6">
      {/* Header with CTAs - matching dashboard style */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Context</h1>
          <p className="text-muted-foreground">
            Foundation data and processing context
          </p>
        </div>
        <div className="flex items-center" style={{ gap: '32px' }}>
          {/* Secondary CTA - Register System */}
          <Link href={`/${locale}/context/systems`}>
            <Button 
              variant="secondary" 
              size="md"
              title="IT systems and infrastructure"
            >
              Register System
            </Button>
          </Link>
          
          {/* Primary CTA - Add Processing */}
          <Link href={`/${locale}/context/processing`}>
            <Button 
              variant="primary" 
              size="md"
            >
              Add Processing
            </Button>
          </Link>
        </div>
      </div>

      {/* Context Status Overview - Primary content section matching other modules */}
      <div className="space-y-5">
        <h2 className="text-lg font-medium text-foreground">Context Status Overview</h2>
        
        {/* Systems Status Cards - Row 1 */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">IT Systems</h3>
          <div className="flex flex-wrap" style={{ gap: '12px' }}>
            {/* Active Systems */}
            <Link href={`/${locale}/context/systems`} className="inline-flex items-center rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              style={{ 
                height: '38px',
                paddingLeft: '12px',
                paddingRight: '16px',
                backgroundColor: 'transparent',
                borderLeft: '3px solid #22c55e',
                gap: '8px'
              }}
            >
              <span 
                style={{ 
                  fontSize: '14px',
                  color: '#9ca3af',
                  fontWeight: '500'
                }}
              >
                Active Systems
              </span>
              <span 
                style={{ 
                  fontSize: '16px',
                  color: 'var(--text-primary)',
                  fontWeight: '600'
                }}
              >
                {isLoading ? '...' : stats?.systems_total || 0}
              </span>
            </Link>

            {/* Critical Systems */}
            <Link href={`/${locale}/context/systems`} className="inline-flex items-center rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              style={{ 
                height: '38px',
                paddingLeft: '12px',
                paddingRight: '16px',
                backgroundColor: 'transparent',
                borderLeft: '3px solid #ef4444',
                gap: '8px'
              }}
            >
              <span 
                style={{ 
                  fontSize: '14px',
                  color: '#9ca3af',
                  fontWeight: '500'
                }}
              >
                Critical Systems
              </span>
              <span 
                style={{ 
                  fontSize: '16px',
                  color: 'var(--text-primary)',
                  fontWeight: '600'
                }}
              >
                {isLoading ? '...' : stats?.systems_critical || 0}
              </span>
            </Link>

            {/* Systems Needing Review */}
            <Link href={`/${locale}/context/systems`} className="inline-flex items-center rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              style={{ 
                height: '38px',
                paddingLeft: '12px',
                paddingRight: '16px',
                backgroundColor: 'transparent',
                borderLeft: '3px solid #f59e0b',
                gap: '8px'
              }}
            >
              <span 
                style={{ 
                  fontSize: '14px',
                  color: '#9ca3af',
                  fontWeight: '500'
                }}
              >
                Needing Review
              </span>
              <span 
                style={{ 
                  fontSize: '16px',
                  color: 'var(--text-primary)',
                  fontWeight: '600'
                }}
              >
                {isLoading ? '...' : Math.floor((stats?.systems_total || 0) * 0.1) || 0}
              </span>
            </Link>
          </div>
        </div>

        {/* Processing Activities Status Cards - Row 2 */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Processing Activities (ROPA)</h3>
          <div className="flex flex-wrap" style={{ gap: '12px' }}>
            {/* Active Activities */}
            <Link href={`/${locale}/context/processing`} className="inline-flex items-center rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              style={{ 
                height: '38px',
                paddingLeft: '12px',
                paddingRight: '16px',
                backgroundColor: 'transparent',
                borderLeft: '3px solid #22c55e',
                gap: '8px'
              }}
            >
              <span 
                style={{ 
                  fontSize: '14px',
                  color: '#9ca3af',
                  fontWeight: '500'
                }}
              >
                Active Activities
              </span>
              <span 
                style={{ 
                  fontSize: '16px',
                  color: 'var(--text-primary)',
                  fontWeight: '600'
                }}
              >
                {isLoading ? '...' : stats?.processing_activities_total || 0}
              </span>
            </Link>

            {/* DPO Review Required */}
            <Link href={`/${locale}/context/processing`} className="inline-flex items-center rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              style={{ 
                height: '38px',
                paddingLeft: '12px',
                paddingRight: '16px',
                backgroundColor: 'transparent',
                borderLeft: '3px solid #f59e0b',
                gap: '8px'
              }}
            >
              <span 
                style={{ 
                  fontSize: '14px',
                  color: '#9ca3af',
                  fontWeight: '500'
                }}
              >
                DPO Review Required
              </span>
              <span 
                style={{ 
                  fontSize: '16px',
                  color: 'var(--text-primary)',
                  fontWeight: '600'
                }}
              >
                {isLoading ? '...' : Math.floor((stats?.processing_activities_total || 0) * 0.4) || 0}
              </span>
            </Link>

            {/* Review Overdue */}
            <Link href={`/${locale}/context/processing`} className="inline-flex items-center rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              style={{ 
                height: '38px',
                paddingLeft: '12px',
                paddingRight: '16px',
                backgroundColor: 'transparent',
                borderLeft: '3px solid #ef4444',
                gap: '8px'
              }}
            >
              <span 
                style={{ 
                  fontSize: '14px',
                  color: '#9ca3af',
                  fontWeight: '500'
                }}
              >
                Review Overdue
              </span>
              <span 
                style={{ 
                  fontSize: '16px',
                  color: 'var(--text-primary)',
                  fontWeight: '600'
                }}
              >
                {isLoading ? '...' : stats?.processing_activities_review_overdue || 0}
              </span>
            </Link>
          </div>
        </div>

        {/* Data Flows Status Cards - Row 3 */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Data Flows</h3>
          <div className="flex flex-wrap" style={{ gap: '12px' }}>
            {/* Active Flows */}
            <Link href={`/${locale}/context/data-flows`} className="inline-flex items-center rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              style={{ 
                height: '38px',
                paddingLeft: '12px',
                paddingRight: '16px',
                backgroundColor: 'transparent',
                borderLeft: '3px solid #22c55e',
                gap: '8px'
              }}
            >
              <span 
                style={{ 
                  fontSize: '14px',
                  color: '#9ca3af',
                  fontWeight: '500'
                }}
              >
                Active Flows
              </span>
              <span 
                style={{ 
                  fontSize: '16px',
                  color: 'var(--text-primary)',
                  fontWeight: '600'
                }}
              >
                {isLoading ? '...' : stats?.data_flows_total || 0}
              </span>
            </Link>

            {/* Cross-Border Transfers */}
            <Link href={`/${locale}/context/data-flows`} className="inline-flex items-center rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              style={{ 
                height: '38px',
                paddingLeft: '12px',
                paddingRight: '16px',
                backgroundColor: 'transparent',
                borderLeft: '3px solid #f59e0b',
                gap: '8px'
              }}
            >
              <span 
                style={{ 
                  fontSize: '14px',
                  color: '#9ca3af',
                  fontWeight: '500'
                }}
              >
                Cross-Border Transfers
              </span>
              <span 
                style={{ 
                  fontSize: '16px',
                  color: 'var(--text-primary)',
                  fontWeight: '600'
                }}
              >
                {isLoading ? '...' : stats?.data_flows_cross_border || 0}
              </span>
            </Link>

            {/* High Criticality */}
            <Link href={`/${locale}/context/data-flows`} className="inline-flex items-center rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              style={{ 
                height: '38px',
                paddingLeft: '12px',
                paddingRight: '16px',
                backgroundColor: 'transparent',
                borderLeft: '3px solid #ef4444',
                gap: '8px'
              }}
            >
              <span 
                style={{ 
                  fontSize: '14px',
                  color: '#9ca3af',
                  fontWeight: '500'
                }}
              >
                High Criticality
              </span>
              <span 
                style={{ 
                  fontSize: '16px',
                  color: 'var(--text-primary)',
                  fontWeight: '600'
                }}
              >
                {isLoading ? '...' : Math.floor((stats?.data_flows_total || 0) * 0.3) || 0}
              </span>
            </Link>
          </div>
        </div>

        {/* Vendors Status Cards - Row 4 */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Vendors & Processors</h3>
          <div className="flex flex-wrap" style={{ gap: '12px' }}>
            {/* Active Vendors */}
            <Link href={`/${locale}/context/vendors`} className="inline-flex items-center rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              style={{ 
                height: '38px',
                paddingLeft: '12px',
                paddingRight: '16px',
                backgroundColor: 'transparent',
                borderLeft: '3px solid #22c55e',
                gap: '8px'
              }}
            >
              <span 
                style={{ 
                  fontSize: '14px',
                  color: '#9ca3af',
                  fontWeight: '500'
                }}
              >
                Active Vendors
              </span>
              <span 
                style={{ 
                  fontSize: '16px',
                  color: 'var(--text-primary)',
                  fontWeight: '600'
                }}
              >
                {isLoading ? '...' : stats?.vendors_total || 0}
              </span>
            </Link>

            {/* Missing DPA */}
            <Link href={`/${locale}/context/vendors`} className="inline-flex items-center rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              style={{ 
                height: '38px',
                paddingLeft: '12px',
                paddingRight: '16px',
                backgroundColor: 'transparent',
                borderLeft: '3px solid #ef4444',
                gap: '8px'
              }}
            >
              <span 
                style={{ 
                  fontSize: '14px',
                  color: '#9ca3af',
                  fontWeight: '500'
                }}
              >
                Missing DPA
              </span>
              <span 
                style={{ 
                  fontSize: '16px',
                  color: 'var(--text-primary)',
                  fontWeight: '600'
                }}
              >
                {isLoading ? '...' : stats?.vendors_no_dpa || 0}
              </span>
            </Link>

            {/* DPA Expiring Soon */}
            <Link href={`/${locale}/context/vendors`} className="inline-flex items-center rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              style={{ 
                height: '38px',
                paddingLeft: '12px',
                paddingRight: '16px',
                backgroundColor: 'transparent',
                borderLeft: '3px solid #f59e0b',
                gap: '8px'
              }}
            >
              <span 
                style={{ 
                  fontSize: '14px',
                  color: '#9ca3af',
                  fontWeight: '500'
                }}
              >
                DPA Expiring Soon
              </span>
              <span 
                style={{ 
                  fontSize: '16px',
                  color: 'var(--text-primary)',
                  fontWeight: '600'
                }}
              >
                {isLoading ? '...' : Math.floor((stats?.vendors_total || 0) * 0.15) || 0}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions Section - matching other modules pattern */}
      <div className="space-y-5">
        <h2 className="text-lg font-medium text-foreground">Quick Actions</h2>
        
        <div className="flex flex-wrap" style={{ gap: '12px' }}>
          <Link href={`/${locale}/context/systems`}>
            <Button variant="outline" size="md" className="gap-2">
              <Database className="h-4 w-4" />
              Manage Systems
            </Button>
          </Link>
          
          <Link href={`/${locale}/context/processing`}>
            <Button variant="outline" size="md" className="gap-2">
              <Activity className="h-4 w-4" />
              View Processing Activities
            </Button>
          </Link>
          
          <Link href={`/${locale}/context/data-flows`}>
            <Button variant="outline" size="md" className="gap-2">
              <GitBranch className="h-4 w-4" />
              Monitor Data Flows
            </Button>
          </Link>
          
          <Link href={`/${locale}/context/vendors`}>
            <Button variant="outline" size="md" className="gap-2">
              <Users className="h-4 w-4" />
              Review Vendors
            </Button>
          </Link>
          
          <Link href={`/${locale}/context/locations`}>
            <Button variant="outline" size="md" className="gap-2">
              <MapPin className="h-4 w-4" />
              Check Locations
            </Button>
          </Link>
        </div>
      </div>

    </div>
  )
}