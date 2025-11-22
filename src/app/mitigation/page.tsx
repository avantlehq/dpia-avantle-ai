import { PageHeader } from '@/components/layout/page-header'
import { Breadcrumbs } from '@/components/navigation/breadcrumbs'
import { EmptyState } from '@/components/ui/empty-state'
import { CheckSquare } from 'lucide-react'

// Force dynamic rendering to ensure proper authentication
export const dynamic = 'force-dynamic'

export default async function MitigationPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Risk Mitigation"
        description="Define and track risk mitigation strategies and their implementation status."
      />

      <Breadcrumbs
        items={[
          { label: "Risk Management", href: "/risks" },
          { label: "Mitigation", href: "/mitigation", current: true }
        ]}
      />

      <EmptyState
        title="No mitigation strategies yet"
        description="Create mitigation strategies to address identified risks and reduce their potential impact on data protection."
        actionLabel="Create Strategy"
        onAction={() => console.log('Create mitigation clicked')}
        icon={<CheckSquare className="h-12 w-12 text-muted-foreground" />}
      />
    </div>
  )
}