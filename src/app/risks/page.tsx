import { PageHeader } from '@/components/layout/page-header'
import { Breadcrumbs } from '@/components/navigation/breadcrumbs'
import { EmptyState } from '@/components/ui/empty-state'
import { AlertTriangle } from 'lucide-react'

// Force dynamic rendering to ensure proper authentication
export const dynamic = 'force-dynamic'

export default async function RisksPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Risk Registry"
        description="All risks identified across your processing activities."
      />

      <Breadcrumbs
        items={[
          { label: "Risk Management", href: "/risks", current: true }
        ]}
      />

      <EmptyState
        title="No risks yet"
        description="Start by creating your first identified risk to track and manage potential threats to personal data processing."
        actionLabel="Create Risk"
        onAction={() => console.log('Create risk clicked')}
        icon={<AlertTriangle className="h-12 w-12 text-muted-foreground" />}
      />
    </div>
  )
}