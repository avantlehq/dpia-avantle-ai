// Avantle Privacy Platform Version Information - Build Cache Buster v3.21.31
export const VERSION = "3.28.0" as const
export const VERSION_NAME = "🌐 Context Module i18n Refactor Complete" as const
export const BUILD_DATE = "2026-01-19"

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
