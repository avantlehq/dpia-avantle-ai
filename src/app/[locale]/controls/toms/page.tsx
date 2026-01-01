'use client'

import React from 'react'
import { Lock } from 'lucide-react'
import { ModuleComingSoon } from '@/components/ui/module-coming-soon'

export default function TOMsPage() {
  const features = [
    'Technical controls inventory (encryption, access controls)',
    'Organizational measures checklist (policies, training)',
    'Implementation status tracking',
    'Compliance gap analysis',
    'Audit trail documentation'
  ]

  return (
    <ModuleComingSoon
      icon={Lock}
      title="TOMs - Technical & Organizational Measures"
      description="Comprehensive security measures management for GDPR Article 32 compliance"
      features={features}
      estimatedTimeline="Q1 2026"
      moduleColor="#F5A623"
    />
  )
}