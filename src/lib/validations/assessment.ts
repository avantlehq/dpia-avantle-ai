import { z } from 'zod'

export const assessmentSchema = z.object({
  name: z.string().min(1, 'Assessment name is required').max(255),
  description: z.string().optional(),
  workspace_id: z.string().uuid('Invalid workspace ID'),
  data: z.record(z.string(), z.unknown()).optional().default({})
})

export const processingIdentificationSchema = z.object({
  processing_name: z.string().min(1, 'Processing name is required'),
  controller: z.string().min(1, 'Controller is required'),
  data_protection_officer: z.string().optional(),
  joint_controllers: z.array(z.string()).optional(),
  processors: z.array(z.string()).optional()
})

export const legalBasisSchema = z.object({
  lawfulness_basis: z.enum(['consent', 'contract', 'legal_obligation', 'vital_interests', 'public_task', 'legitimate_interests']),
  special_category_basis: z.string().optional(),
  description: z.string().min(1, 'Legal basis description is required')
})

export const dataTypesSchema = z.object({
  personal_data: z.array(z.string()).min(1, 'At least one personal data type is required'),
  special_categories: z.array(z.string()),
  criminal_data: z.boolean(),
  data_sources: z.array(z.string())
})

export const riskSchema = z.object({
  id: z.string(),
  category: z.string(),
  description: z.string(),
  likelihood: z.enum(['low', 'medium', 'high']),
  severity: z.enum(['low', 'medium', 'high']),
  residual_risk: z.enum(['low', 'medium', 'high'])
})

export const riskAssessmentSchema = z.object({
  risks: z.array(riskSchema),
  overall_risk_level: z.enum(['low', 'medium', 'high']),
  systematic_monitoring: z.boolean(),
  large_scale_processing: z.boolean(),
  vulnerable_data_subjects: z.boolean()
})

export const measureSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  implementation_status: z.enum(['planned', 'in_progress', 'completed']),
  effectiveness: z.enum(['low', 'medium', 'high'])
})

export const mitigationMeasuresSchema = z.object({
  measures: z.array(measureSchema)
})

export const exportRequestSchema = z.object({
  assessment_id: z.string().uuid('Invalid assessment ID'),
  format: z.enum(['pdf', 'docx']),
  locale: z.enum(['en', 'sk', 'de']).optional().default('en')
})