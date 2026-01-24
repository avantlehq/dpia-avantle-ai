/**
 * Context Module - Zod Validation Schemas
 * 
 * Validation schemas for Context API requests and responses.
 * Used for runtime type checking and form validation.
 */

import { z } from 'zod';
import {
  LawfulBasis,
  SpecialCategoryBasis,
  DataCategoryType,
  DataSensitivity,
  EndpointType,
  VendorRole,
  TransferMechanism,
  FlowDirection,
  EntityStatus,
  ContractStatus,
  Criticality,
  SystemRole,
} from './types';

// Base schemas
const UUIDSchema = z.string().uuid();
const TimestampSchema = z.string().datetime();
const DateOnlySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

// Enum schemas
const LawfulBasisSchema = z.nativeEnum(LawfulBasis);
const SpecialCategoryBasisSchema = z.nativeEnum(SpecialCategoryBasis);
const DataCategoryTypeSchema = z.nativeEnum(DataCategoryType);
const DataSensitivitySchema = z.nativeEnum(DataSensitivity);
const EndpointTypeSchema = z.nativeEnum(EndpointType);
const VendorRoleSchema = z.nativeEnum(VendorRole);
const TransferMechanismSchema = z.nativeEnum(TransferMechanism);
const FlowDirectionSchema = z.nativeEnum(FlowDirection);
const EntityStatusSchema = z.nativeEnum(EntityStatus);
const ContractStatusSchema = z.nativeEnum(ContractStatus);
const CriticalitySchema = z.nativeEnum(Criticality);
const SystemRoleSchema = z.nativeEnum(SystemRole);

// Country code validation (ISO 3166-1 alpha-2)
const CountryCodeSchema = z.string().length(2).regex(/^[A-Z]{2}$/);

// Email validation
const EmailSchema = z.string().email();

// URL validation
const UrlSchema = z.string().url();

// Audit fields schema
const AuditFieldsSchema = z.object({
  created_at: TimestampSchema,
  updated_at: TimestampSchema,
  created_by: UUIDSchema,
  updated_by: UUIDSchema,
  deleted_at: TimestampSchema.nullable(),
});

// Core entity schemas
export const JurisdictionSchema = z.object({
  id: UUIDSchema,
  country_code: CountryCodeSchema,
  name_en: z.string().min(1).max(255),
  name_sk: z.string().min(1).max(255),
  gdpr_adequacy: z.boolean(),
  supervisory_authority: z.string().max(500).nullable(),
});

export const PhysicalLocationSchema = z.object({
  id: UUIDSchema,
  tenant_id: UUIDSchema,
  workspace_id: UUIDSchema,
  name: z.string().min(1).max(255),
  description: z.string().max(1000).nullable(),
  address: z.string().max(500).nullable(),
  city: z.string().max(100).nullable(),
  jurisdiction_id: UUIDSchema,
  jurisdiction: JurisdictionSchema.optional(),
  status: EntityStatusSchema,
}).merge(AuditFieldsSchema);

export const VendorContractSchema = z.object({
  id: UUIDSchema,
  tenant_id: UUIDSchema,
  workspace_id: UUIDSchema,
  vendor_id: UUIDSchema,
  contract_type: z.string().min(1).max(255),
  reference_number: z.string().max(100).nullable(),
  start_date: DateOnlySchema,
  end_date: DateOnlySchema.nullable(),
  review_date: DateOnlySchema.nullable(),
  status: ContractStatusSchema,
}).merge(AuditFieldsSchema);

export const VendorSchema = z.object({
  id: UUIDSchema,
  tenant_id: UUIDSchema,
  workspace_id: UUIDSchema,
  name: z.string().min(1).max(255),
  description: z.string().max(1000).nullable(),
  website: UrlSchema.max(500).nullable(),
  contact_email: EmailSchema.max(255).nullable(),
  primary_contact: z.string().max(255).nullable(),
  status: EntityStatusSchema,
  contracts: z.array(VendorContractSchema).optional(),
  locations: z.array(PhysicalLocationSchema).optional(),
}).merge(AuditFieldsSchema);

export const SystemEndpointSchema = z.object({
  id: UUIDSchema,
  tenant_id: UUIDSchema,
  workspace_id: UUIDSchema,
  system_id: UUIDSchema,
  name: z.string().min(1).max(255),
  endpoint_type: EndpointTypeSchema,
  url: UrlSchema.max(500).nullable(),
  description: z.string().max(1000).nullable(),
  authentication_method: z.string().max(255).nullable(),
  encryption_in_transit: z.boolean(),
  encryption_at_rest: z.boolean(),
  status: EntityStatusSchema,
}).merge(AuditFieldsSchema);

export const SystemSchema = z.object({
  id: UUIDSchema,
  tenant_id: UUIDSchema,
  workspace_id: UUIDSchema,
  name: z.string().min(1).max(255),
  description: z.string().max(1000).nullable(),
  system_type: z.string().max(100).nullable(),
  owner_team: z.string().max(255).nullable(),
  technical_contact: z.string().max(255).nullable(),
  business_contact: z.string().max(255).nullable(),
  criticality: CriticalitySchema.nullable(),
  status: EntityStatusSchema,
  endpoints: z.array(SystemEndpointSchema).optional(),
  locations: z.array(PhysicalLocationSchema).optional(),
}).merge(AuditFieldsSchema);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DataCategorySchema: z.ZodSchema<any> = z.object({
  id: UUIDSchema,
  tenant_id: UUIDSchema,
  workspace_id: UUIDSchema,
  name: z.string().min(1).max(255),
  description: z.string().max(1000).nullable(),
  category_type: DataCategoryTypeSchema,
  sensitivity: DataSensitivitySchema,
  special_category_basis: SpecialCategoryBasisSchema.nullable(),
  is_standard: z.boolean(),
  parent_id: UUIDSchema.nullable(),
  parent: z.lazy(() => DataCategorySchema).nullable().optional(),
  children: z.lazy(() => z.array(DataCategorySchema)).optional(),
  status: EntityStatusSchema,
}).merge(AuditFieldsSchema);

export const RetentionPolicySchema = z.object({
  id: UUIDSchema,
  tenant_id: UUIDSchema,
  workspace_id: UUIDSchema,
  name: z.string().min(1).max(255),
  description: z.string().max(1000).nullable(),
  retention_period_years: z.number().int().min(0).nullable(),
  retention_period_months: z.number().int().min(0).nullable(),
  retention_criteria: z.string().min(1).max(1000),
  disposal_method: z.string().max(500).nullable(),
  legal_basis_for_retention: z.string().max(1000).nullable(),
  review_frequency_months: z.number().int().min(1).default(12),
  status: EntityStatusSchema,
}).merge(AuditFieldsSchema).refine(
  (data) => data.retention_period_years !== null || data.retention_period_months !== null,
  { message: "Either retention_period_years or retention_period_months must be specified" }
);

// Forward declare for circular references
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DataFlowSchema: z.ZodType<any> = z.lazy(() => z.object({
  id: UUIDSchema,
  tenant_id: UUIDSchema,
  workspace_id: UUIDSchema,
  name: z.string().min(1).max(255),
  description: z.string().max(1000).nullable(),
  purpose: z.string().max(1000).nullable(),
  flow_direction: FlowDirectionSchema,
  frequency: z.string().max(255).nullable(),
  volume_estimate: z.string().max(255).nullable(),
  criticality: CriticalitySchema.nullable(),
  status: EntityStatusSchema,
  edges: z.array(DataFlowEdgeSchema).optional(),
  data_categories: z.array(DataCategorySchema).optional(),
}).merge(AuditFieldsSchema));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CrossBorderTransferSchema: z.ZodType<any> = z.lazy(() => z.object({
  id: UUIDSchema,
  tenant_id: UUIDSchema,
  workspace_id: UUIDSchema,
  data_flow_edge_id: UUIDSchema,
  exporter_jurisdiction_id: UUIDSchema,
  importer_jurisdiction_id: UUIDSchema,
  exporter_jurisdiction: JurisdictionSchema,
  importer_jurisdiction: JurisdictionSchema,
  transfer_mechanism: TransferMechanismSchema,
  adequacy_decision_ref: z.string().max(500).nullable(),
  safeguards_description: z.string().max(1000).nullable(),
  tia_required: z.boolean(),
  tia_reference: z.string().max(255).nullable(),
  tia_completed_date: DateOnlySchema.nullable(),
  derogation_justification: z.string().max(1000).nullable(),
  risk_assessment_completed: z.boolean(),
  status: EntityStatusSchema,
}).merge(AuditFieldsSchema).refine(
  (data) => data.exporter_jurisdiction_id !== data.importer_jurisdiction_id,
  { message: "Exporter and importer jurisdictions must be different" }
).refine(
  (data) => !data.tia_required || data.tia_reference !== null,
  { message: "TIA reference is required when TIA is required" }
).refine(
  (data) => data.transfer_mechanism !== TransferMechanism.ADEQUACY_DECISION || data.adequacy_decision_ref !== null,
  { message: "Adequacy decision reference is required for adequacy decision transfers" }
).refine(
  (data) => data.transfer_mechanism !== TransferMechanism.DEROGATION || data.derogation_justification !== null,
  { message: "Derogation justification is required for derogation transfers" }
));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DataFlowEdgeSchema: z.ZodType<any> = z.lazy(() => z.object({
  id: UUIDSchema,
  tenant_id: UUIDSchema,
  workspace_id: UUIDSchema,
  data_flow_id: UUIDSchema,
  from_system_id: UUIDSchema.nullable(),
  from_vendor_id: UUIDSchema.nullable(),
  to_system_id: UUIDSchema.nullable(),
  to_vendor_id: UUIDSchema.nullable(),
  from_system: SystemSchema.nullable().optional(),
  from_vendor: VendorSchema.nullable().optional(),
  to_system: SystemSchema.nullable().optional(),
  to_vendor: VendorSchema.nullable().optional(),
  edge_order: z.number().int().min(0),
  description: z.string().max(1000).nullable(),
  encryption_in_transit: z.boolean(),
  authentication_required: z.boolean(),
  status: EntityStatusSchema,
  cross_border_transfer: CrossBorderTransferSchema.nullable().optional(),
}).merge(AuditFieldsSchema).refine(
  (data) => {
    // Must have exactly one source (system or vendor)
    const hasFromSystem = data.from_system_id !== null;
    const hasFromVendor = data.from_vendor_id !== null;
    return (hasFromSystem && !hasFromVendor) || (!hasFromSystem && hasFromVendor);
  },
  { message: "Must have exactly one source (system or vendor)" }
).refine(
  (data) => {
    // Must have exactly one destination (system or vendor)
    const hasToSystem = data.to_system_id !== null;
    const hasToVendor = data.to_vendor_id !== null;
    return (hasToSystem && !hasToVendor) || (!hasToSystem && hasToVendor);
  },
  { message: "Must have exactly one destination (system or vendor)" }
));

// Join table schemas
const ProcessingSystemRelationSchema = z.object({
  processing_activity_id: UUIDSchema,
  system_id: UUIDSchema,
  system: SystemSchema,
  system_role: SystemRoleSchema.nullable(),
  created_at: TimestampSchema,
  created_by: UUIDSchema,
});

const ProcessingDataCategoryRelationSchema = z.object({
  processing_activity_id: UUIDSchema,
  data_category_id: UUIDSchema,
  data_category: DataCategorySchema,
  necessity_justification: z.string().max(1000).nullable(),
  created_at: TimestampSchema,
  created_by: UUIDSchema,
});

const ProcessingVendorRelationSchema = z.object({
  processing_activity_id: UUIDSchema,
  vendor_id: UUIDSchema,
  vendor: VendorSchema,
  vendor_role: VendorRoleSchema,
  contract_required: z.boolean(),
  created_at: TimestampSchema,
  created_by: UUIDSchema,
});

const ProcessingRetentionRelationSchema = z.object({
  processing_activity_id: UUIDSchema,
  retention_policy_id: UUIDSchema,
  retention_policy: RetentionPolicySchema,
  applies_to_category: z.string().max(255).nullable(),
  created_at: TimestampSchema,
  created_by: UUIDSchema,
});

const ProcessingDataFlowRelationSchema = z.object({
  processing_activity_id: UUIDSchema,
  data_flow_id: UUIDSchema,
  data_flow: DataFlowSchema,
  flow_purpose: z.string().max(1000).nullable(),
  created_at: TimestampSchema,
  created_by: UUIDSchema,
});

export const ProcessingActivitySchema = z.object({
  id: UUIDSchema,
  tenant_id: UUIDSchema,
  workspace_id: UUIDSchema,
  name: z.string().min(1).max(255),
  description: z.string().max(1000).nullable(),
  purpose: z.string().min(1).max(1000),
  lawful_basis: LawfulBasisSchema,
  lawful_basis_explanation: z.string().max(1000).nullable(),
  data_subject_categories: z.string().max(500).nullable(),
  special_category_basis: SpecialCategoryBasisSchema.nullable(),
  automated_decision_making: z.boolean(),
  profiling: z.boolean(),
  data_source: z.string().max(500).nullable(),
  dpo_review_required: z.boolean(),
  review_date: DateOnlySchema.nullable(),
  last_review_date: DateOnlySchema.nullable(),
  status: EntityStatusSchema,
  systems: z.array(ProcessingSystemRelationSchema).optional(),
  data_categories: z.array(ProcessingDataCategoryRelationSchema).optional(),
  vendors: z.array(ProcessingVendorRelationSchema).optional(),
  retention_policies: z.array(ProcessingRetentionRelationSchema).optional(),
  data_flows: z.array(ProcessingDataFlowRelationSchema).optional(),
}).merge(AuditFieldsSchema);

// Export the referenced schemas
export { DataFlowSchema, DataFlowEdgeSchema, CrossBorderTransferSchema };

// Request validation schemas
export const CreatePhysicalLocationRequestSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  jurisdiction_id: UUIDSchema,
});

export const UpdatePhysicalLocationRequestSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  jurisdiction_id: UUIDSchema.optional(),
  status: EntityStatusSchema.optional(),
});

export const CreateVendorRequestSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  website: UrlSchema.max(500).or(z.literal('')).optional(),
  contact_email: EmailSchema.max(255).or(z.literal('')).optional(),
  primary_contact: z.string().max(255).optional(),
  vendor_role: VendorRoleSchema.optional(),
  status: EntityStatusSchema.optional(),
  has_dpa: z.boolean().optional(),
  dpa_expires: DateOnlySchema.or(z.literal('')).optional(),
  location: z.string().max(100).optional(),
});

export const UpdateVendorRequestSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  website: UrlSchema.max(500).or(z.literal('')).optional(),
  contact_email: EmailSchema.max(255).or(z.literal('')).optional(),
  primary_contact: z.string().max(255).optional(),
  vendor_role: VendorRoleSchema.optional(),
  status: EntityStatusSchema.optional(),
  has_dpa: z.boolean().optional(),
  dpa_expires: DateOnlySchema.or(z.literal('')).optional(),
  location: z.string().max(100).optional(),
});

export const CreateSystemRequestSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  system_type: z.string().max(100).optional(),
  owner_team: z.string().max(255).optional(),
  technical_contact: z.string().max(255).optional(),
  business_contact: z.string().max(255).optional(),
  criticality: CriticalitySchema.optional(),
});

export const UpdateSystemRequestSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  system_type: z.string().max(100).optional(),
  owner_team: z.string().max(255).optional(),
  technical_contact: z.string().max(255).optional(),
  business_contact: z.string().max(255).optional(),
  criticality: CriticalitySchema.optional(),
  status: EntityStatusSchema.optional(),
});

export const CreateSystemEndpointRequestSchema = z.object({
  name: z.string().min(1).max(255),
  endpoint_type: EndpointTypeSchema,
  url: UrlSchema.max(500).optional(),
  description: z.string().max(1000).optional(),
  authentication_method: z.string().max(255).optional(),
  encryption_in_transit: z.boolean().optional().default(false),
  encryption_at_rest: z.boolean().optional().default(false),
});

export const UpdateSystemEndpointRequestSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  endpoint_type: EndpointTypeSchema.optional(),
  url: UrlSchema.max(500).optional(),
  description: z.string().max(1000).optional(),
  authentication_method: z.string().max(255).optional(),
  encryption_in_transit: z.boolean().optional(),
  encryption_at_rest: z.boolean().optional(),
  status: EntityStatusSchema.optional(),
});

export const CreateDataCategoryRequestSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  category_type: DataCategoryTypeSchema,
  sensitivity: DataSensitivitySchema,
  special_category_basis: SpecialCategoryBasisSchema.optional(),
  parent_id: UUIDSchema.optional(),
}).refine(
  (data) => {
    // Special category data must have special category basis
    if (data.category_type === DataCategoryType.SPECIAL) {
      return data.special_category_basis !== undefined;
    }
    // Non-special category data should not have special category basis
    return data.special_category_basis === undefined;
  },
  { message: "Special category data must have special category basis" }
);

export const UpdateDataCategoryRequestSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  category_type: DataCategoryTypeSchema.optional(),
  sensitivity: DataSensitivitySchema.optional(),
  special_category_basis: SpecialCategoryBasisSchema.optional(),
  parent_id: UUIDSchema.optional(),
  status: EntityStatusSchema.optional(),
});

export const CreateProcessingActivityRequestSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  purpose: z.string().min(1).max(1000),
  lawful_basis: LawfulBasisSchema,
  lawful_basis_explanation: z.string().max(1000).optional(),
  data_subject_categories: z.string().max(500).optional(),
  special_category_basis: SpecialCategoryBasisSchema.optional(),
  automated_decision_making: z.boolean().optional().default(false),
  profiling: z.boolean().optional().default(false),
  data_source: z.string().max(500).optional(),
  dpo_review_required: z.boolean().optional().default(false),
  review_date: DateOnlySchema.optional(),
});

export const UpdateProcessingActivityRequestSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  purpose: z.string().min(1).max(1000).optional(),
  lawful_basis: LawfulBasisSchema.optional(),
  lawful_basis_explanation: z.string().max(1000).optional(),
  data_subject_categories: z.string().max(500).optional(),
  special_category_basis: SpecialCategoryBasisSchema.optional(),
  automated_decision_making: z.boolean().optional(),
  profiling: z.boolean().optional(),
  data_source: z.string().max(500).optional(),
  dpo_review_required: z.boolean().optional(),
  review_date: DateOnlySchema.optional(),
  last_review_date: DateOnlySchema.optional(),
  status: EntityStatusSchema.optional(),
});

export const CreateRetentionPolicyRequestSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  retention_period_years: z.number().int().min(0).optional(),
  retention_period_months: z.number().int().min(0).optional(),
  retention_criteria: z.string().min(1).max(1000),
  disposal_method: z.string().max(500).optional(),
  legal_basis_for_retention: z.string().max(1000).optional(),
  review_frequency_months: z.number().int().min(1).optional().default(12),
}).refine(
  (data) => data.retention_period_years !== undefined || data.retention_period_months !== undefined,
  { message: "Either retention_period_years or retention_period_months must be specified" }
);

export const UpdateRetentionPolicyRequestSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  retention_period_years: z.number().int().min(0).optional(),
  retention_period_months: z.number().int().min(0).optional(),
  retention_criteria: z.string().min(1).max(1000).optional(),
  disposal_method: z.string().max(500).optional(),
  legal_basis_for_retention: z.string().max(1000).optional(),
  review_frequency_months: z.number().int().min(1).optional(),
  status: EntityStatusSchema.optional(),
});

export const CreateDataFlowRequestSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  purpose: z.string().max(1000).optional(),
  flow_direction: FlowDirectionSchema,
  frequency: z.string().max(255).optional(),
  volume_estimate: z.string().max(255).optional(),
  criticality: CriticalitySchema.optional(),
  status: EntityStatusSchema.optional(),
  from_system: UUIDSchema.optional(),
  to_system: UUIDSchema.optional(),
  from_vendor: UUIDSchema.optional(),
  to_vendor: UUIDSchema.optional(),
  encryption_in_transit: z.boolean().optional(),
  cross_border_transfer: z.boolean().optional(),
});

export const UpdateDataFlowRequestSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  purpose: z.string().max(1000).optional(),
  flow_direction: FlowDirectionSchema.optional(),
  frequency: z.string().max(255).optional(),
  volume_estimate: z.string().max(255).optional(),
  criticality: CriticalitySchema.optional(),
  status: EntityStatusSchema.optional(),
  from_system: UUIDSchema.optional(),
  to_system: UUIDSchema.optional(),
  from_vendor: UUIDSchema.optional(),
  to_vendor: UUIDSchema.optional(),
  encryption_in_transit: z.boolean().optional(),
  cross_border_transfer: z.boolean().optional(),
});

export const CreateDataFlowEdgeRequestSchema = z.object({
  data_flow_id: UUIDSchema,
  from_system_id: UUIDSchema.optional(),
  from_vendor_id: UUIDSchema.optional(),
  to_system_id: UUIDSchema.optional(),
  to_vendor_id: UUIDSchema.optional(),
  edge_order: z.number().int().min(0).optional().default(0),
  description: z.string().max(1000).optional(),
  encryption_in_transit: z.boolean().optional().default(false),
  authentication_required: z.boolean().optional().default(true),
}).refine(
  (data) => {
    // Must have exactly one source (system or vendor)
    const hasFromSystem = data.from_system_id !== undefined;
    const hasFromVendor = data.from_vendor_id !== undefined;
    return (hasFromSystem && !hasFromVendor) || (!hasFromSystem && hasFromVendor);
  },
  { message: "Must have exactly one source (system or vendor)" }
).refine(
  (data) => {
    // Must have exactly one destination (system or vendor)
    const hasToSystem = data.to_system_id !== undefined;
    const hasToVendor = data.to_vendor_id !== undefined;
    return (hasToSystem && !hasToVendor) || (!hasToSystem && hasToVendor);
  },
  { message: "Must have exactly one destination (system or vendor)" }
);

export const UpdateDataFlowEdgeRequestSchema = z.object({
  from_system_id: UUIDSchema.optional(),
  from_vendor_id: UUIDSchema.optional(),
  to_system_id: UUIDSchema.optional(),
  to_vendor_id: UUIDSchema.optional(),
  edge_order: z.number().int().min(0).optional(),
  description: z.string().max(1000).optional(),
  encryption_in_transit: z.boolean().optional(),
  authentication_required: z.boolean().optional(),
  status: EntityStatusSchema.optional(),
});

export const CreateCrossBorderTransferRequestSchema = z.object({
  data_flow_edge_id: UUIDSchema,
  exporter_jurisdiction_id: UUIDSchema,
  importer_jurisdiction_id: UUIDSchema,
  transfer_mechanism: TransferMechanismSchema,
  adequacy_decision_ref: z.string().max(500).optional(),
  safeguards_description: z.string().max(1000).optional(),
  tia_required: z.boolean().optional().default(false),
  tia_reference: z.string().max(255).optional(),
  tia_completed_date: DateOnlySchema.optional(),
  derogation_justification: z.string().max(1000).optional(),
  risk_assessment_completed: z.boolean().optional().default(false),
}).refine(
  (data) => data.exporter_jurisdiction_id !== data.importer_jurisdiction_id,
  { message: "Exporter and importer jurisdictions must be different" }
);

export const UpdateCrossBorderTransferRequestSchema = z.object({
  transfer_mechanism: TransferMechanismSchema.optional(),
  adequacy_decision_ref: z.string().max(500).optional(),
  safeguards_description: z.string().max(1000).optional(),
  tia_required: z.boolean().optional(),
  tia_reference: z.string().max(255).optional(),
  tia_completed_date: DateOnlySchema.optional(),
  derogation_justification: z.string().max(1000).optional(),
  risk_assessment_completed: z.boolean().optional(),
  status: EntityStatusSchema.optional(),
});

// Relationship management schemas
export const AddSystemToProcessingRequestSchema = z.object({
  system_id: UUIDSchema,
  system_role: SystemRoleSchema.optional(),
});

export const AddDataCategoryToProcessingRequestSchema = z.object({
  data_category_id: UUIDSchema,
  necessity_justification: z.string().max(1000).optional(),
});

export const AddVendorToProcessingRequestSchema = z.object({
  vendor_id: UUIDSchema,
  vendor_role: VendorRoleSchema,
  contract_required: z.boolean().optional().default(true),
});

export const AddRetentionPolicyToProcessingRequestSchema = z.object({
  retention_policy_id: UUIDSchema,
  applies_to_category: z.string().max(255).optional(),
});

export const AddDataFlowToProcessingRequestSchema = z.object({
  data_flow_id: UUIDSchema,
  flow_purpose: z.string().max(1000).optional(),
});

export const AddLocationToSystemRequestSchema = z.object({
  location_id: UUIDSchema,
});

export const AddLocationToVendorRequestSchema = z.object({
  location_id: UUIDSchema,
});

export const AddDataCategoryToDataFlowRequestSchema = z.object({
  data_category_id: UUIDSchema,
});

// List query parameter schemas
export const ListQueryParamsSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  search: z.string().max(100).optional(),
  status: EntityStatusSchema.optional(),
});

export const JurisdictionQueryParamsSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  search: z.string().max(100).optional(),
  gdpr_adequacy: z.coerce.boolean().optional(),
});

export const PhysicalLocationQueryParamsSchema = ListQueryParamsSchema.extend({
  jurisdiction_id: UUIDSchema.optional(),
});

export const VendorQueryParamsSchema = ListQueryParamsSchema.extend({
  contact_email: EmailSchema.optional(),
  primary_contact: z.string().optional(),
  website: UrlSchema.optional(),
  status: EntityStatusSchema.optional(),
});

export const SystemQueryParamsSchema = ListQueryParamsSchema.extend({
  criticality: CriticalitySchema.optional(),
});

export const DataCategoryQueryParamsSchema = ListQueryParamsSchema.extend({
  category_type: DataCategoryTypeSchema.optional(),
  sensitivity: DataSensitivitySchema.optional(),
  is_standard: z.coerce.boolean().optional(),
  parent_id: UUIDSchema.optional(),
});

export const ProcessingActivityQueryParamsSchema = ListQueryParamsSchema.extend({
  lawful_basis: LawfulBasisSchema.optional(),
  dpo_review_required: z.coerce.boolean().optional(),
  review_overdue: z.coerce.boolean().optional(),
});

export const DataFlowQueryParamsSchema = ListQueryParamsSchema.extend({
  flow_direction: FlowDirectionSchema.optional(),
  criticality: CriticalitySchema.optional(),
});

// Pagination response schema
export const PaginationMetadataSchema = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1).max(100),
  total: z.number().int().min(0),
  pages: z.number().int().min(0),
});

export const createPaginatedResponseSchema = <T>(itemSchema: z.ZodType<T>) =>
  z.object({
    data: z.array(itemSchema),
    pagination: PaginationMetadataSchema,
  });

// Error response schemas
export const APIErrorSchema = z.object({
  error: z.string(),
  message: z.string(),
  details: z.record(z.string(), z.unknown()).optional(),
});

export const ValidationErrorSchema = APIErrorSchema.extend({
  fields: z.record(z.string(), z.array(z.string())).optional(),
});

// Context claims schema for JWT validation
export const ContextClaimsSchema = z.object({
  tenant_id: UUIDSchema,
  workspace_id: UUIDSchema,
  sub: UUIDSchema, // user ID
});

// Include parameter validation
export const ProcessingActivityIncludeSchema = z.array(
  z.enum(['systems', 'data_categories', 'vendors', 'retention_policies', 'data_flows'])
).optional();

export const VendorIncludeSchema = z.array(
  z.enum(['contracts', 'locations'])
).optional();

export const SystemIncludeSchema = z.array(
  z.enum(['endpoints', 'locations'])
).optional();

export const DataFlowIncludeSchema = z.array(
  z.enum(['edges', 'data_categories'])
).optional();