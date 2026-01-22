import { Plug } from 'lucide-react'
import { HelpPlaceholder } from '@/components/help/HelpPlaceholder'

export default function IntegrationsModulePage() {
  return (
    <HelpPlaceholder
      icon={<Plug className="h-7 w-7 text-purple-500" />}
      title="Integrations Module"
      description="API access, webhooks, SSO/SAML, and third-party connectors"
    />
  )
}
