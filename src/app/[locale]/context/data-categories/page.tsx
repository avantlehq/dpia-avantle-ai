'use client'

import React from 'react'
import { Folder } from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamic import to avoid SSR issues
const ModuleComingSoon = dynamic(
  () => import('@/components/ui/module-coming-soon').then(mod => ({ default: mod.ModuleComingSoon })),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
      </div>
    )
  }
)

export default function DataCategoriesPage() {
  const features = [
    'Personal data taxonomy and classification system',
    'Special category data (sensitive) identification',
    'Data sensitivity scoring and risk assessment',
    'GDPR Article 9 compliance tracking',
    'Data lineage and relationship mapping'
  ]

  return (
    <ModuleComingSoon
      icon={Folder}
      title="Data Categories"
      description="Personal data classification and categorization system for GDPR compliance"
      features={features}
      estimatedTimeline="Q1 2026"
      moduleColor="#4A90E2"
    />
  )
}