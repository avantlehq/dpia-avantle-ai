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
      console.log('Fetching assessments from API...')
      const response = await fetch('/api/assessments', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('Assessments fetched successfully:', data)
      
      if (data.assessments && Array.isArray(data.assessments)) {
        setAssessments(data.assessments)
        
        // Calculate stats
        const newStats = {
          totalAssessments: data.assessments.length,
          completed: data.assessments.filter((a: Assessment) => a.status === 'completed').length,
          inProgress: data.assessments.filter((a: Assessment) => a.status === 'in_progress').length,
          drafts: data.assessments.filter((a: Assessment) => a.status === 'draft').length,
        }
        setStats(newStats)
        console.log('Stats calculated:', newStats)
      }
    } catch (error) {
      console.error('Error fetching assessments:', error)
      // Keep empty state on error
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
              <div className="flex items-center justify-between w-full">
                <p className="text-sm font-medium text-muted-foreground">Total Assessments</p>
                <p className="text-2xl font-bold text-foreground">
                  {isLoading ? '...' : stats.totalAssessments}
                </p>
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
              <div className="flex items-center justify-between w-full">
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-foreground">
                  {isLoading ? '...' : stats.completed}
                </p>
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
              <div className="flex items-center justify-between w-full">
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-foreground">
                  {isLoading ? '...' : stats.inProgress}
                </p>
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
              <div className="flex items-center justify-between w-full">
                <p className="text-sm font-medium text-muted-foreground">Drafts</p>
                <p className="text-2xl font-bold text-foreground">
                  {isLoading ? '...' : stats.drafts}
                </p>
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
                  <Button variant="outline" className="gap-2 w-full sm:w-auto">
                    <Sparkles className="h-4 w-4" />
                    Quick Pre-check
                  </Button>
                </Link>
                <Link href="/assessments/new">
                  <Button 
                    className="gap-2 w-full sm:w-auto"
                    style={{
                      backgroundColor: '#2563eb',
                      fontSize: '18px',
                      fontWeight: '600'
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    New DPIA Assessment
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
                  <TableRow key={assessment.id}>
                    <TableCell className="font-medium">
                      <Link 
                        href={`/assessment?id=${assessment.id}`}
                        className="hover:underline"
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