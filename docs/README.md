# Developer Documentation

Welcome to the Avantle Privacy Platform developer documentation. This directory contains comprehensive technical documentation for developers working on the DPIA platform.

**Latest Update (v3.25.1)**: Context Module multi-page workflow complete. All 6 sub-modules migrated from modal overlays to full-page forms with deep linking, browser navigation, and improved mobile UX.

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