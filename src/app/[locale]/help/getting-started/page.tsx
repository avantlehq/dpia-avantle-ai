import { Play } from 'lucide-react'
import { HelpPlaceholder } from '@/components/help/HelpPlaceholder'

export default function GettingStartedPage() {
  return (
    <HelpPlaceholder
      icon={<Play className="h-7 w-7 text-blue-500" />}
      title="Getting Started"
      description="Learn the basics of the Avantle Privacy Platform"
    />
  )
}
