# Developer Documentation

Welcome to the Avantle Privacy Platform developer documentation. This directory contains comprehensive technical documentation for developers working on the DPIA platform.

**Latest Update (v3.30.0)**: Context module list pages i18n refactor complete. All 6 Context list pages now fully bilingual (Slovak/English). Added ~180 translation keys to context.pages namespace.

## 📁 Documentation Structure

### Core Documentation
- **[Design System](./design-system.md)** - Complete design token system, component library, and UI patterns
- **[Architecture](./architecture.md)** - System architecture, module structure, and technical decisions
- **[Data Model](./data-model.md)** - Database schema, entity relationships, and data flow
- **[Database Schema Diagrams](./data-model-mermaid.md)** - Interactive Mermaid.js ER diagrams and comprehensive data dictionary
- **[API Reference](./api-reference.md)** - REST endpoints, authentication, and integration patterns

### Development Guides
- **[Getting Started](./getting-started.md)** - Setup, installation, and first contribution
- **[Component Guidelines](./component-guidelines.md)** - Component creation patterns and best practices
- **[Theme System](./theme-system.md)** - Dark/light themes, design tokens, and styling approach
- **[Internationalization](./i18n.md)** - Slovak/English bilingual support and translation workflow

### Feature Documentation
- **[DPIA Workflow](./dpia-workflow.md)** - Complete DPIA assessment process and validation
- **[Navigation System](./navigation-system.md)** - Module structure, routing, and breadcrumbs
- **[Form System](./form-system.md)** - Dynamic form generation, validation, and submission
- **[Export System](./export-system.md)** - PDF/DOCX generation and document templates

## 🚀 Quick Start

1. Read [Getting Started](./getting-started.md) for setup instructions
2. Review [Design System](./design-system.md) for UI development
3. Check [Architecture](./architecture.md) for system understanding
4. Explore [Data Model](./data-model.md) for database interactions

## 📋 Recent Updates

**Version 3.30.0** - Context List Pages i18n Refactor Complete ✅
- **Complete Bilingual Support**: All 6 Context module list pages now fully bilingual (Slovak/English)
- **Translation Namespace**: Added context.pages namespace with 6 sub-namespaces (~180 translation keys)
- **Pages Refactored**: systems, vendors, locations, data-categories, data-flows, processing list pages
- **Critical Gap Fixed**: v3.28.0 only translated forms, v3.30.0 completes list pages
- **Slovak URLs Work**: /sk/context/* now displays Slovak text throughout (was English-only)
- **Components Updated**: Headers, filters, status pills, table headers, empty states, footers
- **Pattern Consistency**: useTranslations('context.pages.{module}') matches privacy.pages pattern
- **Full Coverage**: Context module now 100% bilingual (18 components: 6 list pages + 6 forms + 6 dialogs)

**Version 3.29.0** - Privacy Module i18n Refactor Complete ✅
- **Privacy Module Bilingual**: Eliminated 44 hardcoded ternary translations across Privacy module
- **Components Refactored**: assessments-table.tsx, privacy/page.tsx, assessments/page.tsx
- **Translation Namespaces**: Added privacy.assessments and privacy.overview namespaces
- **Server/Client Components**: Server components use getTranslations(), client use useTranslations()
- **Status Labels**: All assessment statuses (Drafts, Overdue, Completed, In Progress) translated
- **Quick Actions**: DPIA, LIA, TIA action labels fully localized

**Version 3.28.0** - Context Forms i18n Refactor Complete ✅
- **Context Forms Bilingual**: Eliminated 230+ hardcoded ternary translations across all Context forms
- **Forms Refactored**: LocationForm, VendorForm, SystemForm, DataCategoryForm, DataFlowForm, ProcessingActivityForm
- **Translation Namespaces**: Added context.common and 6 module-specific namespaces
- **Delete Dialogs**: All 6 delete confirmation dialogs fully translated
- **Architecture Pattern**: useLocale() for routing, useTranslations() for UI text
- **Zero Locale Props**: Cleaner component APIs without locale prop passing

**Version 3.25.2** - Context Routes Fix & RLS Policies ✅
- **Next.js 15+ Compatibility**: Fixed all Context module routes to use async params (Promise<{ locale: string }>)
- **Routing Fix**: Resolved 404 errors on all Context /new routes (systems, vendors, locations, data-categories, data-flows, processing)
- **Edit Pages Fix**: Updated all [id] edit pages with async params
- **Database Schema**: Added audit columns (created_by, updated_by, deleted_at) to systems table
- **RLS Policies**: Fixed Row Level Security to allow service_role bypass for API operations
- **API Functionality**: POST /api/v1/context/systems now works correctly
- **Production Tested**: System creation tested and working on production

**Version 3.25.1** - Build Fixes & Production Ready ✅
- **TypeScript Compliance**: Fixed 6 interface type errors across Context client library
- **ESLint Compliance**: Escaped apostrophes in 10 not-found.tsx files
- **React Compliance**: Fixed async client component error in assessment page
- **Build Status**: ✓ Compiled successfully with zero errors and warnings
- **Production Deployment**: All code quality checks passing

**Version 3.25.0** - Context Module Multi-page Workflow ✅
- **Architecture Transformation**: Migrated all 6 Context sub-modules from modal overlays to multi-page forms
- **Deep Linking**: Share direct URLs (e.g., /en/context/systems/abc-123)
- **Browser Navigation**: Back button works correctly across all Context forms
- **Mobile UX**: Full-page forms provide superior mobile experience
- **Client Library**: Type-safe fetch wrappers in src/lib/context/ for all modules
- **Shared Components**: ContextFormShell for consistent form layout
- **Route Structure**: Consistent /[module]/new and /[module]/[id] pattern
- **Technical Debt Resolved**: Eliminated all modal UX limitations from v3.24.x

**Version 3.21.178** - Unified Platform Overview Architecture
- **Platform Dashboard**: Single source management overview with 92% compliance score visibility
- **Compliance Methodology Center**: Transparent calculation formula with weighted scoring framework
- **Weighted Formula Documentation**: Context(25%) + Privacy(30%) + Risk(20%) + Controls(15%) + Training(10%)

## 🤝 Contributing

All documentation follows the same principles as the codebase:
- Direct, concise communication
- Technical accuracy over verbose explanations
- Code examples with real implementation details
- Focus on practical developer needs