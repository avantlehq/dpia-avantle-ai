// Avantle Privacy Platform Version Information - Build Cache Buster v3.21.22
export const VERSION = "3.21.102" as const
export const VERSION_NAME = "Aggressive Main Content Spacing Fix - Nested Margin Approach" as const
export const BUILD_DATE = "2026-01-01"

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
  "3.21.102": {
    date: "2026-01-01",
    name: "Aggressive Main Content Spacing Fix - Nested Margin Approach",
    features: [
      "AGGRESSIVE SPACING FIX: Switched from Tailwind classes to inline styles to prevent CSS override issues",
      "NESTED MARGIN APPROACH: Main has 32px padding + inner div has 24px left margin = 56px total left spacing",
      "GUARANTEED VISIBILITY: Using explicit style attributes to ensure spacing isn't overridden by global CSS",
      "ENHANCED SEPARATION: Content now has substantial breathing room from 256px sidebar border",
      "CSS OVERRIDE PROTECTION: Inline styles have higher specificity than any conflicting CSS rules"
    ]
  },
  "3.21.101": {
    date: "2026-01-01",
    name: "Fix Main Content Layout - Add Left Margin from Sidebar",
    features: [
      "LAYOUT FIX: Changed main content padding from p-8 to py-8 pr-8 pl-12 for proper left spacing",
      "CONTENT SPACING: Added extra 16px left margin (48px total) so text/graphics don't touch sidebar border",
      "VISUAL IMPROVEMENT: Main content now has proper breathing room from sidebar in both English and Slovak versions",
      "RESPONSIVE LAYOUT: Maintains consistent spacing across all screen sizes while preserving existing right/top/bottom padding",
      "PROFESSIONAL DESIGN: Eliminates content touching borders for better visual hierarchy and readability"
    ]
  },
  "3.21.100": {
    date: "2026-01-01",
    name: "Complete All Missing English Translation Keys - Full Sidebar Coverage",
    features: [
      "ALL ENGLISH KEYS ADDED: Added 12 missing translation keys (systems, processing, data-categories, data-flows, vendors, locations, lia, tia, policies, toms, governance, audit-packages)",
      "CONTEXT MODULE FIX: All 6 Context sidebar items now show proper English text instead of 'pages.' prefixes",
      "PRIVACY MODULE FIX: LIA, TIA, and Policies sidebar items now translated properly",
      "TRUST CENTER FIX: Governance and Audit Packages sidebar items now display correct English text",
      "SYSTEMATIC SOLUTION: All module item IDs from modules.ts now have corresponding English translation keys"
    ]
  },
  "3.21.99": {
    date: "2026-01-01",
    name: "Complete English Sidebar Translations - Fix Missing Controls & Training Keys",
    features: [
      "ENGLISH TRANSLATIONS COMPLETE: Added missing 'controls-overview' and 'training-overview' translation keys to English pages section",
      "SIDEBAR TRANSLATION FIX: English Controls sidebar now shows 'Controls Overview' instead of 'pages.controls-overview'",
      "TRAINING TRANSLATION FIX: English Training sidebar now shows 'Training Overview' instead of 'pages.training-overview'",
      "FULL BILINGUAL COVERAGE: Both English and Slovak module sidebars now display proper text without 'pages.' prefixes",
      "TRANSLATION PARITY: English and Slovak versions now have matching translation key coverage for all modules"
    ]
  },
  "3.21.98": {
    date: "2026-01-01",
    name: "Complete Slovak Sidebar Translations - Fix Missing Controls & Training Keys",
    features: [
      "SLOVAK TRANSLATIONS COMPLETE: Added missing 'controls-overview' and 'training-overview' translation keys",
      "SIDEBAR TRANSLATION FIX: Controls sidebar now shows 'Prehľad kontrol' instead of 'pages.controls-overview'",
      "TRAINING TRANSLATION FIX: Training sidebar now shows 'Prehľad školení' instead of 'pages.training-overview'",
      "FULL SLOVAK COVERAGE: All module sidebars now display proper Slovak text without 'pages.' prefixes",
      "SYSTEMATIC CHECK: Verified all module item IDs have corresponding Slovak translation keys"
    ]
  },
  "3.21.97": {
    date: "2026-01-01",
    name: "Fix Build Error - Remove Duplicate Translation Key",
    features: [
      "BUILD FIX: Removed duplicate 'privacy-risks' translation key that was causing TypeScript compilation error",
      "TYPESCRIPT CLEAN: Resolved object literal multiple properties error in useTranslations.ts",
      "COMPILATION SUCCESS: TypeScript now compiles successfully without duplicate key conflicts",
      "PRODUCTION READY: Fixed critical build blocker while maintaining all translation functionality",
      "CODE CLEANUP: Ensured unique translation keys across Slovak navigation sections"
    ]
  },
  "3.21.96": {
    date: "2026-01-01",
    name: "Complete Navigation i18n - Trust Center, Help Page & Risk Sidebar",
    features: [
      "TRUST CENTER FIX: Fixed topbar showing 'modules.trust-center' instead of 'Centrum dôvery'",
      "HELP PAGE CREATED: Added complete Help/Support page with SK/EN translations and coming soon content",
      "RISK SIDEBAR FIX: Fixed Risk module sidebar showing translation keys instead of proper Slovak/English text",
      "HELP TRANSLATIONS: Added comprehensive help section translations (documentation, support, community, status)",
      "NAVIGATION POLISH: All topbar modules and sidebar items now display correctly in both languages"
    ]
  },
  "3.21.95": {
    date: "2026-01-01",
    name: "Fix Navigation Translations - Topbar & Privacy Sidebar",
    features: [
      "TOPBAR TRANSLATIONS: Fixed module names in topbar to display Slovak/English correctly (Context → Kontext, etc.)",
      "PRIVACY SIDEBAR FIX: Fixed Privacy sidebar showing 'pages.dpia-precheck' instead of translated text",
      "TRANSLATION KEYS: Added missing dpia-precheck and dpia-assessments translation keys",
      "COMPLETE NAVIGATION i18n: Both topbar modules and sidebar items now fully localized",
      "MODULAR TRANSLATION: Added useTranslations hook to ModuleLink component for proper topbar i18n"
    ]
  },
  "3.21.94": {
    date: "2026-01-01",
    name: "Remove Breadcrumbs - Simplified Navigation Architecture",
    features: [
      "BREADCRUMBS REMOVED: Eliminated breadcrumb navigation component to simplify architecture",
      "CLEAN LAYOUT: Streamlined SimpleLayout without unnecessary navigation complexity",
      "PERFORMANCE OPTIMIZATION: Removed SSR problematic component reducing build complexity",
      "FOCUSED UX: Two-layer navigation (topbar + sidebar) provides cleaner user experience",
      "ARCHITECTURAL SIMPLIFICATION: Reduced component dependencies and import overhead"
    ]
  },
  "3.21.93": {
    date: "2026-01-01",
    name: "Complete Slovak Translations - Business Ready GDPR Platform",
    features: [
      "COMPLETE SLOVAK CONTENT: Added comprehensive Slovak translations for all modules (Risk, Controls, Training, Trust Center)",
      "GDPR TERMINOLOGY: Professional Slovak legal terminology for DPIA compliance (prevádzkovateľ, spracovateľ, dotknutá osoba, etc.)",
      "BUSINESS READY TRANSLATIONS: Risk management, controls, training, and audit terminology fully localized",
      "LEGAL COMPLIANCE: Proper Slovak GDPR terms for lawyer collaboration and regulatory compliance",
      "COMPREHENSIVE i18n: 100+ new translation keys covering all privacy platform modules and workflows"
    ]
  },
  "3.21.92": {
    date: "2026-01-01",
    name: "Fix Sidebar Translations - Slovak Navigation Items",
    features: [
      "SIDEBAR TRANSLATIONS: Fixed sidebar navigation items to display in Slovak/English based on selected locale",
      "USETRANSLATIONS INTEGRATION: Added useTranslations hook to ModernSidebar component",
      "NAVIGATION LOCALIZATION: Sidebar items now properly use t('pages.{item.id}') for translated names",
      "TOOLTIP TRANSLATIONS: Collapsed sidebar tooltips now display in correct language",
      "COMPLETE SIDEBAR i18n: All sidebar text including disabled item tooltips now fully localized"
    ]
  },
  "3.21.91": {
    date: "2025-12-31",
    name: "Fix Locale Detection - URL-Based Slovak Switching",
    features: [
      "LOCALE URL DETECTION: Fixed useClientLocale hook to detect locale from URL pathname (/sk/, /en/)",
      "PROPER SLOVAK SWITCHING: Pages now correctly render in Slovak when URL contains /sk/ prefix",
      "NAVIGATION LOCALE FIX: Language switcher now properly navigates to locale-aware URLs",
      "PATHNAME INTEGRATION: Added usePathname to detect locale from browser URL segments",
      "TRANSLATION ACTIVATION: Slovak translations now properly activate based on URL structure"
    ]
  },
  "3.21.90": {
    date: "2025-12-31",
    name: "Complete Slovak Translations - Business Ready Platform",
    features: [
      "COMPLETE SLOVAK TRANSLATIONS: Added comprehensive Slovak terminology for all modules (Context, Privacy, Risk, Controls, Training, Trust Center)",
      "GDPR LEGAL TERMINOLOGY: Professional Slovak translations for DPIA, LIA, TIA with proper legal precision",
      "CONTEXT MODULE LOCALIZED: Complete Slovak UI for Context overview page with proper terminology",
      "NAVIGATION TRANSLATIONS: All module names and page titles properly translated for Slovak users",
      "BUSINESS READY: Platform now fully functional in Slovak for lawyer collaboration and MVP testing"
    ]
  },
  "3.21.89": {
    date: "2025-12-31",
    name: "Update CLAUDE.md - Slovak Business Ready Documentation",
    features: [
      "CLAUDE.MD UPDATE: Updated project documentation with STAGE 4 completion and Slovak bilingual status",
      "TOMORROW'S ROADMAP: Documented priority plan for STAGE 4 finalization (breadcrumbs fix, Slovak content)",
      "ACHIEVEMENTS SUMMARY: Complete overview of bilingual platform implementation and business readiness",
      "TECHNICAL DEBT TRACKING: Documented known issues (breadcrumbs SSR, build warnings) for next session",
      "BUSINESS CONTEXT: Clear next steps for Slovak lawyer collaboration and demo preparation"
    ]
  },
  "3.21.88": {
    date: "2025-12-31",
    name: "Complete Locale Sub-Pages - All Module Routes Fixed",
    features: [
      "COMPLETE SUB-PAGES: Created all missing locale-aware sub-pages (/context/systems, /privacy/lia, etc.)",
      "CONTEXT MODULE COMPLETE: All context sub-pages (/systems, /processing, /data-categories, /vendors, etc.) working",
      "PRIVACY/RISK/CONTROLS: Complete sub-page structure for all modules with proper locale routing",
      "TRUST-CENTER COMPLETE: Governance and audit-packages sub-pages with locale-aware navigation",
      "LOCALE-AWARE LINKS: Updated Context overview page with proper locale-aware internal navigation links"
    ]
  },
  "3.21.87": {
    date: "2025-12-31",
    name: "Fix Module Navigation - Locale-Aware Routing",
    features: [
      "LOCALE ROUTING FIX: Fixed module links to use correct [locale] routing structure (/{locale}/context, etc.)",
      "MODULE CONFIG UPDATE: Updated all module hrefs to include locale prefix using getLocaleHref helper",
      "LOCALE-AWARE PAGES: Created missing locale-aware pages for all modules in /[locale]/ structure",
      "TOPBAR HOME FIX: Updated context-aware home link to include locale prefix for proper navigation",
      "BREADCRUMBS TEMP DISABLED: Temporarily disabled breadcrumbs to fix build issues with useContext hooks"
    ]
  },
  "3.21.86": {
    date: "2025-12-31",
    name: "STAGE 4: Slovak/English Bilingual Support - Complete i18n",
    features: [
      "BILINGUAL PLATFORM: Complete Slovak/English translation system with client-side locale switching",
      "FUNCTIONAL LANGUAGE SWITCHER: Working dropdown in topbar with persistent locale storage and page reload", 
      "UI TRANSLATION: Privacy overview, breadcrumbs, and navigation fully localized with useTranslations hook",
      "MOBILE LANGUAGE UX: Touch-optimized language selector with 48px targets and visual feedback",
      "LEGAL PRECISION: GDPR terminology correctly translated to Slovak for compliance with legal requirements"
    ]
  },
  "3.21.85": {
    date: "2025-12-31",
    name: "STAGE 3: Navigation Breadcrumbs - Complete UX Enhancement",
    features: [
      "BREADCRUMB NAVIGATION: Smart contextual breadcrumbs with responsive collapse and mobile optimization",
      "SIDEBAR INTEGRATION: Perfect sync with sidebar active states and navigation logic", 
      "MOBILE UX POLISH: 48px touch targets, swipe gestures, and responsive breadcrumb collapse",
      "i18n FOUNDATION: Complete translation system ready for SK/EN support with fallback handling",
      "PERFORMANCE OPTIMIZED: React.memo, GPU acceleration, spring physics animations across components"
    ]
  },
  "3.21.84": {
    date: "2025-12-28",
    name: "STAGE 2: Mobile UX Polish - Swipe Gestures + Touch Optimization",
    features: [
      "MOBILE GESTURES: Custom swipe detection with velocity thresholds for drawer control",
      "TOUCH OPTIMIZATION: All interactive elements upgraded to 48px minimum for WCAG compliance", 
      "SPRING PHYSICS: Cubic-bezier animations with GPU acceleration for smooth mobile experience",
      "iOS/ANDROID FIXES: Platform-specific CSS handling for viewport heights and safe areas",
      "PERFORMANCE FOUNDATION: React.memo optimization and efficient re-render prevention"
    ]
  },
  "3.21.70": {
    date: "2025-12-28",
    name: "Emergency Fix: Toggle & Button Styling",
    features: [
      "CRITICAL TOGGLE FIX: Simplified hook state initialization to prevent race conditions",
      "STATE SYNCHRONIZATION: Fixed localStorage loading to happen before screen size detection", 
      "BUTTON BACKGROUNDS FIX: Restored CSS support for Tailwind arbitrary values with design tokens",
      "REGRESSION REPAIR: Fixed white button backgrounds caused by over-aggressive CSS removal",
      "EMERGENCY DEPLOYMENT: Immediate fix for broken toggle and button styling issues"
    ]
  },
  "3.21.69": {
    date: "2025-12-28",
    name: "Fix Sidebar Toggle Logic & Button Styling",
    features: [
      "SIDEBAR TOGGLE FIX: Fixed logic inconsistencies in collapsed state detection",
      "DESKTOP/MOBILE LOGIC: Clarified isDesktop && isCollapsed conditions throughout sidebar", 
      "BUTTON STYLING FIX: Removed CSS overrides that made secondary buttons look like primary",
      "VISUAL REGRESSION: Fixed button color specificity issues in globals.css",
      "FUNCTIONALITY RESTORED: Both toggle and button styling now work correctly"
    ]
  },
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