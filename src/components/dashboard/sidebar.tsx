import { useTranslations } from 'next-intl'
import { Link } from '../../../i18n/routing'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  Plus, 
  Settings,
  BarChart3
} from 'lucide-react'

export function Sidebar() {
  const t = useTranslations('dashboard')

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6">
        <h2 className="text-xl font-bold">DPIA.ai</h2>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        <Link href="/dashboard">
          <Button variant="ghost" className="w-full justify-start">
            <BarChart3 className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </Link>
        
        <Link href="/dashboard">
          <Button variant="ghost" className="w-full justify-start">
            <FileText className="mr-2 h-4 w-4" />
            {t('assessments')}
          </Button>
        </Link>
        
        <Link href="/dashboard/new">
          <Button variant="ghost" className="w-full justify-start">
            <Plus className="mr-2 h-4 w-4" />
            {t('newAssessment')}
          </Button>
        </Link>
        
        <Button variant="ghost" className="w-full justify-start">
          <Settings className="mr-2 h-4 w-4" />
          {t('settings')}
        </Button>
      </nav>
    </div>
  )
}