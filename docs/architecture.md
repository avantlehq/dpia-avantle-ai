# Architecture Documentation

## System Overview

Avantle Privacy Platform is a Next.js 16 application built for European GDPR compliance with automated DPIA assessments.

### Technology Stack
- **Framework**: Next.js 16.1.1 with React 19 + TypeScript
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Styling**: Tailwind CSS + Design Token System
- **Authentication**: Supabase Auth with Row Level Security
- **Forms**: React Hook Form + Zod validation
- **Internationalization**: next-intl (Slovak/English)
- **Theme**: next-themes (Dark/Light mode)
- **Deployment**: Vercel with automated CI/CD

## Application Architecture

### Modular Structure
```
/src
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalization routes
│   ├── api/               # API endpoints
│   └── globals.css        # Design tokens + Tailwind
├── components/            # Reusable UI components  
│   ├── ui/               # Base design system
│   ├── assessment/       # DPIA-specific components
│   ├── navigation/       # Topbar, sidebar, breadcrumbs
│   └── validation/       # Form validation components
├── lib/                  # Utilities and services
│   ├── database/        # Supabase client and services
│   ├── validation/      # Form validation logic
│   └── exports/         # PDF/DOCX generation
└── docs/                # Developer documentation
```

### Module System
```
Privacy Platform
├── Context Module        # Data inventory and processing context
├── Privacy Module       # DPIA, LIA, TIA assessments
├── Risk Module         # Risk management and scoring
├── Controls Module     # Security controls and measures
├── Training Module     # Staff training and awareness
└── Trust Center       # Governance and audit trails
```

## Component Architecture

### Design System Hierarchy
```
Design Tokens (CSS Variables)
├── Base UI Components (/components/ui/)
│   ├── Button, Input, Select, Card
│   ├── Form, Dialog, Progress
│   └── ThemeProvider, ThemeToggle
├── Feature Components (/components/assessment/)
│   ├── DynamicFormGenerator
│   ├── WizardNavigation  
│   ├── AssessmentCard
│   └── RiskScoreDisplay
└── Layout Components (/components/navigation/)
    ├── Topbar with ModuleNavigation
    ├── ModernSidebar with collapse
    └── Breadcrumbs (context-aware)
```

### Form System Architecture
```
JSON Template → DynamicFormGenerator → React Hook Form → Zod Validation → Supabase Storage
```

**Flow:**
1. JSON templates define form structure in `form_sections` table
2. `DynamicFormGenerator` renders forms from JSON templates
3. React Hook Form handles state and user interaction
4. Zod schemas provide type-safe validation
5. `DatabaseService` persists answers to `assessment_answers`

## Navigation Architecture

### Three-Layer Navigation
```
Topbar (Global)
├── Brand + Version
├── Module Navigation (Context, Privacy, Risk, Controls, Training, Trust Center)
└── Utilities (Theme, Language, User)

Sidebar (Module-specific)
├── Module Overview
├── Feature Pages
└── Settings/Configuration

Breadcrumbs (Contextual)
└── Module > Feature > Sub-page
```

### Responsive Behavior
- **Desktop**: Sidebar docked, breadcrumbs visible
- **Tablet**: Sidebar collapsible, breadcrumbs condensed
- **Mobile**: Sidebar as overlay drawer, breadcrumbs minimal

## Theme System Architecture

### Design Token Foundation
```css
/* Light Theme */
:root {
  --surface-0: #ffffff;
  --text-primary: #1e293b;
  --brand-primary: #3b82f6;
}

/* Dark Theme */
.dark {
  --surface-0: #0f1419;
  --text-primary: #f7fafc;
  --brand-primary: #3b82f6;
}
```

### Theme Implementation
```
ThemeProvider (next-themes)
├── CSS Variable Injection
├── System Preference Detection
├── LocalStorage Persistence
└── SSR-Safe Hydration
```

## Database Architecture

### Multi-Tenant Design
```
tenant_id (Organization)
├── workspaces (Projects)
│   ├── assessments (DPIA instances)
│   │   └── assessment_answers (Form data)
│   └── users (Team access)
└── settings (Org preferences)
```

### Data Flow
```
User Input → React Hook Form → Validation → DatabaseService → Supabase RLS → PostgreSQL
```

## Security Architecture

### Authentication & Authorization
```
Supabase Auth
├── Email/Password + Social Logins
├── JWT Token Management
├── Row Level Security (RLS)
└── Service Role for Backend Operations
```

### Data Protection
- **Encryption**: Database encryption at rest
- **Transport**: TLS 1.3 for all connections
- **Access Control**: RLS policies for tenant isolation
- **Audit Trail**: All changes logged with timestamps

## API Architecture

### REST Endpoints
```
/api/assessments/
├── GET /[id] - Fetch assessment
├── POST / - Create assessment
├── PUT /[id] - Update assessment
└── DELETE /[id] - Delete assessment

/api/export/
├── GET /?assessment_id&format=pdf
└── GET /?assessment_id&format=docx

/api/validation/
└── POST / - Validate assessment completeness
```

### Service Layer Pattern
```typescript
// Clean separation of concerns
DatabaseService → Business Logic → API Routes → Frontend Components
```

## Internationalization Architecture

### Translation System
```
next-intl
├── Locale Detection (/[locale]/ routes)
├── Message Loading (messages/sk.json, messages/en.json)  
├── Server/Client Components (useTranslations hook)
└── Fallback Handling (English default)
```

### Content Strategy
- **UI**: Fully translated (Slovak/English)
- **Legal Terms**: GDPR-compliant Slovak terminology
- **Form Templates**: Multi-language field definitions

## Build & Deployment Architecture

### CI/CD Pipeline
```
Git Push → GitHub Actions → Vercel Build → Production Deploy → Cache Invalidation
```

### Build Optimization
- **Turbopack**: Fast development builds
- **Static Generation**: ISR for assessment templates
- **Code Splitting**: Module-based chunks
- **Asset Optimization**: Image optimization, font loading

### Environment Management
```
Development (.env.local)
├── Supabase Development Project
├── Local Database
└── Development Analytics

Production (.env.production)
├── Supabase Production Project  
├── Production Database
├── CDN Assets
└── Production Analytics
```

## Performance Architecture

### Optimization Strategies
- **React.memo**: Prevent unnecessary re-renders
- **Virtualization**: Large form lists
- **Debounced Saves**: Auto-save with 2-second debounce
- **Progressive Loading**: Skeleton states during data fetching
- **Caching**: SWR for client-side caching

### Bundle Analysis
```bash
# Analyze bundle size
npm run build && npm run analyze

# Key optimizations
- Tree shaking for unused code
- Dynamic imports for heavy components
- Service worker for offline capability
```

## Error Handling Architecture

### Error Boundary System
```
Global Error Boundary
├── Network Error Recovery
├── Validation Error Display
├── Permission Error Handling
└── Development Debug Information
```

### Error Types
- **Validation Errors**: Form field validation with field-level feedback
- **Network Errors**: Retry mechanisms with exponential backoff
- **Permission Errors**: Graceful degradation with proper messaging
- **System Errors**: Error boundary capture with recovery options

## Monitoring & Analytics

### Production Monitoring
- **Error Tracking**: Automatic error reporting
- **Performance Metrics**: Core Web Vitals tracking
- **User Analytics**: Privacy-compliant usage metrics
- **Database Monitoring**: Query performance and connection health

This architecture supports the enterprise-grade privacy platform with scalability, security, and maintainability as core principles.