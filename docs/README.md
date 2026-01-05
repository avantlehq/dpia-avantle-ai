# DPIA Runtime Documentation

**Project:** dpia-avantle-ai  
**Domain:** dpia.avantle.ai  
**Type:** Execution/Runtime Application

---

## Documentation Structure

### 📋 [Data Model](./data-model.md)
Comprehensive documentation of all data structures, interfaces, and types used in the DPIA Runtime application. Covers current Control Plane integrations and planned DPIA business logic data models.

### 🚀 Architecture Overview
**Execution/Runtime Platform for:**
- DPIA / ROPA / LIA workflows
- Client data processing and exports  
- Whitelabel partner domains
- UI for client-focused work

### 🔗 Platform Integration
**Connected to:**
- **Control Plane API** (core.avantle.ai): Authentication, tenants, partners
- **Marketing Platform** (avantle.ai): Admin console integration
- **Partner Domains**: Custom whitelabel access (e.g., gdpr.havelka.sk)

---

## Development Guidelines

### Documentation Principles
- **Separation of Concerns**: CLAUDE.md for project management, /docs for technical specifications
- **Living Documentation**: Updated with code changes and new features
- **Business Focus**: Emphasis on DPIA workflows and client data processing

### File Organization
```
docs/
├── README.md           # This overview
├── data-model.md       # Complete data model documentation
├── context-module.md   # Context module specification (planned)
├── risk-assessment.md  # Risk module specification (planned)
└── api-integration.md  # API integration patterns (planned)
```

---

## Quick Navigation

- **Project Management**: See [CLAUDE.md](../CLAUDE.md) for development workflow, version management, and project status
- **Technical Specifications**: Browse files in this /docs directory
- **Data Structures**: Start with [data-model.md](./data-model.md)

---

*This documentation directory maintains technical specifications separate from project management information in CLAUDE.md*