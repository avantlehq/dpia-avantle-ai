import { AlertTriangle } from 'lucide-react'
import { HelpPlaceholder } from '@/components/help/HelpPlaceholder'

export default function RiskModulePage() {
  return (
    <HelpPlaceholder
      icon={<AlertTriangle className="h-7 w-7 text-red-500" />}
      title="Risk Module"
      description="Privacy risk identification, assessment, and management"
    />
  )
}
