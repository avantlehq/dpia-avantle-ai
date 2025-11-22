// DPIA Agent Version Information
export const VERSION = "2.3" as const
export const VERSION_NAME = "Database Integration Complete" as const
export const BUILD_DATE = new Date().toISOString().split('T')[0]

export const getVersionInfo = () => ({
  version: VERSION,
  name: VERSION_NAME,
  buildDate: BUILD_DATE,
  displayName: `v${VERSION} (${VERSION_NAME})`,
  fullDisplayName: `DPIA Agent v${VERSION} - ${VERSION_NAME}`,
})

// Version changelog
export const CHANGELOG = {
  "2.3": {
    date: "2024-11-22",
    name: "Database Integration Complete",
    features: [
      "Successfully connected to Supabase database",
      "Ran complete database migration with 9 tables",
      "Fixed RLS policies security warnings",
      "Real data persistence instead of mock mode",
      "Security-hardened database functions"
    ],
    improvements: [
      "6/6 test suite now passing with real database",
      "Assessment API using real Supabase backend",
      "Production-ready database architecture",
      "Multi-tenant RLS policies fully functional"
    ]
  },
  "2.2": {
    date: "2024-11-21",
    name: "CI Fixed & Production Ready",
    features: [
      "Fixed CI/CD pipeline ESLint errors",
      "Resolved Avantle.ai styling issues",
      "Production deployment with proper dark theme",
      "All tests passing with comprehensive error handling"
    ],
    improvements: [
      "ESLint configured for production deployment",
      "Clean CI/CD pipeline without build failures",
      "Proper semantic versioning implemented"
    ]
  },
  "2.1": {
    date: "2024-11-21", 
    name: "Avantle Design Fixed",
    features: [
      "Fixed Tailwind CSS configuration",
      "Implemented proper dark mode theming",
      "Added Tailwind config with CSS variables"
    ]
  },
  "2.0": {
    date: "2024-11-21",
    name: "Phase 1B Complete", 
    features: [
      "Complete onboarding flow with personalized wizard",
      "Server actions for real-time assessment workflow", 
      "Comprehensive database setup guides and tooling",
      "Professional PDF/DOCX export system",
      "Advanced dashboard with analytics cards",
      "Assessment creation and management system",
      "Production-ready Supabase integration",
      "Comprehensive test suite for QA validation"
    ],
    improvements: [
      "5/6 test suite passing (mock mode fully functional)",
      "Complete database schema with RLS policies",
      "Server-side rendering with Next.js 15",
      "Type-safe operations with comprehensive error handling",
      "Production deployment ready on dpia.avantle.ai"
    ]
  },
  "1.3": {
    date: "2024-11-20", 
    name: "Avantle Design",
    features: [
      "Complete Avantle.ai visual design rebrand",
      "Dark mode as default theme",
      "Inter font family integration",
      "Privacy by Design messaging",
      "Minimalist European aesthetic",
      "OKLCH color space for precise colors",
      "Semi-transparent card backgrounds",
      "Glowing effects on primary actions"
    ],
    improvements: [
      "Consistent visual identity across all pages",
      "Enhanced accessibility with proper contrast",
      "Modern typography with light font weights",
      "Backdrop blur effects for depth",
      "Professional European privacy branding"
    ]
  },
  "1.2": {
    date: "2024-11-20", 
    name: "Phase 1B Fixed",
    features: [
      "DPIA Assessment pre-check wizard (8-question evaluation)",
      "3-section DPIA Builder core framework", 
      "Advanced risk scoring engine (likelihood × impact)",
      "Professional UI/UX with mobile responsiveness",
      "Multi-tenant database architecture with RLS",
      "Template-driven form generation system",
      "API endpoints for assessment management",
      "Complete customer journey implementation"
    ],
    improvements: [
      "Clean TypeScript compilation",
      "ESLint compliant codebase", 
      "Production-ready deployment",
      "Security best practices",
      "Comprehensive error handling"
    ]
  }
} as const