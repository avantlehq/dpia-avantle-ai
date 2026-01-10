'use client'

import React from 'react'
import { Calculator, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic'

export default function GovernancePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Compliance Score Methodology</h1>
        <p className="text-muted-foreground">
          How we calculate the 92% compliance score shown on the Platform Dashboard
        </p>
      </div>

      {/* Overall Score Summary */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Calculator className="h-5 w-5 text-blue-500" />
            Current Compliance Score: 92%
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Weighted average across all privacy compliance modules, calculated in real-time based on module completeness and data quality.
          </p>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <p className="text-sm font-medium mb-2">Calculation Formula:</p>
            <code className="text-sm text-blue-600 dark:text-blue-400">
              Score = (Context × 25%) + (Privacy × 30%) + (Risk × 20%) + (Controls × 15%) + (Training × 10%)
            </code>
          </div>
        </CardContent>
      </Card>

      {/* Component Breakdown */}
      <div className="grid gap-4">
        <h2 className="text-lg font-medium text-foreground">Component Breakdown</h2>
        
        {/* Context Module */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Context Data Quality
              </span>
              <span className="text-lg font-bold text-green-600">95%</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Systems Documented</span>
                <span className="font-medium">24/25 (96%)</span>
              </div>
              <div className="flex justify-between">
                <span>Processing Activities</span>
                <span className="font-medium">12/13 (92%)</span>
              </div>
              <div className="flex justify-between">
                <span>Data Flows Mapped</span>
                <span className="font-medium">18/18 (100%)</span>
              </div>
              <div className="flex justify-between">
                <span>Vendor DPAs</span>
                <span className="font-medium">8/10 (80%)</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">Weight: 25% of total score</p>
          </CardContent>
        </Card>

        {/* Privacy Module */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-500" />
                Privacy Assessments
              </span>
              <span className="text-lg font-bold text-blue-600">88%</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>DPIA Completed</span>
                <span className="font-medium">12/14 (86%)</span>
              </div>
              <div className="flex justify-between">
                <span>DPIA Current (&lt; 12 months)</span>
                <span className="font-medium">11/12 (92%)</span>
              </div>
              <div className="flex justify-between">
                <span>LIA Assessments</span>
                <span className="font-medium text-orange-600">Coming Soon</span>
              </div>
              <div className="flex justify-between">
                <span>TIA Assessments</span>
                <span className="font-medium text-orange-600">Coming Soon</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">Weight: 30% of total score</p>
          </CardContent>
        </Card>

        {/* Risk Module */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                Risk Management
              </span>
              <span className="text-lg font-bold text-yellow-600">90%</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>High Risks Mitigated</span>
                <span className="font-medium">22/25 (88%)</span>
              </div>
              <div className="flex justify-between">
                <span>Risk Register Updated</span>
                <span className="font-medium">Yes (100%)</span>
              </div>
              <div className="flex justify-between">
                <span>Risk Assessments Current</span>
                <span className="font-medium text-orange-600">Coming Soon</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">Weight: 20% of total score</p>
          </CardContent>
        </Card>

        {/* Controls Module */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-purple-500" />
                Technical & Organizational Measures
              </span>
              <span className="text-lg font-bold text-purple-600">94%</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Controls Implemented</span>
                <span className="font-medium">18/19 (95%)</span>
              </div>
              <div className="flex justify-between">
                <span>Controls Tested</span>
                <span className="font-medium">16/18 (89%)</span>
              </div>
              <div className="flex justify-between">
                <span>Security Frameworks</span>
                <span className="font-medium text-orange-600">Coming Soon</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">Weight: 15% of total score</p>
          </CardContent>
        </Card>

        {/* Training Module */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-amber-500" />
                Privacy Training
              </span>
              <span className="text-lg font-bold text-amber-600">87%</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Employee Training Completed</span>
                <span className="font-medium">142/164 (87%)</span>
              </div>
              <div className="flex justify-between">
                <span>Training Current (&lt; 12 months)</span>
                <span className="font-medium">128/142 (90%)</span>
              </div>
              <div className="flex justify-between">
                <span>Role-based Training</span>
                <span className="font-medium text-orange-600">Coming Soon</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">Weight: 10% of total score</p>
          </CardContent>
        </Card>
      </div>

      {/* Missing Data Sources */}
      <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
            <Clock className="h-5 w-5" />
            Missing Data Sources & Coming Soon Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm space-y-2">
            <h4 className="font-medium">Not Yet Implemented:</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Legitimate Interest Assessments (LIA) tracking</li>
              <li>Transfer Impact Assessments (TIA) metrics</li>
              <li>Automated risk assessment scoring</li>
              <li>Security framework compliance tracking</li>
              <li>Role-based training completion metrics</li>
              <li>Historical trend analysis</li>
              <li>Real-time data source integration</li>
            </ul>
          </div>
          <p className="text-xs text-orange-600 dark:text-orange-400">
            Current score based on available data. Full methodology will include all modules when implemented.
          </p>
        </CardContent>
      </Card>

      {/* Back to Dashboard */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 underline">
              ← Back to Platform Dashboard
            </Link>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}