// DPIA Agent Version Information
export const VERSION = "3.0.3" as const
export const VERSION_NAME = "Topbar UX Improvements" as const
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
  "2.5": {
    date: "2024-11-22",
    name: "Phase 1C Complete - Stability & Polish",
    features: [
      "Comprehensive Result<T> pattern for bulletproof data fetching",
      "AuthGuard and AssessmentGuard services for defensive security",
      "Enhanced error handling with ErrorState, EmptyState, LoadingSkeleton components", 
      "Mobile responsiveness improvements across all pages",
      "TypeScript cleanup removing all unnecessary any types",
      "Security middleware with proper headers and CSRF protection"
    ],
    improvements: [
      "100% clean build with no compilation errors or 500 routes",
      "Type-safe error categorization (NOT_FOUND, UNAUTHORIZED, SERVER_ERROR, VALIDATION_ERROR)",
      "Defensive programming principles throughout codebase",
      "Production-ready authentication and authorization guards",
      "Mobile-first responsive design with proper touch targets",
      "Comprehensive loading states and error feedback for excellent UX"
    ],
    security: [
      "Authentication guards preventing unauthorized access",
      "Assessment access validation with workspace isolation",
      "Proper error handling without information leakage",
      "Security headers in middleware for CSRF protection",
      "Type safety preventing runtime errors and security issues"
    ]
  },
  "2.4": {
    date: "2024-11-22",
    name: "Production Ready + Database + UI Fixed", 
    features: [
      "Fixed all production UI and routing issues",
      "Created missing /precheck page with full functionality",
      "Resolved TypeScript compilation and build errors",
      "Updated CLAUDE.md to reflect current production status",
      "Complete user journey from onboarding to export working"
    ],
    improvements: [
      "All production routes working without 404 errors",
      "Proper component integration and error handling", 
      "Clean build pipeline and deployment process",
      "Updated documentation reflecting database integration achievement"
    ]
  },
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