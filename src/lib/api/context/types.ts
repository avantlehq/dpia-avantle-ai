/**
 * Context Module - TypeScript Types
 * Generated from OpenAPI specification
 * 
 * Core types for GDPR context data management including jurisdictions,
 * locations, vendors, systems, data categories, and processing activities.
 */

// Base types
export type UUID = string;
export type Timestamp = string; // ISO 8601 datetime
export type DateOnly = string; // ISO 8601 date

// Enums
export enum LawfulBasis {
  CONSENT = 'consent',
  CONTRACT = 'contract',
  LEGAL_OBLIGATION = 'legal_obligation',
  VITAL_INTERESTS = 'vital_interests',
  PUBLIC_TASK = 'public_task',
  LEGITIMATE_INTERESTS = 'legitimate_interests',
}

export enum SpecialCategoryBasis {
  EXPLICIT_CONSENT = 'explicit_consent',
  EMPLOYMENT = 'employment',
  VITAL_INTERESTS = 'vital_interests',
  PUBLIC_INTEREST = 'public_interest',
  HEALTHCARE = 'healthcare',
  RESEARCH = 'research',
  LEGAL_CLAIMS = 'legal_claims',
}

export enum DataCategoryType {
  PERSONAL = 'personal',
  SPECIAL = 'special',
  CRIMINAL = 'criminal',
  ANONYMOUS = 'anonymous',
}

export enum DataSensitivity {
  PUBLIC = 'public',
  INTERNAL = 'internal',
  CONFIDENTIAL = 'confidential',
  RESTRICTED = 'restricted',
}

export enum EndpointType {
  API = 'api',
  DATABASE = 'database',
  FILE_SHARE = 'file_share',
  EMAIL = 'email',
  WEB_INTERFACE = 'web_interface',
  OTHER = 'other',
}

export enum VendorRole {
  PROCESSOR = 'processor',
  JOINT_CONTROLLER = 'joint_controller',
  RECIPIENT = 'recipient',
  SUB_PROCESSOR = 'sub_processor',
}

export enum TransferMechanism {
  ADEQUACY_DECISION = 'adequacy_decision',
  STANDARD_CONTRACTUAL_CLAUSES = 'standard_contractual_clauses',
  BINDING_CORPORATE_RULES = 'binding_corporate_rules',
  DEROGATION = 'derogation',
  OTHER = 'other',
}

export enum FlowDirection {
  INBOUND = 'inbound',
  OUTBOUND = 'outbound',
  BIDIRECTIONAL = 'bidirectional',
  INTERNAL = 'internal',
}

export enum EntityStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum ContractStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  TERMINATED = 'terminated',
}

export enum Criticality {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum SystemRole {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  BACKUP = 'backup',
}

// Audit fields interface
export interface AuditFields {
  created_at: Timestamp;
  updated_at: Timestamp;
  created_by: UUID;
  updated_by: UUID;
  deleted_at: Timestamp | null;
}

// Core entities
export interface Jurisdiction {
  id: UUID;
  country_code: string; // ISO 3166-1 alpha-2
  name_en: string;
  name_sk: string;
  gdpr_adequacy: boolean;
  supervisory_authority: string | null;
}

export interface PhysicalLocation extends AuditFields {
  id: UUID;
  tenant_id: UUID;
  workspace_id: UUID;
  name: string;
  description: string | null;
  address: string | null;
  city: string | null;
  jurisdiction_id: UUID;
  jurisdiction?: Jurisdiction;
  status: EntityStatus;
}

export interface VendorContract extends AuditFields {
  id: UUID;
  tenant_id: UUID;
  workspace_id: UUID;
  vendor_id: UUID;
  contract_type: string;
  reference_number: string | null;
  start_date: DateOnly;
  end_date: DateOnly | null;
  review_date: DateOnly | null;
  status: ContractStatus;
}

export interface Vendor extends AuditFields {
  id: UUID;
  tenant_id: UUID;
  workspace_id: UUID;
  name: string;
  description: string | null;
  website: string | null;
  contact_email: string | null;
  primary_contact: string | null;
  vendor_role: 'processor' | 'joint_controller' | 'recipient' | 'sub_processor';
  status: EntityStatus;
  has_dpa: boolean;
  dpa_expires: DateOnly | null;
  location: string | null;
  contracts?: VendorContract[];
  locations?: PhysicalLocation[];
}

export interface SystemEndpoint extends AuditFields {
  id: UUID;
  tenant_id: UUID;
  workspace_id: UUID;
  system_id: UUID;
  name: string;
  endpoint_type: EndpointType;
  url: string | null;
  description: string | null;
  authentication_method: string | null;
  encryption_in_transit: boolean;
  encryption_at_rest: boolean;
  status: EntityStatus;
}

export interface System extends AuditFields {
  id: UUID;
  tenant_id: UUID;
  workspace_id: UUID;
  name: string;
  description: string | null;
  system_type: string | null;
  owner_team: string | null;
  technical_contact: string | null;
  business_contact: string | null;
  criticality: Criticality | null;
  status: EntityStatus;
  endpoints?: SystemEndpoint[];
  locations?: PhysicalLocation[];
}

export interface DataCategory extends AuditFields {
  id: UUID;
  tenant_id: UUID;
  workspace_id: UUID;
  name: string;
  description: string | null;
  category_type: DataCategoryType;
  sensitivity: DataSensitivity;
  special_category_basis: SpecialCategoryBasis | null;
  is_standard: boolean;
  parent_id: UUID | null;
  parent?: DataCategory | null;
  children?: DataCategory[];
  status: EntityStatus;
}

export interface RetentionPolicy extends AuditFields {
  id: UUID;
  tenant_id: UUID;
  workspace_id: UUID;
  name: string;
  description: string | null;
  retention_period_years: number | null;
  retention_period_months: number | null;
  retention_criteria: string;
  disposal_method: string | null;
  legal_basis_for_retention: string | null;
  review_frequency_months: number;
  status: EntityStatus;
}

export interface ProcessingActivity extends AuditFields {
  id: UUID;
  tenant_id: UUID;
  workspace_id: UUID;
  name: string;
  description: string | null;
  purpose: string;
  lawful_basis: LawfulBasis;
  lawful_basis_explanation: string | null;
  data_subject_categories: string | null;
  special_category_basis: SpecialCategoryBasis | null;
  automated_decision_making: boolean;
  profiling: boolean;
  data_source: string | null;
  dpo_review_required: boolean;
  review_date: DateOnly | null;
  last_review_date: DateOnly | null;
  status: EntityStatus;
  systems?: ProcessingSystemRelation[];
  data_categories?: ProcessingDataCategoryRelation[];
  vendors?: ProcessingVendorRelation[];
  retention_policies?: ProcessingRetentionRelation[];
  data_flows?: ProcessingDataFlowRelation[];
}

export interface DataFlow extends AuditFields {
  id: UUID;
  tenant_id: UUID;
  workspace_id: UUID;
  name: string;
  description: string | null;
  purpose: string | null;
  flow_direction: FlowDirection;
  frequency: string | null;
  volume_estimate: string | null;
  criticality: Criticality | null;
  status: EntityStatus;
  edges?: DataFlowEdge[];
  data_categories?: DataCategory[];
}

export interface DataFlowEdge extends AuditFields {
  id: UUID;
  tenant_id: UUID;
  workspace_id: UUID;
  data_flow_id: UUID;
  from_system_id: UUID | null;
  from_vendor_id: UUID | null;
  to_system_id: UUID | null;
  to_vendor_id: UUID | null;
  from_system?: System | null;
  from_vendor?: Vendor | null;
  to_system?: System | null;
  to_vendor?: Vendor | null;
  edge_order: number;
  description: string | null;
  encryption_in_transit: boolean;
  authentication_required: boolean;
  status: EntityStatus;
  cross_border_transfer?: CrossBorderTransfer | null;
}

export interface CrossBorderTransfer extends AuditFields {
  id: UUID;
  tenant_id: UUID;
  workspace_id: UUID;
  data_flow_edge_id: UUID;
  exporter_jurisdiction_id: UUID;
  importer_jurisdiction_id: UUID;
  exporter_jurisdiction: Jurisdiction;
  importer_jurisdiction: Jurisdiction;
  transfer_mechanism: TransferMechanism;
  adequacy_decision_ref: string | null;
  safeguards_description: string | null;
  tia_required: boolean; // Transfer Impact Assessment
  tia_reference: string | null;
  tia_completed_date: DateOnly | null;
  derogation_justification: string | null;
  risk_assessment_completed: boolean;
  status: EntityStatus;
}

// Join table interfaces
export interface ProcessingSystemRelation {
  processing_activity_id: UUID;
  system_id: UUID;
  system: System;
  system_role: SystemRole | null;
  created_at: Timestamp;
  created_by: UUID;
}

export interface ProcessingDataCategoryRelation {
  processing_activity_id: UUID;
  data_category_id: UUID;
  data_category: DataCategory;
  necessity_justification: string | null;
  created_at: Timestamp;
  created_by: UUID;
}

export interface ProcessingVendorRelation {
  processing_activity_id: UUID;
  vendor_id: UUID;
  vendor: Vendor;
  vendor_role: VendorRole;
  contract_required: boolean;
  created_at: Timestamp;
  created_by: UUID;
}

export interface ProcessingRetentionRelation {
  processing_activity_id: UUID;
  retention_policy_id: UUID;
  retention_policy: RetentionPolicy;
  applies_to_category: string | null;
  created_at: Timestamp;
  created_by: UUID;
}

export interface ProcessingDataFlowRelation {
  processing_activity_id: UUID;
  data_flow_id: UUID;
  data_flow: DataFlow;
  flow_purpose: string | null;
  created_at: Timestamp;
  created_by: UUID;
}

// Request DTOs for API endpoints
export interface CreatePhysicalLocationRequest {
  name: string;
  description?: string;
  address?: string;
  city?: string;
  jurisdiction_id: UUID;
}

export interface UpdatePhysicalLocationRequest {
  name?: string;
  description?: string;
  address?: string;
  city?: string;
  jurisdiction_id?: UUID;
  status?: EntityStatus;
}

export interface CreateVendorRequest {
  name: string;
  description?: string;
  website?: string;
  contact_email?: string;
  primary_contact?: string;
  vendor_role?: 'processor' | 'joint_controller' | 'recipient' | 'sub_processor';
  status?: EntityStatus;
  has_dpa?: boolean;
  dpa_expires?: string;
  location?: string;
}

export interface UpdateVendorRequest {
  name?: string;
  description?: string;
  website?: string;
  contact_email?: string;
  primary_contact?: string;
  vendor_role?: 'processor' | 'joint_controller' | 'recipient' | 'sub_processor';
  status?: EntityStatus;
  has_dpa?: boolean;
  dpa_expires?: string;
  location?: string;
}

export interface CreateSystemRequest {
  name: string;
  description?: string;
  system_type?: string;
  owner_team?: string;
  technical_contact?: string;
  business_contact?: string;
  criticality?: Criticality;
}

export interface UpdateSystemRequest {
  name?: string;
  description?: string;
  system_type?: string;
  owner_team?: string;
  technical_contact?: string;
  business_contact?: string;
  criticality?: Criticality;
  status?: EntityStatus;
}

export interface CreateSystemEndpointRequest {
  name: string;
  endpoint_type: EndpointType;
  url?: string;
  description?: string;
  authentication_method?: string;
  encryption_in_transit?: boolean;
  encryption_at_rest?: boolean;
}

export interface UpdateSystemEndpointRequest {
  name?: string;
  endpoint_type?: EndpointType;
  url?: string;
  description?: string;
  authentication_method?: string;
  encryption_in_transit?: boolean;
  encryption_at_rest?: boolean;
  status?: EntityStatus;
}

export interface CreateDataCategoryRequest {
  name: string;
  description?: string;
  category_type: DataCategoryType;
  sensitivity: DataSensitivity;
  special_category_basis?: SpecialCategoryBasis;
  parent_id?: UUID;
}

export interface UpdateDataCategoryRequest {
  name?: string;
  description?: string;
  category_type?: DataCategoryType;
  sensitivity?: DataSensitivity;
  special_category_basis?: SpecialCategoryBasis;
  parent_id?: UUID;
  status?: EntityStatus;
}

export interface CreateProcessingActivityRequest {
  name: string;
  description?: string;
  purpose: string;
  lawful_basis: LawfulBasis;
  lawful_basis_explanation?: string;
  data_subject_categories?: string;
  special_category_basis?: SpecialCategoryBasis;
  automated_decision_making?: boolean;
  profiling?: boolean;
  data_source?: string;
  dpo_review_required?: boolean;
  review_date?: DateOnly;
}

export interface UpdateProcessingActivityRequest {
  name?: string;
  description?: string;
  purpose?: string;
  lawful_basis?: LawfulBasis;
  lawful_basis_explanation?: string;
  data_subject_categories?: string;
  special_category_basis?: SpecialCategoryBasis;
  automated_decision_making?: boolean;
  profiling?: boolean;
  data_source?: string;
  dpo_review_required?: boolean;
  review_date?: DateOnly;
  last_review_date?: DateOnly;
  status?: EntityStatus;
}

export interface CreateRetentionPolicyRequest {
  name: string;
  description?: string;
  retention_period_years?: number;
  retention_period_months?: number;
  retention_criteria: string;
  disposal_method?: string;
  legal_basis_for_retention?: string;
  review_frequency_months?: number;
}

export interface UpdateRetentionPolicyRequest {
  name?: string;
  description?: string;
  retention_period_years?: number;
  retention_period_months?: number;
  retention_criteria?: string;
  disposal_method?: string;
  legal_basis_for_retention?: string;
  review_frequency_months?: number;
  status?: EntityStatus;
}

export interface CreateDataFlowRequest {
  name: string;
  description?: string;
  purpose?: string;
  flow_direction: FlowDirection;
  frequency?: string;
  volume_estimate?: string;
  criticality?: Criticality;
}

export interface UpdateDataFlowRequest {
  name?: string;
  description?: string;
  purpose?: string;
  flow_direction?: FlowDirection;
  frequency?: string;
  volume_estimate?: string;
  criticality?: Criticality;
  status?: EntityStatus;
}

export interface CreateDataFlowEdgeRequest {
  data_flow_id: UUID;
  from_system_id?: UUID;
  from_vendor_id?: UUID;
  to_system_id?: UUID;
  to_vendor_id?: UUID;
  edge_order?: number;
  description?: string;
  encryption_in_transit?: boolean;
  authentication_required?: boolean;
}

export interface UpdateDataFlowEdgeRequest {
  from_system_id?: UUID;
  from_vendor_id?: UUID;
  to_system_id?: UUID;
  to_vendor_id?: UUID;
  edge_order?: number;
  description?: string;
  encryption_in_transit?: boolean;
  authentication_required?: boolean;
  status?: EntityStatus;
}

export interface CreateCrossBorderTransferRequest {
  data_flow_edge_id: UUID;
  exporter_jurisdiction_id: UUID;
  importer_jurisdiction_id: UUID;
  transfer_mechanism: TransferMechanism;
  adequacy_decision_ref?: string;
  safeguards_description?: string;
  tia_required?: boolean;
  tia_reference?: string;
  tia_completed_date?: DateOnly;
  derogation_justification?: string;
  risk_assessment_completed?: boolean;
}

export interface UpdateCrossBorderTransferRequest {
  transfer_mechanism?: TransferMechanism;
  adequacy_decision_ref?: string;
  safeguards_description?: string;
  tia_required?: boolean;
  tia_reference?: string;
  tia_completed_date?: DateOnly;
  derogation_justification?: string;
  risk_assessment_completed?: boolean;
  status?: EntityStatus;
}

// Relationship management DTOs
export interface AddSystemToProcessingRequest {
  system_id: UUID;
  system_role?: SystemRole;
}

export interface AddDataCategoryToProcessingRequest {
  data_category_id: UUID;
  necessity_justification?: string;
}

export interface AddVendorToProcessingRequest {
  vendor_id: UUID;
  vendor_role: VendorRole;
  contract_required?: boolean;
}

export interface AddRetentionPolicyToProcessingRequest {
  retention_policy_id: UUID;
  applies_to_category?: string;
}

export interface AddDataFlowToProcessingRequest {
  data_flow_id: UUID;
  flow_purpose?: string;
}

export interface AddLocationToSystemRequest {
  location_id: UUID;
}

export interface AddLocationToVendorRequest {
  location_id: UUID;
}

export interface AddDataCategoryToDataFlowRequest {
  data_category_id: UUID;
}

// List responses with pagination
export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMetadata;
}

export type JurisdictionList = PaginatedResponse<Jurisdiction>;
export type PhysicalLocationList = PaginatedResponse<PhysicalLocation>;
export type VendorList = PaginatedResponse<Vendor>;
export type SystemList = PaginatedResponse<System>;
export type DataCategoryList = PaginatedResponse<DataCategory>;
export type ProcessingActivityList = PaginatedResponse<ProcessingActivity>;
export type RetentionPolicyList = PaginatedResponse<RetentionPolicy>;
export type DataFlowList = PaginatedResponse<DataFlow>;

// Query parameters for list endpoints
export interface ListQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: EntityStatus;
}

export interface JurisdictionQueryParams extends Omit<ListQueryParams, 'status'> {
  gdpr_adequacy?: boolean;
}

export interface PhysicalLocationQueryParams extends ListQueryParams {
  jurisdiction_id?: UUID;
}

export interface SystemQueryParams extends ListQueryParams {
  criticality?: Criticality;
}

export interface DataCategoryQueryParams extends ListQueryParams {
  category_type?: DataCategoryType;
  sensitivity?: DataSensitivity;
  is_standard?: boolean;
  parent_id?: UUID;
}

export interface ProcessingActivityQueryParams extends ListQueryParams {
  lawful_basis?: LawfulBasis;
  dpo_review_required?: boolean;
  review_overdue?: boolean;
}

export interface DataFlowQueryParams extends ListQueryParams {
  flow_direction?: FlowDirection;
  criticality?: Criticality;
}

// Error types
export interface APIError {
  error: string;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: Record<string, any>;
}

export interface ValidationError extends APIError {
  fields?: Record<string, string[]>;
}

// Include options for related data
export type ProcessingActivityInclude = 'systems' | 'data_categories' | 'vendors' | 'retention_policies' | 'data_flows';
export type VendorInclude = 'contracts' | 'locations';
export type SystemInclude = 'endpoints' | 'locations';
export type DataFlowInclude = 'edges' | 'data_categories';

// Utility types
export type EntityWithRelations<T, K extends string> = T & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [P in K]?: any;
};

export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;
export type RequiredExcept<T, K extends keyof T> = Required<T> & Partial<Pick<T, K>>;

// Hook result types for React Query/SWR
export interface UseListResult<T> {
  data?: PaginatedResponse<T>;
  isLoading: boolean;
  error?: APIError;
  mutate: () => void;
}

export interface UseEntityResult<T> {
  data?: T;
  isLoading: boolean;
  error?: APIError;
  mutate: () => void;
}

// Context tenant/workspace resolution
export interface ContextClaims {
  tenant_id: UUID;
  workspace_id: UUID;
  sub: UUID; // user ID
}