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
  Sparkles,
  Target,
  ShieldCheck,
  Activity,
  UserCog,
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
  gradient?: string
}

// Complete module structure for DPIA Agent
export const navigationConfig: NavGroup[] = [
  {
    name: "Main",
    color: "#4A90E2", // Primary blue
    gradient: "from-blue-500 to-blue-600",
    items: [
      { 
        name: "Dashboard", 
        href: "/dashboard", 
        icon: LayoutDashboard,
        color: "#4A90E2",
        description: "Dashboard overview of all assessments"
      },
    ]
  },
  {
    name: "Assessment", 
    color: "#7ED321", // Green
    gradient: "from-green-500 to-emerald-600",
    items: [
      { 
        name: "Pre-check", 
        href: "/precheck", 
        icon: Sparkles,
        color: "#7ED321",
        description: "Quick GDPR Article 35 evaluation"
      },
    ]
  },
  {
    name: "Builder",
    color: "#F5A623", // Orange
    gradient: "from-orange-500 to-amber-600",
    items: [
      { 
        name: "DPIA Builder", 
        href: "/assessments", 
        icon: Target,
        color: "#F5A623",
        description: "Create and manage DPIA assessments"
      },
    ]
  },
  {
    name: "Risk Management",
    color: "#FF6B6B", // Red/Pink
    gradient: "from-red-500 to-pink-600",
    items: [
      { 
        name: "Risk Registry", 
        href: "/risks", 
        icon: AlertTriangle,
        color: "#FF6B6B",
        description: "Manage identified risks and threats",
        disabled: true // Future feature
      },
      { 
        name: "Controls", 
        href: "/controls", 
        icon: ShieldCheck,
        color: "#FF6B6B",
        description: "Security controls and measures",
        disabled: true // Future feature
      },
      { 
        name: "Mitigation", 
        href: "/mitigation", 
        icon: Activity,
        color: "#FF6B6B",
        description: "Risk mitigation strategies",
        disabled: true // Future feature
      },
    ]
  },
  {
    name: "Settings",
    color: "#9B59B6", // Purple
    gradient: "from-purple-500 to-indigo-600",
    items: [
      { 
        name: "Workspace", 
        href: "/settings", 
        icon: Settings,
        color: "#9B59B6",
        description: "Workspace configuration and preferences",
        disabled: true // Future feature
      },
      { 
        name: "Team", 
        href: "/team", 
        icon: UserCog,
        color: "#9B59B6",
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