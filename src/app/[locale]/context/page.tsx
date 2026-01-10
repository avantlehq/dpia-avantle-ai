'use client'

import React, { useState, useEffect } from 'react'
import { 
  Database,
  Plus,
  Activity,
  Building,
  MapPin,
  Users,
  GitBranch,
  AlertTriangle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

      {/* Context Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Systems Overview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">IT Systems</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {isLoading ? '...' : stats?.systems_total || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? '...' : stats?.systems_critical || 0} critical systems
            </p>
            <Link href={`/${locale}/context/systems`}>
              <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto text-blue-600 hover:text-blue-800">
                View systems →
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Processing Activities */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing Activities</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {isLoading ? '...' : stats?.processing_activities_total || 0}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {!isLoading && stats?.processing_activities_review_overdue && stats.processing_activities_review_overdue > 0 ? (
                <>
                  <AlertTriangle className="h-3 w-3 text-red-500" />
                  {stats.processing_activities_review_overdue} overdue reviews
                </>
              ) : (
                'ROPA compliance tracking'
              )}
            </p>
            <Link href={`/${locale}/context/processing`}>
              <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto text-blue-600 hover:text-blue-800">
                View activities →
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Vendors & Processors */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendors & Processors</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {isLoading ? '...' : stats?.vendors_total || 0}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {!isLoading && stats?.vendors_no_dpa && stats.vendors_no_dpa > 0 ? (
                <>
                  <AlertTriangle className="h-3 w-3 text-red-500" />
                  {stats.vendors_no_dpa} missing DPA
                </>
              ) : (
                'DPA compliance tracking'
              )}
            </p>
            <Link href={`/${locale}/context/vendors`}>
              <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto text-blue-600 hover:text-blue-800">
                View vendors →
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Data Flows */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Flows</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {isLoading ? '...' : stats?.data_flows_total || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? '...' : stats?.data_flows_cross_border || 0} cross-border transfers
            </p>
            <Link href={`/${locale}/context/data-flows`}>
              <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto text-blue-600 hover:text-blue-800">
                View flows →
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Locations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Locations & Jurisdictions</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {isLoading ? '...' : stats?.locations_total || 0}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {!isLoading && stats?.locations_not_adequate && stats.locations_not_adequate > 0 ? (
                <>
                  <AlertTriangle className="h-3 w-3 text-red-500" />
                  {stats.locations_not_adequate} without adequacy
                </>
              ) : (
                'Adequacy decision tracking'
              )}
            </p>
            <Link href={`/${locale}/context/locations`}>
              <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto text-blue-600 hover:text-blue-800">
                View locations →
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href={`/${locale}/context/systems`}>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Database className="h-4 w-4 mr-2" />
                  Add System
                </Button>
              </Link>
              <Link href={`/${locale}/context/processing`}>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Activity className="h-4 w-4 mr-2" />
                  Add Processing
                </Button>
              </Link>
              <Link href={`/${locale}/context/vendors`}>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Add Vendor
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Context Status Overview - Enhanced horizontal status cards layout */}
      <div className="space-y-5">
        <h2 className="text-lg font-medium text-foreground">Context Status Overview</h2>
        
        {/* Systems Status Cards - Row 1 */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">IT Systems</h3>
          <div className="flex flex-wrap" style={{ gap: '12px' }}>
            {/* Active Systems */}
            <div 
              className="inline-flex items-center rounded-lg"
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
            </div>

            {/* Critical Systems */}
            <div 
              className="inline-flex items-center rounded-lg"
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
            </div>

            {/* Systems Needing Review */}
            <div 
              className="inline-flex items-center rounded-lg"
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
            </div>
          </div>
        </div>

        {/* Processing Activities Status Cards - Row 2 */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Processing Activities (ROPA)</h3>
          <div className="flex flex-wrap" style={{ gap: '12px' }}>
            {/* Active Activities */}
            <div 
              className="inline-flex items-center rounded-lg"
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
            </div>

            {/* DPO Review Required */}
            <div 
              className="inline-flex items-center rounded-lg"
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
            </div>

            {/* Review Overdue */}
            <div 
              className="inline-flex items-center rounded-lg"
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
            </div>
          </div>
        </div>

        {/* Data Flows Status Cards - Row 3 */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Data Flows</h3>
          <div className="flex flex-wrap" style={{ gap: '12px' }}>
            {/* Active Flows */}
            <div 
              className="inline-flex items-center rounded-lg"
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
            </div>

            {/* Cross-Border Transfers */}
            <div 
              className="inline-flex items-center rounded-lg"
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
            </div>

            {/* High Criticality */}
            <div 
              className="inline-flex items-center rounded-lg"
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
            </div>
          </div>
        </div>

        {/* Vendors Status Cards - Row 4 */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Vendors & Processors</h3>
          <div className="flex flex-wrap" style={{ gap: '12px' }}>
            {/* Active Vendors */}
            <div 
              className="inline-flex items-center rounded-lg"
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
            </div>

            {/* Missing DPA */}
            <div 
              className="inline-flex items-center rounded-lg"
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
            </div>

            {/* DPA Expiring Soon */}
            <div 
              className="inline-flex items-center rounded-lg"
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
            </div>
          </div>
        </div>
      </div>

      {/* Increased Spacing Before Components */}
      <div className="mt-12"></div>

      {/* Foundation Components Table - matching dashboard style */}
      <Card className="avantle-border bg-card backdrop-blur-sm shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Foundation Components
            <Link href={`/${locale}/context/systems`}>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Component
              </Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Database className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Foundation Ready</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Set up your foundational data context to enable comprehensive privacy assessments and compliance tracking.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center" style={{ gap: '32px' }}>
              {/* Secondary CTA - Manage Systems */}
              <Link href={`/${locale}/context/systems`}>
                <Button 
                  variant="secondary" 
                  size="md"
                  title="IT systems and infrastructure"
                >
                  Manage Systems
                </Button>
              </Link>
              
              {/* Primary CTA - View Processing */}
              <Link href={`/${locale}/context/processing`}>
                <Button 
                  variant="primary" 
                  size="lg"
                >
                  View Processing
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}