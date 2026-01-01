'use client'

import React from 'react'
import { Scale } from 'lucide-react'
import { ModuleComingSoon } from '@/components/ui/module-coming-soon'

export default function LIAPage() {
  const features = [
    'Three-step balancing test wizard',
    'Automated risk scoring for legitimate interests',
    'Data subject rights impact assessment',
    'Comprehensive documentation templates',
    'Legal precedent reference library'
  ]

  return (
    <ModuleComingSoon
      icon={Scale}
      title="LIA - Legitimate Interest Assessment"
      description="GDPR Article 6(1)(f) legitimate interest evaluations"
      features={features}
      estimatedTimeline="Q2 2026"
      moduleColor="#7ED321"
    />
  )
}