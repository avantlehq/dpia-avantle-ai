# Data Model Documentation

## Database Schema (Supabase PostgreSQL)

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

This data model supports the complete DPIA workflow with multi-tenancy, flexible form templates, risk scoring, and compliance validation.