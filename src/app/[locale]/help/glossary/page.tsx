import { BookOpen } from 'lucide-react'
import { HelpPlaceholder } from '@/components/help/HelpPlaceholder'

export default function GlossaryPage() {
  return (
    <HelpPlaceholder
      icon={<BookOpen className="h-7 w-7 text-purple-500" />}
      title="Privacy Glossary"
      description="Key terms and definitions in privacy and data protection"
    />
  )
}
