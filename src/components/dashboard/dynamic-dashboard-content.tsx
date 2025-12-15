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
import { RefreshCw, FileText, Clock, CheckCircle, AlertCircle, Plus, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { AssessmentActions } from '@/components/dashboard/assessment-actions'

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
        <div className="flex flex-wrap gap-6">
          {/* Completed Pill */}
          <div className="inline-flex items-center min-h-[40px] px-4 py-2 bg-green-50/80 border border-green-200/50 rounded-full shadow-sm">
            <span className="text-base text-muted-foreground">Completed</span>
            <span className="ml-4 text-xl font-bold text-foreground">
              {isLoading ? '...' : stats.completed}
            </span>
          </div>

          {/* In Progress Pill */}
          <div className="inline-flex items-center min-h-[40px] px-4 py-2 bg-blue-50/80 border border-blue-200/50 rounded-full shadow-sm">
            <span className="text-base text-muted-foreground">In progress</span>
            <span className="ml-4 text-xl font-bold text-foreground">
              {isLoading ? '...' : stats.inProgress}
            </span>
          </div>

          {/* Drafts Pill */}
          <div className="inline-flex items-center min-h-[40px] px-4 py-2 bg-gray-50/80 border border-gray-200/50 rounded-full shadow-sm">
            <span className="text-base text-muted-foreground">Drafts</span>
            <span className="ml-4 text-xl font-bold text-foreground">
              {isLoading ? '...' : stats.drafts}
            </span>
          </div>
        </div>
      </div>

      {/* Spacing Before Table */}
      <div className="mt-8"></div>

      {/* Assessments Table */}
      <Card className="avantle-border bg-card backdrop-blur-sm shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            All Assessments
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <RefreshCw className="h-8 w-8 mx-auto text-muted-foreground animate-spin mb-4" />
              <p className="text-muted-foreground">Loading assessments...</p>
            </div>
          ) : assessments.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No assessments yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Get started by creating your first DPIA assessment or running a quick pre-check to see if you need one.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
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