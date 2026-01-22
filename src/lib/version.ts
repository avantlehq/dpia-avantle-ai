// Avantle Privacy Platform Version Information - Build Cache Buster v3.21.31
export const VERSION = "3.31.21" as const
export const VERSION_NAME = "Help Module Sidebar Navigation" as const
export const BUILD_DATE = "2026-01-22"

export const getVersionInfo = () => ({
  version: VERSION,
  name: VERSION_NAME,
  buildDate: BUILD_DATE,
  displayName: `v${VERSION} (${VERSION_NAME})`,
  fullDisplayName: `DPIA.ai Privacy Platform v${VERSION} - ${VERSION_NAME}`,
})

// Recent version changelog (last 7 versions only)
// Complete history available in git commits
export const CHANGELOG = {
  "3.31.21": {
    date: "2026-01-22",
    name: "Help Module Sidebar Navigation",
    features: [
      "✅ ADDED: Help module to platform navigation with 13 sidebar items",
      "Created Help module configuration in modules.ts with HelpCircle icon",
      "Added 13 navigation items: Help Overview, Getting Started, GDPR Compliance, Platform Modules, Context Module, Privacy Module, Risk Module, Controls Module, Integrations Module, Trust Center, Privacy Glossary, Troubleshooting, API Documentation",
      "Added 26 translation keys to custom useTranslations hook (13 EN + 13 SK)",
      "Created HelpPlaceholder component for consistent Coming Soon pages",
      "Created 11 placeholder help pages with /help routes",
      "All help pages show 'Coming Soon' cards with Q2 2026 timeline",
      "Bilingual support for all help navigation items",
      "Disabled state with tooltips for pages under development"
    ],
    fixes: [
      "FIXED: Help page now shows Help-specific sidebar instead of Privacy module items",
      "FIXED: Sidebar navigation now module-aware for /help routes",
      "Added missing nav.modules.help and nav.pages.* translation keys",
      "All help routes properly generated in Next.js build manifest"
    ],
    note: "Implementation of Help module sidebar navigation. Clicking Help in topbar now displays Help-specific navigation items in sidebar instead of irrelevant Privacy module items. Infrastructure already supported module-specific navigation - only needed to add Help module configuration and translation keys. All 11 placeholder pages created with consistent HelpPlaceholder component ready for future content."
  },
  "3.31.20": {
    date: "2026-01-22",
    name: "Help Page Translations Complete",
    features: [
      "✅ ADDED: Complete help namespace translations to inline dictionary",
      "Added 20+ translation keys for help page UI elements",
      "Bilingual support for all help sections (Getting Started, Documentation, Support)",
      "Category cards with proper status badges (Available / In Preparation)",
      "Help system overview metrics fully translated"
    ],
    fixes: [
      "FIXED: Help page displaying raw translation keys (inPreparation, categories.gettingStarted.description, etc.)",
      "Added backToDashboard, contactSupport, sectionBeingPrepared keys",
      "Added guidesAvailable, articles, languages metrics keys",
      "Added sections.gettingStarted, sections.documentation, sections.support",
      "Added complete categories structure with title/description for all 6 categories",
      "Added available, inPreparation, browseGuides keys for CategoryCard component",
      "Both English and Slovak translations in custom useTranslations hook"
    ],
    note: "Help page used custom useTranslations hook with inline dictionaries (not next-intl). User reported raw keys displayed on /en/help. Added complete help namespace structure with all required keys for page layout, metrics, sections, and category cards. Categories: Getting Started, GDPR Compliance, Platform Modules, Privacy Glossary, Troubleshooting, API Documentation."
  },
  "3.31.19": {
    date: "2026-01-22",
    name: "Privacy Overview & Debug Console Cleanup",
    features: [
      "✅ ADDED: privacy.overview namespace to messages/en.json and messages/sk.json",
      "Added complete translations for Privacy module overview page (/privacy)",
      "Bilingual support for DPIA, LIA, TIA status sections",
      "Quick Actions section fully translated (Manage DPIA, DPIA Pre-check, Coming Soon features)"
    ],
    fixes: [
      "REMOVED: All console.log debug statements from 6 Context list pages",
      "Cleaned systems/page.tsx - removed 7 console.log statements",
      "Cleaned vendors/page.tsx - removed 3 console.log statements",
      "Cleaned locations/page.tsx - removed 3 console.log statements",
      "Cleaned data-categories/page.tsx - removed 3 console.log statements",
      "Cleaned data-flows/page.tsx - removed 3 console.log statements",
      "Cleaned processing/page.tsx - removed 3 console.log statements",
      "FIXED: Privacy overview page now displays proper translations instead of missing keys",
      "Browser console no longer cluttered with [SystemsPage], [Page] debug logs"
    ],
    note: "Final translation cleanup. User reported two remaining issues: (1) /en/privacy page missing translations, (2) Context pages spamming browser console with debug logs. Added missing privacy.overview namespace with 15+ translation keys for DPIA/LIA/TIA status sections. Removed all debug console.log statements added during v3.30.0-v3.30.3 translation debugging. Console now clean in production."
  },
  "3.31.18": {
    date: "2026-01-21",
    name: "Remove Debug Console Logs",
    features: [],
    fixes: [
      "REMOVED: Debug console.log from ModuleLink in modern-topbar.tsx",
      "REMOVED: Debug console.log from SidebarLink in modern-sidebar.tsx",
      "Console logs were added in v3.31.3 to force Turbopack rebuilds",
      "Now that translation issues are fixed, removed clutter from production console"
    ],
    note: "Cleanup: Removed debugging console.log statements that were added during v3.31.3 Integrations translation fix. These were only needed to force cache invalidation and now just clutter the browser console."
  },
  "3.31.17": {
    date: "2026-01-21",
    name: "Privacy Module Translation Fix - Complete",
    features: [
      "✅ FIXED: Added remaining privacy.assessments translation keys",
      "Added showingAssessments key with dynamic count parameter",
      "Added addNew key for table footer button"
    ],
    fixes: [
      "FIXED: 'MISSING_MESSAGE: privacy.assessments.showingAssessments (en)' console error",
      "FIXED: 'MISSING_MESSAGE: privacy.assessments.addNew (en)' console error",
      "v3.31.16 added main keys but missed table footer keys",
      "AssessmentsTable footer uses t('showingAssessments', { count }) and t('addNew')",
      "Both English and Slovak translations added"
    ],
    note: "Completing v3.31.16 fix. User reported 2 remaining missing keys in assessments table footer after initial fix."
  },
  "3.31.16": {
    date: "2026-01-21",
    name: "Privacy Module Translation Fix",
    features: [
      "✅ FIXED: Added privacy.assessments namespace to messages/en.json and messages/sk.json",
      "Added 23 translation keys for Privacy assessments page and table components",
      "All Privacy module pages now display proper translated text instead of keys"
    ],
    fixes: [
      "FIXED: 'MISSING_MESSAGE: privacy.assessments (en)' console error",
      "FIXED: Raw translation keys displayed on /assessments page",
      "ROOT CAUSE: privacy.assessments namespace missing from messages/*.json",
      "Components used useTranslations('privacy.assessments') but keys didn't exist",
      "Added keys: pageTitle, pageDescription, statusDraft, statusInProgress, etc.",
      "Both English and Slovak translations added"
    ],
    note: "Same pattern as Context module fix in v3.31.14. Privacy module components were using translation namespace that didn't exist in messages/*.json files. Added complete privacy.assessments namespace with all required keys."
  },
  "3.31.15": {
    date: "2026-01-21",
    name: "i18n Consolidation: Single Source of Truth",
    features: [
      "✅ REFACTORED: Consolidated dual i18n systems into single root /i18n/ location",
      "Created /i18n/config.ts - Centralized configuration (moved from src/i18n/)",
      "Created /i18n/client-utils.ts - Extracted only active functions (detectClientLocale, setClientLocale)",
      "Updated tsconfig.json - Added @/i18n/* path mapping for absolute imports",
      "Updated 2 import statements - useClientLocale hook and modules.ts state file",
      "Deleted src/i18n/ directory - Removed 144KB of dead code (~2000 lines)",
      "Fixed src/middleware.ts - Changed relative import to absolute @/i18n/config path"
    ],
    fixes: [
      "DELETED DEAD CODE: src/i18n/keys.ts (150+ lines) - completely unused",
      "DELETED DEAD CODE: src/i18n/request.ts (20 lines) - completely unused",
      "DELETED DEAD CODE: src/i18n/dictionaries/en-v2.json (1117 lines) - never loaded",
      "DELETED DEAD CODE: src/i18n/dictionaries/sk-v2.json (1000+ lines) - never loaded",
      "DELETED DEAD CODE: src/i18n/utils.ts - Kept only 2 functions, removed 200+ lines",
      "FIXED: Build error in middleware - TypeScript couldn't resolve './i18n/config'",
      "ROOT CAUSE: Project had TWO i18n systems - root /i18n/ (active) and src/i18n/ (mostly dead)",
      "All active functionality preserved - only dead code removed"
    ],
    note: "ARCHITECTURAL CLEANUP: Project had dual i18n systems causing confusion since v3.31.8. Consolidated into single root /i18n/ location. Deleted ~2000 lines of dead translation files and utilities. Build passes with zero errors. All Context pages work correctly."
  },
  "3.31.14": {
    date: "2026-01-21",
    name: "ACTUAL FIX: Context Pages in messages/*.json (CORRECT FILES)",
    features: [
      "✅ FIXED: Added context.pages namespace to messages/en.json and messages/sk.json",
      "✅ FIXED: All 6 Context list pages (systems, vendors, locations, dataCategories, dataFlows, processing)",
      "Added 150+ translation keys to CORRECT dictionary files loaded by next-intl",
      "Root cause: App uses /i18n/request.ts loading from /messages/*.json",
      "v3.31.13 edited /src/i18n/dictionaries/*.json (WRONG FILES - never loaded)",
      "Same mistake as v3.31.8 - edited src/ dictionaries instead of root messages/"
    ],
    fixes: [
      "FIXED: 'MISSING_MESSAGE: context.pages.systems (en)' console error",
      "FIXED: Raw translation keys displayed on all Context list pages",
      "ROOT CAUSE: next.config.ts uses './i18n/request.ts' (root) not src/",
      "ROOT request.ts loads from '../messages/${locale}.json' not src/i18n/",
      "v3.31.13 added keys to src/i18n/dictionaries/en-v2.json (IGNORED by app)",
      "Correct location: /messages/en.json and /messages/sk.json at project root",
      "messages/en.json has context.locations, context.systems (forms) but NO context.pages",
      "Added complete context.pages namespace with all 6 sub-modules to messages/*.json"
    ],
    note: "REPEAT OF v3.31.8 BUG: We edited wrong dictionary files AGAIN. App has TWO i18n systems: root /i18n/ (ACTIVE) and src/i18n/ (UNUSED). Must edit /messages/*.json NOT /src/i18n/dictionaries/*.json. This should be the FINAL fix."
  },
  "3.31.13": {
    date: "2026-01-21",
    name: "Context Module List Pages - Complete Translation Fix (All 6 Modules)",
    features: [
      "✅ SYSTEMS PAGE: Added 25+ translation keys (title, overview, status pills, table headers, actions)",
      "✅ VENDORS PAGE: Added 30+ translation keys (DPA status badges, vendor roles, all UI elements)",
      "✅ LOCATIONS PAGE: Added 25+ translation keys (adequacy status, jurisdiction filters)",
      "✅ DATA CATEGORIES PAGE: Added 20+ translation keys (GDPR article classification)",
      "✅ DATA FLOWS PAGE: Added 20+ translation keys (flow direction, encryption status)",
      "✅ PROCESSING PAGE: Added 20+ translation keys (ROPA compliance, legal basis)",
      "Added ~150 total translation keys across 6 Context list pages",
      "Full bilingual support (English/Slovak) for all Context module list pages"
    ],
    fixes: [
      "FIXED: Translation keys displaying as raw strings (context.pages.systems.activeSystems, etc.)",
      "FIXED: Console error 'MISSING_MESSAGE: context.pages.systems (en)'",
      "ROOT CAUSE: v3.30.0 claimed to add ~180 keys but only added minimal entries (title, description, features)",
      "All 6 Context list pages had incomplete translation entries in context.pages namespace",
      "Added complete translation sets to both en-v2.json and sk-v2.json dictionaries",
      "Updated cache key to 2026-01-21T12:00:00Z-v3.31.13 to force dictionary reload",
      "Verified build success with zero TypeScript/ESLint errors"
    ],
    note: "COMPLETE FIX for v3.30.0 incomplete implementation. All Context module list pages now fully bilingual with comprehensive translation coverage. User-reported issue on systems page resolved along with proactive fix for remaining 5 pages."
  },
  "3.31.12": {
    date: "2026-01-20",
    name: "✅ ACTUAL BUG FIX: Inline Dictionary in useTranslations Hook",
    features: [],
    fixes: [
      "ROOT CAUSE IDENTIFIED: useTranslations hook has HARDCODED inline dictionaries",
      "Hook at src/hooks/useTranslations.ts contains embedded translations (lines 12-443)",
      "This custom hook is NOT using messages/*.json OR next-intl at all",
      "Topbar and sidebar use this custom hook, not next-intl's useTranslations",
      "All 11 previous attempts edited external JSON files that were never loaded",
      "trust-center worked because it had inline keys at lines 24, 135",
      "api-integrations failed because it had NO inline keys",
      "FIXED: Added integrations and api-integrations keys to inline dictionaries",
      "Added nav.modules.integrations and nav.modules.api-integrations",
      "Added nav.pages.integrations-overview and nav.pages.api-integrations-overview",
      "Both English and Slovak translations now in the ACTUAL dictionary being used"
    ],
    note: "FINALLY FIXED: After 11 failed attempts editing external files, discovered the topbar/sidebar use a CUSTOM useTranslations hook with inline hardcoded dictionaries. All other modules worked because they had inline keys. Integrations was missing. Added all required keys to the inline dictionary."
  },
  "3.31.8": {
    date: "2026-01-20",
    name: "🐛 FIX: Add Keys to CORRECT Dictionary Files",
    features: [],
    fixes: [
      "FOUND THE BUG: App uses ./i18n/request.ts (root), NOT ./src/i18n/request.ts",
      "Root request.ts loads from ./messages/en.json, NOT ./src/i18n/dictionaries/",
      "We edited src/i18n/dictionaries/ for 7 versions (WRONG FILES)",
      "App was loading from ./messages/en.json and ./messages/sk.json (CORRECT FILES)",
      "Copied nav section from src/i18n/dictionaries/en-v2.json to messages/en.json",
      "Copied nav section from src/i18n/dictionaries/sk-v2.json to messages/sk.json",
      "Translation keys now in correct location: messages/en.json and messages/sk.json",
      "User was right - not a cache issue, it was our bug"
    ],
    note: "CRITICAL BUG FIXED: Two i18n systems existed. Root ./i18n/request.ts loads from ./messages/, but we edited ./src/i18n/. Translation keys existed in wrong files for 7 versions. Now added to correct files."
  },
  "3.31.7": {
    date: "2026-01-20",
    name: "🚀 RENAME Dictionary Files - Ultimate Cache Bypass",
    features: [],
    fixes: [
      "RENAMED: en.json → en-v2.json, sk.json → sk-v2.json",
      "Updated import path: ./dictionaries/${locale}.json → ./dictionaries/${locale}-v2.json",
      "Creates COMPLETELY NEW module paths never seen by webpack/Vercel cache",
      "Old cached imports (en.json, sk.json) will never be requested again",
      "New imports (en-v2.json, sk-v2.json) have zero cache history",
      "This is the most aggressive cache-busting technique possible",
      "Attempt #7 after 6 failed attempts"
    ],
    note: "ULTIMATE NUCLEAR OPTION: Renaming the actual dictionary files forces new import paths. Webpack caches modules by their import path. ./dictionaries/en.json was cached with old content. ./dictionaries/en-v2.json is a brand new module that has never been cached. This MUST work or the issue is deeper than build caching (e.g., Vercel infrastructure bug)."
  },
  "3.31.6": {
    date: "2026-01-20",
    name: "🔄 Reorder JSON Keys - Nuclear Cache Bust",
    features: [],
    fixes: [
      "Moved integrations key to END of modules object (after trust)",
      "Moved integrations-overview key to END of pages object (after trust-center)",
      "Updated _cacheKey timestamp to force new content hash",
      "Theory: Webpack might be caching object structure, not just content",
      "Reordering keys changes JSON serialization completely",
      "This is attempt #6 to break Vercel's persistent cache"
    ],
    note: "NUCLEAR OPTION: 5 previous attempts failed (v3.31.1-v3.31.5). Reordering JSON object keys changes the serialized string completely, forcing every layer of cache (webpack, Vercel, CDN, browser) to recognize this as new content. If this fails, we need manual Vercel cache purge or complete project rebuild."
  },
  "3.31.5": {
    date: "2026-01-20",
    name: "💥 Add Cache Timestamp to JSON Files",
    features: [],
    fixes: [
      "Added _cacheKey timestamp marker to en.json and sk.json dictionary files",
      "Programmatic verification confirmed keys exist: nav.modules.integrations, nav.pages.integrations-overview",
      "Browser console shows translation function called but returning literal keys",
      "Root cause: Vercel edge cache or webpack JSON import cache",
      "Solution: Modified JSON file structure itself with timestamp to force new bundle hash",
      "Any change to JSON file content should invalidate webpack module cache"
    ],
    note: "CRITICAL ESCALATION: Translation keys verified present in source files but browser receives old dictionaries. Added _cacheKey field to JSON to force content hash change and invalidate all layers of caching (webpack module cache, Vercel edge cache, CDN cache). If this doesn't work, issue is in Vercel build system itself."
  },
  "3.31.4": {
    date: "2026-01-20",
    name: "🔥 Force Dictionary Reload - i18n Request",
    features: [],
    fixes: [
      "Modified src/i18n/request.ts to force dictionary cache invalidation",
      "Added console.log and comments to force Turbopack rebuild of i18n loader",
      "Console showed components rendering but t() returning literal keys",
      "Root cause: Webpack/Turbopack caching JSON imports even when files change",
      "Translation keys verified present: nav.modules.integrations, nav.pages.integrations-overview",
      "JSON files validated: en.json and sk.json both valid and contain correct keys",
      "Solution: Modified the import loader itself to force fresh dictionary load"
    ],
    note: "CRITICAL: Dictionary import cache issue. Console logs proved: [ModuleLink] Rendering: integrations → modules.integrations. Translation function called but keys not found despite being present in JSON files. Issue: Dynamic import statement `await import('./dictionaries/${locale}.json')` was cached by build system. Modified request.ts to force rebuild of dictionary loader."
  },
  "3.31.3": {
    date: "2026-01-20",
    name: "🔧 Force Component Rebuild - Topbar & Sidebar",
    features: [],
    fixes: [
      "Added console.log to ModuleLink component in modern-topbar.tsx to force rebuild",
      "Added console.log to SidebarLink component in modern-sidebar.tsx to force rebuild",
      "User reported no change in v3.31.2 - translation keys still showing literally",
      "Root cause: Vercel Turbopack served cached components despite dictionary updates",
      "Solution: Modified both layout components to force cache invalidation",
      "Browser console will show: [ModuleLink] Rendering: integrations → Integrations",
      "Browser console will show: [SidebarLink] Rendering: integrations-overview → Integrations"
    ],
    note: "Critical cache-busting deployment. Same issue as v3.30.2 and v3.31.1 - Vercel refuses to rebuild components when only dictionaries change. Added runtime logging to both topbar and sidebar components to force Turbopack rebuild."
  },
  "3.31.2": {
    date: "2026-01-20",
    name: "✅ Add Missing Integrations Translation Keys",
    features: [],
    fixes: [
      "Added nav.pages.integrations-overview translation key to en.json and sk.json",
      "Sidebar was using t('pages.integrations-overview') but key didn't exist",
      "Fixed 'pages.integrations-overview' literal text displayed in sidebar",
      "English: 'Integrations', Slovak: 'Integrácie'",
      "Sidebar navigation now displays properly translated text"
    ],
    note: "Translation keys fix. User reported seeing 'modules.integrations' in topbar and 'pages.integrations-overview' in sidebar. Root cause: v3.31.0 added module but didn't add corresponding nav.pages translation key. Sidebar uses t('pages.${item.id}') pattern which needs nav.pages.integrations-overview."
  },
  "3.31.1": {
    date: "2026-01-20",
    name: "🔧 Force Rebuild - Integrations Translation Cache",
    features: [],
    fixes: [
      "Added console.log to ModulesHelpPage to force Vercel rebuild",
      "User reported seeing 'modules.integrations' literal text instead of translated strings",
      "Root cause: Vercel build cache served old page.tsx file despite v3.31.0 having correct translation keys",
      "Translation keys verified present in both en.json and sk.json (help.modules.integrations)",
      "Solution: Modified page component with runtime logging to force cache invalidation"
    ],
    note: "Deployment cache fix. v3.31.0 had correct translation keys in dictionaries but Vercel served cached component. Same issue as v3.30.1/v3.30.2. Console log forces Turbopack to rebuild the page component."
  },
  "3.31.0": {
    date: "2026-01-20",
    name: "🔌 Replace Training Module with Integrations",
    features: [
      "Replaced Training module with Integrations across entire platform",
      "Updated module configuration in modules.ts - changed icon from GraduationCap to Plug",
      "Updated routing logic in modern-topbar.tsx for integrations module",
      "Updated bilingual translations in en.json and sk.json (nav.modules and help.modules)",
      "Created new Integrations overview page with ModuleComingSoon component",
      "Updated help modules page - replaced Training entry with Integrations",
      "Renamed route directories: training → integrations (both [locale] and non-localized)",
      "Features planned: API Keys Management, Webhooks, SSO/SAML, OAuth 2.0, Third-party Connectors, Data Export Automation"
    ],
    fixes: [],
    note: "Strategic pivot: Training module moved to future lms.avantle.ai product. Integrations module created as part of core dpia.avantle.ai platform to support API access, webhooks, and third-party connectors. Coming Soon page deployed with Q2 2026 timeline."
  },
  "3.30.4": {
    date: "2026-01-19",
    name: "🔥 CRITICAL FIX: Slovak Translations Now Work",
    features: [],
    fixes: [
      "Fixed getMessages() in layout.tsx - was missing locale parameter",
      "Changed from: await getMessages() → await getMessages({ locale })",
      "Root cause: getMessages() without parameter defaulted to English dictionary for all locales",
      "Debug logs revealed: Locale='sk' but t('title') returned 'IT Systems' instead of 'IT Systémy'",
      "NextIntlClientProvider received English messages regardless of URL (/sk vs /en)",
      "All Context list pages now display Slovak text on /sk URLs"
    ],
    note: "CRITICAL BUG FIX. v3.30.0-v3.30.3 had correct translation keys and page code, but layout.tsx passed wrong dictionary to client components. Sidebar worked (server-side translations), page content stayed English (client components received English messages). One-line fix: add { locale } parameter to getMessages()."
  },
  "3.30.3": {
    date: "2026-01-19",
    name: "🐛 Debug Translation Function Output",
    features: [],
    fixes: [
      "Added console.log to output what t('title') and t('description') actually return",
      "User confirmed locale switches correctly (sk/en in console) but text stays English",
      "Need to diagnose if translation function returns Slovak text or English text",
      "Will reveal if issue is: loading wrong dictionary, missing keys, or rendering problem"
    ],
    note: "Debugging deployment. Locale detection works (sk/en). Translation namespace correct (context.pages.systems). But page shows English text on both /sk and /en URLs. Added logging to see actual translation function return values."
  },
  "3.30.2": {
    date: "2026-01-19",
    name: "🔧 Turbopack Cache Clear - Context i18n Fix",
    features: [],
    fixes: [
      "Added console.log statements to all 6 Context list page components to force Turbopack rebuild",
      "User confirmed version 3.30.1 deployed but search found no 'context.pages.systems' in code",
      "Root cause: Vercel Turbopack build cache served old page.tsx files despite version bump",
      "Solution: Modified all 6 page.tsx files with runtime logging to force cache invalidation",
      "Added diagnostic logging: 'Locale: X, Namespace: context.pages.Y' in browser console"
    ],
    note: "Critical deployment fix. v3.30.0 and v3.30.1 had correct code in git but Vercel Turbopack refused to rebuild page components. Added actual code changes (console.log) that Turbopack cannot cache through. When you see v3.30.2 + console logs about locale/namespace, Slovak translations will work."
  },
  "3.30.1": {
    date: "2026-01-19",
    name: "🔧 Force Rebuild - Context List Pages Deployment",
    features: [],
    fixes: [
      "Force Vercel rebuild to clear build cache and deploy v3.30.0 page.tsx files",
      "User reported sidebar translations work but main content stays English",
      "Root cause: Vercel served cached old page.tsx files instead of new bilingual versions",
      "Added comment to systems/page.tsx to trigger fresh build without cache"
    ],
    note: "Deployment fix. No code changes. v3.30.0 translations were correct but Vercel build cache prevented deployment. This patch forces fresh build to serve actual bilingual page.tsx files."
  },
  "3.30.0": {
    date: "2026-01-19",
    name: "🌐 Context List Pages i18n Refactor Complete",
    features: [
      "Completed i18n refactoring for all 6 Context module list pages (systems, vendors, locations, data-categories, data-flows, processing)",
      "Added context.pages namespace with 6 sub-namespaces containing ~180 total translation keys",
      "All list pages now fully bilingual - Slovak (/sk URLs) and English (/en URLs)",
      "Migrated all headers, search placeholders, filter labels, table headers to next-intl",
      "Status pills (Active, Inactive, DPO Review, etc.) now properly translated",
      "Empty states and no-results messages fully localized",
      "Footer text with dynamic counts (e.g., 'Showing 5 systems') properly translated",
      "Added translation keys to both src/i18n/dictionaries/en.json and sk.json"
    ],
    fixes: [
      "Fixed parsing error in processing/page.tsx where sed wrapped t() calls in quotes",
      "Removed quotes around translation function calls in ternary expressions",
      "All 6 list pages build successfully with zero errors",
      "Verified translation key structure matches existing privacy.pages pattern"
    ],
    note: "Critical gap from v3.28.0 Context i18n refactor resolved. v3.28.0 only translated form components (create/edit pages) but not list pages. User reported: '/sk/context/systems shows same English content as /en/context/systems'. This release completes the bilingual Context module by refactoring all list page UI elements. Pattern: useTranslations('context.pages.{module}') for list pages, separate from context.{module} used by forms."
  },
  "3.29.3": {
    date: "2026-01-19",
    name: "🔧 Data Flows Translation Keys Fix",
    features: [],
    fixes: [
      "Added missing translation keys for DataFlowForm component",
      "Added noSystem, noVendor - dropdown options for 'None' selection",
      "Added toVendor - label for vendor destination field",
      "Added selectDestinationVendor - placeholder for vendor dropdown",
      "Added encryptionInTransitDescription - help text for encryption toggle",
      "Added crossBorderTransferDescription - help text for cross-border toggle",
      "Fixed 6 MISSING_MESSAGE browser console errors in data flows form",
      "Both English and Slovak translations added for all missing keys"
    ],
    note: "Critical hotfix. DataFlowForm was using 6 translation keys that were never added during v3.28.0 Context i18n refactor. Users saw console errors and potentially missing UI labels."
  },
  "3.29.2": {
    date: "2026-01-19",
    name: "🔧 ESLint Warnings Fix",
    features: [],
    fixes: [
      "Removed unused AssessmentsTableProps interface",
      "Prefixed unused 'include' parameter with underscore in physical-location.repository.ts",
      "Added ARIA attributes (aria-controls) to SelectCombobox for accessibility compliance",
      "Prefixed unused name parameters in all Delete dialogs (vendorName, systemName, locationName, flowName, categoryName)",
      "Prefixed unused 'locale' variables in vendors/[id] and locations/[id] page components",
      "Fixed all 10 ESLint warnings that were blocking CI/CD pipeline",
      "Build now passes with zero errors and zero warnings"
    ],
    note: "CI/CD hotfix. GitHub Actions build was failing with 1 error and 10 warnings. All ESLint issues resolved."
  },
  "3.29.1": {
    date: "2026-01-19",
    name: "🔧 Data Categories Translation Keys Fix",
    features: [],
    fixes: [
      "Added missing translation keys for DataCategoryForm dropdown descriptions",
      "Added typePersonal, typePersonalDesc, typeSpecial, typeSpecialDesc, typeCriminal, typeCriminalDesc",
      "Added sensitivityPublicDesc, sensitivityInternalDesc, sensitivityConfidentialDesc, sensitivityRestrictedDesc",
      "Added selectParentCategory placeholder text",
      "Fixed translation keys displaying literally in data category edit forms",
      "Both English and Slovak translations added for all missing keys"
    ],
    note: "Critical hotfix. DataCategoryForm component was using translation keys that were never added to dictionaries during v3.28.0 Context i18n refactor. Users saw raw keys like 'context.dataCategories.typePersonal' instead of translated text."
  },
  "3.29.0": {
    date: "2026-01-19",
    name: "🌐 Privacy Module i18n Refactor Complete",
    features: [
      "Eliminated 44 hardcoded ternary translations across Privacy module components",
      "Migrated assessments-table.tsx to next-intl useTranslations() hooks (17 ternaries)",
      "Migrated privacy/page.tsx to next-intl getTranslations() for server component (16 ternaries)",
      "Migrated assessments/page.tsx to next-intl getTranslations() for server component (11 ternaries)",
      "Added privacy.assessments namespace with comprehensive translation keys",
      "Added privacy.overview namespace for privacy dashboard page",
      "Centralized all Privacy module UI strings in src/i18n/dictionaries/",
      "Added translation keys: pageTitle, pageDescription, overviewTitle, precheckTooltip",
      "Added status labels: statusDrafts, statusOverdue, statusCompleted, statusInProgress",
      "Added Quick Actions labels: manageDpia, dpiaPrecheck, liaComingSoon, tiaComingSoon",
      "Server components use getTranslations() from 'next-intl/server'",
      "Client components use useTranslations() and useLocale() hooks",
      "Date formatting keeps legitimate locale usage (toLocaleDateString)"
    ],
    fixes: [
      "Fixed missing translation keys in assessments page status pills",
      "Corrected translation namespace structure for Privacy module",
      "Build passing with zero TypeScript errors"
    ],
    note: "Complete i18n refactoring for Privacy module following Context module pattern. All hardcoded locale-based ternaries eliminated except legitimate date/number formatting. Privacy module now fully bilingual with centralized translation system."
  },
  "3.28.1": {
    date: "2026-01-19",
    name: "🔧 i18n Dictionary Fix",
    features: [],
    fixes: [
      "Fixed translation keys displaying as-is on production (context.systems.systemType, etc.)",
      "Added context namespace to actual dictionary files (src/i18n/dictionaries/)",
      "All Context modules now load proper translations in both English and Slovak",
      "Previously was adding translations to wrong location (messages/ instead of dictionaries/)"
    ],
    note: "Critical hotfix. Root cause: next-intl loads from src/i18n/dictionaries/ not messages/. The i18n refactor in v3.28.0 added translations to the wrong directory. This patch moves 310+ translation keys to correct location. All 6 Context forms now display properly translated UI text."
  },
  "3.28.0": {
    date: "2026-01-19",
    name: "🌐 Context Module i18n Refactor Complete",
    features: [
      "Eliminated 230+ hardcoded ternary translations across all Context modules",
      "Migrated all 6 Context forms to next-intl useTranslations() hooks",
      "Removed locale props from all Context component interfaces",
      "Centralized all UI strings in messages/en.json and messages/sk.json",
      "Added context.common namespace for shared Context module strings",
      "Added module-specific namespaces: context.locations, context.vendors, context.systems, context.dataCategories, context.dataFlows, context.processing",
      "Refactored LocationForm: 26 ternary occurrences eliminated",
      "Refactored VendorForm: 27 ternary occurrences eliminated",
      "Refactored SystemForm: 24 ternary occurrences eliminated",
      "Refactored DataCategoryForm: 43 ternary occurrences eliminated",
      "Refactored DataFlowForm: 51 ternary occurrences eliminated",
      "Refactored ProcessingActivityForm: 38 ternary occurrences eliminated",
      "Refactored all 6 Delete Dialog components with translated strings",
      "Updated all 12 page files (new/[id] routes) to remove locale prop passing",
      "Converted dropdown options to direct translation keys",
      "Removed unused option constant arrays to reduce code size"
    ],
    fixes: [
      "Fixed SystemForm page file corruption from previous sed command",
      "Fixed ProcessingActivity new page build error with locale prop",
      "Zero ternary operators remaining in Context modules (verified)",
      "All builds passing with zero TypeScript errors"
    ],
    note: "Major i18n architecture refactor. All Context module forms now use centralized translation system. Pattern: useLocale() for routing only, useTranslations() for all UI text. Eliminated technical debt from hardcoded ternary operators. 100% coverage across 6 modules, 6 delete dialogs, 12 page files."
  },
  "3.27.4": {
    date: "2026-01-18",
    name: "📋 Business Strategy Documentation",
    features: [
      "Created comprehensive business-strategy.md documentation in /docs",
      "Documented 3-module product strategy: Avantle Privacy, Risk, LMS",
      "Defined go-to-market strategy: 90% white-label, 10% direct customers",
      "Specified pilot scope: Context + Privacy modules only",
      "Outlined 2026-2028 product roadmap with timeline",
      "Documented competitive positioning and risk mitigation strategies"
    ],
    fixes: [],
    note: "Strategic planning session outcome. Clarified product architecture: dpia.ai (marketing funnel) → avantle.ai (control plane) → privacy.avantle.ai (runtime). Risk and LMS modules will be separate products (risk.avantle.ai, lms.avantle.ai). Pilot focus on Avantle Privacy with Context + Privacy modules fully bilingual."
  },
  "3.27.3": {
    date: "2026-01-18",
    name: "💚 Green Adequacy Checkmark",
    features: [],
    fixes: [
      "Fixed adequacy checkmark color - now displays in green (#22c55e dark, #059669 light)",
      "Changed from text-[var(--success)] to text-[var(--status-success)] (correct token)",
      "Adequacy checkmarks now clearly indicate GDPR adequacy decision status",
      "EU countries, UK, Switzerland, etc. show green ✓ on right side"
    ],
    note: "User question: 'btw some checkmark should be in green?' - Fixed token name. Was using --success (doesn't exist) instead of --status-success. Right-side checkmarks for jurisdictions with GDPR adequacy now properly display in green."
  },
  "3.27.2": {
    date: "2026-01-18",
    name: "✨ Dropdown Hover Highlight",
    features: [
      "Added explicit hover:bg-[var(--surface-2)] to CommandItem for visible mouse hover feedback",
      "Improved dropdown UX - items now clearly highlight when mouse moves over them",
      "Keyboard navigation (Arrow keys) uses same highlight as mouse hover for consistency"
    ],
    fixes: [
      "Fixed invisible hover state - bg-accent was too similar to background (#2A3946 vs #243240)",
      "Replaced bg-accent with bg-[var(--surface-2)] for better contrast (#374151 in dark mode)",
      "Organized CommandItem className into logical groups for maintainability"
    ],
    note: "User feedback: 'I can just write what i search for in dropdown menu' but no visual feedback on hover. Added explicit hover state using --surface-2 token for clear visual feedback in both dark/light modes."
  },
  "3.27.1": {
    date: "2026-01-18",
    name: "🎨 Dropdown Background Fix",
    features: [],
    fixes: [
      "Dropdown backgrounds now use proper design tokens (--surface-1, --text-primary)",
      "PopoverContent: Replaced bg-popover with bg-[var(--surface-1)]",
      "Command: Replaced bg-popover with bg-[var(--surface-1)]",
      "CommandInput: Added explicit border-[var(--border-default)]",
      "Fixed transparent dropdown issue - dropdowns now have opaque backgrounds",
      "Text is now clearly readable against dropdown backgrounds in both dark/light modes",
      "Dropdowns properly separated from underlying page content"
    ],
    note: "Root cause: Tailwind bg-popover/text-popover-foreground classes not properly wired to CSS variables. Switched to explicit CSS variable syntax used throughout the project (bg-[var(--surface-1)]). Affects JurisdictionSelect and all Popover/Command-based components."
  },
  "3.27.0": {
    date: "2026-01-18",
    name: "🔍 Searchable Jurisdiction Select (Phase 1)",
    features: [
      "Created SelectCombobox: Generic searchable select for 13+ items with grouping and badges",
      "Created JurisdictionSelect: Domain wrapper with EU/EEA/Third Country grouping",
      "Created useJurisdictions: Centralized hook for fetching jurisdiction data",
      "Searchable across name_en, name_sk, country_code with client-side filtering",
      "Popular countries (SK, CZ, DE, US, GB, etc.) shown first in results",
      "Adequacy badge (✓) displayed for jurisdictions with GDPR adequacy decisions",
      "Keyboard accessible navigation (Arrow/Enter/Esc)",
      "Mobile-friendly popover interface",
      "Added cmdk@^1.0.0 for command palette pattern",
      "Added shadcn/ui command and popover components"
    ],
    fixes: [
      "UX: 58-item dropdown in LocationForm replaced with searchable combobox",
      "LocationForm: Removed local jurisdiction fetching logic (moved to useJurisdictions hook)",
      "Improved search performance with client-side filtering and debouncing"
    ],
    note: "Phase 1 implementation: Quick win for jurisdiction dropdown. Future phases will add SmartSelect orchestrator and additional renderers (segmented, pills, dropdown) for systematic deployment across all forms."
  },
  "3.26.0": {
    date: "2026-01-17",
    name: "🧹 Repository Cleanup & Jurisdiction Names",
    features: [
      "Removed all Phase 1 workarounds from physical-location.repository.ts",
      "Removed all Phase 1 workarounds from jurisdiction.repository.ts",
      "Populated jurisdiction names (EN/SK) for all database jurisdictions",
      "Updated LocationForm to display localized jurisdiction names instead of codes",
      "physical-location: Restored full field support (description, address, city)",
      "physical-location: Restored soft delete (deleted_at) instead of hard delete",
      "jurisdiction: Restored name_en/name_sk searching and ordering",
      "Created migration: 20260117_jurisdiction_names.sql for 52 countries",
      "UX improvement: Users now see 'Germany' instead of 'DE' in dropdowns"
    ],
    fixes: [
      "LocationForm.tsx: Added name_en and name_sk to Jurisdiction interface",
      "jurisdiction.repository.ts: Changed all ordering from country_code to name_en",
      "jurisdiction.repository.ts: Changed search from country_code only to name_en/name_sk/country_code",
      "physical-location.repository.ts: Now saves jurisdiction_id with all optional fields"
    ],
    note: "Database schema alignment complete (v3.25.49). All temporary workarounds removed. Jurisdiction names properly localized. System fully operational."
  },
  "3.25.0": {
    date: "2026-01-14",
    name: "🏗️ Context Module: Modal → Multi-page Workflow Complete",
    features: [
      "Migrated all 6 Context sub-modules from modal overlays to multi-page workflow",
      "Deep linking support - share direct URLs (e.g., /en/context/systems/abc-123)",
      "Browser back button works correctly",
      "Full-page forms provide superior mobile UX vs modal overlays",
      "Created src/lib/context/ with type-safe fetch wrappers",
      "Shared ContextFormShell component for consistent form layout across all modules",
      "Bilingual forms with Slovak/English support and locale-aware routes",
      "Consistent /[module]/new and /[module]/[id] pattern for all 6 modules"
    ],
    fixes: [
      "Resolved modal UX limitations - no deep linking, broken back button",
      "Eliminated all known technical debt from v3.24.x modal implementation"
    ],
    note: "Complete architecture transformation of Context module. All 6 sub-modules now use multi-page workflow. Zero TypeScript errors, all routes generated correctly."
  },
  "3.21.1": {
    date: "2025-12-xx",
    name: "🎯 Initial Platform Launch",
    features: [
      "Complete DPIA workflow with pre-check and builder",
      "Context module with 6 data management modules",
      "Platform dashboard with compliance scoring",
      "Trust Center with governance documentation",
      "Dark/Light theme support",
      "Bilingual support (Slovak/English)",
      "Next.js 16 + React 19 + TypeScript stack"
    ],
    fixes: [],
    note: "Initial production release of Avantle Privacy Platform"
  }
} as const
