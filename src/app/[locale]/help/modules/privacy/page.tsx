import { Shield } from 'lucide-react'
import { HelpPlaceholder } from '@/components/help/HelpPlaceholder'

export default function PrivacyModulePage() {
  return (
    <HelpPlaceholder
      icon={<Shield className="h-7 w-7 text-green-500" />}
      title="Privacy Module"
      description="DPIA assessments, LIA, TIA, and privacy policies"
    />
  )
}
