# CLAUDE.md

Context for Claude Code working with DPIA Agent repository.

## 🚀 **FUTURE-PROOF ARCHITECTURE: Avantle Privacy Platform**

**❗ KRITICKÁ ARCHITEKTÚRNA PODMIENKA:**
Tento projekt je **prvá fáza** väčšieho produktu **Avantle Privacy** (finálne na privacy.avantle.ai).

### **🎯 Future-Proof Requirements (POVINNÉ)**
```typescript
// ✅ SPRÁVNE - Rozšíriteľná architektúra
/privacy/dpia/...              // nie /dpia/...
/privacy/lia/...               // nie /lia/...
PrivacyAssessmentForm          // nie DPIAForm
assessment.type = "dpia"       // nie dpia = root object

// ❌ ZAKÁZANÉ - Lock-in do DPIA-only
/dpia/...                      // zamyká na DPIA
DPIASpecificComponent          // nie je rozšíriteľné
dpia table ako root            // nie je škálovateľné
```

## Project Status

**Current Version: 3.28.0 - Context Module i18n Refactor Complete**
**URL**: https://dpia.avantle.ai - **LIVE & FULLY FUNCTIONAL**

### ✅ **Core Features Complete**
- **Context Module Multi-page Workflow**: Complete refactor from modal overlays to full-page forms with deep linking, browser navigation, and improved mobile UX
- **Systems Management**: Multi-page CRUD (/systems/new, /systems/[id]) with criticality tracking and ownership management
- **Vendor Management**: Multi-page CRUD (/vendors/new, /vendors/[id]) with DPA tracking, jurisdiction monitoring, vendor role classification
- **Location Management**: Multi-page CRUD (/locations/new, /locations/[id]) with GDPR adequacy decisions, transfer safeguards (SCCs, BCRs)
- **Data Category Management**: Multi-page CRUD (/data-categories/new, /data-categories/[id]) with Article 6 & 9 classification, parent/child hierarchy
- **Data Flow Mapping**: Multi-page CRUD (/data-flows/new, /data-flows/[id]) with encryption monitoring, cross-border transfer detection
- **Processing Activities**: Multi-page CRUD (/processing/new, /processing/[id]) with ROPA compliance, lawful basis tracking, DPO review flags
- **Context API Endpoints**: All functional - `/api/v1/context/{systems,vendors,locations,data-flows,data-categories,processing-activities}`
- **DPIA Workflow**: Pre-check (8 questions) + Builder (4 sections) + PDF export with localized assessment routes
- **Platform Dashboard**: Unified compliance overview with 92% score calculation methodology

### **Technical Stack**
- **Framework**: Next.js 16.1.1 + React 19 + TypeScript
- **Backend**: Supabase PostgreSQL (service role authentication)
- **Styling**: Tailwind CSS + Design Token System (200+ CSS variables)
- **Components**: Professional modal system with comprehensive GDPR compliance fields
- **Internationalization**: Slovak/English bilingual support
- **Theme**: Dark/Light switching with next-themes
- **Deployment**: Vercel with automated CI/CD

## 🏠 **Unified Platform Architecture**

### **Information Architecture**
```
Dashboard (Shows WHAT) ↔ Governance (Shows HOW)
├─ Compliance Score: 92% ⓘ → ├─ Weighted Formula Display
├─ Critical Items: 3         → ├─ Component Breakdowns  
├─ Reviews Needed: 8         → ├─ Missing Data Sources
└─ Audit Reports: 8          → └─ Improvement Areas
```

**Weighted Scoring**: Context(25%) + Privacy(30%) + Risk(20%) + Controls(15%) + Training(10%) = 92%

### **Navigation Structure**
```
Privacy Platform 3.24.202    Context · Privacy · Risk · Controls · Training · Trust Center    🌐 ❓ 👤
```

**Module Overview:**
- **Context Module** ✅ - Data inventory, systems, flows, vendors, locations (complete CRUD with multi-page workflow)
- **Privacy Module** ✅ - DPIA, LIA, TIA assessments (DPIA complete with multi-page workflow)
- **Risk Module** 🔄 - Risk management and scoring (UI complete)
- **Controls Module** 🔄 - Security controls and measures (UI complete)
- **Training Module** 🔄 - Staff training and awareness (UI complete)
- **Trust Center** ✅ - Governance and audit documentation

### **✅ Completed Refactoring (v3.25.0)**
**Context Module: Modal → Multi-page Workflow**
- Status: ✅ COMPLETE - All 6 sub-modules migrated
- Implementation: Multi-page workflow with /new and /[id] routes for all Context modules
- Benefits Achieved:
  - Deep linking support (shareable URLs to specific edit forms)
  - Browser back button works correctly
  - Improved mobile UX (full-page forms vs modal overlays)
  - Consistent UX pattern across entire platform
  - Better SEO and accessibility
- Architecture: Client wrapper library (src/lib/context/), shared ContextFormShell component
- Bilingual Support: Slovak/English throughout all forms
- Delete Operations: Retained lightweight modal confirmations (UX best practice)

## 🎯 **MICROSERVICES STRATEGY**

### **Target Architecture**
```
Frontend Applications:
├── dpia.avantle.ai → Avantle Privacy (DPIA, LIA, TIA, policies)
└── avantle.ai      → Marketing landing page

Backend API Services:
├── context.avantle.ai  → Avantle Inventory (IT systems, data mapping)
├── risk.avantle.ai     → Avantle Risk (Enterprise risk management)
├── controls.avantle.ai → Avantle Controls (Security frameworks)
├── core.avantle.ai     → Avantle Core (Auth, users, tenants)
└── lms.avantle.ai      → Avantle Training (Courses, certifications)
```

**Benefits:**
- **Product Portfolio**: Multiple sellable products from unified codebase
- **Market Expansion**: Risk management, IT inventory, compliance controls
- **Enterprise Suite**: Integrated suite for large customers

## Component System

### **Enhanced Design Token System**
200+ CSS variables for consistent theming:
- **Semantic Colors**: Success, warning, error, info with hover states
- **Mathematical Spacing**: 4px grid-based spacing system (space-1 to space-20)
- **Typography Scale**: Professional hierarchy (3xl to xs) with line heights
- **Component Tokens**: Border-radius, shadows, transitions, z-index

### **Multi-page Form System (v3.25.0 - COMPLETE)**
- **SystemForm**: System types, criticality, ownership tracking with comprehensive validation (/systems/new, /systems/[id])
- **VendorForm**: Vendor roles, DPA tracking, contact management, jurisdiction monitoring (/vendors/new, /vendors/[id])
- **LocationForm**: GDPR adequacy decisions, transfer safeguards, data localization requirements (/locations/new, /locations/[id])
- **DataFlowForm**: Flow direction, endpoints, encryption, cross-border tracking (/data-flows/new, /data-flows/[id])
- **DataCategoryForm**: GDPR Article 6 & 9 classification with legal basis validation (/data-categories/new, /data-categories/[id])
- **ProcessingActivityForm**: ROPA compliance, lawful basis, special category processing (/processing/new, /processing/[id])
- **Delete Dialogs**: GDPR-specific warnings about data lineage impact and compliance records (lightweight modals retained)

**Architecture**: All forms use ContextFormShell component for consistent layout, import from src/lib/context/ wrapper library, support full i18n.

### **Form Control Rules**
- **2 options**: Segmented control (Yes/No)
- **3-8 options**: Pill group with rounded buttons
- **9-12 options**: Standard select dropdown
- **13+ options**: Searchable combobox (SelectCombobox) with grouping, popular items, badges
- **Single CTA Rule**: One primary button per screen only
- **Auto-save**: Debounced 2-second saves with status indicators

### **Searchable Select System (v3.27.0)**
- **SelectCombobox**: Generic component for 13+ items with search, grouping, badges, popular items
- **JurisdictionSelect**: Domain wrapper with EU/EEA/Third Country grouping and adequacy badges
- **useJurisdictions**: Centralized data fetching hook for jurisdiction data
- **Implementation**: LocationForm uses JurisdictionSelect for 58-item jurisdiction dropdown
- **Features**: Keyboard navigation, mobile-friendly popover, bilingual support, client-side filtering

## Database Architecture

### **Context Module Tables (✅ ALL 6 MODULES - COMPLETE CRUD)**
- **Systems** ✅ - IT systems with criticality levels, ownership, and compliance status tracking
- **Vendors** ✅ - Third-party processors with DPA tracking, expiration monitoring, vendor role classification
- **Locations** ✅ - Jurisdictions with GDPR adequacy decisions, transfer safeguards (SCCs/BCRs), data localization flags
- **Data Categories** ✅ - GDPR Article 6 & 9 classification with legal basis validation and parent/child hierarchy
- **Data Flows** ✅ - Flow mapping with direction tracking, encryption monitoring, cross-border transfer detection
- **Processing Activities** ✅ - ROPA compliance with Article 30 requirements, lawful basis, DPO review flags

**Implementation Pattern**: Multi-page workflow (Create/Edit via full pages with routes, Delete via lightweight confirmation modals)
**Migration Complete**: v3.25.0 - All 6 modules now use multi-page pattern for improved UX, SEO, and accessibility

**Security**: Multi-tenant RLS isolation, service role authentication
**Storage**: Supabase Storage for PDF/DOCX exports
**Client Library**: src/lib/context/ - Type-safe fetch wrappers for all Context API endpoints

## Development Workflow

### **⚠️ CRITICAL: Version Management Rule (MANDATORY) ⚠️**

**🚨 THIS RULE CANNOT BE SKIPPED - VERSION MUST BE UPDATED AFTER EVERY CODE CHANGE 🚨**

ALWAYS update version IMMEDIATELY after completing any code changes, before commit:

**Step-by-step process:**
1. **Update `src/lib/version.ts`**:
   - Increment VERSION (patch: 3.25.1 → 3.25.2, minor: 3.25.2 → 3.26.0, major: 3.26.0 → 4.0.0)
   - Update VERSION_NAME with descriptive change summary
   - Update BUILD_DATE to current date
   - Add new CHANGELOG entry at the TOP of CHANGELOG object with detailed feature list

2. **Update `package.json` version** to match VERSION from version.ts

3. **Commit with version bump message**:
   ```bash
   git add src/lib/version.ts package.json
   git commit -m "chore: Bump version to v3.25.2 - Context Routes Fix"
   ```

4. **Push to trigger automatic deployment**

**Why this matters:**
- Version tracking in production for debugging
- Cache invalidation for client browsers
- Changelog visibility for users and team
- Deployment audit trail

**Example workflow:**
```bash
# 1. Make code changes
# 2. Update version.ts and package.json (DON'T FORGET!)
# 3. Commit both version files + code changes
git add -A
git commit -m "fix: Context routes async params

- Fix Next.js 15+ compatibility
- Update version to 3.25.2

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
git push origin main
```

### **Commands**
```bash
pnpm dev              # Start dev server
pnpm build           # Build for production
pnpm lint            # Run ESLint
git add . && git commit -m "message" && git push origin main
```

**Local Path**: `C:\Users\rasti\Projects\avantlehq\dpia-avantle-ai\`

## Documentation

### **Complementary System**
- **CLAUDE.md** (This file) - AI context & development history
- **`/docs/` Folder** - Developer reference & onboarding
  - `design-system.md` - Component API, tokens, patterns
  - `architecture.md` - System overview, microservices strategy
  - `data-model.md` - Database schema, entity relationships

**Usage**: New developers start with `/docs/README.md`, AI assistance uses CLAUDE.md context

## Recent Changes (Last Session)

### **v3.28.0 - 2026-01-19**
**🌐 CONTEXT MODULE I18N REFACTOR: Eliminated 230+ Hardcoded Ternary Translations**

**ACHIEVEMENT**: Complete migration of all Context module forms to centralized next-intl translation system

**Architecture Pattern Established:**
- **useLocale()**: For routing purposes only (`/${locale}/context/...`)
- **useTranslations()**: For all UI text rendering
- **Message Namespaces**:
  - `context.common` - Shared strings across all Context modules
  - `context.locations`, `context.vendors`, `context.systems`, `context.dataCategories`, `context.dataFlows`, `context.processing` - Module-specific translations

**Forms Refactored (6 modules):**
1. **LocationForm** - 26 ternary occurrences eliminated
2. **VendorForm** - 27 ternary occurrences eliminated
3. **SystemForm** - 24 ternary occurrences eliminated
4. **DataCategoryForm** - 43 ternary occurrences eliminated (most complex dropdowns)
5. **DataFlowForm** - 51 ternary occurrences eliminated (largest refactor)
6. **ProcessingActivityForm** - 38 ternary occurrences eliminated (GDPR Article 30 compliance)

**Additional Components:**
- All 6 Delete Dialog components refactored with translated strings
- All 12 page files (new/[id] routes) updated to remove locale prop passing
- Dropdown options converted to direct translation keys
- Removed unused option constant arrays

**Technical Improvements:**
- Zero locale props in component interfaces - cleaner API
- Centralized UI strings in messages/en.json and messages/sk.json
- Removed 230+ hardcoded `locale === 'sk' ? 'text' : 'text'` ternaries
- All builds passing with zero TypeScript errors
- 100% coverage across all Context modules

**Fixes:**
- Fixed SystemForm page file corruption from previous sed command
- Fixed ProcessingActivity new page build error with locale prop
- Verified zero remaining ternaries in Context modules (only data field selection remains in JurisdictionSelect, which is correct)

**Files Modified:** 18 files total (6 forms + 6 delete dialogs + 12 page files)

### **v3.27.0 - 2026-01-18**
**🔍 SEARCHABLE JURISDICTION SELECT: Phase 1 Quick Win Implementation**

**PROBLEM SOLVED**: 58-item dropdown in LocationForm provided poor UX for jurisdiction selection

**Components Created:**
1. **SelectCombobox** (`src/components/ui/select-combobox.tsx`)
   - Generic searchable select component for 13+ items
   - Type-safe with TypeScript generics `<T>`
   - Client-side search filtering with useMemo optimization
   - Support for grouping, badges, popular items
   - Composition pattern: getOptionValue, getOptionLabel, getOptionKeywords
   - Keyboard accessible (Arrow/Enter/Esc navigation)

2. **JurisdictionSelect** (`src/components/context/JurisdictionSelect.tsx`)
   - Domain-specific wrapper for jurisdiction selection
   - Groups by jurisdiction_type (EU Member States / EEA Countries / Third Countries)
   - Displays adequacy badge (✓) for GDPR adequate jurisdictions
   - Popular countries (SK, CZ, DE, US, GB, FR, AT, PL, HU, NL) shown first
   - Bilingual label rendering (Slovak/English)

3. **useJurisdictions** (`src/hooks/useJurisdictions.ts`)
   - Centralized data fetching hook for jurisdiction data
   - Removes duplicate fetching logic from forms
   - Enables future caching implementation

**Form Updates:**
- **LocationForm**: Replaced standard Select with JurisdictionSelect
- Removed local jurisdictions state and useEffect fetching
- Improved UX: Searchable, grouped, filterable 58-item select

**Dependencies Added:**
- `cmdk@^1.0.0` - Command palette pattern for search functionality
- `shadcn/ui command` - Command components
- `shadcn/ui popover` - Popover positioning primitives

**UX Improvements:**
- ✅ Search across name_en, name_sk, country_code
- ✅ Grouped display (EU/EEA/Third Countries)
- ✅ Popular countries prioritized in results
- ✅ Adequacy checkmarks for GDPR adequate jurisdictions
- ✅ Keyboard navigation support
- ✅ Mobile-friendly popover interface
- ✅ Bilingual support (Slovak/English)

**Architecture Pattern:**
- Phase 1: Quick win for jurisdiction dropdown (COMPLETE)
- Future Phase 2: SmartSelect orchestrator with threshold logic
- Future Phase 3: Additional renderers (segmented, pills, standard dropdown)
- Future Phase 4: Systematic deployment across all Context forms

**Files Modified:**
- `package.json` - Added cmdk dependency
- `src/components/context/LocationForm.tsx` - Integrated JurisdictionSelect
- `src/components/ui/select-combobox.tsx` - NEW (generic component)
- `src/components/ui/command.tsx` - NEW (shadcn component)
- `src/components/ui/popover.tsx` - NEW (shadcn component)
- `src/components/context/JurisdictionSelect.tsx` - NEW (domain wrapper)
- `src/hooks/useJurisdictions.ts` - NEW (data fetching hook)

**Build Status**: ✓ Compiled successfully with zero errors
**Git Commits**:
- `7f8ee64` - JurisdictionSelect implementation
- `ac8b6b7` - Version bump to v3.27.0

### **v3.27.3 - 2026-01-18**
**💚 GREEN ADEQUACY CHECKMARK FIX**

**Problem:** Adequacy checkmarks (right side) not displaying in green color

**Root Cause:**
- Used `text-[var(--success)]` but CSS token doesn't exist
- Fell back to default text color (white/gray) instead of green

**Fix:**
- Changed to `text-[var(--status-success)]` (correct token)
- Dark mode: #22c55e (green)
- Light mode: #059669 (green)

**Result:**
- EU countries, UK, Switzerland show GREEN ✓ on right side
- Clearly indicates GDPR adequacy decision status
- Left checkmark (selected item) remains white

**File Modified:** `src/components/context/JurisdictionSelect.tsx`
**Git Commit:** `9c121ed`, `f6b9593`

### **v3.27.2 - 2026-01-18**
**✨ DROPDOWN HOVER HIGHLIGHT**

**Problem:** Dropdown items had no visible hover feedback when mouse moved over them

**Root Cause:**
- `bg-accent` (#2A3946) too similar to background (#243240)
- No visible color difference on hover

**Fix:**
- Added explicit `hover:bg-[var(--surface-2)]` for mouse hover
- Replaced `bg-accent` with `bg-[var(--surface-2)]` for better contrast
- Dark mode: #374151 provides clear visual feedback
- Keyboard navigation (Arrow keys) uses same highlight

**Result:**
- Mouse hover now clearly highlights dropdown items
- Works in both dark and light modes
- Consistent with keyboard navigation styling

**File Modified:** `src/components/ui/command.tsx`
**Git Commit:** `4e1e98b`, `8f0a05c`

### **v3.27.1 - 2026-01-18**
**🎨 DROPDOWN BACKGROUND FIX**

**Problem:** Dropdown menus transparent, causing text to blend with page background

**Root Cause:**
- Tailwind `bg-popover`/`text-popover-foreground` classes not properly wired to CSS variables
- Project uses explicit CSS variable syntax: `bg-[var(--surface-1)]`

**Fixes:**
- `popover.tsx`: Replaced `bg-popover` with `bg-[var(--surface-1)]`
- `popover.tsx`: Replaced `text-popover-foreground` with `text-[var(--text-primary)]`
- `popover.tsx`: Added explicit `border-[var(--border-default)]`
- `command.tsx`: Same bg/text token replacements
- `command.tsx`: Added explicit border color to CommandInput

**Result:**
- Dropdowns now have opaque backgrounds
- Text clearly readable in dark/light modes
- Dropdowns visually separated from underlying content
- Affects JurisdictionSelect and all Popover/Command-based components

**Files Modified:** `src/components/ui/popover.tsx`, `src/components/ui/command.tsx`
**Git Commits:** `5bc129b`, `5780786`

### **Performance Optimization - 2026-01-18**
**⚡ VERSION.TS FILE SIZE REDUCTION**

**Problem:**
- `src/lib/version.ts`: 2,267 lines (144KB) with 173 version entries
- Comment claimed "last 5 versions only" but had full history
- Unnecessary bundle bloat, slow loading

**Fix:**
- Kept only last 7 versions (3.27.3 → 3.21.1)
- Removed 166 old changelog entries
- File size: 144KB → 8KB (94% reduction)
- Lines: 2,267 → 137 (94% reduction)

**Result:**
- Faster builds and deploys
- Smaller bundle size
- Complete history still available in git commits
- Comment now accurate: "last 7 versions only"

**File Modified:** `src/lib/version.ts`
**Git Commit:** `06908e0`

---

### **v3.25.53 - 2026-01-17**
**✅ DATABASE SCHEMA ALIGNMENT COMPLETE: Phase 2 Migration & Vendor Role Fix**

**MAJOR ACHIEVEMENT**: Completed full database schema alignment and fixed all dropdown pre-selection issues across Context modules

**Database Migrations Executed:**
- **Phase 2 Migration**: `20260117_context_schema_alignment.sql` - Added missing columns to all Context tables
  - Added soft delete support (deleted_at) to processing_activities, vendors, physical_locations, data_categories, systems
  - Added audit trail columns (created_by, updated_by) to all Context tables
  - Added jurisdictions localized names (name_en, name_sk)
  - Fixed physical_locations schema - added description, address, city, jurisdiction_id
  - Added parent_id for hierarchical data categories
  - Added special_category_basis for GDPR Article 9 compliance
- **Vendor Columns Migration**: `20260117_vendors_missing_columns.sql` - Added vendor-specific fields
  - Created vendor_role_type enum (processor, joint_controller, recipient, sub_processor)
  - Added vendor_role, status, has_dpa, dpa_expires, location columns to vendors table

**5-Layer Fix Chain for Vendor Role Dropdown Persistence:**
1. **v3.25.48**: VendorRepository - Whitelisted vendor_role in prepareCreateData/prepareUpdateData
2. **v3.25.49**: Database Migration - Added vendor_role column and enum type
3. **v3.25.50**: TypeScript Interfaces - Added vendor_role to Vendor interface in types.ts
4. **v3.25.51**: Zod Validation Schemas - Added vendor_role to CreateVendorRequestSchema/UpdateVendorRequestSchema
5. **v3.25.52**: Empty String Handling - Added .or(z.literal('')) to accept empty strings from form
6. **v3.25.53**: NULL Conversion - Transform empty strings to NULL before database insert/update

**Fixes Applied:**
- ✅ Vendor role dropdown now persists correctly (was reverting to "Processor")
- ✅ Location form fields restored (description, address, city) after migration
- ✅ Data category parent_id and special_category_basis now save correctly
- ✅ All dropdown pre-selection issues resolved across Context modules

**Technical Issues Resolved:**
- 400 Bad Request: "Request body validation failed" - Zod schemas missing vendor_role
- 500 Internal Server Error: "invalid input syntax for type date: ''" - Empty string to DATE column
- TypeScript compilation errors: Interface missing vendor_role property
- Repository blocking fields with outdated workarounds

**Migration Documentation Created:**
- `migrations/MIGRATION_INSTRUCTIONS.md` - Step-by-step guide for main migration
- `migrations/MIGRATION_INSTRUCTIONS_VENDORS.md` - Vendor-specific migration guide
- All migrations include verification queries and rollback scripts

**Files Modified (6 versions deployed):**
- v3.25.48: vendor.repository.ts, types.ts (Repository whitelist)
- v3.25.49: Migration scripts created
- v3.25.50: types.ts (TypeScript interfaces), vendor.repository.ts (findByIdWithRelations)
- v3.25.51: schemas.ts (Zod validation)
- v3.25.52: schemas.ts (Empty string acceptance)
- v3.25.53: vendor.repository.ts (Empty string to NULL conversion)

**Status**: All Context module forms now fully functional with correct dropdown pre-selection

### **v3.25.2 - 2026-01-15**
**🔧 Context Routes Fix: Async Params & RLS Policies**
- **NEXT.JS 15+ COMPATIBILITY**: Fixed all Context module routes to use async params (Promise<{ locale: string }>)
- **ROUTING FIX**: Resolved 404 errors on /en/context/systems/new and all other Context module /new routes
- **ALL /NEW PAGES FIXED**: Updated systems, vendors, locations, data-categories, data-flows, processing /new pages
- **ALL [ID] PAGES FIXED**: Updated all edit pages (systems/[id], vendors/[id], locations/[id], etc.) with async params
- **BUILD OUTPUT**: Context routes now properly appear in Next.js 16 build manifest
- **SUPABASE MIGRATION**: Added audit columns (created_by, updated_by, deleted_at) to systems table
- **RLS POLICIES FIXED**: Updated Row Level Security to allow service_role bypass for API operations
- **DATABASE SCHEMA**: Systems table now has required audit fields matching BaseRepository requirements
- **API FUNCTIONALITY**: POST /api/v1/context/systems now works correctly - can create systems via API
- **PRODUCTION TESTED**: System creation tested and working on https://dpia.avantle.ai/en/context/systems/new
- **VERSION MANAGEMENT**: Strengthened version update rule in CLAUDE.md with critical warnings and step-by-step guide

### **v3.25.1 - 2026-01-14**
**🔧 Build Fixes: TypeScript & ESLint Compliance**
- **TYPESCRIPT FIXES**: Resolved 6 'interface declaring no members' errors by replacing empty interface extends with type aliases
- **ESLINT FIXES**: Escaped apostrophes in 10 not-found.tsx files across all Context modules
- **REACT ERROR FIX**: Removed async modifier from client component in assessment page (no-async-client-component)
- **CLIENT LIBRARY UPDATES**: Fixed type definitions in systems.ts, vendors.ts, locations.ts, data-categories.ts, data-flows.ts, processing-activities.ts
- **404 PAGE UPDATES**: Proper HTML entity escaping (&apos;) in error messages
- **ASSESSMENT PAGE REFACTOR**: Migrated from async params prop to useParams() hook
- **BUILD STATUS**: ✓ Compiled successfully with zero TypeScript errors and ESLint warnings
- **GITIGNORE**: Added tmpclaude-* pattern to prevent temp file tracking in git
- **PRODUCTION READY**: All code quality checks passing, deployment successful

### **v3.25.0 - 2026-01-14**
**🏗️ CONTEXT REFACTOR: Modal → Multi-page Workflow Complete**
- **ARCHITECTURE TRANSFORMATION**: Migrated all 6 Context sub-modules from modal overlays to multi-page workflow
- **DEEP LINKING**: Share direct URLs (e.g., /en/context/systems/abc-123) - resolves previous limitation
- **BROWSER NAVIGATION**: Back button works correctly - resolves previous technical debt
- **MOBILE UX**: Full-page forms provide superior experience vs modal overlays
- **CLIENT LIBRARY**: Created src/lib/context/ with type-safe fetch wrappers (systems.ts, vendors.ts, locations.ts, data-categories.ts, data-flows.ts, processing-activities.ts)
- **SHARED SHELL**: ContextFormShell component for consistent form layout across all modules
- **BILINGUAL FORMS**: Slovak/English support in all Context forms with locale-aware routes
- **ROUTE STRUCTURE**: Consistent /[module]/new and /[module]/[id] pattern for all 6 modules
- **404 HANDLING**: Custom not-found.tsx pages for each module with proper error messaging
- **DELETE DIALOGS**: Retained lightweight modal confirmations (UX best practice for destructive actions)
- **BUILD SUCCESS**: Zero TypeScript errors, all routes generated correctly
- **TECHNICAL DEBT RESOLVED**: Eliminated all known modal UX limitations from v3.24.x

**Modules Migrated**:
1. ✅ Systems - SystemForm with /systems/new, /systems/[id]
2. ✅ Vendors - VendorForm with /vendors/new, /vendors/[id]
3. ✅ Locations - LocationForm with /locations/new, /locations/[id]
4. ✅ Data Categories - DataCategoryForm with /data-categories/new, /data-categories/[id]
5. ✅ Data Flows - DataFlowForm with /data-flows/new, /data-flows/[id]
6. ✅ Processing Activities - ProcessingActivityForm with /processing/new, /processing/[id]

### **Known Issues & Technical Debt**
- ~~Modal UX Limitations~~ ✅ RESOLVED in v3.25.0 - Multi-page workflow implemented
- ~~No Deep Linking~~ ✅ RESOLVED in v3.25.0 - All routes support direct URLs
- ~~Browser Back Button~~ ✅ RESOLVED in v3.25.0 - Standard browser navigation works correctly
- ~~Context Routes 404 Errors~~ ✅ RESOLVED in v3.25.2 - Async params implementation for Next.js 15+
- ~~Systems API 500 Errors~~ ✅ RESOLVED in v3.25.2 - RLS policies fixed for service_role, audit columns added
- ~~Hardcoded Ternary Translations~~ ✅ RESOLVED in v3.28.0 - All Context modules migrated to next-intl, 230+ ternaries eliminated

**Current Status**: All major technical debt resolved. Platform fully functional. i18n architecture complete.

## Communication Style

Direct, concise, unsentimental. No praise, admiration, unnecessary positivity. No comfort, reassurance, encouragement. No friendly/warm tone. No apologies unless clear factual error. Judge ideas bluntly and logically. Truth over feelings. Clear stance, not hedged language. No compliments, "great question," "happy to help," or filler. Short sentences, plain language, zero rhetorical fluff. Priority: accuracy, clarity, candor.

## Organization Context

**avantlehq** builds privacy-first AI platforms focused on European data sovereignty and GDPR compliance.

### **Project Architecture**
1. **avantle-ai** (Marketing layer) - Domain: avantle.ai - Version: 0.4.1
2. **dpia-avantle-ai** (DPIA Application) - Domain: dpia.avantle.ai - Production ready
3. **notes-avantle-ai** (Notes Application) - Domain: notes.avantle.ai - Version: 0.1.3
4. **dpia-ai** (DPIA Marketing) - Domain: dpia.ai - Version: 1.0.4