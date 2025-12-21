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
    href: '/context',
    icon: Database,
    color: 'var(--color-blue)',
    description: 'Foundation data and processing context',
    items: [
      { 
        id: 'systems',
        name: 'Systems', 
        href: '/context/systems', 
        icon: Server,
        description: 'IT systems and infrastructure'
      },
      { 
        id: 'processing',
        name: 'Processing Activities', 
        href: '/context/processing', 
        icon: FileText,
        description: 'ROPA - Record of Processing Activities'
      },
      { 
        id: 'data-categories',
        name: 'Data Categories', 
        href: '/context/data-categories', 
        icon: Folder,
        description: 'Personal data classification'
      },
      { 
        id: 'data-flows',
        name: 'Data Flows', 
        href: '/context/data-flows', 
        icon: ArrowRight,
        description: 'Data movement and transfers'
      },
      { 
        id: 'vendors',
        name: 'Vendors / Processors', 
        href: '/context/vendors', 
        icon: Users,
        description: 'Third-party data processors'
      },
      { 
        id: 'locations',
        name: 'Locations & Jurisdictions', 
        href: '/context/locations', 
        icon: Globe,
        description: 'Geographic data locations'
      }
    ]
  },

  // 2. PRIVACY MODULE - Assessments & Compliance (FUTURE-PROOF)
  {
    id: 'privacy',
    name: 'Privacy',
    href: '/privacy',
    icon: Shield,
    color: 'var(--color-green)',
    description: 'Privacy impact assessments and compliance',
    items: [
      { 
        id: 'overview',
        name: 'Overview', 
        href: '/privacy', 
        icon: LayoutDashboard,
        description: 'Privacy dashboard and statistics'
      },
      { 
        id: 'dpia-precheck',
        name: 'DPIA Pre-Check', 
        href: '/precheck', // Keep existing working route for now
        icon: Sparkles,
        description: 'Quick GDPR Article 35 evaluation'
      },
      { 
        id: 'dpia-assessments',
        name: 'DPIA Assessments', 
        href: '/assessments', // Keep existing working route for now
        icon: Target,
        description: 'Data Protection Impact Assessments'
      },
      { 
        id: 'lia',
        name: 'LIA', 
        href: '/privacy/lia', // FUTURE-PROOF: expandable
        icon: Scale,
        description: 'Legitimate Interest Assessment',
        disabled: true
      },
      { 
        id: 'tia',
        name: 'TIA', 
        href: '/privacy/tia', // FUTURE-PROOF: expandable
        icon: Plane,
        description: 'Transfer Impact Assessment',
        disabled: true
      },
      { 
        id: 'policies',
        name: 'Privacy Policies', 
        href: '/privacy/policies', // FUTURE-PROOF: expandable
        icon: BookOpen,
        description: 'Privacy policy management',
        disabled: true
      }
    ]
  },

  // 3. RISK MODULE - Risk management
  {
    id: 'risk',
    name: 'Risk',
    href: '/risk',
    icon: AlertTriangle,
    color: 'var(--color-red)',
    description: 'Privacy risk identification and management',
    licenseRequired: 'risk-management',
    items: [
      { 
        id: 'risk-overview',
        name: 'Risk Overview', 
        href: '/risk', 
        icon: LayoutDashboard,
        description: 'Risk dashboard and metrics',
        disabled: true
      },
      { 
        id: 'privacy-risks',
        name: 'Privacy Risks', 
        href: '/risk/privacy-risks', 
        icon: AlertTriangle,
        description: 'Identified privacy risks',
        disabled: true
      },
      { 
        id: 'risk-register',
        name: 'Risk Register', 
        href: '/risk/register', 
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
    href: '/controls',
    icon: Lock,
    color: 'var(--color-orange)',
    description: 'Technical and organizational measures',
    licenseRequired: 'controls-management',
    items: [
      { 
        id: 'controls-overview',
        name: 'Controls Overview', 
        href: '/controls', 
        icon: LayoutDashboard,
        description: 'Controls dashboard',
        disabled: true
      },
      { 
        id: 'toms',
        name: 'TOMs', 
        href: '/controls/toms', 
        icon: Lock,
        description: 'Technical & Organizational Measures',
        disabled: true
      }
    ]
  },

  // 5. TRAINING MODULE - Awareness & education
  {
    id: 'training',
    name: 'Training',
    href: '/training',
    icon: GraduationCap,
    color: 'var(--color-purple)',
    description: 'Privacy awareness and training',
    licenseRequired: 'training-management',
    items: [
      { 
        id: 'training-overview',
        name: 'Training Overview', 
        href: '/training', 
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
    href: '/trust-center',
    icon: CheckCircle,
    color: 'var(--color-gray)',
    description: 'Audit packages and compliance reporting',
    licenseRequired: 'trust-center',
    items: [
      { 
        id: 'governance',
        name: 'Governance Overview', 
        href: '/trust-center/governance', 
        icon: LayoutDashboard,
        description: 'Cross-module compliance status',
        disabled: true
      },
      { 
        id: 'audit-packages',
        name: 'Audit Packages', 
        href: '/trust-center/audit-packages', 
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
  // Special handling for existing routes that should map to Privacy module
  const privacyRoutes = ['/precheck', '/assessments', '/assessment']
  if (privacyRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    return 'privacy'
  }

  // Determine active module from pathname
  for (const module of privacyModulesConfig) {
    if (pathname === module.href || pathname.startsWith(module.href + '/')) {
      return module.id
    }
    
    // Check module items
    for (const item of module.items) {
      if (pathname === item.href || pathname.startsWith(item.href + '/')) {
        return module.id
      }
    }
  }
  return undefined
}

export function getActiveNavItem(pathname: string): NavItem | undefined {
  for (const module of privacyModulesConfig) {
    for (const item of module.items) {
      if (pathname === item.href || pathname.startsWith(item.href + '/')) {
        return item
      }
    }
  }
  return undefined
}

// License checking helper
export function getVisibleModules(userLicenses: string[] = []): ModuleConfig[] {
  return privacyModulesConfig.filter(module => {
    if (!module.licenseRequired) return true
    return userLicenses.includes(module.licenseRequired)
  })
}

// Default license for development (all modules visible)
export const DEFAULT_DEV_LICENSES = [
  'risk-management',
  'controls-management', 
  'training-management',
  'trust-center'
]