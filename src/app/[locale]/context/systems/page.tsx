'use client'

import React from 'react'
import { Server } from 'lucide-react'
import { ModuleComingSoon } from '@/components/ui/module-coming-soon'

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic'

export default function SystemsPage() {
  const features = [
    'IT systems inventory with data processing classification',
    'Infrastructure mapping and data flow visualization',
    'System security assessment and compliance tracking',
    'Integration points and API documentation',
    'Change management and version control'
  ]

  return (
    <ModuleComingSoon
      icon={Server}
      title="Systems"
      description="Comprehensive IT systems and infrastructure management for data processing"
      features={features}
      estimatedTimeline="Q2 2026"
      moduleColor="#4A90E2"
    />
  )
}