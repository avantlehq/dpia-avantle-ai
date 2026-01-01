'use client'

import React from 'react'
import { AlertTriangle } from 'lucide-react'
import { ModuleComingSoon } from '@/components/ui/module-coming-soon'

export default function PrivacyRisksPage() {
  const features = [
    'Automated risk identification from DPIA outcomes',
    'Risk scoring matrix (likelihood × impact)',
    'Data subject rights impact calculator',
    'Regulatory enforcement risk assessment',
    'Continuous monitoring and alerting system'
  ]

  return (
    <ModuleComingSoon
      icon={AlertTriangle}
      title="Privacy Risks"
      description="Comprehensive privacy risk identification, assessment and monitoring"
      features={features}
      estimatedTimeline="Q4 2026"
      moduleColor="#FF6B6B"
    />
  )
}