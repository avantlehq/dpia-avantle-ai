import React from 'react'
import Link from 'next/link'

export default function TrustCenterOverviewPage() {
  return (
    <div className="space-y-6">
      {/* Header - Simplified */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Trust Center</h1>
        <p className="text-muted-foreground">
          Audit packages and compliance documentation for external stakeholders
        </p>
      </div>

      {/* Note about Platform Overview */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          📊 <strong>Platform Overview & Compliance Metrics</strong> are now available on the main 
          <Link href="/dashboard" className="underline ml-1">Platform Dashboard</Link> - 
          your single source for management reporting and compliance monitoring.
        </p>
      </div>

    </div>
  )
}