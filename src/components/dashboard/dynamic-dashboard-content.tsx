'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { RefreshCw, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { AssessmentActions } from '@/components/dashboard/assessment-actions'
import { StatCardSkeleton, AssessmentCardSkeleton } from '@/components/ui/skeleton'

interface Assessment {
  id: string
  name: string
  status: string
  created_at: string
  updated_at: string
}

interface DashboardStats {
  totalAssessments: number
  completed: number
  inProgress: number
  drafts: number
}

export function DynamicDashboardContent() {
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalAssessments: 0,
    completed: 0,
    inProgress: 0,
    drafts: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchAssessments = async () => {
    try {
      console.log('Dashboard: Fetching assessments from direct API (bypassing RLS)...')
      const response = await fetch('/api/assessments-direct', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Prevent caching to ensure fresh data
        cache: 'no-store'
      })
      
      console.log('Dashboard: API response status:', response.status)
      
      if (!response.ok) {
        console.error('Dashboard: API response not ok:', response.status, response.statusText)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('Dashboard: API response data:', data)
      console.log('Dashboard: Full response details:', {
        assessments: data.assessments,
        assessmentsLength: data.assessments?.length,
        debug: data.debug,
        error: data.error,
        details: data.details
      })
      
      if (data.error) {
        console.error('Dashboard: API returned error:', data.error, data.details)
        setAssessments([])
        setStats({ totalAssessments: 0, completed: 0, inProgress: 0, drafts: 0 })
        return
      }
      
      if (data.assessments && Array.isArray(data.assessments)) {
        console.log('Dashboard: Setting assessments:', data.assessments.length, 'items')
        setAssessments(data.assessments)
        
        // Calculate stats
        const newStats = {
          totalAssessments: data.assessments.length,
          completed: data.assessments.filter((a: Assessment) => a.status === 'completed').length,
          inProgress: data.assessments.filter((a: Assessment) => a.status === 'in_progress').length,
          drafts: data.assessments.filter((a: Assessment) => a.status === 'draft').length,
        }
        setStats(newStats)
        console.log('Dashboard: Stats calculated:', newStats)
      } else {
        console.log('Dashboard: No assessments in response, setting empty array')
        setAssessments([])
        setStats({ totalAssessments: 0, completed: 0, inProgress: 0, drafts: 0 })
      }
    } catch (error) {
      console.error('Dashboard: Error fetching assessments:', error)
      setAssessments([])
      setStats({ totalAssessments: 0, completed: 0, inProgress: 0, drafts: 0 })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchAssessments()
  }

  useEffect(() => {
    fetchAssessments()

    // Auto-refresh when window regains focus (e.g., returning from assessment creation)
    const handleFocus = () => {
      console.log('Dashboard: Window focused, refreshing assessments...')
      fetchAssessments()
    }

    // Auto-refresh every 30 seconds to catch new assessments
    const interval = setInterval(() => {
      console.log('Dashboard: Auto-refreshing assessments...')
      fetchAssessments()
    }, 30000)

    window.addEventListener('focus', handleFocus)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
      clearInterval(interval)
    }
  }, [])

  function getStatusIcon(status: string) {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-600" />
      case 'submitted':
        return <AlertCircle className="h-4 w-4 text-orange-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-600" />
    }
  }

  function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
    switch (status) {
      case 'completed':
        return 'default'
      case 'in_progress':
        return 'secondary'
      case 'submitted':
        return 'outline'
      default:
        return 'outline'
    }
  }

  return (
    <>
      {/* Assessment Overview */}
      <div className="space-y-5">
        <h2 className="text-lg font-medium text-foreground">Assessment Overview</h2>
        
        {/* Status Pills Group */}
        {isLoading ? (
          <div className="flex flex-wrap" style={{ gap: '12px' }}>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
        ) : (
          <div className="flex flex-wrap" style={{ gap: '12px' }}>
            {/* Completed Pill */}
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
                Completed
              </span>
              <span 
                style={{ 
                  fontSize: '16px',
                  color: 'var(--text-primary)',
                  fontWeight: '600'
                }}
              >
                {stats.completed}
              </span>
            </div>

            {/* In Progress Pill */}
            <div 
              className="inline-flex items-center rounded-lg"
              style={{ 
                height: '38px',
                paddingLeft: '12px',
                paddingRight: '16px',
                backgroundColor: 'transparent',
                borderLeft: '3px solid #3b82f6',
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
                In Progress
              </span>
              <span 
                style={{ 
                  fontSize: '16px',
                  color: 'var(--text-primary)',
                  fontWeight: '600'
                }}
              >
                {stats.inProgress}
              </span>
            </div>

            {/* Drafts Pill */}
            <div 
              className="inline-flex items-center rounded-lg"
              style={{ 
                height: '38px',
                paddingLeft: '12px',
                paddingRight: '16px',
                backgroundColor: 'transparent',
                borderLeft: '3px solid #9ca3af',
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
                Drafts
              </span>
              <span 
                style={{ 
                  fontSize: '16px',
                  color: 'var(--text-primary)',
                  fontWeight: '600'
                }}
              >
                {stats.drafts}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Increased Spacing Before Table */}
      <div className="mt-12"></div>

      {/* Assessments Table */}
      <Card className="avantle-border bg-card backdrop-blur-sm shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            All Assessments
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              leftIcon={<RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
              isLoading={isRefreshing}
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <AssessmentCardSkeleton />
              <AssessmentCardSkeleton />
              <AssessmentCardSkeleton />
            </div>
          ) : assessments.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No assessments yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Get started by creating your first DPIA assessment or running a quick pre-check to see if you need one.
              </p>
              <div className="flex flex-col items-center gap-4">
                {/* Primary CTA - New Assessment (single prominent action) */}
                <Link href="/assessments/new">
                  <button
                    className="primary-cta-button group"
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                      color: 'var(--text-primary)',
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
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assessments.map((assessment) => (
                  <TableRow key={assessment.id} className="group hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">
                      <Link 
                        href={`/assessment?id=${assessment.id}`}
                        className="text-foreground hover:text-primary hover:underline transition-colors duration-200"
                      >
                        {assessment.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(assessment.status)} className="flex items-center gap-1 w-fit">
                        {getStatusIcon(assessment.status)}
                        {assessment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(assessment.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(assessment.updated_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <AssessmentActions
                        assessmentId={assessment.id}
                        assessmentName={assessment.name}
                        status={assessment.status}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  )
}