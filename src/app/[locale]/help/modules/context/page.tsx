import { Database } from 'lucide-react'
import { HelpPlaceholder } from '@/components/help/HelpPlaceholder'

export default function ContextModulePage() {
  return (
    <HelpPlaceholder
      icon={<Database className="h-7 w-7 text-blue-500" />}
      title="Context Module"
      description="Managing systems, data flows, vendors, and processing activities"
    />
  )
}
