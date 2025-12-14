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
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="avantle-border bg-card backdrop-blur-sm border-l-4 border-l-dpia-blue shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-2 rounded-lg bg-icon-blue hover:bg-icon-blue-hover transition-colors duration-200">
              <FileText style={{ color: 'var(--color-blue)' }} className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center w-full">
              <p className="text-sm font-medium text-muted-foreground">Total Assessments</p>
              <div className="flex-grow text-center">
                <p className="text-2xl font-bold text-foreground">
                  {isLoading ? '...' : stats.totalAssessments}
                </p>
              </div>
            </div>
            </div>
          </CardContent>
        </Card>

        <Card className="avantle-border bg-card backdrop-blur-sm border-l-4 border-l-dpia-green shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-2 rounded-lg bg-icon-green hover:bg-icon-green-hover transition-colors duration-200">
              <CheckCircle style={{ color: 'var(--color-green)' }} className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center w-full">
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <div className="flex-grow text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {isLoading ? '...' : stats.completed}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="avantle-border bg-card backdrop-blur-sm border-l-4 border-l-dpia-orange shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-2 rounded-lg bg-icon-orange hover:bg-icon-orange-hover transition-colors duration-200">
              <Clock style={{ color: 'var(--color-orange)' }} className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center w-full">
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <div className="flex-grow text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {isLoading ? '...' : stats.inProgress}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="avantle-border bg-card backdrop-blur-sm border-l-4 border-l-dpia-gray shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-2 rounded-lg bg-icon-gray hover:bg-icon-gray-hover transition-colors duration-200">
              <AlertCircle style={{ color: 'var(--color-gray)' }} className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center w-full">
                <p className="text-sm font-medium text-muted-foreground">Drafts</p>
                <div className="flex-grow text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {isLoading ? '...' : stats.drafts}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/precheck">
                  <Button className="avantle-border bg-icon-green hover:bg-icon-green-hover border-dpia-green gap-2 w-full sm:w-auto transition-colors duration-200">
                    <Sparkles className="h-4 w-4" style={{ color: 'var(--color-green)' }} />
                    <span style={{ color: 'var(--color-green)' }}>New Pre-check</span>
                  </Button>
                </Link>
                <Link href="/assessments/new">
                  <Button className="bg-icon-blue hover:bg-icon-blue-hover border-dpia-blue gap-2 w-full sm:w-auto transition-colors duration-200">
                    <Plus className="h-4 w-4" style={{ color: 'var(--color-blue)' }} />
                    <span style={{ color: 'var(--color-blue)' }}>New Assessment</span>
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