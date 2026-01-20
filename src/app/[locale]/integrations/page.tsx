'use client'

import React from 'react'
import { Plug } from 'lucide-react'
import { ModuleComingSoon } from '@/components/ui/module-coming-soon'

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic'

export default function IntegrationsPage() {
  const features = [
    'API keys management and access control',
    'Webhooks for real-time event notifications',
    'SSO/SAML integration for enterprise authentication',
    'Third-party connector marketplace (Slack, Teams, JIRA)',
    'Data export automation to compliance platforms',
    'OAuth 2.0 for secure third-party authorization'
  ]

  return (
    <ModuleComingSoon
      icon={Plug}
      title="Integrations"
      description="Connect external systems, manage API access, and automate compliance workflows"
      features={features}
      estimatedTimeline="Q2 2026"
      moduleColor="#8B5CF6"
    />
  )
}
