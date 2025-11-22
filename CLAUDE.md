# CLAUDE.md

Tento súbor poskytuje kontext pre Claude Code pri práci s DPIA Agent repozitárom.

## Kontext projektu DPIA Suite

**DPIA Suite** je európska platforma pre automatizované GDPR Data Protection Impact Assessments s kompletným workflow od pre-check až po export dokumentov.

### Aktuálny stav projektu (November 2024)

**🎯 PHASE 1B: ✅ COMPLETE - PRODUCTION READY WITH DATABASE**
- ✅ Version 2.3 deployed na https://dpia.avantle.ai
- ✅ **Real Supabase database integration** (no longer mock mode)
- ✅ Kompletný 3-sekciový DPIA Builder
- ✅ Pre-check wizard "Do I need a DPIA?" - **FIXED routing**
- ✅ Professional PDF/DOCX export system
- ✅ Onboarding flow + personalized wizard
- ✅ Risk scoring engine (likelihood × impact)
- ✅ Avantle.ai visual design branding
- ✅ CI/CD pipeline + comprehensive testing
- ✅ **6/6 test suite passing** (real database backend)

### Produktová architektúra

**A) dpia.ai — Marketing Layer** 📍 PLÁNOVANÉ
- Status: Čaká na implementáciu
- Framework: Next.js 15, Tailwind, shadcn/ui
- Účel: Lead generation, SEO, conversion

**B) dpia.avantle.ai — Application Runtime** 📍 **✅ PHASE 1C COMPLETE - PRODUCTION READY**
- **URL**: https://dpia.avantle.ai
- **Version**: 2.5 "Phase 1C Complete - Stability & Polish"
- **Framework**: Next.js 16 + App Router + TypeScript
- **Styling**: Tailwind CSS v4 + Avantle.ai dark mode + mobile responsive
- **Backend**: Supabase (real database with RLS policies)
- **Security**: AuthGuard services, defensive programming, proper error handling
- **Features**: Bulletproof DPIA Suite s Result<T> pattern a comprehensive error boundaries

### Databázová architektúra (Supabase)

**CORE TABUĽKY:**
- users
- tenants
- workspaces
- members
- assessments
- assessment_answers
- form_sections
- risk_evaluations
- export_history
- user_preferences
- (Phase 2A) tenant_branding

**Bezpečnosť:**
- Multi-tenant izolácia cez RLS
- Každý dotaz viazaný na workspace_id + tenant_id
- Supabase Storage pre PDF/DOCX

### ✅ Implementované funkčné moduly DPIA Suite

**A) DPIA Builder - ✅ HOTOVÝ**
- ✅ 3-sekciový wizard (Context & Scope, Legal Basis, Risk Factors)
- ✅ Server actions pre save/resume functionality
- ✅ Risk scoring engine (likelihood × impact)
- ✅ Professional PDF/DOCX export system
- ✅ Assessment workflow: draft → in_progress → completed
- ✅ Complete audit logging
- ✅ Multi-tenant workspace architecture
- ✅ Onboarding flow (workspace creation → first assessment)

**B) DPIA Pre-check - ✅ HOTOVÝ**
- ✅ 8-question evaluation wizard na /precheck
- ✅ Smart scoring: DPIA Required/Recommended/Not Required
- ✅ Integration s database pre history
- ✅ CTA pre "Start Full DPIA" workflow
- ✅ Professional UI s result recommendations

## 🎯 Production Status (November 22, 2024)

### ✅ COMPLETED - Phase 2A: Unified Layout Architecture
- ✅ **Production URL**: https://dpia.avantle.ai (LIVE)
- ✅ **Current Version**: 2.6 "Phase 2A - Unified Layout Architecture"
- ✅ **CI/CD**: GitHub Actions + Vercel deployment
- ✅ **Testing**: 100% clean build with no compilation errors
- ✅ **Database**: Real Supabase production backend with RLS
- ✅ **Security**: AuthGuard and AssessmentGuard services implemented
- ✅ **Error Handling**: Comprehensive Result<T> pattern with bulletproof data fetching
- ✅ **Mobile**: Responsive design improvements across all pages
- ✅ **TypeScript**: Cleanup removing unnecessary any types
- ✅ **UX**: Loading states, error boundaries, defensive programming
- ✅ **Layout System**: Complete unified architecture with navigation and responsive design

### 🔄 COMPLETED PHASES

**Phase 1C: Stability & Polish ✅ COMPLETE**
- ✅ Fixed all 500 UI errors and routing conflicts
- ✅ Implemented bulletproof fetch logic with Result<T> pattern
- ✅ Added comprehensive mobile responsiveness
- ✅ TypeScript cleanup and enhanced UX polish
- ✅ Security guards and defensive programming principles

**Phase 2A: Unified Layout Architecture ✅ COMPLETE (November 22, 2024)**
- ✅ Complete layout system (LayoutShell, Topbar, Sidebars, RightPanel)
- ✅ React Context state management for layout
- ✅ Comprehensive navigation structure for GDPR modules
- ✅ Wizard step navigation for DPIA assessments
- ✅ Radix UI components integration (scroll-area, separator, tooltip)
- ✅ Mobile-responsive design with collapsible panels
- ✅ Avantle.ai design system integration
- ✅ Retrofitted all existing pages (dashboard, precheck, onboarding)

### 🔄 NEXT PHASES

**Phase 2B: Marketing Site**
- Implement dpia.ai marketing layer
- SEO content and lead generation
- Integration with dpia.avantle.ai

**Phase 3: Advanced Features**
- Extended DPIA sections (complete 10-section wizard)
- Advanced reporting and analytics
- Whitelabel/multi-tenant customization

## ✅ Aktuálny stav repozitára (Version 2.6)

### 🎯 PHASE 2A COMPLETE - Unified Layout Architecture

**Infraštruktúra - ✅ HOTOVÉ:**
- ✅ Next.js 16 + TypeScript + Tailwind CSS v4
- ✅ Supabase complete integration + RLS policies
- ✅ Multi-tenant architektúra fully implemented
- ✅ AuthGuard & AssessmentGuard security services
- ✅ Result<T> pattern for bulletproof error handling
- ✅ Mobile-first responsive design
- ✅ Security middleware with proper headers
- ✅ GitHub Actions CI/CD pipeline
- ✅ Vercel production deployment

**Layout Architecture - ✅ HOTOVÉ (Phase 2A):**
- ✅ LayoutShell component pre unified page structure
- ✅ SidebarLeft s collapsible navigation a GDPR module routing
- ✅ Topbar s user controls, workspace switcher a theme toggle
- ✅ RightPanel s AI assistant a context-aware help
- ✅ SidebarSteps pre wizard step navigation v assessments
- ✅ React Context state management pre layout state
- ✅ Responsive mobile design s touch-optimized controls
- ✅ NavGroup a NavItem components pre modular navigation
- ✅ Radix UI primitives integration (ScrollArea, Tooltip, Separator)
- ✅ Avantle.ai design system integration throughout

**Security & Error Handling - ✅ HOTOVÉ (Phase 1C):**
- ✅ AuthGuard service pre authentication a workspace access validation
- ✅ AssessmentGuard service pre assessment-specific permissions  
- ✅ Result<T> pattern pre consistent error handling across all services
- ✅ Error boundary components (ErrorState, EmptyState, NotFoundState, UnauthorizedState)
- ✅ LoadingSkeleton components pre proper UX feedback
- ✅ Type-safe error categorization (NOT_FOUND, UNAUTHORIZED, SERVER_ERROR, VALIDATION_ERROR)
- ✅ Security middleware s basic headers a CSRF protection
- ✅ Defensive programming principles throughout codebase

**Mobile & Responsiveness - ✅ HOTOVÉ (Phase 1C):**
- ✅ Mobile-first responsive design improvements
- ✅ Responsive button layouts a proper touch targets
- ✅ Adaptive text sizing pre different screen sizes
- ✅ Mobile-optimized navigation a forms
- ✅ Table horizontal scrolling pre mobile devices
- ✅ Container spacing a padding optimized pre mobile

**UI/UX - ✅ HOTOVÉ:**
- ✅ Complete dashboard s analytics cards
- ✅ Professional onboarding wizard (3 steps)
- ✅ Assessment creation/management system
- ✅ Comprehensive wizard components
- ✅ Avantle.ai dark mode branding
- ✅ shadcn/ui + Tailwind CSS professional styling

**Database Schema - ✅ HOTOVÉ:**
- ✅ Complete multi-tenant RLS structure
- ✅ All core tables implemented and tested
- ✅ Assessment workflow with server actions
- ✅ Export history and audit logging
- ✅ Ready for production deployment

**Core Features - ✅ IMPLEMENTED:**
- ✅ **DPIA Builder** - 3-section wizard complete
- ✅ **DPIA Pre-check** - 8-question evaluation
- ✅ **Risk Scoring Engine** - likelihood × impact
- ✅ **PDF/DOCX Export** - professional document generation
- ✅ **Onboarding Flow** - personalized user journey
- ✅ **Server Actions** - real-time data management

### 🔧 Technical Implementation Details

**Current Features Working:**
1. **Homepage** (/) - Professional landing with feature overview
2. **Onboarding** (/onboarding) - 3-step personalized wizard
3. **Dashboard** (/dashboard) - Assessment management + analytics
4. **API Endpoints** - Complete REST API with health monitoring
5. **Export System** - Real PDF/DOCX generation with branding
6. **Test Suite** - 5/6 comprehensive tests passing

```
src/
  app/
    page.tsx                    # Homepage with feature overview
    onboarding/page.tsx         # 3-step onboarding wizard (LayoutShell integrated)
    dashboard/page.tsx          # Assessment management + analytics (LayoutShell integrated)
    precheck/page.tsx           # Pre-check wizard (LayoutShell integrated)
    api/                        # Complete REST API endpoints
      assessments/              # CRUD operations for assessments
      precheck/                 # Pre-check wizard scoring
      export/                   # PDF/DOCX generation
      health/                   # System monitoring
      version/                  # Version information
  components/
    layout/                     # **NEW: Unified layout architecture**
      layout-shell.tsx          # Main layout wrapper with composition patterns
      sidebar-left.tsx          # Collapsible navigation with GDPR modules
      topbar.tsx               # User controls, workspace switcher, theme toggle
      right-panel.tsx          # AI assistant and context-aware help
      sidebar-steps.tsx        # Wizard step navigation for assessments
    navigation/                 # **NEW: Modular navigation components**
      nav-group.tsx            # Navigation group wrapper
      nav-item.tsx             # Individual navigation items with state
    onboarding/                 # Onboarding wizard components
    dashboard/                  # Dashboard and assessment components
    ui/                         # shadcn/ui component library + new Radix UI components
      scroll-area.tsx          # **NEW: Radix UI ScrollArea primitive**
      separator.tsx            # **NEW: Radix UI Separator primitive**
      tooltip.tsx              # **NEW: Radix UI Tooltip primitive**
  lib/
    state/                      # **NEW: Layout state management**
      layout.tsx               # React Context for layout state
      navigation.ts            # Navigation configuration and GDPR module structure
    actions/                    # Server actions for data management
    services/                   # Database and export services
    validations/                # Zod schemas for form validation
    templates/                  # DPIA document templates
```

**Key Technologies:**
- ✅ Next.js 16 with App Router and Server Actions
- ✅ TypeScript with strict type safety
- ✅ Tailwind CSS v4 with Avantle.ai branding
- ✅ Supabase (database, auth, RLS, storage)
- ✅ React Hook Form + Zod validation
- ✅ PDF/DOCX generation (jsPDF, docx)
- ✅ GitHub Actions CI/CD + Vercel deployment
- ✅ **NEW: Radix UI primitives** (scroll-area, separator, tooltip, progress)
- ✅ **NEW: React Context** for layout state management
- ✅ **NEW: Responsive layout system** with mobile-first design

## 📋 Development Commands

```bash
# Development (from dpia-avantle-ai/)
pnpm dev              # Start dev server (http://localhost:3000)
pnpm build           # Build for production
pnpm start           # Start production server  
pnpm lint            # Run ESLint (warnings only)

# Testing
node test-application.js     # Run comprehensive test suite

# Deployment
git add . && git commit -m "message" && git push origin main
```

## 🎯 Next Steps

**Phase 2A: Unified Layout Architecture ✅ COMPLETE (November 22, 2024)**
- ✅ All layout components implemented and production-ready
- ✅ Navigation structure prepared for future GDPR compliance modules
- ✅ Mobile-responsive design with professional UX
- ✅ All existing pages retrofitted with new layout system

**Future Enhancements (Phase 2B):**
1. **Marketing Site** - Implement dpia.ai landing page
2. **Extended DPIA** - Add remaining 7 sections to wizard  
3. **Advanced Features** - Whitelabel, analytics, multi-tenant customization
4. **GDPR Modules** - Implement Risk Management, ROPA, LIA/TIA modules using new navigation structure

## ✅ Success Metrics

**Current Status: PHASE 2A COMPLETE - Unified Layout Architecture**
- ✅ All core functionality implemented and tested
- ✅ Production deployment successful
- ✅ Professional UI/UX with Avantle.ai branding
- ✅ 6/6 comprehensive tests passing
- ✅ **Real Supabase database connected and working**
- ✅ **All routing issues fixed (precheck page working)**
- ✅ **Complete layout system with unified architecture**
- ✅ **Mobile-responsive design across all pages**
- ✅ **Navigation structure ready for future GDPR modules**

The DPIA Agent is **production-ready** with unified layout architecture as a comprehensive GDPR compliance platform! 🎉

**Major Achievement**: Successfully implemented enterprise-grade layout system with React Context state management, responsive design, and modular navigation ready for future GDPR compliance modules (Risk Management, ROPA, LIA/TIA, Templates).
