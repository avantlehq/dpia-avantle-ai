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

**Current Status: VERSION 3.21.63 - Design Token System & Production Foundation**

### Latest Achievements (December 28, 2025)
- ✅ **Design Token System**: Complete CSS variable foundation for scalable color management
- ✅ **Production Button System**: Refactored Button component using design tokens with zero visual regression
- ✅ **IconButton Component**: New reusable component with 40x40px hit area and proper accessibility
- ✅ **Consistent UI Foundation**: All interactive elements now use centralized design token system
- ✅ **Button Text Visibility**: Fixed inheritance issues ensuring white text across all button variants
- ✅ **UI Consistency**: Standardized precheck button layout and removed legacy styling inconsistencies

### Foundation Achievements  
- ✅ **Modern SaaS Navigation**: Professional text-only design, 32px spacing, context-aware routing
- ✅ **Enterprise Button Patterns**: Single primary CTA rule, micro-hierarchy, gradient styling
- ✅ **Complete Module Architecture**: 6 modules × 13 pages = fully navigable privacy platform
- ✅ **Critical Security**: CVE-2025-55182 patched (Next.js 16.0.10), production hardened
- ✅ **Database Persistence**: Fixed RLS configuration, full DPIA workflow functional

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
- Styling: Tailwind CSS + Design Token System (CSS variables)
- Theme: Production-ready token system with scalable color management
- Components: Button & IconButton with centralized styling
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
Privacy Platform 3.21.50    Context · Privacy · Risk · Controls · Training · Trust Center    🌐 ❓ 👤
```

**Left**: Brand + Version (context-aware routing)  
**Center**: Text-only modules with 32px spacing  
**Right**: 3 utilities max (Language, Help, User)

### Sidebar Design
- **Text-Only Navigation**: No icons, clean professional appearance
- **HOME Header**: Simple text with collapse button (white arrow)
- **Proper Spacing**: 20px right padding, ml-4 main content margin
- **Collapsed State**: No first letters, minimal clean design

### Routing Logic
- **Privacy Overview** (`/privacy`) → General privacy stats, compliance overview, quick actions
- **DPIA Assessments** (`/dashboard`) → Dashboard with existing assessments, "New Assessment" CTA
- **DPIA Builder** (`/assessments/new`) → Launched from Dashboard for assessment creation
- **Breadcrumbs**: Start with module name (Privacy > DPIA Assessments), not generic "Home"

## Design Token System

### Core Design Tokens (CSS Variables)
```css
/* Brand Colors */
--brand-primary: #4A90E2;             /* Primary brand color - buttons, links */
--brand-primary-hover: #3B82E7;       /* Primary hover state */
--brand-primary-active: #2563eb;      /* Primary active/pressed state */
--brand-destructive: #dc2626;         /* Error/delete actions */

/* Surface Colors */
--surface-0: #192734;                 /* App background (ultra-soft dark blue) */
--surface-1: #1F2D3A;                 /* Cards, panels, sidebar */
--surface-2: #374151;                 /* Secondary surfaces, table rows */
--surface-3: #4B5563;                 /* Tertiary surfaces, hover states */

/* Text & Borders */
--text-primary: #FFFFFF;              /* Primary text, headings */
--text-secondary: #E5E7EB;            /* Secondary text, labels */
--text-muted: #9CA3AF;                /* Muted text, placeholders */
--border-default: #4B5563;            /* Default borders, dividers */
--interactive-hover: rgba(255,255,255,0.05);  /* Hover overlay */
--focus-ring: #4A90E2;                /* Focus outline color */
```

### Component Architecture
- **Button System**: Design token-based variants (primary, secondary, ghost, outline, destructive)
- **IconButton**: Standardized 40x40px hit area with accessibility-first design
- **Navigation**: Consistent hover/active states using design tokens
- **Focus Management**: Unified focus ring using --focus-ring token
- **Zero Visual Regression**: All components maintain identical appearance

### Design Principles
- **Token-First Approach**: All colors must use CSS variables from design token system
- **Scalable Foundation**: Easy to add themes, adjust colors globally, or rebrand
- **Accessibility Maintained**: All contrast ratios and focus states preserved
- **Component Consistency**: Button and IconButton provide standardized interaction patterns

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
- **Design Token Buttons**: All buttons use CSS variables for consistent theming
- **Button Variants**: Primary (brand), secondary (surface), ghost/outline (transparent), destructive (error)
- **IconButton Standard**: 40x40px hit area with accessibility-first design
- **Micro-Hierarchy**: Consistent spacing (32px gaps) between action groups
- **Auto-save**: Debounced 2-second saves with status indicators ("Saving..." → "Saved · just now")

### Navigation Standards
- **Header**: "Workspace" (not "Menu")
- **Modules**: Action-oriented names (Overview, DPIA Pre-Check, DPIA Assessments)
- **Design**: Flat, minimal, using design tokens for consistency
- **Active states**: --text-primary, --interactive-press background
- **Hover states**: --text-muted → --text-primary, --interactive-hover background
- **Target aesthetic**: Similar to Linear/Vercel/GitHub Projects with design token foundation

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

## Component System Architecture

### Design Token-Based Button System
**Button Component** (`src/components/ui/button.tsx`) - Refactored with design tokens:

**API:**
- `variant`: "primary" | "secondary" | "ghost" | "outline" | "destructive"
- `size`: "sm" | "md" | "lg" 
- `leftIcon` / `rightIcon`: ReactNode support
- `isLoading`: Shows spinner, disables interaction
- `fullWidth`: Boolean for full-width buttons
- `asChild`: Radix Slot pattern for Link composition

**Design Token Integration:**
- **Primary**: `--brand-primary` background, `--brand-primary-hover` on hover
- **Secondary**: `--surface-2` background, `--border-default` border
- **Ghost/Outline**: Transparent with `--interactive-hover` on hover
- **Text**: All variants use `--text-primary` (white)
- **Focus**: Unified `--focus-ring` for accessibility

**IconButton Component** (`src/components/ui/icon-button.tsx`) - New addition:

**Standards:**
- **Hit Area**: Fixed 40x40px (md), 32px (sm), 48px (lg)
- **Icon Size**: Auto-calculated based on button size (16px/18px/20px)
- **Accessibility**: Required `aria-label` for all instances
- **Variants**: default, ghost, primary, destructive using design tokens

**Usage Rules:**
- **Single Primary CTA**: Only ONE primary button per screen
- **Consistent Spacing**: 32px gaps between button groups
- **Token-First**: All new components must use design token CSS variables
- **Focus rings**: 2px brand blue, offset matches dark background

### Implementation Coverage
- ✅ **Privacy Overview**: Primary "New Assessment" + Secondary "Start Pre-check"
- ✅ **Context Module**: Primary "Add Processing" + Secondary "Register System" 
- ✅ **Dashboard**: Ghost refresh button with loading states
- ✅ **Micro-hierarchy**: Outline dashed secondary helpers

## Key Achievements
- ✅ **Consistent Button System**: Unified component with variants, loading states, proper focus management
- ✅ **Enterprise Platform Complete**: Full DPIA workflow with validation, export, dashboard
- ✅ **Security Hardened**: CVE-2025-55182 patched, RLS configuration fixed
- ✅ **Modern UI/UX**: Professional SaaS design, neutral forms, single primary CTAs
- ✅ **Production Ready**: Live at https://dpia.avantle.ai with full database persistence