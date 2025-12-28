// Avantle Privacy Platform Version Information - Build Cache Buster v3.21.22
export const VERSION = "3.21.54" as const
export const VERSION_NAME = "Fix Button Visibility - Better Contrast" as const
export const BUILD_DATE = "2025-12-28"

export const getVersionInfo = () => ({
  version: VERSION,
  name: VERSION_NAME,
  buildDate: BUILD_DATE,
  displayName: `v${VERSION} (${VERSION_NAME})`,
  fullDisplayName: `DPIA.ai Privacy Platform v${VERSION} - ${VERSION_NAME}`,
})

// Recent version changelog (last 5 versions only)
// Complete history available in CHANGELOG.md
export const CHANGELOG = {
  "3.21.54": {
    date: "2025-12-28",
    name: "Fix Button Visibility - Better Contrast",
    features: [
      "BUTTON VISIBILITY FIX: Improved contrast for secondary buttons against dark background",
      "COLOR ADJUSTMENTS: Secondary buttons now use #374151 instead of #2A3B4A for better visibility", 
      "BORDER ENHANCEMENT: Improved border colors (#4B5563 → #6B7280) for outline buttons",
      "HOVER IMPROVEMENTS: Enhanced hover states with white/10 opacity for ghost and outline variants",
      "SHADOW ADDITION: Added shadow-sm to secondary buttons for better visual separation"
    ]
  },
  "3.21.53": {
    date: "2025-12-28",
    name: "Fix Build Errors - Clean Unused Imports",
    features: [
      "BUILD FIXES: Resolved TypeScript errors and lint warnings from CI/CD",
      "IMPORT CLEANUP: Removed 10 unused imports across components (AlertTriangle, Users, Home, etc.)",
      "BUTTON IMPORT: Fixed missing Button import in dashboard page causing build failure", 
      "LINT COMPLIANCE: All components now pass ESLint unused variable checks",
      "PRODUCTION BUILD: Verified successful build with NODE_ENV=production"
    ]
  },
  "3.21.52": {
    date: "2025-12-28",
    name: "Optimize Version File - Reduce Token Size",
    features: [
      "FILE SIZE OPTIMIZATION: Moved complete changelog to CHANGELOG.md to reduce token usage",
      "PERFORMANCE IMPROVEMENT: Reduced version.ts from 30,380 to under 1,000 tokens",
      "MAINTAINED FUNCTIONALITY: Kept recent 5 versions in CHANGELOG export for quick access",
      "DOCUMENTATION: Created comprehensive CHANGELOG.md with full version history",
      "CLAUDE CODE COMPATIBILITY: Fixed 'exceeds maximum tokens' error for easier development"
    ]
  },
  "3.21.51": {
    date: "2025-12-28",
    name: "Consistent Button System - Enterprise UX Components",
    features: [
      "UNIFIED BUTTON COMPONENT: Created reusable Button with 5 variants",
      "LOADING STATES: Built-in spinner support with aria-busy accessibility",
      "ICON SUPPORT: leftIcon/rightIcon props with proper spacing",
      "DESIGN CONSISTENCY: 10px radius, proper heights, brand blue primary",
      "SINGLE CTA RULE: Enforced one primary button per screen",
      "ACCESSIBILITY: Focus rings, disabled states, keyboard navigation",
      "REFACTORED COMPONENTS: Privacy, Context, Dashboard buttons migrated"
    ]
  },
  "3.21.50": {
    date: "2025-12-21",
    name: "Fix Missing Footer & Rebrand to Privacy Platform",
    features: [
      "FOOTER CONSISTENCY: Fixed missing footer on DPIA assessment pages",
      "PRIVACY PLATFORM BRANDING: Updated topbar and footer naming",
      "LAYOUT INHERITANCE: Ensured proper shared layout components",
      "PROFESSIONAL SPACING: Fixed content margins and border spacing",
      "UNIFIED NAVIGATION: Consistent footer across platform modules"
    ]
  },
  "3.21.49": {
    date: "2025-12-21", 
    name: "Center Dashboard Buttons - Fix Right Alignment Issue",
    features: [
      "BUTTON CENTERING: Fixed incorrectly right-aligned primary CTAs",
      "RESPONSIVE LAYOUT: Proper center alignment using justify-center",
      "VISUAL HIERARCHY: Maintained spacing with centered placement",
      "CROSS-BROWSER CONSISTENT: Works across all screen sizes",
      "UX IMPROVEMENT: Better visual balance in empty states"
    ]
  },
  "3.21.48": {
    date: "2025-12-21",
    name: "Modern SaaS Dashboard Buttons - Enterprise UX Hierarchy", 
    features: [
      "SAAS BUTTON DESIGN: Implemented professional gradient primary CTAs",
      "UX HIERARCHY: Primary (large) + secondary (ghost/outline) pattern",
      "MICRO-HIERARCHY: Added 'or start with pre-check →' helper pattern",
      "HOVER ANIMATIONS: Subtle lift effects and color transitions",
      "VISUAL CONSISTENCY: Matching button styles across all modules"
    ]
  }
}

// Type exports for component usage
export type VersionInfo = ReturnType<typeof getVersionInfo>
export type ChangelogEntry = (typeof CHANGELOG)[keyof typeof CHANGELOG]