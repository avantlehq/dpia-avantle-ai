import { 
  Home,
  LayoutDashboard, 
  CheckCircle, 
  FileText, 
  Shield, 
  Settings, 
  CheckSquare, 
  Database, 
  Scale, 
  File, 
  Users,
  AlertTriangle,
  type LucideIcon
} from 'lucide-react'

export interface NavItem {
  name: string
  href: string
  icon: LucideIcon
  badge?: string | number
  description?: string
  disabled?: boolean
}

export interface NavGroup {
  name: string
  items: NavItem[]
}

// Complete module structure for DPIA Agent
export const navigationConfig: NavGroup[] = [
  {
    name: "Main",
    items: [
      { 
        name: "Home", 
        href: "/dashboard", 
        icon: Home,
        description: "Dashboard overview of all assessments"
      },
    ]
  },
  {
    name: "Assessment", 
    items: [
      { 
        name: "Pre-check", 
        href: "/precheck", 
        icon: CheckCircle,
        description: "Quick GDPR Article 35 evaluation"
      },
    ]
  },
  {
    name: "Builder",
    items: [
      { 
        name: "DPIA Builder", 
        href: "/assessments", 
        icon: FileText,
        description: "Create and manage DPIA assessments"
      },
    ]
  },
  {
    name: "Risk Management",
    items: [
      { 
        name: "Risk Registry", 
        href: "/risks", 
        icon: AlertTriangle,
        description: "Manage identified risks and threats",
        disabled: true // Future feature
      },
      { 
        name: "Controls", 
        href: "/controls", 
        icon: Shield,
        description: "Security controls and measures",
        disabled: true // Future feature
      },
      { 
        name: "Mitigation", 
        href: "/mitigation", 
        icon: CheckSquare,
        description: "Risk mitigation strategies",
        disabled: true // Future feature
      },
    ]
  },
  {
    name: "Settings",
    items: [
      { 
        name: "Workspace", 
        href: "/settings", 
        icon: Settings,
        description: "Workspace configuration and preferences",
        disabled: true // Future feature
      },
      { 
        name: "Team", 
        href: "/team", 
        icon: Users,
        description: "Team members and permissions",
        disabled: true // Future feature
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