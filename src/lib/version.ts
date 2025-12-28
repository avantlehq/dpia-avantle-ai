// Avantle Privacy Platform Version Information - Build Cache Buster v3.21.22
export const VERSION = "3.21.68" as const
export const VERSION_NAME = "Hotfix: React Hook Rules Violation & Cleanup" as const
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
  "3.21.68": {
    date: "2025-12-28",
    name: "Hotfix: React Hook Rules Violation & Cleanup",
    features: [
      "CRITICAL HOOK FIX: Fixed React Hook conditional call violation in ModernSidebar",
      "HOOK ORDER: Moved useEffect before early return to maintain consistent hook order", 
      "IMPORT CLEANUP: Removed unused imports (Button, ChevronLeft, ChevronRight, FileText)",
      "BUILD COMPLIANCE: Fixed all lint errors and warnings for production deployment",
      "CI/CD STABILITY: Ensured clean build process without React violations"
    ]
  },
  "3.21.67": {
    date: "2025-12-28",
    name: "Fix Sidebar Toggle Bug - SSR Safe LocalStorage",
    features: [
      "CRITICAL BUG FIX: Fixed sidebar toggle not working - was stuck in collapsed state",
      "SSR SAFETY: Added proper typeof window checks to prevent localStorage SSR errors", 
      "HYDRATION MISMATCH: Added mounted state to prevent SSR/client content mismatch",
      "PRODUCTION BUILD: Fixed build errors by ensuring proper SSR compatibility",
      "TOGGLE FUNCTIONALITY: Sidebar now properly expands/collapses on button click"
    ]
  },
  "3.21.66": {
    date: "2025-12-28",
    name: "Modern Sidebar Toggle System - Desktop Rail & Mobile Drawer",
    features: [
      "SIDEBAR TOGGLE SYSTEM: Complete implementation with hamburger button in topbar",
      "DESKTOP RAIL MODE: 64px collapsed sidebar with first-letter navigation icons", 
      "MOBILE DRAWER: Full overlay drawer with backdrop, ESC close, and focus trap",
      "KEYBOARD SHORTCUT: Cmd/Ctrl+B toggles sidebar (respects input field focus)",
      "LOCALSTORAGE PERSISTENCE: Desktop mode persists across sessions",
      "DESIGN TOKEN INTEGRATION: Uses --brand-primary, --surface-1, --text-primary tokens",
      "ACCESSIBILITY: aria-expanded, aria-controls, proper focus management"
    ]
  },
  "3.21.65": {
    date: "2025-12-28",
    name: "MVP Simplification - Remove Privacy Module Breadcrumbs",
    features: [
      "BREADCRUMB REMOVAL: Removed breadcrumbs from Privacy module for MVP simplification",
      "NAVIGATION STREAMLINE: Three-layer navigation reduced to topbar + sidebar for cleaner UX", 
      "FEATURE FLAG APPROACH: Breadcrumbs hidden behind breadcrumbsEnabled flag for future reintroduction",
      "VISUAL BALANCE MAINTAINED: Automatic spacing preservation with space-y-6 container",
      "NON-DESTRUCTIVE CHANGE: Breadcrumb component preserved but removed from render tree"
    ]
  },
  "3.21.64": {
    date: "2025-12-28",
    name: "CLAUDE.md Update - Design Token Documentation",
    features: [
      "CLAUDE.MD UPDATE: Comprehensive documentation of design token system architecture",
      "COMPONENT DOCUMENTATION: Detailed Button and IconButton specifications with design tokens", 
      "CURRENT STATUS: Updated to reflect VERSION 3.21.63 achievements and design token foundation",
      "TECHNICAL STACK: Updated to include design token system and component architecture",
      "DEVELOPER GUIDANCE: Clear token-first approach and component usage standards"
    ]
  },
  "3.21.63": {
    date: "2025-12-28",
    name: "Design Token System - Production Ready Foundation",
    features: [
      "DESIGN TOKENS: Complete CSS variable system for brand, surface, border, text and interactive colors",
      "BUTTON REFACTOR: Updated Button component to use design tokens while maintaining identical appearance", 
      "ICONBUTTON COMPONENT: New reusable IconButton with 40x40px hit area and proper accessibility",
      "NAVIGATION TOKENS: Updated topbar navigation to use consistent design token classes",
      "SCALABLE FOUNDATION: Zero visual regression - same appearance with improved maintainability"
    ]
  },
  "3.21.62": {
    date: "2025-12-28",
    name: "UI Cleanup - Footer, Button Layout & Consistency",
    features: [
      "FOOTER CLEANUP: Removed 'GDPR Compliance Tool' text from footer - now shows just 'Privacy Platform X.X.X'",
      "BUTTON SIMPLIFICATION: Removed plus sign (+) from New Assessment button for cleaner design", 
      "LAYOUT IMPROVEMENT: Moved precheck button to proper horizontal layout with 32px gap",
      "SIZE CONSISTENCY: Changed precheck button from size sm to md to match other secondary buttons",
      "LABEL CLARITY: Updated precheck button text from 'start with pre-check →' to 'Start Pre-check'"
    ]
  },
  "3.21.61": {
    date: "2025-12-28",
    name: "Consistent Secondary Buttons - Dashboard Fix",
    features: [
      "BUTTON CONSISTENCY: Fixed precheck button on dashboard to use standard secondary styling",
      "DESIGN SYSTEM COMPLIANCE: Changed from outline + custom gray text to proper secondary variant", 
      "VISUAL HARMONY: Precheck button now matches other secondary buttons across the platform",
      "UX IMPROVEMENT: Consistent button hierarchy while maintaining micro-hierarchy pattern",
      "REMOVED CUSTOM OVERRIDES: Eliminated text-gray-400 and border-dashed custom classes"
    ]
  },
  "3.21.60": {
    date: "2025-12-28",
    name: "Button Text Fix - CSS Specificity Override",
    features: [
      "CRITICAL FIX: Added high-specificity CSS rules to override nav link inheritance",
      "BUTTON DATA ATTRIBUTE: Added data-button='true' for precise CSS targeting", 
      "CSS HIERARCHY OVERRIDE: Fixed nav a rule that was forcing color:inherit on button text",
      "MULTIPLE SELECTORS: Covers a button, nav a button, and component class patterns",
      "GUARANTEED WHITE TEXT: All button text now displays white regardless of wrapper context"
    ]
  },
  "3.21.59": {
    date: "2025-12-28",
    name: "Fix Button Text Visibility - Force White Text",
    features: [
      "BUTTON TEXT FIX: Added !important declarations to force white text color in all button variants",
      "INHERITANCE OVERRIDE: Fixed CSS inheritance from Link components that was causing black text", 
      "COLOR CONSISTENCY: All button variants now display proper white text regardless of wrapper components",
      "DESIGN SYSTEM COMPLIANCE: Buttons now match specification with white text on dark backgrounds",
      "ACCESSIBILITY IMPROVEMENT: Enhanced text contrast ensures proper readability"
    ]
  },
  "3.21.58": {
    date: "2025-12-28",
    name: "Dark Theme Button Colors - Proper Design System",
    features: [
      "BUTTON COLOR FIX: Updated all button variants to use proper dark theme colors",
      "PRIMARY VARIANT: Brand blue background (#4A90E2) with white text",
      "SECONDARY VARIANT: Dark surface (#374151) with proper border and white text", 
      "GHOST/OUTLINE VARIANTS: Transparent backgrounds with white text and proper hover states",
      "DESTRUCTIVE VARIANT: Red background with white text for error actions"
    ]
  },
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