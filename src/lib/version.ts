// DPIA Agent Version Information
export const VERSION = "1.3" as const
export const VERSION_NAME = "Avantle Design" as const
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