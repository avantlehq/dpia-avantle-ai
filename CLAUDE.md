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

### **🔄 Migration Benefits**
- **Hostname**: dpia.avantle.ai môže ostať navždy
- **Rebrand**: Triviálny (len názvy, nie kód)
- **Product expansion**: Bez refaktoru (LIA, TIA, ...)
- **URL consistency**: /privacy/... naprieč všetkými assessment typmi

## Project Context: DPIA Suite (Phase 1)

**DPIA Suite** - European platform for automated GDPR Data Protection Impact Assessments with complete workflow.

**Current Status: VERSION 3.21.13 - Clean Enterprise Navigation Complete**

### Latest Achievements (December 21, 2025)
- ✅ **Clean Enterprise Topbar**: Text-only modules with proper 32px spacing (Context · Privacy · Risk · Controls · Training · Trust Center)
- ✅ **Context-Aware Navigation**: Home button routes to appropriate module overview (Privacy → /privacy, others → module overview)
- ✅ **Privacy Module Routing Fix**: DPIA Assessments → Dashboard, DPIA Builder → accessible from Dashboard
- ✅ **Breadcrumbs Enhancement**: Start with module name instead of generic "Home"
- ✅ **Version Display**: "Privacy Platform 3.21.13" visible in topbar with explicit CSS styling

### Recent Foundation Achievements  
- ✅ **Modern SaaS Navigation**: Professional flat design, action-oriented modules
- ✅ **Neutral Form Design**: Calm UI with neutral questions, indigo-500 selections, green reserved for success
- ✅ **Critical Security**: CVE-2025-55182 patched (Next.js 16.0.7), 5 repositories secured
- ✅ **Database Persistence**: Fixed RLS configuration, full end-to-end workflow working
- ✅ **Enterprise Features**: Template validation, PDF export, unified green theme

### Production Status
**URL**: https://dpia.avantle.ai - **LIVE & FULLY FUNCTIONAL**

**Core Features Complete:**
- ✅ **Assessment Creation**: Database saves + dashboard display working
- ✅ **DPIA Pre-check**: 8-question evaluation wizard 
- ✅ **DPIA Builder**: 4-section wizard with validation
- ✅ **PDF Export**: Working export functionality
- ✅ **Real-time Validation**: Professional UI panels with GDPR business logic

**Technical Stack:**
- Framework: Next.js 16.0.10 + React 19 + TypeScript
- Backend: Supabase (service role key bypassing RLS)
- Styling: Tailwind CSS + explicit CSS for reliability
- Theme: Ultra-soft RGB(25,39,52) with single blue accent
- Security: CVE-2025-55182 patched, enterprise-grade

## Enterprise Navigation Architecture

### Topbar Design Principles
- **Clean Enterprise Design**: Text-only modules, no visual chaos or floating icons
- **Proper Spacing**: 32px gaps between modules using explicit CSS (`style={{ gap: '32px' }}`)
- **Recognition Over Recall**: Active module marked with 2px blue underline, white text
- **Context-Aware Home**: Brand logo routes to appropriate module overview
- **Version Display**: "Privacy Platform X.X.X" visible for user reference

### Navigation Structure
```
Privacy Platform 3.21.13    Context · Privacy · Risk · Controls · Training · Trust Center    🌐 ❓ 👤
```

**Left**: Brand + Version (context-aware routing)  
**Center**: Text-only modules with 32px spacing  
**Right**: 3 utilities max (Language, Help, User)

### Routing Logic
- **Privacy Overview** (`/privacy`) → General privacy stats, compliance overview, quick actions
- **DPIA Assessments** (`/dashboard`) → Dashboard with existing assessments, "New Assessment" CTA
- **DPIA Builder** (`/assessments/new`) → Launched from Dashboard for assessment creation
- **Breadcrumbs**: Start with module name (Privacy > DPIA Assessments), not generic "Home"

## Design System

### Color Palette
- **Background**: RGB(25,39,52) ultra-soft dark blue
- **Categories**: Blue (Dashboard), Green (Assessment), Orange (Builder), Red (Risk), Purple (Settings)
- **Opacity Standards**: 15% (icons), 25% (hover), 30% (borders), 40% (underlines)
- **Accent Color**: Single blue-500 (#3b82f6) throughout application

### Component Patterns
- **Navigation**: Enterprise text-first design, explicit CSS for reliability
- **Forms**: Neutral questions, indigo selections (#6366f1), green reserved for success only
- **Cards**: Consistent elevation (shadow-sm hover:shadow-md), category-based left borders
- **Buttons**: Single primary CTA rule, matching backgrounds with typography hierarchy

## Form Control System

### Smart Component Selection
- **2 options**: Segmented control (Yes/No) - horizontal flex, equal width
- **3-8 options**: Pill group - flex-wrap with rounded buttons  
- **9+ options**: Searchable select dropdown

### Form Rules
- **Questions**: Always neutral muted color, never section-colored
- **Unselected**: Gray backgrounds, hover states
- **Selected**: Indigo-500 (#6366f1) only, never green/red semantics
- **Success**: Green reserved exclusively for completion states
- **Touch targets**: Minimum 48px height, proper spacing

## UX Patterns

### Primary Actions
- **Single CTA Rule**: One primary button per screen only
- **Auto-save**: Debounced 2-second saves with status indicators ("Saving..." → "Saved · just now")
- **Sticky positioning**: Primary CTA always visible at bottom
- **Visual hierarchy**: px-8 py-4, text-lg font-bold, rounded-xl, min-w-[200px]

### Navigation Standards
- **Header**: "Workspace" (not "Menu")
- **Modules**: Action-oriented names (Overview, DPIA Pre-Check, DPIA Assessments)
- **Design**: Flat, minimal, no color-coding or dividers
- **Active states**: bg-muted/50, border-l-2 border-l-indigo-500
- **Target aesthetic**: Similar to Linear/Vercel/GitHub Projects

## Database Architecture (Supabase)
- **Core Tables**: users, tenants, workspaces, assessments, assessment_answers, form_sections
- **Security**: Multi-tenant RLS isolation, service role key for write operations
- **Storage**: Supabase Storage for PDF/DOCX exports

## Functional Modules
- **DPIA Builder**: 4-section wizard with validation, risk scoring, PDF export
- **DPIA Pre-check**: 8-question evaluation with smart recommendations
- **Dashboard**: Real-time stats, assessment listing, auto-refresh

## Technical Insights

### Critical Fixes
- **DatabaseService RLS**: Fixed anon key → service role key for write operations
- **CVE-2025-55182**: Patched Next.js 16.0.1 → 16.0.7 (RCE vulnerability)
- **Application Errors**: Static server + dynamic client pattern prevents SSR crashes
- **Export System**: Fixed PDF generation with proper window.open() pattern

### Development Commands
```bash
pnpm dev              # Start dev server
pnpm build           # Build for production
pnpm lint            # Run ESLint
git add . && git commit -m "message" && git push origin main
```

### Version Management Rules
**⚠️ MANDATORY: Always update version after every deployment!**
1. Update `src/lib/version.ts` (VERSION, VERSION_NAME, CHANGELOG)
2. Update `package.json` version
3. Commit with version bump message
4. Push to production

**Local Path**: `C:\Users\rasti\Projects\avantlehq\dpia-avantle-ai\`

## Key Achievements
- ✅ **Enterprise Platform Complete**: Full DPIA workflow with validation, export, dashboard
- ✅ **Security Hardened**: CVE-2025-55182 patched, RLS configuration fixed
- ✅ **Modern UI/UX**: Professional SaaS design, neutral forms, single primary CTAs
- ✅ **Production Ready**: Live at https://dpia.avantle.ai with full database persistence