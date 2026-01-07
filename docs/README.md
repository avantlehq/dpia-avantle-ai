# Developer Documentation

Welcome to the Avantle Privacy Platform developer documentation. This directory contains comprehensive technical documentation for developers working on the DPIA platform.

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

**Version 3.21.150** - Context Module Database Setup COMPLETE ✅
- **Context Module Database**: Successfully applied all 9 migrations creating Context tables
- **Test Data Seeding**: Populated database with comprehensive test data (systems, vendors, locations)
- **Context API Functional**: All three core endpoints working with real database data
- **TypeScript Production Builds**: Fixed all compilation errors including spread operator assertions
- **ESLint Compliance**: Targeted disable comments for necessary 'any' types maintaining Supabase compatibility
- **Repository Pattern Optimization**: Simplified complex JOIN queries, fixed service layer issues
- **Authentication Architecture**: Service role authentication with anonymous access support

## 🤝 Contributing

All documentation follows the same principles as the codebase:
- Direct, concise communication
- Technical accuracy over verbose explanations
- Code examples with real implementation details
- Focus on practical developer needs