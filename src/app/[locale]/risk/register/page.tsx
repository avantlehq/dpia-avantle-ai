'use client'

import React from 'react'
import { FileText } from 'lucide-react'
import { ModuleComingSoon } from '@/components/ui/module-coming-soon'

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic'

export default function RiskRegisterPage() {
  const features = [
    'Centralized risk inventory with unique risk IDs',
    'Risk owner assignment and responsibility tracking',
    'Mitigation status monitoring (Open, In Progress, Closed)',
    'Risk treatment plan documentation',
    'Audit trail and compliance reporting'
  ]

  return (
    <ModuleComingSoon
      icon={FileText}
      title="Risk Register"
      description="Centralized privacy risk registry with comprehensive tracking and management"
      features={features}
      estimatedTimeline="Q1 2027"
      moduleColor="#FF6B6B"
    />
  )
}