# Developer Documentation

Welcome to the Avantle Privacy Platform developer documentation. This directory contains comprehensive technical documentation for developers working on the DPIA platform.

**Latest Update (v3.24.202)**: Context Module ALL 6 sub-modules complete with CRUD operations (Systems, Vendors, Locations, Data Categories, Data Flows, Processing Activities). Localized assessment routes fixed.

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

**Version 3.24.202** - Context Module Complete + Route Fixes ✅
- **All 6 Context Sub-modules CRUD Complete**: Systems, Vendors, Locations, Data Categories, Data Flows, Processing Activities
- **Vendor Management**: DPA tracking, expiration monitoring, vendor role classification, jurisdiction tracking
- **Location Management**: GDPR adequacy decisions, transfer safeguards (SCCs/BCRs), data localization requirements
- **Localized Routes Fixed**: Assessment detail pages now properly support Slovak/English routes without 404 errors
- **Modal-based CRUD**: Current implementation uses overlay modals for rapid CRUD operations
- **Planned Refactoring**: Migration to multi-page workflow for improved mobile UX and deep linking (~8-10 hours)

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