import { Lock } from 'lucide-react'
import { HelpPlaceholder } from '@/components/help/HelpPlaceholder'

export default function ControlsModulePage() {
  return (
    <HelpPlaceholder
      icon={<Lock className="h-7 w-7 text-orange-500" />}
      title="Controls Module"
      description="Technical and organizational measures (TOMs)"
    />
  )
}
