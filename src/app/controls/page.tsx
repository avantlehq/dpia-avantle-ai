import { PageHeader } from '@/components/layout/page-header'
import { Breadcrumbs } from '@/components/navigation/breadcrumbs'
import { EmptyState } from '@/components/ui/empty-state'
import { Shield } from 'lucide-react'

// Force dynamic rendering to ensure proper authentication
export const dynamic = 'force-dynamic'

export default async function ControlsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Security Controls"
        description="Manage security controls and protective measures for your data processing activities."
      />

      <Breadcrumbs
        items={[
          { label: "Risk Management", href: "/risks" },
          { label: "Controls", href: "/controls", current: true }
        ]}
      />

      <EmptyState
        title="No controls defined yet"
        description="Create security controls to protect personal data and mitigate identified risks in your processing activities."
        actionLabel="Create Control"
        onAction={() => console.log('Create control clicked')}
        icon={<Shield className="h-12 w-12 text-muted-foreground" />}
      />
    </div>
  )
}