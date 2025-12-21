import React from 'react'
import { Database, Server, FileText, Folder, ArrowRight, Users, Globe } from 'lucide-react'

// Context Module Test Page
export default function ContextPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <div 
            className="p-2 rounded-lg" 
            style={{ backgroundColor: 'rgba(74, 144, 226, 0.15)' }}
          >
            <Database 
              className="h-6 w-6" 
              style={{ color: 'var(--color-blue)' }} 
            />
          </div>
          Context Overview
        </h1>
        <p className="text-muted-foreground text-lg">
          Foundation data and processing context for privacy assessments
        </p>
      </div>

      {/* Context Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Systems */}
        <div className="p-6 rounded-lg border border-border bg-card backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Server className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold">Systems</h3>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div>• IT systems inventory</div>
            <div>• Infrastructure mapping</div>
            <div>• System dependencies</div>
            <div>• Technical documentation</div>
          </div>
        </div>

        {/* Processing Activities */}
        <div className="p-6 rounded-lg border border-border bg-card backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold">Processing Activities</h3>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div>• ROPA (Article 30)</div>
            <div>• Processing purposes</div>
            <div>• Legal bases</div>
            <div>• Data retention periods</div>
          </div>
        </div>

        {/* Data Categories */}
        <div className="p-6 rounded-lg border border-border bg-card backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Folder className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold">Data Categories</h3>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div>• Personal data types</div>
            <div>• Special category data</div>
            <div>• Data sensitivity levels</div>
            <div>• Data classification</div>
          </div>
        </div>

        {/* Data Flows */}
        <div className="p-6 rounded-lg border border-border bg-card backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
              <ArrowRight className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold">Data Flows</h3>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div>• Data movement mapping</div>
            <div>• Transfer mechanisms</div>
            <div>• Cross-border transfers</div>
            <div>• Data flow diagrams</div>
          </div>
        </div>

        {/* Vendors & Processors */}
        <div className="p-6 rounded-lg border border-border bg-card backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
              <Users className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold">Vendors & Processors</h3>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div>• Third-party processors</div>
            <div>• Vendor assessments</div>
            <div>• DPA management</div>
            <div>• Processor oversight</div>
          </div>
        </div>

        {/* Locations & Jurisdictions */}
        <div className="p-6 rounded-lg border border-border bg-card backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
              <Globe className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold">Locations & Jurisdictions</h3>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div>• Geographic locations</div>
            <div>• Jurisdictional mapping</div>
            <div>• Regulatory frameworks</div>
            <div>• Cross-border rules</div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 rounded-lg bg-muted/30">
          <div className="text-2xl font-bold text-blue-600">12</div>
          <div className="text-sm text-muted-foreground">Systems</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-muted/30">
          <div className="text-2xl font-bold text-green-600">8</div>
          <div className="text-sm text-muted-foreground">Processing Activities</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-muted/30">
          <div className="text-2xl font-bold text-purple-600">15</div>
          <div className="text-sm text-muted-foreground">Data Categories</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-muted/30">
          <div className="text-2xl font-bold text-orange-600">6</div>
          <div className="text-sm text-muted-foreground">Vendors</div>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="text-center py-8">
        <p className="text-muted-foreground text-sm">
          Context management module is coming soon. This is a test page to ensure navigation works properly.
        </p>
      </div>
    </div>
  )
}