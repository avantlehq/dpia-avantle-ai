// Avantle Privacy Platform - Future-Proof Module Architecture
// Following /privacy/... routing pattern for scalability

import { 
  Database,
  Shield, 
  AlertTriangle,
  Lock,
  GraduationCap,
  CheckCircle,
  Server,
  FileText,
  Folder,
  ArrowRight,
  Users,
  Globe,
  LayoutDashboard,
  Sparkles,
  Target,
  Scale,
  Plane,
  BookOpen,
  type LucideIcon
} from 'lucide-react'
import { detectClientLocale } from '@/i18n/utils'

// Core module interface for Avantle Privacy Platform
export interface ModuleConfig {
  id: string
  name: string  
  href: string
  icon: LucideIcon
  color: string
  items: NavItem[]
  licenseRequired?: string
  roleRequired?: string[]
  description?: string
}

// Helper function to get locale-aware href
function getLocaleHref(path: string): string {
  if (typeof window === 'undefined') return path
  const locale = detectClientLocale()
  return `/${locale}${path}`
}

export interface NavItem {
  id: string
  name: string
  href: string
  icon: LucideIcon
  description?: string
  disabled?: boolean
  badge?: string | number
  isExternalLink?: boolean
}

// Privacy Platform - 6 Core Modules
export const privacyModulesConfig: ModuleConfig[] = [
  // 1. CONTEXT MODULE - Foundation data
  {
    id: 'context',
    name: 'Context',
    href: getLocaleHref('/context'),
    icon: Database,
    color: 'var(--color-blue)',
    description: 'Foundation data and processing context',
    items: [
      { 
        id: 'overview',
        name: 'Overview', 
        href: getLocaleHref('/context'), 
        icon: LayoutDashboard,
        description: 'Context dashboard and foundation data overview'
      },
      { 
        id: 'systems',
        name: 'Systems', 
        href: getLocaleHref('/context/systems'), 
        icon: Server,
        description: 'IT systems and infrastructure'
      },
      { 
        id: 'processing',
        name: 'Processing Activities', 
        href: getLocaleHref('/context/processing'), 
        icon: FileText,
        description: 'ROPA - Record of Processing Activities'
      },
      { 
        id: 'data-categories',
        name: 'Data Categories', 
        href: getLocaleHref('/context/data-categories'), 
        icon: Folder,
        description: 'Personal data classification'
      },
      { 
        id: 'data-flows',
        name: 'Data Flows', 
        href: getLocaleHref('/context/data-flows'), 
        icon: ArrowRight,
        description: 'Data movement and transfers'
      },
      { 
        id: 'vendors',
        name: 'Vendors / Processors', 
        href: getLocaleHref('/context/vendors'), 
        icon: Users,
        description: 'Third-party data processors'
      },
      { 
        id: 'locations',
        name: 'Locations & Jurisdictions', 
        href: getLocaleHref('/context/locations'), 
        icon: Globe,
        description: 'Geographic data locations'
      }
    ]
  },

  // 2. PRIVACY MODULE - Assessments & Compliance (FUTURE-PROOF)
  {
    id: 'privacy',
    name: 'Privacy',
    href: getLocaleHref('/privacy'),
    icon: Shield,
    color: 'var(--color-green)',
    description: 'Privacy impact assessments and compliance',
    items: [
      { 
        id: 'overview',
        name: 'Overview', 
        href: getLocaleHref('/privacy'), 
        icon: LayoutDashboard,
        description: 'Privacy dashboard and statistics'
      },
      { 
        id: 'dpia-precheck',
        name: 'DPIA Pre-Check', 
        href: getLocaleHref('/precheck'), // Keep existing working route for now
        icon: Sparkles,
        description: 'Quick GDPR Article 35 evaluation'
      },
      { 
        id: 'dpia-assessments',
        name: 'DPIA Assessments', 
        href: getLocaleHref('/dashboard'), // Points to dashboard with existing assessments
        icon: Target,
        description: 'Data Protection Impact Assessments'
      },
      { 
        id: 'lia',
        name: 'LIA', 
        href: getLocaleHref('/privacy/lia'), // FUTURE-PROOF: expandable
        icon: Scale,
        description: 'Legitimate Interest Assessment'
      },
      { 
        id: 'tia',
        name: 'TIA', 
        href: getLocaleHref('/privacy/tia'), // FUTURE-PROOF: expandable
        icon: Plane,
        description: 'Transfer Impact Assessment'
      },
      { 
        id: 'policies',
        name: 'Privacy Policies', 
        href: getLocaleHref('/privacy/policies'), // FUTURE-PROOF: expandable
        icon: BookOpen,
        description: 'Privacy policy management'
      }
    ]
  },

  // 3. RISK MODULE - Risk management
  {
    id: 'risk',
    name: 'Risk',
    href: getLocaleHref('/risk'),
    icon: AlertTriangle,
    color: 'var(--color-red)',
    description: 'Privacy risk identification and management',
    licenseRequired: 'risk-management',
    items: [
      { 
        id: 'risk-overview',
        name: 'Risk Overview', 
        href: getLocaleHref('/risk'), 
        icon: LayoutDashboard,
        description: 'Risk dashboard and metrics',
        disabled: true
      },
      { 
        id: 'privacy-risks',
        name: 'Privacy Risks', 
        href: getLocaleHref('/risk/privacy-risks'), 
        icon: AlertTriangle,
        description: 'Identified privacy risks',
        disabled: true
      },
      { 
        id: 'risk-register',
        name: 'Risk Register', 
        href: getLocaleHref('/risk/register'), 
        icon: FileText,
        description: 'Centralized risk registry',
        disabled: true
      }
    ]
  },

  // 4. CONTROLS MODULE - Security controls
  {
    id: 'controls',
    name: 'Controls',
    href: getLocaleHref('/controls'),
    icon: Lock,
    color: 'var(--color-orange)',
    description: 'Technical and organizational measures',
    licenseRequired: 'controls-management',
    items: [
      { 
        id: 'controls-overview',
        name: 'Controls Overview', 
        href: getLocaleHref('/controls'), 
        icon: LayoutDashboard,
        description: 'Controls dashboard',
        disabled: true
      },
      { 
        id: 'toms',
        name: 'TOMs', 
        href: getLocaleHref('/controls/toms'), 
        icon: Lock,
        description: 'Technical & Organizational Measures'
      }
    ]
  },

  // 5. TRAINING MODULE - Awareness & education
  {
    id: 'training',
    name: 'Training',
    href: getLocaleHref('/training'),
    icon: GraduationCap,
    color: 'var(--color-purple)',
    description: 'Privacy awareness and training',
    licenseRequired: 'training-management',
    items: [
      { 
        id: 'training-overview',
        name: 'Training Overview', 
        href: getLocaleHref('/training'), 
        icon: LayoutDashboard,
        description: 'Training dashboard',
        disabled: true
      }
    ]
  },

  // 6. TRUST CENTER - Audit & compliance outputs
  {
    id: 'trust-center',
    name: 'Trust Center',
    href: getLocaleHref('/trust-center'),
    icon: CheckCircle,
    color: 'var(--color-gray)',
    description: 'Audit packages and compliance reporting',
    licenseRequired: 'trust-center',
    items: [
      { 
        id: 'governance',
        name: 'Governance Overview', 
        href: getLocaleHref('/trust-center/governance'), 
        icon: LayoutDashboard,
        description: 'Cross-module compliance status',
        disabled: true
      },
      { 
        id: 'audit-packages',
        name: 'Audit Packages', 
        href: getLocaleHref('/trust-center/audit-packages'), 
        icon: FileText,
        description: 'Compliance audit bundles',
        disabled: true
      }
    ]
  }
]

// Helper functions
export function getModuleConfig(moduleId: string): ModuleConfig | undefined {
  return privacyModulesConfig.find(module => module.id === moduleId)
}

export function getActiveModule(pathname: string): string | undefined {
  // Special handling for dashboard - default to privacy module
  if (pathname === '/dashboard' || pathname === '/') {
    return 'privacy'
  }
  
  // Special handling for existing routes that should map to Privacy module
  const privacyRoutes = ['/precheck', '/assessments', '/assessment']
  if (privacyRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    return 'privacy'
  }

  // Determine active module from pathname
  for (const moduleConfig of privacyModulesConfig) {
    if (pathname === moduleConfig.href || pathname.startsWith(moduleConfig.href + '/')) {
      return moduleConfig.id
    }
    
    // Check module items
    for (const item of moduleConfig.items) {
      if (pathname === item.href || pathname.startsWith(item.href + '/')) {
        return moduleConfig.id
      }
    }
  }
  return undefined
}

export function getActiveNavItem(pathname: string): NavItem | undefined {
  for (const moduleConfig of privacyModulesConfig) {
    for (const item of moduleConfig.items) {
      if (pathname === item.href || pathname.startsWith(item.href + '/')) {
        return item
      }
    }
  }
  return undefined
}

// Always return all modules - no license filtering for now
export function getVisibleModules(): ModuleConfig[] {
  return privacyModulesConfig
}