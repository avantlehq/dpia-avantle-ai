import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { 
  LayoutDashboard,
  Sparkles,
  Target,
  Scale,
  Plane,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  Plus
} from 'lucide-react'
import Link from 'next/link'

// Privacy Overview Dashboard - Central hub for all privacy activities
export default function PrivacyOverview() {
  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs />
      
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <div 
            className="p-2 rounded-lg" 
            style={{ backgroundColor: 'rgba(126, 211, 33, 0.15)' }}
          >
            <LayoutDashboard 
              className="h-6 w-6" 
              style={{ color: 'var(--color-green)' }} 
            />
          </div>
          Privacy Overview
        </h1>
        <p className="text-muted-foreground text-lg">
          Central dashboard for privacy impact assessments and compliance activities
        </p>
      </div>

      {/* Privacy Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* DPIA Status Card */}
        <Card className="avantle-border bg-card backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Target className="h-4 w-4" style={{ color: 'var(--color-green)' }} />
              DPIA Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Completed</span>
                  <Badge variant="default" className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
                    12
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">In Progress</span>
                  <Badge variant="secondary">5</Badge>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Drafts</span>
                  <Badge variant="outline">8</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Overdue</span>
                  <Badge variant="destructive">2</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Status Card */}
        <Card className="avantle-border bg-card backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4" style={{ color: 'var(--color-blue)' }} />
              Compliance Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Overall Score</span>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-green-600">85%</div>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-green-600">Ready</span>
                <span className="font-medium">15</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-yellow-600">Pending</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-red-600">Action Required</span>
                <span className="font-medium">2</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Summary Card */}
        <Card className="avantle-border bg-card backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" style={{ color: 'var(--color-red)' }} />
              Risk Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-red-600">High</span>
                  <Badge variant="destructive">3</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-yellow-600">Medium</span>
                  <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300">8</Badge>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-green-600">Low</span>
                  <Badge variant="outline">15</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Mitigated</span>
                  <Badge variant="default" className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">22</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="avantle-border bg-card backdrop-blur-sm shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* New DPIA Assessment */}
            <Link href="/assessments" className="group">
              <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: 'rgba(126, 211, 33, 0.15)' }}
                >
                  <Plus className="h-5 w-5" style={{ color: 'var(--color-green)' }} />
                </div>
                <div className="flex-1">
                  <div className="font-medium group-hover:text-foreground">New DPIA Assessment</div>
                  <div className="text-sm text-muted-foreground">Create a new Data Protection Impact Assessment</div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
              </div>
            </Link>

            {/* DPIA Pre-Check */}
            <Link href="/precheck" className="group">
              <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: 'rgba(74, 144, 226, 0.15)' }}
                >
                  <Sparkles className="h-5 w-5" style={{ color: 'var(--color-blue)' }} />
                </div>
                <div className="flex-1">
                  <div className="font-medium group-hover:text-foreground">Run DPIA Pre-Check</div>
                  <div className="text-sm text-muted-foreground">Quick evaluation to determine if full DPIA is required</div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
              </div>
            </Link>

            {/* View All Assessments */}
            <Link href="/assessments" className="group">
              <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: 'rgba(245, 166, 35, 0.15)' }}
                >
                  <Target className="h-5 w-5" style={{ color: 'var(--color-orange)' }} />
                </div>
                <div className="flex-1">
                  <div className="font-medium group-hover:text-foreground">View All Assessments</div>
                  <div className="text-sm text-muted-foreground">Manage existing DPIA assessments and reports</div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Assessment Types (Coming Soon) */}
      <Card className="avantle-border bg-card backdrop-blur-sm shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Assessment Types</CardTitle>
          <p className="text-sm text-muted-foreground">Comprehensive privacy impact assessment tools</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* LIA - Coming Soon */}
            <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-muted/20 opacity-60">
              <div className="p-2 rounded-lg bg-muted">
                <Scale className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-muted-foreground">LIA</div>
                <div className="text-sm text-muted-foreground">Legitimate Interest Assessment</div>
                <Badge variant="outline" className="text-xs mt-1">Coming Soon</Badge>
              </div>
            </div>

            {/* TIA - Coming Soon */}
            <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-muted/20 opacity-60">
              <div className="p-2 rounded-lg bg-muted">
                <Plane className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-muted-foreground">TIA</div>
                <div className="text-sm text-muted-foreground">Transfer Impact Assessment</div>
                <Badge variant="outline" className="text-xs mt-1">Coming Soon</Badge>
              </div>
            </div>

            {/* Privacy Policies - Coming Soon */}
            <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-muted/20 opacity-60">
              <div className="p-2 rounded-lg bg-muted">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-muted-foreground">Privacy Policies</div>
                <div className="text-sm text-muted-foreground">Policy management and generation</div>
                <Badge variant="outline" className="text-xs mt-1">Coming Soon</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="avantle-border bg-card backdrop-blur-sm shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Assessment #123 completed</span>
              <span className="text-muted-foreground ml-auto">2 hours ago</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span>Pre-check #456 flagged for full DPIA</span>
              <span className="text-muted-foreground ml-auto">4 hours ago</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span>Policy review due in 5 days</span>
              <span className="text-muted-foreground ml-auto">1 day ago</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Target className="h-4 w-4 text-orange-600" />
              <span>New assessment started by Demo User</span>
              <span className="text-muted-foreground ml-auto">2 days ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}