'use client'

import React from 'react'
import { Users } from 'lucide-react'
import { ModuleComingSoon } from '@/components/ui/module-coming-soon'

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic'

export default function VendorsPage() {
  const features = [
    'Vendor registry with DPA management',
    'Processor vs sub-processor classification',
    'Compliance status monitoring and alerts',
    'Contract lifecycle and renewal tracking',
    'Vendor risk assessment and scoring'
  ]

  return (
    <ModuleComingSoon
      icon={Users}
      title="Vendors / Processors"
      description="Third-party data processor and vendor management with DPA tracking"
      features={features}
      estimatedTimeline="Q3 2026"
      moduleColor="#4A90E2"
    />
  )
}