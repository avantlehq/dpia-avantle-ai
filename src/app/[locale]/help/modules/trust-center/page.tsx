import { CheckCircle } from 'lucide-react'
import { HelpPlaceholder } from '@/components/help/HelpPlaceholder'

export default function TrustCenterModulePage() {
  return (
    <HelpPlaceholder
      icon={<CheckCircle className="h-7 w-7 text-gray-500" />}
      title="Trust Center"
      description="Governance overview and audit packages"
    />
  )
}
