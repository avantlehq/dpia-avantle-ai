'use client'

import React from 'react'
import { Plane } from 'lucide-react'
import { ModuleComingSoon } from '@/components/ui/module-coming-soon'

export default function TIAPage() {
  const features = [
    'Adequacy decision checker for destination countries',
    'Standard Contractual Clauses (SCCs) template library',
    'Risk assessment matrix for third country transfers',
    'EDPB guidelines compliance checker',
    'Transfer mapping and documentation tools'
  ]

  return (
    <ModuleComingSoon
      icon={Plane}
      title="TIA - Transfer Impact Assessment"
      description="GDPR Chapter V international transfer evaluations and compliance"
      features={features}
      estimatedTimeline="Q3 2026"
      moduleColor="#4A90E2"
    />
  )
}