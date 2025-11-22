import { PageHeader } from '@/components/layout/page-header'
import { Breadcrumbs } from '@/components/navigation/breadcrumbs'
import { EmptyState } from '@/components/ui/empty-state'
import { Users } from 'lucide-react'

// Force dynamic rendering to ensure proper authentication
export const dynamic = 'force-dynamic'

export default async function TeamPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Team Management"
        description="Manage team members, roles, and permissions for collaborative GDPR compliance work."
      />

      <Breadcrumbs
        items={[
          { label: "Settings", href: "/settings" },
          { label: "Team", href: "/team", current: true }
        ]}
      />

      <EmptyState
        title="No team members yet"
        description="Invite team members to collaborate on GDPR assessments. Assign roles like DPO, Legal Counsel, or Assessment Reviewer with appropriate permissions."
        actionLabel="Invite Members"
        onAction={() => console.log('Invite members clicked')}
        icon={<Users className="h-12 w-12 text-muted-foreground" />}
      />
    </div>
  )
}