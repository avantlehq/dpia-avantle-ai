'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Database, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DataFlowFormProps {
  assessmentId: string
  onComplete: () => void
  onNext: () => void
}

export function DataFlowForm({ onComplete, onNext }: DataFlowFormProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Database className="h-5 w-5 text-dpia-blue" />
          <h2 className="text-2xl font-semibold">Data Flow & Processing</h2>
          <Badge variant="secondary">Coming Soon</Badge>
        </div>
        <p className="text-muted-foreground">
          Map data collection, storage, transfers, and sharing arrangements.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Section Under Development
          </CardTitle>
          <CardDescription>
            This section will include forms for:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Collection methods and sources</li>
            <li>• Data storage locations and security</li>
            <li>• Third-party transfers and sharing</li>
            <li>• Data processors and joint controllers</li>
            <li>• Security measures and safeguards</li>
            <li>• International transfers and adequacy</li>
          </ul>
          
          <div className="mt-6">
            <Button 
              onClick={() => {
                onComplete()
                onNext()
              }}
              variant="outline"
            >
              Skip for Now (Development)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}