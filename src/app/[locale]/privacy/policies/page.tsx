'use client'

import React from 'react'
import { BookOpen } from 'lucide-react'
import { ModuleComingSoon } from '@/components/ui/module-coming-soon'

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic'

export default function PoliciesPage() {
  const features = [
    'GDPR-compliant policy template generator',
    'Multi-language policy support (EU languages)',
    'Automated policy updates based on processing changes',
    'Version control and change tracking',
    'Legal review workflow and approval process'
  ]

  return (
    <ModuleComingSoon
      icon={BookOpen}
      title="Privacy Policies"
      description="Comprehensive privacy policy management and automated generation"
      features={features}
      estimatedTimeline="Q2 2026"
      moduleColor="#9B59B6"
    />
  )
}