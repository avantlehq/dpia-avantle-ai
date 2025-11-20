import { z } from 'zod'

// Risk assessment schema
export const riskAssessmentSchema = z.object({
  likelihood: z.number().min(1).max(5),
  impact: z.number().min(1).max(5),
  score: z.number().min(1).max(25),
  level: z.enum(['low', 'medium', 'high', 'critical']),
  description: z.string().optional(),
  mitigation: z.string().optional(),
})

// Individual field value schema - flexible for different field types
export const fieldValueSchema = z.union([
  z.string(),
  z.array(z.string()),
  z.boolean(),
  riskAssessmentSchema,
  z.object({}).passthrough(), // For complex objects
])

// Assessment answer schema
export const assessmentAnswerSchema = z.object({
  assessment_id: z.string().uuid(),
  section_id: z.string(),
  field_id: z.string(),
  value: fieldValueSchema,
  metadata: z.object({}).passthrough().optional(),
})

// Section submission schema
export const sectionSubmissionSchema = z.object({
  section_id: z.string(),
  answers: z.record(z.string(), fieldValueSchema),
})

// Assessment creation schema
export const createAssessmentSchema = z.object({
  name: z.string().min(1, 'Assessment name is required').max(200),
  description: z.string().optional(),
  template_version: z.string().default('dpia-basic-eu-v1'),
})

// Assessment update schema  
export const updateAssessmentSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  status: z.enum(['draft', 'in_progress', 'in_review', 'submitted', 'completed']).optional(),
})

// Context & Scope section schema
export const contextScopeSchema = z.object({
  project_name: z.string().min(1, 'Project name is required'),
  description: z.string().min(1, 'Description is required'),
  data_controller: z.string().min(1, 'Data controller is required'),
  data_processor: z.string().optional(),
  processing_purpose: z.string().min(1, 'Processing purpose is required'),
  data_categories: z.array(z.string()).min(1, 'Select at least one data category'),
  data_subjects: z.array(z.string()).min(1, 'Select at least one data subject category'),
  data_volume: z.enum(['small', 'medium', 'large', 'unknown']),
})

// Legal Basis section schema
export const legalBasisSchema = z.object({
  lawful_basis: z.enum(['consent', 'contract', 'legal_obligation', 'vital_interests', 'public_task', 'legitimate_interests']),
  lawful_basis_details: z.string().min(1, 'Lawful basis details are required'),
  special_category_basis: z.enum(['none', 'explicit_consent', 'employment', 'vital_interests', 'public_health', 'research', 'other']).optional(),
  data_minimization: z.string().min(1, 'Data minimization measures are required'),
  retention_period: z.string().min(1, 'Retention period is required'),
  international_transfers: z.enum(['none', 'adequacy', 'safeguards', 'derogations']),
})

// Risk Factors section schema
export const riskFactorsSchema = z.object({
  risk_systematic_monitoring: riskAssessmentSchema,
  risk_large_scale: riskAssessmentSchema,
  risk_vulnerable_subjects: riskAssessmentSchema,
  risk_innovative_tech: riskAssessmentSchema,
  risk_automated_decisions: riskAssessmentSchema,
  additional_risks: z.string().optional(),
  mitigation_measures: z.string().min(1, 'Mitigation measures are required'),
})

// Complete DPIA schema (all sections)
export const dpiaFormSchema = z.object({
  context_scope: contextScopeSchema,
  legal_basis: legalBasisSchema,
  risk_factors: riskFactorsSchema,
})

// Types
export type RiskAssessment = z.infer<typeof riskAssessmentSchema>
export type FieldValue = z.infer<typeof fieldValueSchema>
export type AssessmentAnswer = z.infer<typeof assessmentAnswerSchema>
export type SectionSubmission = z.infer<typeof sectionSubmissionSchema>
export type CreateAssessment = z.infer<typeof createAssessmentSchema>
export type UpdateAssessment = z.infer<typeof updateAssessmentSchema>
export type ContextScope = z.infer<typeof contextScopeSchema>
export type LegalBasis = z.infer<typeof legalBasisSchema>
export type RiskFactors = z.infer<typeof riskFactorsSchema>
export type DPIAForm = z.infer<typeof dpiaFormSchema>

// Field type definitions for template
export type FieldType = 
  | 'text'
  | 'textarea' 
  | 'select'
  | 'radio'
  | 'checkboxGroup'
  | 'riskAssessment'
  | 'boolean'

export interface FieldOption {
  value: string
  label: string
  description?: string
}

export interface FormField {
  id: string
  label: string
  type: FieldType
  required: boolean
  placeholder?: string
  description?: string
  options?: FieldOption[]
  riskFactors?: string[]
}

export interface FormSection {
  id: string
  title: string
  description: string
  order: number
  fields: FormField[]
}

export interface DPIATemplate {
  template: {
    id: string
    name: string
    description: string
    version: string
    sections: FormSection[]
    riskAssessmentScale: {
      likelihood: Array<{
        value: number
        label: string
        description: string
      }>
      impact: Array<{
        value: number
        label: string
        description: string
      }>
    }
  }
}

// Assessment status types
export type AssessmentStatus = 'draft' | 'in_progress' | 'in_review' | 'submitted' | 'completed'
export type SectionStatus = 'not_started' | 'in_progress' | 'completed'

// Database types
export interface Assessment {
  id: string
  workspace_id: string
  name: string
  description?: string
  status: AssessmentStatus
  template_version: string
  data: Record<string, any>
  created_by: string
  submitted_at?: string
  created_at: string
  updated_at: string
}

export interface FormSectionProgress {
  id: string
  assessment_id: string
  section_id: string
  status: SectionStatus
  completion_percent: number
  last_updated: string
}