import { Shield } from 'lucide-react'
import { HelpPlaceholder } from '@/components/help/HelpPlaceholder'

export default function CompliancePage() {
  return (
    <HelpPlaceholder
      icon={<Shield className="h-7 w-7 text-green-500" />}
      title="GDPR Compliance"
      description="Understanding GDPR requirements and how to meet them"
    />
  )
}
