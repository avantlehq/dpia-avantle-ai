'use client'

import React from 'react'
import { Globe } from 'lucide-react'
import { ModuleComingSoon } from '@/components/ui/module-coming-soon'

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic'

export default function LocationsPage() {
  const features = [
    'Geographic data mapping and visualization',
    'Jurisdictional compliance requirements',
    'Cross-border transfer monitoring',
    'Data residency and sovereignty tracking',
    'Regulatory landscape mapping by location'
  ]

  return (
    <ModuleComingSoon
      icon={Globe}
      title="Locations & Jurisdictions"
      description="Geographic data location tracking and jurisdictional compliance management"
      features={features}
      estimatedTimeline="Q3 2026"
      moduleColor="#4A90E2"
    />
  )
}