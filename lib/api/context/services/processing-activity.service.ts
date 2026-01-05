/**
 * Context Module - Processing Activity Service
 * 
 * Service layer for GDPR Article 30 processing activity operations.
 * Handles complex business logic validation and compliance checking.
 */

import type { 
  ProcessingActivity, 
  CreateProcessingActivityRequest,
  UpdateProcessingActivityRequest,
  AddSystemToProcessingRequest,
  AddDataCategoryToProcessingRequest,
  AddVendorToProcessingRequest,
  AddRetentionPolicyToProcessingRequest,
  ProcessingActivityQueryParams, 
  PaginatedResponse,
  UUID 
} from '../types';
import type { ProcessingActivityRepository } from '../repositories/processing-activity.repository';
import type { SystemRepository } from '../repositories/system.repository';
import type { DataCategoryRepository } from '../repositories/data-category.repository';
import type { VendorRepository } from '../repositories/vendor.repository';

export class ProcessingActivityService {
  constructor(
    private processingActivityRepo: ProcessingActivityRepository,
    private systemRepo: SystemRepository,
    private dataCategoryRepo: DataCategoryRepository,
    private vendorRepo: VendorRepository
  ) {}

  /**
   * Get all processing activities with filtering and pagination
   */
  async getProcessingActivities(params: ProcessingActivityQueryParams = {}): Promise<PaginatedResponse<ProcessingActivity>> {
    return await this.processingActivityRepo.findMany(params);
  }

  /**
   * Get processing activity by ID with all relationships
   */
  async getProcessingActivityById(id: UUID, include?: string[]): Promise<ProcessingActivity | null> {
    if (include?.length) {
      return await this.processingActivityRepo.findByIdWithAllRelations(id);
    }
    return await this.processingActivityRepo.findById(id, include);
  }

  /**
   * Create new processing activity
   */
  async createProcessingActivity(data: CreateProcessingActivityRequest): Promise<ProcessingActivity> {
    // Validate business rules
    await this.validateProcessingActivityData(data);

    // Create the activity
    const activity = await this.processingActivityRepo.create(data);
    
    return activity;
  }

  /**
   * Update existing processing activity
   */
  async updateProcessingActivity(id: UUID, data: UpdateProcessingActivityRequest): Promise<ProcessingActivity> {
    // Check if activity exists
    const existingActivity = await this.processingActivityRepo.findById(id);
    if (!existingActivity) {
      throw new Error('Processing activity not found');
    }

    // Validate business rules
    const validationData = {
      ...existingActivity,
      ...data,
      description: data.description ?? existingActivity.description,
      lawful_basis_explanation: data.lawful_basis_explanation ?? existingActivity.lawful_basis_explanation,
      data_subject_categories: data.data_subject_categories ?? existingActivity.data_subject_categories
    };
    await this.validateProcessingActivityData(validationData as any, id);

    // Update the activity
    return await this.processingActivityRepo.update(id, data);
  }

  /**
   * Delete processing activity
   */
  async deleteProcessingActivity(id: UUID): Promise<void> {
    // Check if activity exists
    const existingActivity = await this.processingActivityRepo.findById(id);
    if (!existingActivity) {
      throw new Error('Processing activity not found');
    }

    // Prevent deletion of standard activities if applicable
    // For now, allow deletion but could add business rules here

    await this.processingActivityRepo.delete(id);
  }

  /**
   * Get activities requiring DPO review
   */
  async getActivitiesRequiringDpoReview(): Promise<ProcessingActivity[]> {
    return await this.processingActivityRepo.findRequiringDpoReview();
  }

  /**
   * Get activities with overdue reviews
   */
  async getOverdueReviews(): Promise<ProcessingActivity[]> {
    return await this.processingActivityRepo.findOverdueReviews();
  }

  /**
   * Get activities by lawful basis
   */
  async getActivitiesByLawfulBasis(lawfulBasis: string): Promise<ProcessingActivity[]> {
    // Validate lawful basis
    const validBases = ['consent', 'contract', 'legal_obligation', 'vital_interests', 'public_task', 'legitimate_interests'];
    if (!validBases.includes(lawfulBasis)) {
      throw new Error(`Invalid lawful basis. Must be one of: ${validBases.join(', ')}`);
    }

    return await this.processingActivityRepo.findByLawfulBasis(lawfulBasis as 'consent' | 'contract' | 'legal_obligation' | 'vital_interests' | 'public_task' | 'legitimate_interests');
  }

  /**
   * Complete activity review
   */
  async completeReview(id: UUID, reviewDate?: string): Promise<ProcessingActivity> {
    // Validate activity exists
    const activity = await this.processingActivityRepo.findById(id);
    if (!activity) {
      throw new Error('Processing activity not found');
    }

    // Validate date if provided
    if (reviewDate && !this.isValidDate(reviewDate)) {
      throw new Error('Invalid review date format. Use YYYY-MM-DD');
    }

    return await this.processingActivityRepo.completeReview(id, reviewDate);
  }

  // System relationship management

  /**
   * Add system to processing activity
   */
  async addSystem(processingActivityId: UUID, request: AddSystemToProcessingRequest): Promise<void> {
    // Validate activity exists
    const activity = await this.processingActivityRepo.findById(processingActivityId);
    if (!activity) {
      throw new Error('Processing activity not found');
    }

    // Validate system exists
    const system = await this.systemRepo.findById(request.system_id);
    if (!system) {
      throw new Error('System not found');
    }

    await this.processingActivityRepo.addSystem(processingActivityId, request);
  }

  /**
   * Remove system from processing activity
   */
  async removeSystem(processingActivityId: UUID, systemId: UUID): Promise<void> {
    await this.processingActivityRepo.removeSystem(processingActivityId, systemId);
  }

  /**
   * Get systems for processing activity
   */
  async getActivitySystems(processingActivityId: UUID): Promise<any[]> {
    // Validate activity exists
    const activity = await this.processingActivityRepo.findById(processingActivityId);
    if (!activity) {
      throw new Error('Processing activity not found');
    }

    return await this.processingActivityRepo.getSystems(processingActivityId);
  }

  // Data category relationship management

  /**
   * Add data category to processing activity
   */
  async addDataCategory(processingActivityId: UUID, request: AddDataCategoryToProcessingRequest): Promise<void> {
    // Validate activity exists
    const activity = await this.processingActivityRepo.findById(processingActivityId);
    if (!activity) {
      throw new Error('Processing activity not found');
    }

    // Validate data category exists
    const dataCategory = await this.dataCategoryRepo.findById(request.data_category_id);
    if (!dataCategory) {
      throw new Error('Data category not found');
    }

    // Additional validation for special categories
    if (dataCategory.category_type === 'special' && !activity.special_category_basis) {
      throw new Error(
        'Processing activity must have special category legal basis to process special category data. ' +
        'Update the activity to specify Article 9 GDPR basis.'
      );
    }

    await this.processingActivityRepo.addDataCategory(processingActivityId, request);
  }

  /**
   * Remove data category from processing activity
   */
  async removeDataCategory(processingActivityId: UUID, dataCategoryId: UUID): Promise<void> {
    await this.processingActivityRepo.removeDataCategory(processingActivityId, dataCategoryId);
  }

  /**
   * Update data category necessity justification
   */
  async updateDataCategoryJustification(
    processingActivityId: UUID, 
    dataCategoryId: UUID, 
    necessityJustification: string
  ): Promise<void> {
    if (!necessityJustification || necessityJustification.trim().length === 0) {
      throw new Error('Necessity justification cannot be empty');
    }

    await this.processingActivityRepo.updateDataCategoryJustification(
      processingActivityId, 
      dataCategoryId, 
      necessityJustification.trim()
    );
  }

  /**
   * Get data categories for processing activity
   */
  async getActivityDataCategories(processingActivityId: UUID): Promise<any[]> {
    // Validate activity exists
    const activity = await this.processingActivityRepo.findById(processingActivityId);
    if (!activity) {
      throw new Error('Processing activity not found');
    }

    return await this.processingActivityRepo.getDataCategories(processingActivityId);
  }

  // Vendor relationship management

  /**
   * Add vendor to processing activity
   */
  async addVendor(processingActivityId: UUID, request: AddVendorToProcessingRequest): Promise<void> {
    // Validate activity exists
    const activity = await this.processingActivityRepo.findById(processingActivityId);
    if (!activity) {
      throw new Error('Processing activity not found');
    }

    // Validate vendor exists
    const vendor = await this.vendorRepo.findById(request.vendor_id);
    if (!vendor) {
      throw new Error('Vendor not found');
    }

    // Validate vendor role
    const validRoles = ['processor', 'joint_controller', 'recipient', 'sub_processor'];
    if (!validRoles.includes(request.vendor_role)) {
      throw new Error(`Invalid vendor role. Must be one of: ${validRoles.join(', ')}`);
    }

    await this.processingActivityRepo.addVendor(processingActivityId, request);
  }

  /**
   * Remove vendor from processing activity
   */
  async removeVendor(processingActivityId: UUID, vendorId: UUID): Promise<void> {
    await this.processingActivityRepo.removeVendor(processingActivityId, vendorId);
  }

  /**
   * Update vendor role
   */
  async updateVendorRole(
    processingActivityId: UUID, 
    vendorId: UUID, 
    vendorRole: string,
    contractRequired?: boolean
  ): Promise<void> {
    const validRoles = ['processor', 'joint_controller', 'recipient', 'sub_processor'];
    if (!validRoles.includes(vendorRole)) {
      throw new Error(`Invalid vendor role. Must be one of: ${validRoles.join(', ')}`);
    }

    await this.processingActivityRepo.updateVendorRole(
      processingActivityId, 
      vendorId, 
      vendorRole, 
      contractRequired
    );
  }

  /**
   * Get vendors for processing activity
   */
  async getActivityVendors(processingActivityId: UUID): Promise<any[]> {
    // Validate activity exists
    const activity = await this.processingActivityRepo.findById(processingActivityId);
    if (!activity) {
      throw new Error('Processing activity not found');
    }

    return await this.processingActivityRepo.getVendors(processingActivityId);
  }

  // Retention policy relationship management

  /**
   * Add retention policy to processing activity
   */
  async addRetentionPolicy(processingActivityId: UUID, request: AddRetentionPolicyToProcessingRequest): Promise<void> {
    // Validate activity exists
    const activity = await this.processingActivityRepo.findById(processingActivityId);
    if (!activity) {
      throw new Error('Processing activity not found');
    }

    // Validate retention policy exists (would need retention policy repo)
    // For now, assume it exists

    await this.processingActivityRepo.addRetentionPolicy(processingActivityId, request);
  }

  /**
   * Remove retention policy from processing activity
   */
  async removeRetentionPolicy(processingActivityId: UUID, retentionPolicyId: UUID): Promise<void> {
    await this.processingActivityRepo.removeRetentionPolicy(processingActivityId, retentionPolicyId);
  }

  /**
   * Get retention policies for processing activity
   */
  async getActivityRetentionPolicies(processingActivityId: UUID): Promise<any[]> {
    // Validate activity exists
    const activity = await this.processingActivityRepo.findById(processingActivityId);
    if (!activity) {
      throw new Error('Processing activity not found');
    }

    return await this.processingActivityRepo.getRetentionPolicies(processingActivityId);
  }

  /**
   * Get processing activity statistics
   */
  async getProcessingStatistics(): Promise<{
    total_activities: number;
    by_lawful_basis: Record<string, number>;
    requiring_dpo_review: number;
    overdue_reviews: number;
    by_status: Record<string, number>;
    with_special_categories: number;
    with_automated_decision_making: number;
    with_profiling: number;
  }> {
    return await this.processingActivityRepo.getStatistics();
  }

  /**
   * Advanced processing activity search
   */
  async advancedSearch(filters: {
    search?: string;
    status?: 'active' | 'inactive';
    lawful_bases?: ('consent' | 'contract' | 'legal_obligation' | 'vital_interests' | 'public_task' | 'legitimate_interests')[];
    special_category_bases?: ('explicit_consent' | 'employment' | 'vital_interests' | 'public_interest' | 'healthcare' | 'research' | 'legal_claims')[];
    dpo_review_required?: boolean;
    automated_decision_making?: boolean;
    profiling?: boolean;
    review_overdue?: boolean;
    systems?: UUID[];
    data_categories?: UUID[];
    vendors?: UUID[];
  }): Promise<ProcessingActivity[]> {
    return await this.processingActivityRepo.advancedSearch(filters);
  }

  /**
   * Validate processing activity GDPR compliance
   */
  async validateCompliance(activityId: UUID): Promise<{
    activity: ProcessingActivity;
    compliance_score: number; // 0-100
    compliance_status: 'compliant' | 'needs_attention' | 'non_compliant';
    issues: {
      category: string;
      severity: 'error' | 'warning';
      message: string;
      recommendation: string;
    }[];
    next_actions: {
      priority: 'high' | 'medium' | 'low';
      action: string;
      deadline?: string;
    }[];
  }> {
    const activity = await this.processingActivityRepo.findByIdWithAllRelations(activityId);
    if (!activity) {
      throw new Error('Processing activity not found');
    }

    const issues: any[] = [];
    const nextActions: any[] = [];

    // Validate lawful basis
    if (!activity.lawful_basis_explanation || activity.lawful_basis_explanation.trim().length === 0) {
      issues.push({
        category: 'lawful_basis',
        severity: 'warning',
        message: 'Missing lawful basis explanation',
        recommendation: 'Provide detailed explanation for the chosen lawful basis',
      });
    }

    // Validate special category processing
    const hasSpecialCategories = activity.data_categories?.some(dc => 
      dc.data_category?.category_type === 'special'
    ) || false;

    if (hasSpecialCategories && !activity.special_category_basis) {
      issues.push({
        category: 'special_categories',
        severity: 'error',
        message: 'Processing special category data without appropriate legal basis',
        recommendation: 'Specify Article 9 GDPR legal basis for special category data processing',
      });
      
      nextActions.push({
        priority: 'high',
        action: 'Update processing activity with special category legal basis',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days
      });
    }

    // Validate DPO review requirement
    if (activity.dpo_review_required && (!activity.last_review_date || 
        this.isReviewOverdue(activity.review_date, activity.last_review_date))) {
      issues.push({
        category: 'dpo_review',
        severity: 'error',
        message: 'DPO review required but overdue or not completed',
        recommendation: 'Schedule and complete DPO review immediately',
      });
      
      nextActions.push({
        priority: 'high',
        action: 'Complete DPO review',
        deadline: activity.review_date || undefined,
      });
    }

    // Validate automated decision making
    if (activity.automated_decision_making && !activity.lawful_basis_explanation?.includes('automated')) {
      issues.push({
        category: 'automated_processing',
        severity: 'warning',
        message: 'Automated decision making requires specific safeguards',
        recommendation: 'Document safeguards and human oversight for automated processing',
      });
    }

    // Validate vendor relationships
    const processors = activity.vendors?.filter(v => v.vendor_role === 'processor') || [];
    const processorsWithoutContracts = processors.filter(p => !p.contract_required);
    
    if (processorsWithoutContracts.length > 0) {
      issues.push({
        category: 'vendor_contracts',
        severity: 'error',
        message: `${processorsWithoutContracts.length} processors without data processing agreements`,
        recommendation: 'Execute data processing agreements with all processors',
      });
      
      nextActions.push({
        priority: 'high',
        action: 'Execute missing data processing agreements',
      });
    }

    // Validate data minimization
    if (!activity.data_categories || activity.data_categories.length === 0) {
      issues.push({
        category: 'data_minimization',
        severity: 'warning',
        message: 'No data categories specified',
        recommendation: 'Specify which data categories are processed for transparency',
      });
    }

    // Calculate compliance score
    const totalChecks = 6; // Number of compliance areas checked
    const errorCount = issues.filter(i => i.severity === 'error').length;
    const warningCount = issues.filter(i => i.severity === 'warning').length;
    
    const complianceScore = Math.max(0, Math.round(
      ((totalChecks - errorCount * 2 - warningCount) / totalChecks) * 100
    ));

    // Determine compliance status
    let complianceStatus: any = 'compliant';
    if (errorCount > 0) complianceStatus = 'non_compliant';
    else if (warningCount > 0) complianceStatus = 'needs_attention';

    return {
      activity,
      compliance_score: complianceScore,
      compliance_status: complianceStatus,
      issues,
      next_actions: nextActions,
    };
  }

  /**
   * Generate Article 30 record export
   */
  async generateArticle30Record(activityId?: UUID): Promise<{
    generated_at: string;
    activities: {
      name: string;
      purpose: string;
      lawful_basis: string;
      lawful_basis_explanation: string;
      data_categories: string[];
      data_subjects: string;
      processors: {
        name: string;
        role: string;
      }[];
      international_transfers: {
        destination: string;
        safeguards: string;
      }[];
      retention: string;
      security_measures: string;
    }[];
  }> {
    let activities: ProcessingActivity[];

    if (activityId) {
      const activity = await this.processingActivityRepo.findByIdWithAllRelations(activityId);
      activities = activity ? [activity] : [];
    } else {
      const result = await this.processingActivityRepo.findMany({ 
        limit: 1000,
        status: 'active' 
      });
      activities = result.data;
      
      // Get full relations for each activity
      activities = await Promise.all(
        activities.map(a => this.processingActivityRepo.findByIdWithAllRelations(a.id))
      ).then(results => results.filter(Boolean) as ProcessingActivity[]);
    }

    const article30Activities = activities.map(activity => ({
      name: activity.name,
      purpose: activity.purpose,
      lawful_basis: this.formatLawfulBasis(activity.lawful_basis),
      lawful_basis_explanation: activity.lawful_basis_explanation || 'Not specified',
      data_categories: activity.data_categories?.map(dc => dc.data_category?.name).filter(Boolean) || [],
      data_subjects: activity.data_subject_categories || 'Not specified',
      processors: activity.vendors?.filter(v => v.vendor_role === 'processor')
        .map(v => ({
          name: v.vendor?.name || 'Unknown',
          role: v.vendor_role,
        })) || [],
      international_transfers: [], // TODO: Get from cross-border transfers
      retention: activity.retention_policies?.map(rp => rp.retention_policy?.retention_criteria).join('; ') || 'Not specified',
      security_measures: 'Standard technical and organizational measures', // TODO: Get from systems
    }));

    return {
      generated_at: new Date().toISOString(),
      activities: article30Activities,
    };
  }

  // Private helper methods

  private async validateProcessingActivityData(
    data: CreateProcessingActivityRequest | (UpdateProcessingActivityRequest & { id?: UUID }), 
    excludeId?: UUID
  ): Promise<void> {
    const errors: string[] = [];

    // Validate required fields
    if ('name' in data && (!data.name || data.name.trim().length === 0)) {
      errors.push('Processing activity name is required');
    }

    if ('purpose' in data && (!data.purpose || data.purpose.trim().length === 0)) {
      errors.push('Processing purpose is required');
    }

    if ('lawful_basis' in data && !data.lawful_basis) {
      errors.push('Lawful basis is required');
    }

    // Validate lawful basis
    if (data.lawful_basis) {
      const validBases = ['consent', 'contract', 'legal_obligation', 'vital_interests', 'public_task', 'legitimate_interests'];
      if (!validBases.includes(data.lawful_basis)) {
        errors.push(`Invalid lawful basis. Must be one of: ${validBases.join(', ')}`);
      }
    }

    // Validate special category basis if provided
    if (data.special_category_basis) {
      const validSpecialBases = ['explicit_consent', 'employment', 'vital_interests', 'public_interest', 'healthcare', 'research', 'legal_claims'];
      if (!validSpecialBases.includes(data.special_category_basis)) {
        errors.push(`Invalid special category basis. Must be one of: ${validSpecialBases.join(', ')}`);
      }
    }

    // Validate dates
    if (data.review_date && !this.isValidDate(data.review_date)) {
      errors.push('Invalid review date format. Use YYYY-MM-DD');
    }

    // Check name uniqueness
    if (data.name) {
      const nameExists = await this.processingActivityRepo.nameExists(data.name.trim(), excludeId);
      if (nameExists) {
        errors.push('Processing activity name already exists in this workspace');
      }
    }

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
  }

  private isValidDate(dateString: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }

  private isReviewOverdue(reviewDate?: string | null, lastReviewDate?: string | null): boolean {
    if (!reviewDate) return false;
    
    const review = new Date(reviewDate);
    const today = new Date();
    
    return review < today;
  }

  private formatLawfulBasis(lawfulBasis: string): string {
    const basisMap: Record<string, string> = {
      'consent': 'Article 6(1)(a) - Consent',
      'contract': 'Article 6(1)(b) - Contract',
      'legal_obligation': 'Article 6(1)(c) - Legal obligation',
      'vital_interests': 'Article 6(1)(d) - Vital interests',
      'public_task': 'Article 6(1)(e) - Public task',
      'legitimate_interests': 'Article 6(1)(f) - Legitimate interests',
    };
    
    return basisMap[lawfulBasis] || lawfulBasis;
  }
}