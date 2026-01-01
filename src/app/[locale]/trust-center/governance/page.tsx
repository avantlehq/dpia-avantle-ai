'use client'

import React from 'react'
import { LayoutDashboard } from 'lucide-react'
import { ModuleComingSoon } from '@/components/ui/module-coming-soon'

export default function GovernancePage() {
  const features = [
    'Cross-module compliance dashboard',
    'Governance KPI tracking and reporting',
    'Policy compliance monitoring',
    'Executive summary generation',
    'Regulatory readiness assessment'
  ]

  return (
    <ModuleComingSoon
      icon={LayoutDashboard}
      title="Governance Overview"
      description="Comprehensive privacy governance and cross-module compliance monitoring"
      features={features}
      estimatedTimeline="Q3 2027"
      moduleColor="#A9A9A9"
    />
  )
}