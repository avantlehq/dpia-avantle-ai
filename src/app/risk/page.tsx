import React from 'react'
import { AlertTriangle, FileText, BarChart3, TrendingUp } from 'lucide-react'

// Risk Module Test Page
export default function RiskPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <div 
            className="p-2 rounded-lg" 
            style={{ backgroundColor: 'rgba(255, 107, 107, 0.15)' }}
          >
            <AlertTriangle 
              className="h-6 w-6" 
              style={{ color: 'var(--color-red)' }} 
            />
          </div>
          Risk Management Overview
        </h1>
        <p className="text-muted-foreground text-lg">
          Privacy risk identification, assessment, and management
        </p>
      </div>

      {/* Risk Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 dark:text-red-400">High Risk</p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-300">3</p>
            </div>
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-800/50">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 dark:text-yellow-400">Medium Risk</p>
              <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">8</p>
            </div>
            <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-800/50">
              <BarChart3 className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 dark:text-green-400">Low Risk</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">15</p>
            </div>
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-800/50">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-900/20 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Mitigated</p>
              <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">22</p>
            </div>
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800/50">
              <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Risk Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Data Breach Risks */}
        <div className="p-6 rounded-lg border border-border bg-card backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold">Data Breach Risks</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Unauthorized access</span>
              <span className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 text-xs rounded-full">High</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Data exfiltration</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 text-xs rounded-full">Medium</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Insider threats</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 text-xs rounded-full">Medium</span>
            </div>
          </div>
        </div>

        {/* Compliance Risks */}
        <div className="p-6 rounded-lg border border-border bg-card backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
              <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold">Compliance Risks</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">GDPR violations</span>
              <span className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 text-xs rounded-full">High</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Inadequate documentation</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 text-xs rounded-full">Medium</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Missing consent</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 text-xs rounded-full">Medium</span>
            </div>
          </div>
        </div>

        {/* Technical Risks */}
        <div className="p-6 rounded-lg border border-border bg-card backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold">Technical Risks</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">System vulnerabilities</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 text-xs rounded-full">Medium</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Data corruption</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-xs rounded-full">Low</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Service disruption</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-xs rounded-full">Low</span>
            </div>
          </div>
        </div>

        {/* Operational Risks */}
        <div className="p-6 rounded-lg border border-border bg-card backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold">Operational Risks</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Process failures</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 text-xs rounded-full">Medium</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Human error</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 text-xs rounded-full">Medium</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Training gaps</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-xs rounded-full">Low</span>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="text-center py-8">
        <p className="text-muted-foreground text-sm">
          Risk management module is coming soon. This is a test page to ensure navigation works properly.
        </p>
      </div>
    </div>
  )
}