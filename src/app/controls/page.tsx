import React from 'react'
import { Lock, Shield, Key, Database } from 'lucide-react'

// Controls Module Test Page
export default function ControlsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <div 
            className="p-2 rounded-lg" 
            style={{ backgroundColor: 'rgba(245, 166, 35, 0.15)' }}
          >
            <Lock 
              className="h-6 w-6" 
              style={{ color: 'var(--color-orange)' }} 
            />
          </div>
          Controls Overview
        </h1>
        <p className="text-muted-foreground text-lg">
          Technical and organizational measures for data protection
        </p>
      </div>

      {/* Controls Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Technical Measures */}
        <div className="p-6 rounded-lg border border-border bg-card backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold">Technical Measures</h3>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div>• Encryption at rest and in transit</div>
            <div>• Access controls and authentication</div>
            <div>• Network security measures</div>
            <div>• Data backup and recovery</div>
          </div>
        </div>

        {/* Organizational Measures */}
        <div className="p-6 rounded-lg border border-border bg-card backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <Key className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold">Organizational Measures</h3>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div>• Staff training and awareness</div>
            <div>• Privacy policies and procedures</div>
            <div>• Incident response plans</div>
            <div>• Data retention policies</div>
          </div>
        </div>

        {/* Data Security */}
        <div className="p-6 rounded-lg border border-border bg-card backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Database className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold">Data Security</h3>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div>• Data minimization practices</div>
            <div>• Purpose limitation controls</div>
            <div>• Data quality assurance</div>
            <div>• Regular security assessments</div>
          </div>
        </div>

        {/* Compliance Status */}
        <div className="p-6 rounded-lg border border-border bg-card backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
              <Lock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold">Compliance Status</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Implemented</span>
              <span className="font-medium text-green-600">24 controls</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">In Progress</span>
              <span className="font-medium text-yellow-600">8 controls</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Planned</span>
              <span className="font-medium text-gray-400">12 controls</span>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="text-center py-8">
        <p className="text-muted-foreground text-sm">
          Controls management module is coming soon. This is a test page to ensure navigation works properly.
        </p>
      </div>
    </div>
  )
}