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

**Current Version: 3.36.0 - Context Tables UX Unification**
**URL**: https://dpia.avantle.ai - **LIVE & FULLY FUNCTIONAL**

### ✅ **Core Features Complete**
- **Context Module Multi-page Workflow**: Complete refactor from modal overlays to full-page forms with deep linking, browser navigation, and improved mobile UX
- **Systems Management**: Multi-page CRUD (/systems/new, /systems/[id]) with criticality tracking and ownership management
- **Vendor Management**: Multi-page CRUD (/vendors/new, /vendors/[id]) with DPA tracking, jurisdiction monitoring, vendor role classification
- **Location Management**: Multi-page CRUD (/locations/new, /locations/[id]) with GDPR adequacy decisions, transfer safeguards (SCCs, BCRs)
- **Data Category Management**: Multi-page CRUD (/data-categories/new, /data-categories/[id]) with Article 6 & 9 classification, parent/child hierarchy
- **Data Flow Mapping**: ✅ FULL DATABASE BACKEND - Multi-page CRUD (/data-flows/new, /data-flows/[id]) with encryption monitoring, cross-border transfer detection, endpoint tracking (system-to-system, system-to-vendor flows)
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

**Weighted Scoring**: Context(25%) + Privacy(30%) + Risk(20%) + Controls(15%) + Integrations(10%) = 92%

### **Navigation Structure**
```
Privacy Platform 3.31.12    Context · Privacy · Risk · Controls · Integrations · Trust Center    🌐 ❓ 👤
```

**Module Overview:**
- **Context Module** ✅ - Data inventory, systems, flows, vendors, locations (complete CRUD with multi-page workflow)
- **Privacy Module** ✅ - DPIA, LIA, TIA assessments (DPIA complete with multi-page workflow)
- **Risk Module** 🔄 - Risk management and scoring (UI complete)
- **Controls Module** 🔄 - Security controls and measures (UI complete)
- **Integrations Module** 🔄 - API access, webhooks, SSO/SAML (Coming Soon - Q2 2026)
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
├── integrations.avantle.ai → Avantle Connect (API, webhooks, SSO)
└── core.avantle.ai     → Avantle Core (Auth, users, tenants)
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

## Internationalization (i18n) Architecture

**⚠️ CRITICAL: Single Source of Truth (Consolidated in v3.31.15)**

### **i18n System Structure**
```
/i18n/
  ├── config.ts          # Locale configuration, validation, storage keys
  ├── client-utils.ts    # Client-side functions (detectClientLocale, setClientLocale)
  └── request.ts         # next-intl server-side loader (loads from /messages/)

/messages/
  ├── en.json           # English translations - LOADED BY NEXT-INTL
  └── sk.json           # Slovak translations - LOADED BY NEXT-INTL

src/hooks/
  └── useTranslations.ts # Custom hook with INLINE dictionaries (topbar/sidebar ONLY)
```

### **🔥 CRITICAL RULES FOR ADDING TRANSLATIONS**

1. **For ALL pages and components** (Context, Privacy, forms, lists, etc.):
   - ✅ ADD keys to `/messages/en.json` and `/messages/sk.json`
   - ❌ NEVER edit `src/hooks/useTranslations.ts` (inline dictionaries for topbar/sidebar only)
   - These files are loaded by next-intl's `./i18n/request.ts`

2. **For topbar/sidebar navigation ONLY**:
   - ✅ ADD keys to `src/hooks/useTranslations.ts` inline dictionaries
   - This custom hook has hardcoded translations (NOT loaded from JSON)
   - Affects: ModuleLink in topbar, SidebarLink in sidebar

3. **Verification Steps**:
   - Check import paths: `useTranslations('namespace')` from 'next-intl' → loads from `/messages/`
   - Check import paths: Custom `useTranslations()` from '@/hooks/' → uses inline dictionaries
   - Run build to verify no MISSING_MESSAGE console errors
   - Test both `/en/` and `/sk/` URLs

### **Translation Namespace Pattern**
```typescript
// Context module forms: context.{module}
useTranslations('context.systems')      // SystemForm component
useTranslations('context.vendors')      // VendorForm component

// Context module lists: context.pages.{module}
useTranslations('context.pages.systems')   // systems/page.tsx list page
useTranslations('context.pages.vendors')   // vendors/page.tsx list page

// Privacy module: privacy.{feature}
useTranslations('privacy.assessments')  // assessments/page.tsx

// Navigation (inline dictionaries): nav.{section}
useTranslations('nav')                  // topbar/sidebar (custom hook)
t('modules.privacy')                    // module names
t('pages.dpia-precheck')               // page names
```

### **Common i18n Mistakes (Lessons Learned)**

**❌ MISTAKE 1: Editing wrong dictionary files**
- Problem: Adding keys to `src/i18n/dictionaries/*.json` (never loaded)
- Solution: ALWAYS add to `/messages/en.json` and `/messages/sk.json`
- History: Repeated in v3.31.8 and v3.31.13 before consolidation in v3.31.15

**❌ MISTAKE 2: Forgetting namespace keys**
- Problem: Component uses `useTranslations('privacy.assessments')` but namespace doesn't exist
- Solution: Add complete namespace with all keys component needs
- Example: v3.31.16 fixed missing `privacy.assessments` namespace

**❌ MISTAKE 3: Incomplete key sets**
- Problem: Adding main keys but missing footer/action keys
- Solution: Search component code for ALL `t('...')` calls before adding keys
- Example: v3.31.17 added missing `showingAssessments` and `addNew` keys

**❌ MISTAKE 4: Assuming topbar/sidebar use next-intl**
- Problem: Editing `/messages/*.json` for navigation translations
- Solution: Navigation uses `src/hooks/useTranslations.ts` inline dictionaries
- History: v3.31.12 discovered after 11 failed attempts

### **Translation Workflow**
1. Component uses `useTranslations('namespace.subnamespace')`
2. Verify if it's navigation (topbar/sidebar) or regular component
3. If navigation → Edit `src/hooks/useTranslations.ts` inline dictionaries
4. If regular component → Edit `/messages/en.json` and `/messages/sk.json`
5. Add ALL keys the component references (search for `t('...')` calls)
6. Test both `/en/` and `/sk/` URLs
7. Check browser console for MISSING_MESSAGE errors

## Database Architecture

### **Context Module Tables (✅ ALL 6 MODULES - COMPLETE CRUD)**
- **Systems** ✅ - IT systems with criticality levels, ownership, and compliance status tracking
- **Vendors** ✅ - Third-party processors with DPA tracking, expiration monitoring, vendor role classification
- **Locations** ✅ - Jurisdictions with GDPR adequacy decisions, transfer safeguards (SCCs/BCRs), data localization flags
- **Data Categories** ✅ - GDPR Article 6 & 9 classification with legal basis validation and parent/child hierarchy
- **Data Flows** ✅ - **FULL DATABASE BACKEND (v3.35.0)** - Flow mapping with endpoints (from_system, to_system, from_vendor, to_vendor), direction tracking, encryption monitoring (encryption_in_transit), cross-border transfer detection (cross_border_transfer)
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

### **v3.36.0 - 2026-01-25**
**🎨 CONTEXT TABLES UX UNIFICATION: CLICKABLE ROWS + KEBAB MENU**

**ACHIEVEMENT**: Unified table interaction pattern across all 6 Context modules to match DPIA Assessments UX

**IMPLEMENTED FEATURES**:
1. **Clickable Row Navigation** - Name column now links to edit page with hover effect (blue text)
2. **Kebab Menu (DropdownMenu)** - Replaced 2-icon pattern with single MoreVertical dropdown
3. **Reusable Component** - Created `ContextTableActions` for all Context modules
4. **Visual Consistency** - Matches DPIA Assessments table interaction pattern
5. **Scalable Design** - Easy to add future actions (Duplicate, Export, Archive)
6. **Bilingual Support** - Translation labels for Edit/Delete in EN/SK

**COMPONENTS CREATED**:
- `src/components/context/ContextTableActions.tsx` - Generic kebab menu component
  - Props: itemId, itemName, module, onDelete, editLabel, deleteLabel
  - Uses shadcn/ui DropdownMenu with Radix UI primitives
  - Module types: systems | vendors | locations | data-categories | data-flows | processing

**PAGES MODIFIED (6)**:
- `src/app/[locale]/context/systems/page.tsx`
- `src/app/[locale]/context/vendors/page.tsx`
- `src/app/[locale]/context/locations/page.tsx`
- `src/app/[locale]/context/data-categories/page.tsx`
- `src/app/[locale]/context/data-flows/page.tsx`
- `src/app/[locale]/context/processing/page.tsx`

**CHANGES PER PAGE**:
- Removed Edit, Trash2 icon imports (no longer needed)
- Added ContextTableActions import
- Wrapped name cell in `<Link>` with group hover styling
- Replaced 2-button actions with single ContextTableActions component
- Translation keys already existed (no new keys needed)

**UX BENEFITS**:
- **Cleaner UI**: 1 icon instead of 2-3 buttons per row
- **Mobile-friendly**: Dropdown better on touch devices than multiple icons
- **Consistent**: Identical pattern with DPIA Assessments module
- **Future-proof**: Ready for additional actions without UI clutter

**VERSION MANAGEMENT**:
- Version: 3.35.3 → 3.36.0
- `package.json` updated to 3.36.0
- Changelog entry with 6 features documented

**BUILD STATUS**: ✓ pnpm build SUCCESS - zero errors, 109 routes generated

**Git Commit:** `e0a3334`

---

### **v3.35.3 - 2026-01-24**
**🔧 FIX: DATA FLOW EDIT PAGE SERVER-SIDE FETCHING**

**PROBLEM**: 404 error when editing data flows via `/en/context/data-flows/[id]`

**ROOT CAUSE**: Edit page used client library (`getDataFlow()`) which doesn't work in server components - relative URLs fail during SSR

**FIXED**:
- Changed from client library to `ContextService` for server-side data fetching
- Pattern now matches systems, vendors, locations pages
- Server components access database via repository, no HTTP calls
- Edit page loads data flow correctly before rendering

**Files Modified:**
- `src/app/[locale]/context/data-flows/[id]/page.tsx` - Server-side fetching with ContextService
- `src/lib/version.ts` - Version 3.35.3
- `package.json` - Version 3.35.3

**Git Commit:** `9aee5c2`

---

### **v3.35.2 - 2026-01-24**
**🔧 DATABASE TYPES UPDATE**

**PROBLEM**: TypeScript build error - endpoint columns missing from database types

**ROOT CAUSE**: Migration added columns to database but `database.types.ts` wasn't updated

**FIXED**:
- Manually updated `src/lib/api/context/database.types.ts`
- Added `from_system`, `to_system`, `from_vendor`, `to_vendor` columns (string | null)
- Added `encryption_in_transit`, `cross_border_transfer` columns (boolean)
- Added foreign key relationships to systems and vendors tables
- Updated Row, Insert, and Update type definitions

**Files Modified:**
- `src/lib/api/context/database.types.ts` - Added 6 new columns
- `src/lib/version.ts` - Version 3.35.2
- `package.json` - Version 3.35.2

**Git Commit:** `191ef0a`

---

### **v3.35.1 - 2026-01-24**
**🔧 TYPESCRIPT TYPE SAFETY FIX**

**PROBLEM**: ESLint build error - "Unexpected any" in data-flows route

**ROOT CAUSE**: Query parameters cast as `any` violates ESLint rules

**FIXED**:
- Imported `FlowDirection`, `Criticality`, `EntityStatus` types
- Replaced `as any` with proper type assertions: `as FlowDirection | undefined`
- Query parameters now properly typed with undefined union types

**Files Modified:**
- `src/app/api/v1/context/data-flows/route.ts` - Type imports and assertions
- `src/lib/version.ts` - Version 3.35.1
- `package.json` - Version 3.35.1

**Git Commit:** `d4f77e6`

---

### **v3.35.0 - 2026-01-24**
**🚀 DATA FLOWS FULL DATABASE IMPLEMENTATION**

**ACHIEVEMENT**: Complete replacement of mock data with full database backend for Data Flows

**IMPLEMENTATION**:
- Created `data-flow.repository.ts` - BaseRepository extension with relations support
- Created `data-flow.service.ts` - Business logic with endpoint validation
- Added `DataFlowService` to `ContextService`
- Replaced all mock API routes with real database operations
- Created database migration: `20260124_create_data_flows_table.sql`

**Database Schema**:
- Created `data_flows` table with all columns
- Created `flow_direction` enum (inbound, outbound, bidirectional, internal)
- Endpoint columns: `from_system`, `to_system`, `from_vendor`, `to_vendor` (UUID references)
- Security columns: `encryption_in_transit`, `cross_border_transfer` (BOOLEAN)
- Indexes for multi-tenancy, foreign keys, and query optimization
- RLS policies: workspace isolation + service_role bypass
- Updated_at trigger for automatic timestamp updates

**API Updates**:
- GET `/api/v1/context/data-flows` - List flows with filters
- POST `/api/v1/context/data-flows` - Create flow
- GET `/api/v1/context/data-flows/[id]` - Get single flow
- PUT `/api/v1/context/data-flows/[id]` - Update flow
- DELETE `/api/v1/context/data-flows/[id]` - Soft delete flow

**Type Updates**:
- Updated `DataFlow`, `CreateDataFlowRequest`, `UpdateDataFlowRequest` interfaces
- Updated Zod schemas with endpoint and security validations
- Added `DataFlowQueryParams` with filter support

**Translation Keys**:
- Added 43+ translation keys for Data Flows form (EN + SK)
- Endpoint labels, direction descriptions, criticality descriptions
- Frequency/volume options, security field descriptions

**Files Created:**
- `src/lib/api/context/repositories/data-flow.repository.ts` - NEW (163 lines)
- `src/lib/api/context/services/data-flow.service.ts` - NEW (127 lines)
- `migrations/20260124_create_data_flows_table.sql` - NEW (110 lines)
- `migrations/20260124_create_data_flows_table_rollback.sql` - NEW (17 lines)

**Files Modified:**
- `src/app/api/v1/context/data-flows/route.ts` - Real database operations
- `src/app/api/v1/context/data-flows/[id]/route.ts` - Real database operations
- `src/lib/api/context/services/context.service.ts` - Added DataFlowService
- `src/lib/api/context/types.ts` - Updated DataFlow interfaces
- `src/lib/api/context/schemas.ts` - Updated Zod schemas
- `messages/en.json` - Added 43 translation keys
- `messages/sk.json` - Added 43 translation keys

**RESULT**:
- ✅ Created flows persist to database and appear in list
- ✅ Updates modify actual database records
- ✅ Deletes use soft delete pattern (deleted_at)
- ✅ Full validation with foreign key constraints
- ✅ Complete bilingual support (EN/SK)

**Git Commits:** `687ce09`, `3a79939`

---

### **v3.32.4 - 2026-01-22**
**🗑️ DELETE PLATFORM MODULES PAGE**

**CLEANUP**:
- Deleted `/help/modules/page.tsx` completely
- Route `/en/help/modules` now returns 404
- No orphaned pages remaining
- Completed cleanup from v3.32.3

**Files Modified:**
- `src/app/[locale]/help/modules/page.tsx` - DELETED (334 lines removed)
- `src/lib/version.ts` - Version 3.32.4
- `package.json` - Version 3.32.4

**Git Commit:** `69eed2d`

---

### **v3.32.3 - 2026-01-22**
**🔄 REMOVE PLATFORM MODULES OVERVIEW**

**REFACTOR**:
- Removed "Platform Modules" from Help sidebar navigation
- Deleted `modules-overview` nav item from modules.ts
- Cleaned up translation keys (EN + SK)
- Individual module help pages remain directly accessible

**Rationale**: Platform Modules overview was redundant - sidebar already lists all module help pages

**Files Modified:**
- `src/lib/state/modules.ts` - Removed modules-overview item
- `src/hooks/useTranslations.ts` - Removed EN/SK translation keys
- `src/lib/version.ts` - Version 3.32.3
- `package.json` - Version 3.32.3

**Git Commit:** `c74ab87`

---

### **v3.32.2 - 2026-01-22**
**🐛 FIX: HELP ICON DESKTOP VISIBILITY**

**PROBLEM**: Help icon still visible on desktop despite md:hidden class

**ROOT CAUSE**: Tailwind md:hidden had CSS specificity conflicts

**FIXED**:
- Changed from Tailwind class to conditional rendering with `showAsDrawer` state
- Uses existing SidebarContext for reliable desktop/mobile detection
- Help icon now properly hidden on desktop, visible only on mobile

**Files Modified:**
- `src/components/layout/modern-topbar.tsx` - Conditional rendering
- `src/lib/version.ts` - Version 3.32.2
- `package.json` - Version 3.32.2

**Git Commit:** `12ae6fe`

---

### **v3.32.1 - 2026-01-22**
**⚙️ HELP TOPBAR: UTILITY STYLING**

**REFACTOR**:
- Shortened label: "Help & Support" → "Help" (EN), "Pomoc a podpora" → "Pomoc" (SK)
- Reduced visual weight: Help tab uses muted `text-secondary` color
- Subtle active state: `border-b-2` instead of thick pill background
- Removed redundancy: Top-right help icon hidden on desktop (md:hidden)
- Mobile: Help icon still visible when tabs collapse

**Goal**: Help styled as utility, not core compliance module

**Files Modified:**
- `src/hooks/useTranslations.ts` - Shortened labels
- `src/components/layout/modern-topbar.tsx` - Conditional styling + icon hiding
- `src/lib/version.ts` - Version 3.32.1
- `package.json` - Version 3.32.1

**Git Commit:** `786a152`

---

### **v3.32.0 - 2026-01-22**
**🎨 HELP PAGE UX REFACTOR: EXECUTIVE-FRIENDLY**

**MAJOR REFACTOR**:
- Created **HelpActionBar** with search + Getting Started + Contact Support buttons
- Created **HelpStats** component - replaced debug text with stat chips (Guides: 1, Articles: 12, Languages: 2)
- Created **HelpSectionCard** - card-based layout with icons, status pills, CTAs
- Created **StatusPill** - subtle Available/Coming soon variants
- Added **client-side search** filtering by title/description
- Added **empty state** for zero search results
- Responsive layout: 2-column desktop, 1-column mobile
- Reduced vertical whitespace for better above-the-fold content

**Components Created:**
- `src/components/help/HelpActionBar.tsx`
- `src/components/help/HelpStats.tsx`
- `src/components/help/HelpSectionCard.tsx`
- `src/components/help/StatusPill.tsx`

**Files Modified:**
- `src/app/[locale]/help/page.tsx` - Complete refactor
- `src/hooks/useTranslations.ts` - Added 6 translation keys (EN + SK)
- `src/lib/version.ts` - Version 3.32.0
- `package.json` - Version 3.32.0

**Git Commit:** `e915128`

---

### **v3.31.21 - 2026-01-22**
**📚 HELP MODULE SIDEBAR NAVIGATION**

**IMPLEMENTATION**:
- Added Help module to `privacyModulesConfig` with 13 navigation items
- Created 11 placeholder help pages with HelpPlaceholder component
- Added 26 translation keys (13 EN + 13 SK)
- Help now shows module-specific sidebar instead of Privacy module items
- All placeholder pages show "Coming Soon" cards with Q2 2026 timeline

**Navigation Items:**
- Help Overview, Getting Started, GDPR Compliance, Platform Modules, Context Module, Privacy Module, Risk Module, Controls Module, Integrations Module, Trust Center, Privacy Glossary, Troubleshooting, API Documentation

**Files Modified:**
- `src/lib/state/modules.ts` - Added Help module
- `src/hooks/useTranslations.ts` - Added translation keys
- `src/components/help/HelpPlaceholder.tsx` - NEW component
- 11 placeholder pages created in `/help/*`
- `src/lib/version.ts` - Version 3.31.21
- `package.json` - Version 3.31.21

**Git Commit:** `a56b1bc`

**ROOT CAUSE**:
- `privacy.assessments` namespace missing from `/messages/*.json`
- Components used `useTranslations('privacy.assessments')` but namespace didn't exist
- Same pattern as Context module issue in v3.31.14

**FIXED**:
- Added `privacy.assessments` namespace to `/messages/en.json` and `/messages/sk.json`
- Added 23 translation keys: pageTitle, pageDescription, statusDraft, statusInProgress, statusCompleted, statusReview, statusOverdue, loading, errorTitle, tryAgain, emptyTitle, emptyDescription, startPrecheck, newDpia, overviewTitle, precheckTooltip, tableHeader* keys

**Files Modified:**
- `messages/en.json` - Added 23 English translation keys
- `messages/sk.json` - Added 23 Slovak translation keys
- `src/lib/version.ts` - Version 3.31.16
- `package.json` - Version 3.31.16

**Git Commit:** `24fde6b`

---

### **v3.31.15 - 2026-01-21**
**🎯 I18N CONSOLIDATION: SINGLE SOURCE OF TRUTH (MAJOR REFACTORING)**

**PROBLEM**: Project had TWO i18n systems causing developer confusion
- Root `/i18n/` (ACTIVE) - Used by next-intl, loads from `/messages/*.json`
- `src/i18n/` (MOSTLY DEAD) - Contained ~2000 lines of unused code
- Developers repeatedly edited wrong files (src/i18n/ instead of /messages/)

**ARCHITECTURAL CLEANUP**:
- Consolidated dual i18n systems into single root `/i18n/` location
- Created `/i18n/config.ts` (moved from `src/i18n/config.ts`)
- Created `/i18n/client-utils.ts` (extracted only 2 active functions: detectClientLocale, setClientLocale)
- Updated `tsconfig.json` with `@/i18n/*` path mapping for absolute imports
- Updated imports in `useClientLocale.ts` and `modules.ts`
- Fixed `src/middleware.ts` - Changed relative import to absolute `@/i18n/config`

**DEAD CODE DELETED** (~2000 lines, 144KB):
- `src/i18n/keys.ts` (150+ lines) - completely unused
- `src/i18n/request.ts` (20 lines) - completely unused
- `src/i18n/utils.ts` (200+ lines) - kept only 2 functions, removed rest
- `src/i18n/dictionaries/en-v2.json` (1117 lines) - never loaded
- `src/i18n/dictionaries/sk-v2.json` (1000+ lines) - never loaded
- `src/i18n/config.ts` (moved to root)

**NEW STRUCTURE**:
```
/i18n/
  ├── config.ts          # Centralized configuration
  └── client-utils.ts    # Active client functions only
/messages/
  ├── en.json           # English translations (loaded by next-intl)
  └── sk.json           # Slovak translations (loaded by next-intl)
src/hooks/
  └── useTranslations.ts # Custom hook with inline dictionaries (topbar/sidebar ONLY)
```

**LESSON LEARNED**:
- Always verify which files are actually loaded by checking import paths
- External JSON files are irrelevant if components use different sources
- Single source of truth eliminates confusion

**Files Modified:** 15 files (6 deleted, 2 created, 7 updated)
- Net reduction: 2421 lines removed, 445 lines added
- Build passes with zero errors

**Git Commit:** `39d43cd`

---

### **v3.31.14 - 2026-01-21**
**✅ CONTEXT MODULE TRANSLATION FIX - ROOT CAUSE**

**PROBLEM**: Context module list pages displaying raw translation keys
- Console error: `MISSING_MESSAGE: context.pages.systems (en)`
- User reported: "i have a lang problem in Context module position systems. I see these kind of text: context.pages.systems.description"

**ROOT CAUSE ANALYSIS**:
- v3.31.13 added keys to `/src/i18n/dictionaries/en-v2.json` (WRONG FILES - never loaded)
- App uses `./i18n/request.ts` (root) which loads from `../messages/${locale}.json`
- This was REPEAT of v3.31.8 bug - edited wrong dictionary files AGAIN

**FIXED**:
- Added `context.pages` namespace to `/messages/en.json` and `/messages/sk.json` (CORRECT FILES)
- Added all 6 Context list pages: systems, vendors, locations, dataCategories, dataFlows, processing
- Added ~150 translation keys to both languages

**Files Modified:**
- `messages/en.json` - Added context.pages namespace
- `messages/sk.json` - Added context.pages namespace
- `src/lib/version.ts` - Version 3.31.14
- `package.json` - Version 3.31.14

**Git Commit:** `8d10157`

---

### **v3.31.13 - 2026-01-21**
**❌ FAILED ATTEMPT: Wrong Dictionary Files (AGAIN)**

**PROBLEM**: v3.31.13 attempted to fix Context translation issues but edited wrong files
- Added ~150 translation keys to `src/i18n/dictionaries/en-v2.json` and `sk-v2.json`
- These files are NEVER loaded by next-intl
- Same mistake as v3.31.8 - edited src/i18n/ instead of /messages/

**ROOT CAUSE**: Confusion from dual i18n systems
- Developer didn't verify which files next-intl actually loads
- Assumed src/i18n/dictionaries/ were the active files
- Actually: next-intl loads from `/messages/*.json` only

**LESSON**: This repeated failure led to v3.31.15 i18n consolidation refactoring

**Git Commit:** (not recorded - failed deployment)

---

### **v3.31.12 - 2026-01-20**
**✅ INTEGRATIONS MODULE TRANSLATION FIX - ROOT CAUSE IDENTIFIED**

**PROBLEM**: After replacing Training module with Integrations in v3.31.0, the topbar and sidebar displayed literal translation keys (`modules.api-integrations`, `pages.api-integrations-overview`) instead of translated text ("Integrations"/"Integrácie"). All other modules (Context, Privacy, Risk, Controls, Trust Center) worked correctly.

**11 FAILED ATTEMPTS (v3.31.1 through v3.31.11)**:
- Edited `messages/*.json` files (wrong location)
- Edited `src/i18n/dictionaries/*.json` files (wrong location)
- Added cache-busting timestamps
- Renamed dictionary files (en.json → en-v2.json)
- Reordered JSON keys
- Modified i18n loader files
- Deleted conflicting config files
- Renamed module ID from 'integrations' to 'api-integrations'
All attempts edited external JSON files that were never loaded by the topbar/sidebar components.

**ROOT CAUSE DISCOVERED**:
- Topbar (`src/components/layout/modern-topbar.tsx`) and sidebar use a **CUSTOM useTranslations hook**
- Hook location: `src/hooks/useTranslations.ts` (lines 12-443)
- This custom hook has **hardcoded inline dictionaries** - does NOT load from any JSON files
- The hook is NOT using next-intl or any external translation files
- trust-center module worked because it had inline keys at lines 24, 135
- api-integrations module failed because it had NO inline keys

**FIX APPLIED**:
- Added `integrations: 'Integrations'` and `'api-integrations': 'Integrations'` to English nav.modules (line 25-26)
- Added `integrations: 'Integrácie'` and `'api-integrations': 'Integrácie'` to Slovak nav.modules (line 138-139)
- Added `'integrations-overview'` and `'api-integrations-overview'` to nav.pages for both languages
- All translations now in the ACTUAL dictionary being used by topbar/sidebar

**LESSON LEARNED**: Always trace import paths to verify which dictionary files are actually loaded by components. External JSON files are irrelevant if components use hardcoded inline dictionaries.

**Files Modified:**
- `src/hooks/useTranslations.ts` - Added missing integrations keys to inline dictionaries
- `src/lib/version.ts` - Version bump to 3.31.12
- `package.json` - Version bump to 3.31.12

**Git Commit:** `e737d0b` - Version 3.31.12 deployed to production

---

### **v3.31.0 - 2026-01-20**
**🔄 TRAINING MODULE REPLACED WITH INTEGRATIONS**

**STRATEGIC CHANGE**: Replaced Training module with Integrations module to align with platform roadmap and customer needs.

**IMPLEMENTATION**:
- Renamed `/app/[locale]/training/` directory to `/app/[locale]/integrations/`
- Updated module configuration in `src/lib/state/modules.ts`:
  - Module ID: `integrations` (later changed to `api-integrations` in v3.31.11)
  - Icon: Plug (lucide-react)
  - Color: Purple (#8B5CF6)
  - License: 'integrations'
- Created Coming Soon page at `/integrations` with feature list:
  - API keys management and access control
  - Webhooks for real-time event notifications
  - SSO/SAML integration for enterprise authentication
  - Third-party connector marketplace (Slack, Teams, JIRA)
  - Data export automation to compliance platforms
  - OAuth 2.0 for secure third-party authorization
- Updated help documentation in `/app/[locale]/help/modules/page.tsx`
- Added bilingual translations (intended - see v3.31.12 for actual fix)
- Estimated timeline: Q2 2026

**NOTE**: Translation keys initially added to external JSON files, but actual fix required in v3.31.12 (inline dictionaries).

**Files Modified:**
- `src/lib/state/modules.ts` - Module configuration change
- `src/app/[locale]/integrations/page.tsx` - NEW Coming Soon page
- `src/app/[locale]/help/modules/page.tsx` - Updated help docs
- Translation files (later fixed in v3.31.12)

---

### **v3.30.0 - 2026-01-19**
**🌐 CONTEXT LIST PAGES I18N REFACTOR COMPLETE**

**PROBLEM DISCOVERED**: User reported critical gap in v3.28.0 Context i18n refactor - list pages remained entirely in English even on Slovak URLs.

**User Report:** "čo sme vlastne prekladali. my sme neprekladali labels jednotlivych stran v context module ale iba čast vstupnych parametrov" - Translation: "what did we actually translate. we didn't translate labels of individual pages in context module but only part of input parameters."

**Confirmation:** `/sk/context/systems` displayed same English content as `/en/context/systems` - all 6 Context list pages showed English on both language URLs.

**Root Cause:** v3.28.0 refactor only covered form components (create/edit pages with /new and /[id] routes) but not list pages. Forms were bilingual but list pages were English-only.

**Implementation:**
- Created separate `context.pages` namespace to avoid conflict with existing `context.{module}` used by forms
- Added 6 sub-namespaces: systems, vendors, locations, dataCategories, dataFlows, processing
- Added ~180 total translation keys to both en.json and sk.json dictionaries
- Refactored all 6 list page components to use `useTranslations('context.pages.{module}')`

**Components Refactored:**
1. **systems/page.tsx** - Headers, search, filters, status pills, table headers, footer
2. **vendors/page.tsx** - DPA status badges, vendor counts, all UI elements
3. **locations/page.tsx** - Adequacy status, jurisdiction filters, location stats
4. **data-categories/page.tsx** - GDPR article classification, category types
5. **data-flows/page.tsx** - Flow direction, encryption status, cross-border indicators
6. **processing/page.tsx** - ROPA compliance, lawful basis, DPO review flags

**Fixes:**
- Fixed parsing error in processing/page.tsx where sed command wrapped t() calls in quotes
- Removed quotes: `'{t('adjustFilters')}'` → `t('adjustFilters')`
- All 6 pages build successfully with zero errors

**Result:**
- Context module now **fully bilingual** across both list pages AND forms
- Slovak URLs (/sk/context/*) display Slovak text throughout
- English URLs (/en/context/*) display English text throughout
- Pattern matches existing `privacy.pages` namespace structure
- Complete coverage: 6 list pages + 6 forms + 6 delete dialogs = 18 bilingual components

**Files Modified:**
- `src/i18n/dictionaries/en.json` - Added context.pages namespace (+180 keys)
- `src/i18n/dictionaries/sk.json` - Added context.pages namespace (+180 keys)
- `src/app/[locale]/context/systems/page.tsx` - Full i18n refactor
- `src/app/[locale]/context/vendors/page.tsx` - Full i18n refactor
- `src/app/[locale]/context/locations/page.tsx` - Full i18n refactor
- `src/app/[locale]/context/data-categories/page.tsx` - Full i18n refactor
- `src/app/[locale]/context/data-flows/page.tsx` - Full i18n refactor
- `src/app/[locale]/context/processing/page.tsx` - Full i18n refactor
- `src/lib/version.ts` - Version bump to 3.30.0
- `package.json` - Version bump to 3.30.0

**Git Commit:** `a9f7deb` - Version 3.30.0 deployed to production

### **v3.28.1 - 2026-01-19**
**🔧 CRITICAL HOTFIX: i18n Dictionary Location**

**Problem:** Translation keys displaying as-is on production (e.g., `context.systems.systemType`, `context.common.configuration`)

**Root Cause:** next-intl loads translations from `src/i18n/dictionaries/` not `messages/`. The v3.28.0 refactor added 310+ translation keys to wrong directory.

**Fix:**
- Copied full context namespace to `src/i18n/dictionaries/en.json` (310+ lines)
- Copied full context namespace to `src/i18n/dictionaries/sk.json` (310+ lines)
- All 6 Context modules now load proper translations in both languages
- next-intl request.ts correctly resolves: `messages: (await import(\`./dictionaries/\${locale}.json\`)).default`

**Files Modified:**
- `src/i18n/dictionaries/en.json` - Added context namespace (622 lines added)
- `src/i18n/dictionaries/sk.json` - Added context namespace (622 lines added)

**Result:** All Context forms (Systems, Vendors, Locations, Data Categories, Data Flows, Processing Activities) now display properly translated UI text instead of translation keys.

**Git Commits:**
- `8fd37eb` - Dictionary file updates
- `1635de8` - Version bump to 3.28.1

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
- ~~Hardcoded Ternary Translations~~ ✅ RESOLVED in v3.28.0 - All Context forms migrated to next-intl, 230+ ternaries eliminated
- ~~Context List Pages English-only~~ ✅ RESOLVED in v3.30.0 - All 6 Context list pages fully bilingual, 180+ translation keys added
- ~~Integrations Module Translation Keys~~ ✅ RESOLVED in v3.31.12 - Added missing keys to inline dictionary in custom useTranslations hook
- ~~Data Flows Mock Data~~ ✅ RESOLVED in v3.35.0 - Full database backend implemented with repository/service pattern

**Current Status**: All major technical debt resolved. Platform fully functional. All modules display proper translations in both English and Slovak. All 6 Context modules have complete database CRUD operations.

## Communication Style

Direct, concise, unsentimental. No praise, admiration, unnecessary positivity. No comfort, reassurance, encouragement. No friendly/warm tone. No apologies unless clear factual error. Judge ideas bluntly and logically. Truth over feelings. Clear stance, not hedged language. No compliments, "great question," "happy to help," or filler. Short sentences, plain language, zero rhetorical fluff. Priority: accuracy, clarity, candor.

## Organization Context

**avantlehq** builds privacy-first AI platforms focused on European data sovereignty and GDPR compliance.

### **Project Architecture**
1. **avantle-ai** (Marketing layer) - Domain: avantle.ai - Version: 0.4.1
2. **dpia-avantle-ai** (DPIA Application) - Domain: dpia.avantle.ai - Production ready
3. **notes-avantle-ai** (Notes Application) - Domain: notes.avantle.ai - Version: 0.1.3
4. **dpia-ai** (DPIA Marketing) - Domain: dpia.ai - Version: 1.0.4