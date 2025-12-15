import { 
  LayoutDashboard, 
  Settings, 
  AlertTriangle,
  Sparkles,
  Target,
  type LucideIcon
} from 'lucide-react'

export interface NavItem {
  name: string
  href: string
  icon: LucideIcon
  badge?: string | number
  description?: string
  disabled?: boolean
  color?: string
}

export interface NavGroup {
  name: string
  items: NavItem[]
  color?: string
  colorClass?: string
  gradient?: string
}

// Modern SaaS navigation structure for DPIA.ai
export const navigationConfig: NavGroup[] = [
  {
    name: "", // No group headers for modern flat design
    colorClass: "neutral",
    items: [
      { 
        name: "Overview", 
        href: "/dashboard", 
        icon: LayoutDashboard,
        description: "Assessment overview and dashboard"
      },
      { 
        name: "DPIA Pre-Check", 
        href: "/precheck", 
        icon: Sparkles,
        description: "Quick GDPR Article 35 evaluation"
      },
      { 
        name: "DPIA Assessments", 
        href: "/assessments", 
        icon: Target,
        description: "Create and manage privacy impact assessments"
      },
    ]
  },
  // Future modules - disabled for now
  {
    name: "", // No group headers
    colorClass: "neutral",
    items: [
      { 
        name: "Risk Management", 
        href: "/risks", 
        icon: AlertTriangle,
        description: "Manage identified privacy risks",
        disabled: true
      },
      { 
        name: "Settings", 
        href: "/settings", 
        icon: Settings,
        description: "Workspace configuration",
        disabled: true
      },
    ]
  }
]

// Wizard steps configuration
export interface WizardStep {
  id: string
  name: string
  href: string
  description?: string
  completed?: boolean
  current?: boolean
}

export const dpiaWizardSteps: WizardStep[] = [
  {
    id: "context",
    name: "Context & Scope",
    href: "/context",
    description: "Define the processing context and scope"
  },
  {
    id: "legal-basis",
    name: "Legal Basis",
    href: "/legal-basis", 
    description: "Establish legal grounds for processing"
  },
  {
    id: "risk-assessment",
    name: "Risk Assessment",
    href: "/risk-assessment",
    description: "Identify and evaluate privacy risks"
  },
  {
    id: "measures",
    name: "Measures",
    href: "/measures",
    description: "Define mitigation measures"
  },
  {
    id: "summary",
    name: "Summary",
    href: "/summary",
    description: "Review and finalize assessment"
  }
]

// Helper functions
export function getActiveNavItem(pathname: string): NavItem | undefined {
  for (const group of navigationConfig) {
    for (const item of group.items) {
      if (pathname === item.href || pathname.startsWith(item.href + '/')) {
        return item
      }
    }
  }
  return undefined
}

export function getActiveWizardStep(pathname: string): WizardStep | undefined {
  return dpiaWizardSteps.find(step => 
    pathname.includes(step.id) || pathname.endsWith(step.href)
  )
}

export function updateWizardStepStatus(
  steps: WizardStep[], 
  currentStepId: string
): WizardStep[] {
  return steps.map((step, index) => {
    const currentIndex = steps.findIndex(s => s.id === currentStepId)
    return {
      ...step,
      completed: index < currentIndex,
      current: step.id === currentStepId
    }
  })
}