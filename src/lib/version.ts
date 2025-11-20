// DPIA Suite Version Information
export const VERSION = "1.1" as const
export const VERSION_NAME = "Phase 1B" as const
export const BUILD_DATE = new Date().toISOString().split('T')[0]

export const getVersionInfo = () => ({
  version: VERSION,
  name: VERSION_NAME,
  buildDate: BUILD_DATE,
  displayName: `v${VERSION} (${VERSION_NAME})`,
  fullDisplayName: `DPIA Suite v${VERSION} - ${VERSION_NAME}`,
})

// Version changelog for Phase 1B
export const CHANGELOG = {
  "1.1": {
    date: "2024-11-20",
    name: "Phase 1B",
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