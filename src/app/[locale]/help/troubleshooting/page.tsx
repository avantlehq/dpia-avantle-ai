import { AlertTriangle } from 'lucide-react'
import { HelpPlaceholder } from '@/components/help/HelpPlaceholder'

export default function TroubleshootingPage() {
  return (
    <HelpPlaceholder
      icon={<AlertTriangle className="h-7 w-7 text-orange-500" />}
      title="Troubleshooting"
      description="Common issues and how to resolve them"
    />
  )
}
