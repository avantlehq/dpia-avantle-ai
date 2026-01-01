'use client'

import React from 'react'
import { ArrowRight } from 'lucide-react'
import nextDynamic from 'next/dynamic'

// Dynamic import to avoid SSR issues
const ModuleComingSoon = nextDynamic(
  () => import('@/components/ui/module-coming-soon').then(mod => ({ default: mod.ModuleComingSoon })),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
      </div>
    )
  }
)

export default function DataFlowsPage() {
  const features = [
    'Visual data flow mapping and diagramming',
    'Cross-border transfer identification',
    'Third-party integration tracking',
    'Data retention lifecycle visualization',
    'Automated flow discovery and documentation'
  ]

  return (
    <ModuleComingSoon
      icon={ArrowRight}
      title="Data Flows"
      description="Data movement and transfer tracking with visual flow mapping"
      features={features}
      estimatedTimeline="Q2 2026"
      moduleColor="#4A90E2"
    />
  )
}