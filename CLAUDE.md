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

**Current Version: 3.24.199 - Context Module CRUD Implementation COMPLETE**
**URL**: https://dpia.avantle.ai - **LIVE & FULLY FUNCTIONAL**

### ✅ **Core Features Complete**
- **Context Module CRUD**: Complete CRUD operations for Systems, Data Categories, Data Flows with professional modal system
- **Data Flow Mapping**: GDPR compliance tracking, encryption monitoring, cross-border transfer detection
- **GDPR Compliance**: Article 6 & 9 data classification, ROPA management, adequacy decisions
- **Context API Endpoints**: All functional - `/api/v1/context/{systems,vendors,locations,data-flows,data-categories,processing-activities}`
- **DPIA Workflow**: Pre-check (8 questions) + Builder (4 sections) + PDF export
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
Privacy Platform 3.24.199    Context · Privacy · Risk · Controls · Training · Trust Center    🌐 ❓ 👤
```

**Module Overview:**
- **Context Module** ✅ - Data inventory, systems, flows, vendors (complete CRUD)
- **Privacy Module** ✅ - DPIA, LIA, TIA assessments (DPIA complete)
- **Risk Module** 🔄 - Risk management and scoring (UI complete)
- **Controls Module** 🔄 - Security controls and measures (UI complete)
- **Training Module** 🔄 - Staff training and awareness (UI complete)
- **Trust Center** ✅ - Governance and audit documentation

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

### **Professional Modal System**
- **DataFlowModal**: Flow direction, endpoints, encryption, cross-border tracking
- **DataCategoryModal**: GDPR Article 6 & 9 classification with legal basis validation
- **SystemModal**: System types, criticality, ownership tracking
- **Delete Dialogs**: GDPR-specific warnings about data lineage impact

### **Form Control Rules**
- **2 options**: Segmented control (Yes/No)
- **3-8 options**: Pill group with rounded buttons  
- **9+ options**: Searchable select dropdown
- **Single CTA Rule**: One primary button per screen only
- **Auto-save**: Debounced 2-second saves with status indicators

## Database Architecture

### **Context Module Tables (✅ COMPLETE CRUD)**
- **Systems**: IT systems with criticality tracking and ownership
- **Data Categories**: GDPR Article 6 & 9 classification with hierarchy support
- **Data Flows**: Flow mapping with encryption and cross-border monitoring
- **Vendors**: Third-party processors with DPA compliance tracking
- **Processing Activities**: ROPA compliance with Article 30 requirements
- **Locations**: Physical locations with jurisdiction adequacy decisions

**Security**: Multi-tenant RLS isolation, service role authentication
**Storage**: Supabase Storage for PDF/DOCX exports

## Development Workflow

### **Version Management (MANDATORY)**
ALWAYS update version after every deployment:
1. Update `src/lib/version.ts` (VERSION, VERSION_NAME, CHANGELOG)
2. Update `package.json` version
3. Commit with version bump message
4. Push to trigger automatic deployment

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

## Communication Style

Direct, concise, unsentimental. No praise, admiration, unnecessary positivity. No comfort, reassurance, encouragement. No friendly/warm tone. No apologies unless clear factual error. Judge ideas bluntly and logically. Truth over feelings. Clear stance, not hedged language. No compliments, "great question," "happy to help," or filler. Short sentences, plain language, zero rhetorical fluff. Priority: accuracy, clarity, candor.

## Organization Context

**avantlehq** builds privacy-first AI platforms focused on European data sovereignty and GDPR compliance.

### **Project Architecture**
1. **avantle-ai** (Marketing layer) - Domain: avantle.ai - Version: 0.4.1
2. **dpia-avantle-ai** (DPIA Application) - Domain: dpia.avantle.ai - Production ready
3. **notes-avantle-ai** (Notes Application) - Domain: notes.avantle.ai - Version: 0.1.3
4. **dpia-ai** (DPIA Marketing) - Domain: dpia.ai - Version: 1.0.4