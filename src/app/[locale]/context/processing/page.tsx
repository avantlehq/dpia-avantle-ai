'use client'

import React from 'react'
import { FileText } from 'lucide-react'
import { ModuleComingSoon } from '@/components/ui/module-coming-soon'

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic'

export default function ProcessingPage() {
  const features = [
    'GDPR Article 30 compliant ROPA templates',
    'Processing purpose and legal basis tracking',
    'Data retention period management',
    'Cross-border transfer documentation',
    'Automated ROPA generation and updates'
  ]

  return (
    <ModuleComingSoon
      icon={FileText}
      title="Processing Activities"
      description="Record of Processing Activities (ROPA) management - GDPR Article 30 compliance"
      features={features}
      estimatedTimeline="Q1 2026"
      moduleColor="#4A90E2"
    />
  )
}