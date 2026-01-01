'use client'

import React from 'react'
import { ArrowRight } from 'lucide-react'
import { ModuleComingSoon } from '@/components/ui/module-coming-soon'

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