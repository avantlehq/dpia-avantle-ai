import { Code2 } from 'lucide-react'
import { HelpPlaceholder } from '@/components/help/HelpPlaceholder'

export default function ApiPage() {
  return (
    <HelpPlaceholder
      icon={<Code2 className="h-7 w-7 text-cyan-500" />}
      title="API Documentation"
      description="Integration guides and API reference"
    />
  )
}
