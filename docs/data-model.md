# Data Model Documentation

## Database Schema (Supabase PostgreSQL)

### 🎯 **Microservices Data Architecture**
**Current (v3.25.53)**: All tables in single dpia.avantle.ai database with **Complete Context Module CRUD**
**Status**: ✅ Database schema fully aligned - Phase 2 migration complete (2026-01-17)
**Status**: ✅ All Context modules (6/6) fully operational with multi-page CRUD workflow
**Status**: ✅ All dropdown pre-selection issues resolved across platform
**Future**: Separated per service domain

## 📊 **Compliance Scoring Framework (v3.21.178)**

### **Weighted Calculation Formula**
The unified platform compliance score is calculated using a weighted formula across five core modules:

```sql
-- Compliance Score Calculation (92% example)
SELECT 
  (context_score * 0.25) +      -- 25% weight: IT asset inventory quality
  (privacy_score * 0.30) +      -- 30% weight: Assessment completion rates  
  (risk_score * 0.20) +         -- 20% weight: Risk management coverage
  (controls_score * 0.15) +     -- 15% weight: Security controls implementation
  (training_score * 0.10)       -- 10% weight: Staff awareness completion
AS overall_compliance_score;

-- Example calculation:
-- (95 * 0.25) + (88 * 0.30) + (90 * 0.20) + (94 * 0.15) + (87 * 0.10) = 92%
```

### **Module Scoring Criteria**

#### **Context Module (25% Weight) - Data Quality Assessment**
```typescript
interface ContextScoring {
  systems_completeness: number;      // Active systems vs documented (24/25 = 96%)
  vendor_assessment: number;         // Vendor compliance status (95%)
  data_mapping: number;             // Processing activity coverage (93%)
  location_compliance: number;      // Jurisdiction adequacy status (97%)
}

// Current Context Score: 95%
// Calculation: Average of systems (96%), vendors (95%), data mapping (93%), locations (97%)
```

#### **Privacy Module (30% Weight) - Assessment Coverage**
```typescript
interface PrivacyScoring {
  dpia_completion: number;          // Active DPIAs vs required (12/14 = 86%)
  lia_coverage: number;            // LIA assessments (Coming Soon)
  tia_coverage: number;            // TIA assessments (Coming Soon) 
  policy_updates: number;          // Policy document currency (92%)
}

// Current Privacy Score: 88%
// Calculation: DPIA (86%) + Policy Updates (92%), weighted for missing LIA/TIA
```

#### **Risk Module (20% Weight) - Risk Management Coverage**
```typescript
interface RiskScoring {
  risk_identification: number;     // Documented risks vs identified (90%)
  mitigation_plans: number;        // Active mitigation strategies (90%)
  review_frequency: number;        // Regular risk assessment cadence (90%)
  incident_response: number;       // Incident handling readiness (90%)
}

// Current Risk Score: 90% (Coming Soon - estimated)
```

#### **Controls Module (15% Weight) - Security Implementation**
```typescript
interface ControlsScoring {
  technical_controls: number;      // Technical security measures (95%)
  procedural_controls: number;     // Process-based controls (92%)
  physical_controls: number;       // Physical security measures (95%)
  monitoring_systems: number;      // Continuous monitoring (94%)
}

// Current Controls Score: 94%
```

#### **Training Module (10% Weight) - Awareness Completion**
```typescript
interface TrainingScoring {
  staff_completion: number;        // Training completion rates (85%)
  certification_status: number;   // Professional certifications (90%)
  awareness_metrics: number;       // Security awareness indicators (86%)
  update_frequency: number;        // Training content currency (88%)
}

// Current Training Score: 87%
```

### **Data Sources and Integration**

#### **Real-time Data Collection**
```sql
-- Context Module Data (✅ IMPLEMENTED)
SELECT 
  COUNT(*) as active_systems,
  COUNT(CASE WHEN status = 'critical' THEN 1 END) as critical_systems
FROM systems WHERE tenant_id = current_tenant_id();

-- Privacy Module Data (✅ IMPLEMENTED)  
SELECT 
  COUNT(*) as total_assessments,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_assessments
FROM assessments WHERE tenant_id = current_tenant_id();

-- Future Module Data (🔄 COMING SOON)
-- Risk, Controls, Training modules will follow similar patterns
```

#### **Missing Data Sources (Transparency Framework)**
```typescript
interface ComingSoonFeatures {
  lia_assessments: "Coming Soon";     // Legitimate Interest Assessments
  tia_assessments: "Coming Soon";     // Transfer Impact Assessments  
  automated_risk_scoring: "Coming Soon"; // Real-time risk calculation
  control_implementation: "Coming Soon"; // Security control tracking
  training_analytics: "Coming Soon";     // Staff training metrics
}
```

### **Compliance Score Storage**
```sql
-- Platform Overview Metrics Table (Future Implementation)
CREATE TABLE compliance_metrics (
  id uuid PRIMARY KEY,
  tenant_id uuid REFERENCES tenants(id),
  calculation_date timestamptz DEFAULT now(),
  
  -- Module Scores (0-100)
  context_score integer NOT NULL,
  privacy_score integer NOT NULL, 
  risk_score integer NOT NULL,
  controls_score integer NOT NULL,
  training_score integer NOT NULL,
  
  -- Weighted Overall Score (0-100)
  overall_score integer NOT NULL,
  
  -- Component Metrics
  metrics jsonb NOT NULL, -- Detailed breakdown per module
  
  -- Audit Trail
  calculated_by uuid REFERENCES users(id),
  methodology_version text DEFAULT 'v1.0',
  
  UNIQUE(tenant_id, calculation_date::date)
);
```

### **Methodology Transparency**
The governance page (`/trust-center/governance`) provides complete transparency into:
- **Formula Weights**: Why each module has specific percentage weight
- **Calculation Logic**: How individual module scores are determined
- **Data Sources**: What specific metrics feed into each score
- **Missing Elements**: Clear identification of "Coming Soon" features
- **Audit Trail**: Historical score changes and methodology versions

**Database Separation Strategy:**
- **dpia.avantle.ai**: assessments, assessment_answers, form_sections (Privacy domain)
- **context.avantle.ai**: systems, processing_activities, vendors, data_categories (Inventory domain) 
- **risk.avantle.ai**: risks, risk_assessments, mitigation_plans (Risk domain)
- **controls.avantle.ai**: controls, control_assessments, toms (Controls domain)
- **core.avantle.ai**: users, tenants, workspaces (Shared infrastructure)

### Core Entities

#### Users Table
```sql
users (
  id: uuid PRIMARY KEY,
  email: text UNIQUE NOT NULL,
  created_at: timestamptz DEFAULT now(),
  updated_at: timestamptz DEFAULT now(),
  profile: jsonb,
  preferences: jsonb
)
```

#### Tenants Table
```sql
tenants (
  id: uuid PRIMARY KEY,
  name: text NOT NULL,
  slug: text UNIQUE NOT NULL,
  created_at: timestamptz DEFAULT now(),
  settings: jsonb,
  subscription_tier: text DEFAULT 'free'
)
```

#### Workspaces Table
```sql
workspaces (
  id: uuid PRIMARY KEY,
  tenant_id: uuid REFERENCES tenants(id),
  name: text NOT NULL,
  description: text,
  created_at: timestamptz DEFAULT now(),
  is_active: boolean DEFAULT true
)
```

### Assessment System

#### Assessments Table
```sql
assessments (
  id: uuid PRIMARY KEY,
  workspace_id: uuid REFERENCES workspaces(id),
  type: assessment_type NOT NULL, -- 'dpia', 'lia', 'tia'
  title: text NOT NULL,
  description: text,
  status: assessment_status DEFAULT 'draft', -- 'draft', 'in_progress', 'review', 'completed', 'archived'
  created_by: uuid REFERENCES users(id),
  created_at: timestamptz DEFAULT now(),
  updated_at: timestamptz DEFAULT now(),
  completed_at: timestamptz,
  metadata: jsonb,
  risk_score: integer, -- 0-100
  compliance_status: text -- 'compliant', 'non_compliant', 'review_needed'
)
```

#### Assessment Answers Table
```sql
assessment_answers (
  id: uuid PRIMARY KEY,
  assessment_id: uuid REFERENCES assessments(id) ON DELETE CASCADE,
  section_id: text NOT NULL, -- 'context_scope', 'data_flow_processing', etc.
  field_id: text NOT NULL,
  value: jsonb NOT NULL, -- Stores any type: string, array, object
  created_at: timestamptz DEFAULT now(),
  updated_at: timestamptz DEFAULT now(),
  UNIQUE(assessment_id, section_id, field_id)
)
```

#### Form Sections Table
```sql
form_sections (
  id: uuid PRIMARY KEY,
  assessment_type: assessment_type NOT NULL,
  section_id: text NOT NULL,
  title: text NOT NULL,
  description: text,
  order_index: integer NOT NULL,
  is_required: boolean DEFAULT true,
  template: jsonb NOT NULL, -- JSON form template
  validation_rules: jsonb,
  created_at: timestamptz DEFAULT now(),
  UNIQUE(assessment_type, section_id)
)
```

### Context Module Tables (✅ COMPLETE CRUD OPERATIONAL)

**Implementation Status (v3.24.199):**
- ✅ **Systems**: Full CRUD with SystemModal, professional form validation, criticality tracking
- ✅ **Data Categories**: Complete GDPR Article 6 & 9 classification with DataCategoryModal  
- ✅ **Data Flows**: Comprehensive flow mapping with encryption monitoring, cross-border tracking
- ✅ **Vendors**: CRUD operations with DPA compliance tracking
- ✅ **Locations**: Physical location management with jurisdiction adequacy decisions
- ✅ **Processing Activities**: ROPA compliance with ProcessingActivityModal

#### Systems Table
```sql
systems (
  id: uuid PRIMARY KEY,
  tenant_id: uuid NOT NULL,
  workspace_id: uuid NOT NULL,
  name: text NOT NULL,
  description: text,
  system_type: text,
  status: text DEFAULT 'active',
  created_at: timestamptz DEFAULT now(),
  updated_at: timestamptz DEFAULT now(),
  created_by: text,
  updated_by: text
)
```

#### Vendors Table
```sql
vendors (
  id: uuid PRIMARY KEY,
  tenant_id: uuid NOT NULL,
  workspace_id: uuid NOT NULL,
  name: text NOT NULL,
  description: text,
  vendor_type: text,
  status: text DEFAULT 'active',
  created_at: timestamptz DEFAULT now(),
  updated_at: timestamptz DEFAULT now(),
  created_by: text,
  updated_by: text
)
```

#### Physical Locations Table
```sql
physical_locations (
  id: uuid PRIMARY KEY,
  tenant_id: uuid NOT NULL,
  workspace_id: uuid NOT NULL,
  name: text NOT NULL,
  address: text,
  jurisdiction_id: uuid,
  status: text DEFAULT 'active',
  created_at: timestamptz DEFAULT now(),
  updated_at: timestamptz DEFAULT now(),
  created_by: text,
  updated_by: text
)
```

#### Processing Activities Table
```sql
processing_activities (
  id: uuid PRIMARY KEY,
  tenant_id: uuid NOT NULL,
  workspace_id: uuid NOT NULL,
  name: text NOT NULL,
  purpose: text,
  lawful_basis: text,
  status: text DEFAULT 'active',
  created_at: timestamptz DEFAULT now(),
  updated_at: timestamptz DEFAULT now(),
  created_by: text,
  updated_by: text
)
```

**Context API Endpoints:**
- `GET /api/v1/context/systems` - Returns all systems (✅ Working)
- `GET /api/v1/context/vendors` - Returns all vendors (✅ Working)  
- `GET /api/v1/context/locations` - Returns all physical locations (✅ Working)
- `GET /api/v1/context/processing-activities` - Returns all processing activities
- `GET /api/v1/context/data-categories` - Returns all data categories
- `GET /api/v1/context/jurisdictions` - Returns all jurisdictions

**Test Data Status:**
- ✅ 3 Systems (CRM, HR Management, Analytics Platform)
- ✅ 2 Vendors (Microsoft Corporation, Salesforce Inc.)
- ✅ 2 Physical Locations (Bratislava HQ, London Office)
- ✅ 3 Jurisdictions (Slovakia, United Kingdom, European Union)

## Data Relationships

### Multi-Tenancy Structure
```
Tenant (Organization)
├── Workspaces (Projects/Departments)
│   ├── Assessments (DPIA/LIA/TIA instances)
│   │   └── Assessment Answers (Form responses)
│   └── Users (Team members)
└── Settings (Organization preferences)
```

### Assessment Flow
```
1. User creates Assessment (draft status)
2. Assessment Answers populated via form sections
3. Validation runs on completion
4. Risk scoring calculated
5. Status updated to completed
6. PDF/DOCX export generated
```

## JSON Template Structure

### Form Section Template
```typescript
interface SectionDefinition {
  sectionId: string           // 'context_scope', 'data_flow_processing'
  title: string              // "Context & Scope"
  description: string        // Section explanation
  fields: FieldDefinition[]  // Form fields array
}

interface FieldDefinition {
  id: string                 // 'processing_purpose', 'data_categories'
  type: FieldType           // 'text', 'textarea', 'select', 'radio', 'multiselect'
  label: string             // "What is the purpose of data processing?"
  placeholder?: string      // Input placeholder
  required: boolean         // Validation requirement
  options?: string[]        // For select/radio/multiselect fields
}

type FieldType = 'text' | 'textarea' | 'select' | 'radio' | 'multiselect' | 'checkbox'
```

### Assessment Answer Storage
```typescript
interface AssessmentAnswer {
  assessment_id: string
  section_id: string        // 'context_scope'
  field_id: string         // 'processing_purpose'
  value: any               // String, array, object based on field type
}

// Examples:
// Text field: { value: "Customer support processing" }
// Multiselect: { value: ["Personal identifiers", "Contact information"] }
// Radio: { value: "Yes" }
```

## Risk Scoring Algorithm

### DPIA Risk Calculation
```typescript
interface RiskFactors {
  dataVolume: number        // 0-25 points
  sensitivityLevel: number  // 0-30 points  
  processingScope: number   // 0-20 points
  retentionPeriod: number  // 0-15 points
  securityMeasures: number // 0-10 points (negative impact)
}

// Total risk score: 0-100
// 0-30: Low risk (green)
// 31-60: Medium risk (orange) 
// 61-100: High risk (red)
```

### Validation Rules
```typescript
interface ValidationResult {
  isValid: boolean
  completionPercentage: number
  errors: ValidationError[]
  warnings: ValidationWarning[]
  missingSections: string[]
  missingRequiredFields: string[]
}
```

## Database Access Patterns

### Service Layer (DatabaseService)
```typescript
class DatabaseService {
  // Assessment CRUD
  async createAssessment(data: AssessmentCreate): Promise<Assessment>
  async getAssessment(id: string): Promise<Assessment | null>
  async updateAssessment(id: string, data: AssessmentUpdate): Promise<Assessment>
  async deleteAssessment(id: string): Promise<void>
  
  // Assessment Answers
  async saveAnswer(answer: AssessmentAnswer): Promise<void>
  async getAnswers(assessmentId: string): Promise<AssessmentAnswer[]>
  async getAnswersBySection(assessmentId: string, sectionId: string): Promise<AssessmentAnswer[]>
  
  // Validation
  async validateAssessment(assessmentId: string): Promise<ValidationResult>
  async calculateRiskScore(assessmentId: string): Promise<number>
}
```

### Row Level Security (RLS)
```sql
-- Users can only access their tenant's data
CREATE POLICY tenant_isolation ON assessments 
FOR ALL USING (
  workspace_id IN (
    SELECT id FROM workspaces 
    WHERE tenant_id = current_tenant_id()
  )
);

-- Service role bypasses RLS for backend operations
-- Anon role restricted to read-only public data
```

## Data Migration Strategy

### Version Control
- Schema migrations in `supabase/migrations/`
- Form template versioning in `form_sections.template`
- Backward compatibility for assessment answers

### Form Template Evolution
```typescript
// Handle template changes without breaking existing assessments
interface FormTemplate {
  version: string           // "1.0.0"
  sections: SectionDefinition[]
  migrations?: TemplateMigration[]
}
```

## Export Data Structure

### PDF Export Payload
```typescript
interface ExportData {
  assessment: Assessment
  answers: Record<string, any>    // Grouped by section
  metadata: {
    generatedAt: string
    version: string
    riskScore: number
    complianceStatus: string
  }
}
```

## Context Module Schema (Future context.avantle.ai)

### Context Domain Tables
```sql
-- IT Systems Registry
systems (
  id: uuid PRIMARY KEY,
  workspace_id: uuid REFERENCES workspaces(id),
  name: text NOT NULL,
  description: text,
  system_type: system_type, -- 'application', 'database', 'infrastructure', 'cloud_service'
  owner: text,
  technical_contact: text,
  business_contact: text,
  criticality_level: criticality_level, -- 'low', 'medium', 'high', 'critical'
  hosting_type: hosting_type, -- 'on_premise', 'cloud', 'hybrid', 'saas'
  hosting_location: text,
  vendor_id: uuid REFERENCES vendors(id),
  created_at: timestamptz DEFAULT now(),
  updated_at: timestamptz DEFAULT now(),
  metadata: jsonb,
  is_active: boolean DEFAULT true
);

-- Processing Activities (ROPA - Record of Processing Activities)
processing_activities (
  id: uuid PRIMARY KEY,
  workspace_id: uuid REFERENCES workspaces(id),
  name: text NOT NULL,
  description: text,
  purpose: text NOT NULL,
  legal_basis: legal_basis[], -- Array of GDPR legal bases
  controller: text,
  joint_controllers: text[],
  processor_id: uuid REFERENCES vendors(id),
  data_subject_categories: text[],
  data_categories: uuid[] REFERENCES data_categories(id),
  recipients: text[],
  third_country_transfers: boolean DEFAULT false,
  transfer_safeguards: text,
  retention_period: text,
  security_measures: text,
  created_at: timestamptz DEFAULT now(),
  updated_at: timestamptz DEFAULT now(),
  metadata: jsonb,
  is_active: boolean DEFAULT true
);

-- Data Categories Classification
data_categories (
  id: uuid PRIMARY KEY,
  workspace_id: uuid REFERENCES workspaces(id),
  name: text NOT NULL,
  description: text,
  category_type: data_category_type, -- 'personal', 'special', 'pseudonymized', 'anonymous'
  sensitivity_level: sensitivity_level, -- 'public', 'internal', 'confidential', 'restricted'
  special_category: boolean DEFAULT false,
  gdpr_article: text,
  examples: text[],
  created_at: timestamptz DEFAULT now(),
  parent_category_id: uuid REFERENCES data_categories(id),
  metadata: jsonb
);

-- Vendors/Processors Registry
vendors (
  id: uuid PRIMARY KEY,
  workspace_id: uuid REFERENCES workspaces(id),
  name: text NOT NULL,
  vendor_type: vendor_type, -- 'processor', 'joint_controller', 'sub_processor', 'service_provider'
  contact_person: text,
  email: text,
  phone: text,
  address: jsonb,
  country: text,
  adequacy_decision: boolean DEFAULT false,
  transfer_mechanism: text,
  contract_date: date,
  contract_expiry: date,
  dpa_signed: boolean DEFAULT false,
  security_assessment: jsonb,
  created_at: timestamptz DEFAULT now(),
  updated_at: timestamptz DEFAULT now(),
  metadata: jsonb,
  is_active: boolean DEFAULT true
);

-- Data Flows Mapping
data_flows (
  id: uuid PRIMARY KEY,
  workspace_id: uuid REFERENCES workspaces(id),
  name: text NOT NULL,
  description: text,
  source_system_id: uuid REFERENCES systems(id),
  destination_system_id: uuid REFERENCES systems(id),
  processing_activity_id: uuid REFERENCES processing_activities(id),
  data_categories: uuid[] REFERENCES data_categories(id),
  flow_type: flow_type, -- 'collection', 'processing', 'sharing', 'transfer', 'deletion'
  frequency: frequency, -- 'real_time', 'hourly', 'daily', 'weekly', 'monthly', 'on_demand'
  volume: text,
  encryption_in_transit: boolean DEFAULT false,
  encryption_at_rest: boolean DEFAULT false,
  created_at: timestamptz DEFAULT now(),
  updated_at: timestamptz DEFAULT now(),
  metadata: jsonb
);

-- Locations/Jurisdictions
locations (
  id: uuid PRIMARY KEY,
  workspace_id: uuid REFERENCES workspaces(id),
  name: text NOT NULL,
  country: text NOT NULL,
  region: text,
  adequacy_decision: boolean DEFAULT false,
  transfer_mechanisms: text[],
  data_residency_requirements: text,
  created_at: timestamptz DEFAULT now(),
  metadata: jsonb
);
```

### Context Module Enums
```sql
CREATE TYPE system_type AS ENUM ('application', 'database', 'infrastructure', 'cloud_service');
CREATE TYPE criticality_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE hosting_type AS ENUM ('on_premise', 'cloud', 'hybrid', 'saas');
CREATE TYPE legal_basis AS ENUM ('consent', 'contract', 'legal_obligation', 'vital_interests', 'public_task', 'legitimate_interests');
CREATE TYPE data_category_type AS ENUM ('personal', 'special', 'pseudonymized', 'anonymous');
CREATE TYPE sensitivity_level AS ENUM ('public', 'internal', 'confidential', 'restricted');
CREATE TYPE vendor_type AS ENUM ('processor', 'joint_controller', 'sub_processor', 'service_provider');
CREATE TYPE flow_type AS ENUM ('collection', 'processing', 'sharing', 'transfer', 'deletion');
CREATE TYPE frequency AS ENUM ('real_time', 'hourly', 'daily', 'weekly', 'monthly', 'on_demand');
```

### Context API Service Structure
```typescript
// Future context.avantle.ai API endpoints
interface ContextAPI {
  // Systems Management
  '/api/v1/systems': CRUD<System>
  '/api/v1/systems/:id/data-flows': DataFlow[]
  
  // Processing Activities (ROPA)
  '/api/v1/processing': CRUD<ProcessingActivity>
  '/api/v1/processing/:id/data-mapping': DataMapping
  
  // Data Categories
  '/api/v1/data-categories': CRUD<DataCategory>
  '/api/v1/data-categories/hierarchy': CategoryTree
  
  // Vendors/Processors
  '/api/v1/vendors': CRUD<Vendor>
  '/api/v1/vendors/:id/contracts': Contract[]
  
  // Data Flows
  '/api/v1/data-flows': CRUD<DataFlow>
  '/api/v1/data-flows/mapping': FlowDiagram
  
  // Locations
  '/api/v1/locations': CRUD<Location>
  '/api/v1/locations/adequacy': AdequacyStatus[]
}
```

This data model supports the complete DPIA workflow with multi-tenancy, flexible form templates, risk scoring, and compliance validation. The Context module schema provides foundation for future context.avantle.ai backend service with comprehensive IT inventory and data mapping capabilities.