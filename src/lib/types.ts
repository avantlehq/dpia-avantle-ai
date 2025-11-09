// Database Types
export interface User {
  id: string
  email: string
  created_at: string
}

export interface Tenant {
  id: string
  name: string
  created_at: string
}

export interface Workspace {
  id: string
  tenant_id: string
  name: string
  created_at: string
}

export interface Member {
  user_id: string
  workspace_id: string
  role: 'owner' | 'admin' | 'member'
  created_at: string
}

export interface Assessment {
  id: string
  workspace_id: string
  name: string
  description?: string
  status: 'draft' | 'in_progress' | 'submitted' | 'completed'
  schema_version: string
  data: AssessmentData
  created_at: string
  updated_at: string
}

export interface AssessmentData {
  identification?: ProcessingIdentification
  legal_basis?: LegalBasis
  data_types?: DataTypes
  purposes?: ProcessingPurposes
  risks?: RiskAssessment
  measures?: MitigationMeasures
  safeguards?: Safeguards
  impact?: ImpactAnalysis
  review?: ReviewData
  conclusion?: Conclusion
}

// DPIA Specific Types
export interface ProcessingIdentification {
  processing_name: string
  controller: string
  data_protection_officer?: string
  joint_controllers?: string[]
  processors?: string[]
}

export interface LegalBasis {
  lawfulness_basis: 'consent' | 'contract' | 'legal_obligation' | 'vital_interests' | 'public_task' | 'legitimate_interests'
  special_category_basis?: string
  description: string
}

export interface DataTypes {
  personal_data: string[]
  special_categories: string[]
  criminal_data: boolean
  data_sources: string[]
}

export interface ProcessingPurposes {
  primary_purpose: string
  secondary_purposes?: string[]
  data_retention: string
  international_transfers: boolean
  transfer_countries?: string[]
  transfer_safeguards?: string
}

export interface RiskAssessment {
  risks: Risk[]
  overall_risk_level: 'low' | 'medium' | 'high'
  systematic_monitoring: boolean
  large_scale_processing: boolean
  vulnerable_data_subjects: boolean
}

export interface Risk {
  id: string
  category: string
  description: string
  likelihood: 'low' | 'medium' | 'high'
  severity: 'low' | 'medium' | 'high'
  residual_risk: 'low' | 'medium' | 'high'
}

export interface MitigationMeasures {
  measures: Measure[]
}

export interface Measure {
  id: string
  title: string
  description: string
  implementation_status: 'planned' | 'in_progress' | 'completed'
  effectiveness: 'low' | 'medium' | 'high'
}

export interface Safeguards {
  technical_measures: string[]
  organizational_measures: string[]
  data_subject_rights: string[]
}

export interface ImpactAnalysis {
  impact_on_rights: string
  proportionality_assessment: string
  necessity_assessment: string
}

export interface ReviewData {
  reviewer: string
  review_date: string
  comments: string
  approved: boolean
}

export interface Conclusion {
  dpia_necessary: boolean
  consultation_required: boolean
  recommendations: string[]
  next_review_date: string
  decision: 'proceed' | 'modify' | 'reject'
}

// Domain Events
export interface DomainEvent {
  id: string
  type: string
  entity_id: string
  payload: Record<string, unknown>
  created_at: string
}

// Export Types
export interface ExportRequest {
  assessment_id: string
  format: 'pdf' | 'docx'
  locale: 'en' | 'sk' | 'de'
}

export interface ExportResult {
  id: string
  url: string
  expires_at: string
}

// Store Types
export interface AppState {
  user: User | null
  workspace: Workspace | null
  assessments: Assessment[]
  loading: boolean
  error: string | null
}

export interface AuthState {
  user: User | null
  loading: boolean
  signIn: (email: string) => Promise<void>
  signOut: () => Promise<void>
  setUser: (user: User | null) => void
}