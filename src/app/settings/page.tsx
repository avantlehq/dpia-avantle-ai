import { PageHeader } from '@/components/layout/page-header'
import { Breadcrumbs } from '@/components/navigation/breadcrumbs'
import { EmptyState } from '@/components/ui/empty-state'
import { Settings } from 'lucide-react'

// Force dynamic rendering to ensure proper authentication
export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Workspace Settings"
        description="Configure your workspace preferences, integrations, and GDPR compliance settings."
      />

      <Breadcrumbs
        items={[
          { label: "Settings", href: "/settings", current: true }
        ]}
      />

      <EmptyState
        title="Settings not yet configured"
        description="Workspace settings will include organization details, compliance preferences, notification settings, and integration configurations."
        actionLabel="Configure Settings"
        onAction={() => console.log('Configure settings clicked')}
        icon={<Settings className="h-12 w-12 text-muted-foreground" />}
      />
    </div>
  )
}