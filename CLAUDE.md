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

**Current Version: 3.25.2 - Context Routes Fix & RLS Policies**
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
- **9+ options**: Searchable select dropdown
- **Single CTA Rule**: One primary button per screen only
- **Auto-save**: Debounced 2-second saves with status indicators

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

**Current Status**: All major technical debt resolved. Platform fully functional.

## Communication Style

Direct, concise, unsentimental. No praise, admiration, unnecessary positivity. No comfort, reassurance, encouragement. No friendly/warm tone. No apologies unless clear factual error. Judge ideas bluntly and logically. Truth over feelings. Clear stance, not hedged language. No compliments, "great question," "happy to help," or filler. Short sentences, plain language, zero rhetorical fluff. Priority: accuracy, clarity, candor.

## Organization Context

**avantlehq** builds privacy-first AI platforms focused on European data sovereignty and GDPR compliance.

### **Project Architecture**
1. **avantle-ai** (Marketing layer) - Domain: avantle.ai - Version: 0.4.1
2. **dpia-avantle-ai** (DPIA Application) - Domain: dpia.avantle.ai - Production ready
3. **notes-avantle-ai** (Notes Application) - Domain: notes.avantle.ai - Version: 0.1.3
4. **dpia-ai** (DPIA Marketing) - Domain: dpia.ai - Version: 1.0.4