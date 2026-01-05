# DPIA Runtime Data Model

**Project:** dpia-avantle-ai  
**Type:** Execution/Runtime Application  
**Purpose:** DPIA workflow data structures and client processing

---

## Overview

This document describes the data model for the DPIA Runtime application. Unlike the Control Plane (core-avantle-ai), this application focuses on DPIA workflows, client data processing, and business functionality.

**Architecture Separation:**
- **Control Plane** (core-avantle-ai): Partners, Tenants, Users, Domains, Billing
- **Runtime Application** (dpia-avantle-ai): DPIA workflows, assessments, client data

---

## Current Data Structures

### 1. Core API Integration Types

Located in: `lib/api/core-client.ts`

#### ApiResponse<T>
```typescript
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    correlation_id: string
  }
  meta?: {
    correlation_id: string
    timestamp: string
    version: string
    pagination?: {
      total_count: number
      page: number
      page_size: number
      total_pages: number
      has_next: boolean
      has_prev: boolean
    }
  }
}
```

#### Partner (Control Plane Reference)
```typescript
interface Partner {
  id: string
  name: string
  billing_email: string
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED'
  tenant_count: number
  created_at: string
  updated_at: string
}
```

#### Tenant (Control Plane Reference)
```typescript
interface Tenant {
  id: string
  partner_id: string
  name: string
  slug: string
  tenant_type: 'UI' | 'API' | 'HYBRID'
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING'
  created_at: string
  custom_domain?: string
  partner: {
    id: string
    name: string
  }
  domains: Array<{
    id: string
    hostname: string
    status: string
  }>
}
```

#### AdminStats (Control Plane Metrics)
```typescript
interface AdminStats {
  overview: {
    total_partners: number
    total_tenants: number
    total_users: number
    total_domains: number
  }
  activity: {
    new_tenants_this_month: number
    domains_verified_today: number
    total_usage_this_month: number
  }
  top_partners: Array<{
    partner_name: string
    tenant_count: number
    total_usage: number
  }>
  recent_signups: Array<{
    tenant_name: string
    partner_name: string
    created_at: string
  }>
}
```

### 2. Authentication & Authorization

Located in: `lib/auth.ts`

#### User
```typescript
interface User {
  id: string
  email: string
  name: string
  role: 'PLATFORM_ADMIN' | 'PARTNER_ADMIN' | 'TENANT_ADMIN' | 'TENANT_USER'
}
```

#### AuthState
```typescript
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}
```

### 3. Internationalization

Located in: `lib/i18n/translations.ts`

#### Translation Interface
Contains all UI text for multi-language support (EN/SK/DE):
- Navigation elements
- Homepage content
- Feature descriptions
- Platform architecture terms
- Privacy principles
- Form labels and buttons

---

## Missing DPIA Business Data Model

### Current State
The application currently only has Control Plane integration interfaces. The actual DPIA business logic data structures are **missing** and need to be implemented.

### Required DPIA Data Structures

#### 1. DPIA Assessment
```typescript
interface DPIAAssessment {
  id: string
  tenant_id: string
  title: string
  description: string
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'APPROVED' | 'REJECTED'
  created_by: string
  created_at: string
  updated_at: string
  due_date?: string
  
  // Assessment sections
  sections: DPIASection[]
  
  // Context information
  context: DPIAContext
  
  // Risk assessment
  risks: DPIARisk[]
  
  // Mitigation measures
  mitigations: DPIAMitigation[]
  
  // Final evaluation
  conclusion: DPIAConclusion
}
```

#### 2. DPIA Context (Module to be implemented)
```typescript
interface DPIAContext {
  // Processing purpose
  purpose: string
  legal_basis: LegalBasis[]
  
  // Data subjects
  data_subjects: DataSubject[]
  
  // Personal data categories
  data_categories: DataCategory[]
  
  // Recipients
  recipients: Recipient[]
  
  // International transfers
  transfers: InternationalTransfer[]
  
  // Retention periods
  retention: RetentionPeriod[]
  
  // Processing activities
  activities: ProcessingActivity[]
}
```

#### 3. Risk Assessment
```typescript
interface DPIARisk {
  id: string
  assessment_id: string
  category: RiskCategory
  description: string
  likelihood: RiskLevel
  impact: RiskLevel
  residual_risk: RiskLevel
  mitigation_measures: string[]
}
```

---

## Implementation Plan

### Phase 1: Context Module (Current Focus)
- Implement DPIAContext data structures
- Create Context section UI components
- Add form validation and data persistence
- Integrate with tenant context

### Phase 2: Risk Assessment Module
- Implement risk identification workflows
- Create risk matrix calculations
- Add mitigation planning features

### Phase 3: Complete DPIA Workflow
- Assessment lifecycle management
- Approval workflows
- Export functionality
- Audit trail integration

---

## Data Persistence Strategy

### Client-Side (Current)
- localStorage for user preferences
- Session storage for form drafts
- No server-side persistence yet

### Future Server-Side
- Integration with tenant-specific databases
- Encrypted storage for sensitive data
- Backup and disaster recovery
- GDPR-compliant data handling

---

## Relationship to Control Plane

### Data Flow
1. **Tenant Context**: Obtained from Control Plane API
2. **User Authentication**: Validated through Control Plane
3. **DPIA Data**: Stored independently in Runtime application
4. **Usage Metrics**: Reported back to Control Plane

### Separation of Concerns
- **Control Plane**: WHO (users), WHERE (tenants), WHAT (permissions)
- **Runtime Application**: HOW (workflows), WHEN (assessments), WHY (compliance)

---

## Next Steps

1. ✅ **Document current state** - This document
2. 🔄 **Implement Context module** - Data structures and UI
3. ⏳ **Add DPIA assessment lifecycle**
4. ⏳ **Integrate risk assessment**
5. ⏳ **Add export and reporting features**

---

*This documentation will be updated as new data structures are implemented.*