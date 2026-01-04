// VERSION MANAGEMENT SYSTEM FOR AVANTLE.AI
// This file tracks the current version and changelog for the Avantle.ai platform

export const VERSION = '1.1.0'
export const VERSION_NAME = 'Multi-Language Support'

export const CHANGELOG = [
  {
    version: '1.1.0',
    name: 'Multi-Language Support',
    date: '2026-01-04',
    changes: [
      '🌍 **MULTI-LANGUAGE**: Complete Slovak/English/German support implemented',
      '📝 **BUTTON UPDATE**: Changed "Launch DPIA Platform" to "Launch Platform"',
      '🇺🇸🇸🇰🇩🇪 **3 LANGUAGES**: Full translation system for EN/SK/DE',
      '🌐 **LANGUAGE SWITCHER**: Globe icon with dropdown for language selection',
      '📋 **COMPREHENSIVE**: All major pages and navigation translated',
      '📦 **CUSTOM I18N**: Lightweight translation system without external dependencies',
      '💾 **LOCALSTORAGE**: Language preference persistence across sessions',
      '🎯 **UX IMPROVED**: Flag indicators and native language names'
    ]
  },
  {
    version: '1.0.4',
    name: 'Clean Typography',
    date: '2026-01-04',
    changes: [
      '🎨 **SIMPLIFIED HERO**: Changed hero title to white "Privacy Platform" for clean look',
      '🏷️ **TOPBAR CLEAN**: Removed blue color from "Privacy" in header for consistent white text',
      '✨ **MINIMAL DESIGN**: Cleaner, more professional appearance without color distractions',
      '🎯 **FOCUS**: Emphasis on content rather than colorful typography'
    ]
  },
  {
    version: '1.0.3',
    name: 'Privacy Platform Branding',
    date: '2026-01-04',
    changes: [
      '🎆 **HOMEPAGE REDESIGN**: Complete redesign reflecting "Avantle Privacy Platform"',
      '🏢 **ENHANCED BRANDING**: Logo updated to "Avantle Privacy Platform" with visual separator',
      '📊 **FEATURES SHOWCASE**: Added 3-column features grid with privacy-focused messaging',
      '🚀 **PLATFORM CTA**: Direct links to DPIA Platform and Platform Administration',
      '🌐 **NAVIGATION UPDATE**: New "Platform" and "Privacy by Design" navigation sections',
      '📝 **NEW PAGES**: Created comprehensive /platform and /privacy informational pages',
      '🇪🇺 **EUROPEAN FOCUS**: Emphasize European data sovereignty and GDPR compliance',
      '🎨 **VISUAL IMPROVEMENTS**: Professional card layouts with privacy-themed icons',
      '🔗 **BETTER UX**: Clear platform access points and architectural explanation'
    ]
  },
  {
    version: '1.0.2',
    name: 'DPIA Color Alignment',
    date: '2026-01-04',
    changes: [
      '🎨 **EXACT COLOR MATCH**: Updated all color variables to match dpia.avantle.ai exactly',
      '🔵 **BLUE**: #4A90E2 → #3b82f6 (exact DPIA match)',
      '🟢 **GREEN**: #7ED321 → #22c55e (exact DPIA match)', 
      '🔴 **RED**: #FF6B6B → #ef4444 (exact DPIA match)',
      '🟣 **PURPLE**: #9B59B6 → #8b5cf6 (updated to Tailwind violet)',
      '🟠 **ORANGE**: #F5A623 → #f97316 (updated to Tailwind orange)',
      '⚪ **GRAY**: #A9A9A9 → #9ca3af (exact DPIA match)',
      '🎯 **CONSISTENCY**: All gradients, borders, and hover states updated',
      '🌐 **BOTH THEMES**: Dark and light mode colors aligned with DPIA standards'
    ]
  },
  {
    version: '1.0.1',
    name: 'Build Fixes & Stability',
    date: '2026-01-04',
    changes: [
      '🔧 **BUILD FIXES**: Resolved TypeScript compilation errors and import path issues',
      '📁 **IMPORT PATHS**: Fixed version import paths from @/lib/version to @/src/lib/version',
      '🔒 **TYPE SAFETY**: Added proper type assertions for User interface and API responses',
      '📦 **INTERFACE UPDATES**: Added slug and custom_domain properties to Tenant interface',
      '🌐 **HEADERS FIX**: Fixed HeadersInit type issues in API client',
      '🎯 **CLIENT DIRECTIVES**: Added "use client" directive for SSR compatibility',
      '⚡ **DEPLOYMENT**: Successful production deployment with all TypeScript errors resolved'
    ]
  },
  {
    version: '1.0.0',
    name: 'Admin Console Launch',
    date: '2026-01-04',
    changes: [
      '🚀 **ADMIN CONSOLE COMPLETE**: Platform Admin Console (/admin) and Partner Portal (/partners)',
      '🏢 **PARTNER MANAGEMENT**: Full CRUD operations for partner organizations',
      '🏗️ **TENANT DASHBOARD**: System-wide tenant management with filtering and statistics',
      '🔐 **ROLE-BASED AUTH**: JWT authentication with Platform Admin and Partner Admin roles', 
      '🎨 **MODERN UI**: Card-based layout with DPIA color scheme and responsive design',
      '🔌 **CORE API INTEGRATION**: Connected to deployed core-avantle-ai control plane',
      '📊 **ADMIN DASHBOARD**: System statistics, activity feed, and usage analytics',
      '🛡️ **SECURITY**: Unauthorized access handling and proper role validation',
      '⚡ **PRODUCTION READY**: Full deployment ready with error handling and loading states',
      '📋 **VERSION MANAGEMENT**: Complete version tracking system with changelog page'
    ]
  }
]

export const BUILD_DATE = new Date().toISOString().split('T')[0]
export const GIT_BRANCH = process.env.VERCEL_GIT_COMMIT_REF || 'main'
export const GIT_COMMIT = process.env.VERCEL_GIT_COMMIT_SHA?.substring(0, 7) || 'unknown'

// Helper function to get formatted version string
export function getVersionString(): string {
  return `v${VERSION}`
}

// Helper function to get full version info
export function getVersionInfo() {
  return {
    version: VERSION,
    name: VERSION_NAME,
    buildDate: BUILD_DATE,
    gitBranch: GIT_BRANCH,
    gitCommit: GIT_COMMIT,
    changelog: CHANGELOG
  }
}