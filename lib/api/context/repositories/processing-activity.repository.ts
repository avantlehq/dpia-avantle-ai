/**
 * Context Module - Processing Activity Repository
 * 
 * Repository for managing GDPR Article 30 processing activities.
 * Handles complex relationships with systems, data categories, vendors, and retention policies.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';
import type { 
  ProcessingActivity, 
  CreateProcessingActivityRequest,
  UpdateProcessingActivityRequest,
  AddSystemToProcessingRequest,
  AddDataCategoryToProcessingRequest,
  AddVendorToProcessingRequest,
  AddRetentionPolicyToProcessingRequest,
  ContextClaims, 
  ProcessingActivityQueryParams,
  UUID 
} from '../types';
import { BaseRepository } from './base.repository';

export class ProcessingActivityRepository extends BaseRepository<
  ProcessingActivity,
  CreateProcessingActivityRequest,
  UpdateProcessingActivityRequest,
  ProcessingActivityQueryParams
> {
  protected tableName = 'processing_activities' as const;

  constructor(context: ContextClaims, client?: SupabaseClient<Database>) {
    super(context, client);
  }

  /**
   * Apply specific filters for processing activities
   */
  protected applyFilters(query: any, params: Partial<ProcessingActivityQueryParams>): any {
    let filteredQuery = query;

    if (params.lawful_basis) {
      filteredQuery = filteredQuery.eq('lawful_basis', params.lawful_basis);
    }

    if (typeof params.dpo_review_required === 'boolean') {
      filteredQuery = filteredQuery.eq('dpo_review_required', params.dpo_review_required);
    }

    if (typeof params.review_overdue === 'boolean' && params.review_overdue) {
      const today = new Date().toISOString().split('T')[0];
      filteredQuery = filteredQuery.lt('review_date', today);
    }

    return filteredQuery;
  }

  /**
   * Apply includes for related data
   */
  protected applyIncludes(query: any, include: string[]): any {
    let selectFields = '*';

    if (include.includes('systems')) {
      selectFields += ', systems:processing_systems(system_role, system:system_id(*))';
    }

    if (include.includes('data_categories')) {
      selectFields += ', data_categories:processing_data_categories(necessity_justification, data_category:data_category_id(*))';
    }

    if (include.includes('vendors')) {
      selectFields += ', vendors:processing_vendors(vendor_role, contract_required, vendor:vendor_id(*))';
    }

    if (include.includes('retention_policies')) {
      selectFields += ', retention_policies:processing_retention(applies_to_category, retention_policy:retention_policy_id(*))';
    }

    if (include.includes('data_flows')) {
      selectFields += ', data_flows:processing_data_flows(flow_purpose, data_flow:data_flow_id(*))';
    }

    return query.select(selectFields);
  }

  /**
   * Get processing activity with all relationships
   */
  async findByIdWithAllRelations(id: UUID): Promise<ProcessingActivity | null> {
    const { data, error } = await this.client
      .from('processing_activities')
      .select(`
        *,
        systems:processing_systems(
          system_role,
          system:system_id(*)
        ),
        data_categories:processing_data_categories(
          necessity_justification,
          data_category:data_category_id(*)
        ),
        vendors:processing_vendors(
          vendor_role,
          contract_required,
          vendor:vendor_id(*)
        ),
        retention_policies:processing_retention(
          applies_to_category,
          retention_policy:retention_policy_id(*)
        ),
        data_flows:processing_data_flows(
          flow_purpose,
          data_flow:data_flow_id(*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch processing activity with relations: ${error.message}`);
    }

    return data as ProcessingActivity;
  }

  /**
   * Get processing activities requiring DPO review
   */
  async findRequiringDpoReview(): Promise<ProcessingActivity[]> {
    const { data, error } = await this.client
      .from('processing_activities')
      .select('*')
      .eq('dpo_review_required', true)
      .eq('status', 'active')
      .order('review_date', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch activities requiring DPO review: ${error.message}`);
    }

    return data as ProcessingActivity[];
  }

  /**
   * Get overdue reviews
   */
  async findOverdueReviews(): Promise<ProcessingActivity[]> {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await this.client
      .from('processing_activities')
      .select('*')
      .lt('review_date', today)
      .eq('status', 'active')
      .order('review_date', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch overdue reviews: ${error.message}`);
    }

    return data as ProcessingActivity[];
  }

  /**
   * Get activities by lawful basis
   */
  async findByLawfulBasis(lawfulBasis: 'consent' | 'contract' | 'legal_obligation' | 'vital_interests' | 'public_task' | 'legitimate_interests'): Promise<ProcessingActivity[]> {
    const { data, error } = await this.client
      .from('processing_activities')
      .select('*')
      .eq('lawful_basis', lawfulBasis)
      .eq('status', 'active')
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch activities by lawful basis: ${error.message}`);
    }

    return data as ProcessingActivity[];
  }

  /**
   * Check if processing activity name exists
   */
  async nameExists(name: string, excludeId?: UUID): Promise<boolean> {
    let query = this.client
      .from('processing_activities')
      .select('id')
      .eq('name', name)
      .eq('status', 'active');

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query.single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to check processing activity name existence: ${error.message}`);
    }

    return !!data;
  }

  /**
   * Mark review as completed
   */
  async completeReview(id: UUID, reviewDate?: string): Promise<ProcessingActivity> {
    return await this.update(id, {
      last_review_date: reviewDate || new Date().toISOString().split('T')[0],
    });
  }

  // System relationship management

  /**
   * Add system to processing activity
   */
  async addSystem(processingActivityId: UUID, request: AddSystemToProcessingRequest): Promise<void> {
    const { error } = await this.client
      .from('processing_systems')
      .insert({
        processing_activity_id: processingActivityId,
        system_id: request.system_id,
        system_role: request.system_role || null,
        created_by: this.context.sub,
      });

    if (error) {
      throw new Error(`Failed to add system to processing activity: ${error.message}`);
    }
  }

  /**
   * Remove system from processing activity
   */
  async removeSystem(processingActivityId: UUID, systemId: UUID): Promise<void> {
    const { error } = await this.client
      .from('processing_systems')
      .delete()
      .eq('processing_activity_id', processingActivityId)
      .eq('system_id', systemId);

    if (error) {
      throw new Error(`Failed to remove system from processing activity: ${error.message}`);
    }
  }

  /**
   * Get systems for processing activity
   */
  async getSystems(processingActivityId: UUID): Promise<any[]> {
    const { data, error } = await this.client
      .from('processing_systems')
      .select(`
        system_role,
        created_at,
        system:system_id(*)
      `)
      .eq('processing_activity_id', processingActivityId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch systems for processing activity: ${error.message}`);
    }

    return data || [];
  }

  // Data category relationship management

  /**
   * Add data category to processing activity
   */
  async addDataCategory(processingActivityId: UUID, request: AddDataCategoryToProcessingRequest): Promise<void> {
    const { error } = await this.client
      .from('processing_data_categories')
      .insert({
        processing_activity_id: processingActivityId,
        data_category_id: request.data_category_id,
        necessity_justification: request.necessity_justification || null,
        created_by: this.context.sub,
      });

    if (error) {
      throw new Error(`Failed to add data category to processing activity: ${error.message}`);
    }
  }

  /**
   * Remove data category from processing activity
   */
  async removeDataCategory(processingActivityId: UUID, dataCategoryId: UUID): Promise<void> {
    const { error } = await this.client
      .from('processing_data_categories')
      .delete()
      .eq('processing_activity_id', processingActivityId)
      .eq('data_category_id', dataCategoryId);

    if (error) {
      throw new Error(`Failed to remove data category from processing activity: ${error.message}`);
    }
  }

  /**
   * Update data category necessity justification
   */
  async updateDataCategoryJustification(
    processingActivityId: UUID, 
    dataCategoryId: UUID, 
    necessityJustification: string
  ): Promise<void> {
    const { error } = await this.client
      .from('processing_data_categories')
      .update({ necessity_justification: necessityJustification })
      .eq('processing_activity_id', processingActivityId)
      .eq('data_category_id', dataCategoryId);

    if (error) {
      throw new Error(`Failed to update data category justification: ${error.message}`);
    }
  }

  /**
   * Get data categories for processing activity
   */
  async getDataCategories(processingActivityId: UUID): Promise<any[]> {
    const { data, error } = await this.client
      .from('processing_data_categories')
      .select(`
        necessity_justification,
        created_at,
        data_category:data_category_id(*)
      `)
      .eq('processing_activity_id', processingActivityId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch data categories for processing activity: ${error.message}`);
    }

    return data || [];
  }

  // Vendor relationship management

  /**
   * Add vendor to processing activity
   */
  async addVendor(processingActivityId: UUID, request: AddVendorToProcessingRequest): Promise<void> {
    const { error } = await this.client
      .from('processing_vendors')
      .insert({
        processing_activity_id: processingActivityId,
        vendor_id: request.vendor_id,
        vendor_role: request.vendor_role,
        contract_required: request.contract_required ?? true,
        created_by: this.context.sub,
      });

    if (error) {
      throw new Error(`Failed to add vendor to processing activity: ${error.message}`);
    }
  }

  /**
   * Remove vendor from processing activity
   */
  async removeVendor(processingActivityId: UUID, vendorId: UUID): Promise<void> {
    const { error } = await this.client
      .from('processing_vendors')
      .delete()
      .eq('processing_activity_id', processingActivityId)
      .eq('vendor_id', vendorId);

    if (error) {
      throw new Error(`Failed to remove vendor from processing activity: ${error.message}`);
    }
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
    const updateData: any = { vendor_role: vendorRole };
    if (typeof contractRequired === 'boolean') {
      updateData.contract_required = contractRequired;
    }

    const { error } = await this.client
      .from('processing_vendors')
      .update(updateData)
      .eq('processing_activity_id', processingActivityId)
      .eq('vendor_id', vendorId);

    if (error) {
      throw new Error(`Failed to update vendor role: ${error.message}`);
    }
  }

  /**
   * Get vendors for processing activity
   */
  async getVendors(processingActivityId: UUID): Promise<any[]> {
    const { data, error } = await this.client
      .from('processing_vendors')
      .select(`
        vendor_role,
        contract_required,
        created_at,
        vendor:vendor_id(*)
      `)
      .eq('processing_activity_id', processingActivityId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch vendors for processing activity: ${error.message}`);
    }

    return data || [];
  }

  // Retention policy relationship management

  /**
   * Add retention policy to processing activity
   */
  async addRetentionPolicy(processingActivityId: UUID, request: AddRetentionPolicyToProcessingRequest): Promise<void> {
    const { error } = await this.client
      .from('processing_retention')
      .insert({
        processing_activity_id: processingActivityId,
        retention_policy_id: request.retention_policy_id,
        applies_to_category: request.applies_to_category || null,
        created_by: this.context.sub,
      });

    if (error) {
      throw new Error(`Failed to add retention policy to processing activity: ${error.message}`);
    }
  }

  /**
   * Remove retention policy from processing activity
   */
  async removeRetentionPolicy(processingActivityId: UUID, retentionPolicyId: UUID): Promise<void> {
    const { error } = await this.client
      .from('processing_retention')
      .delete()
      .eq('processing_activity_id', processingActivityId)
      .eq('retention_policy_id', retentionPolicyId);

    if (error) {
      throw new Error(`Failed to remove retention policy from processing activity: ${error.message}`);
    }
  }

  /**
   * Get retention policies for processing activity
   */
  async getRetentionPolicies(processingActivityId: UUID): Promise<any[]> {
    const { data, error } = await this.client
      .from('processing_retention')
      .select(`
        applies_to_category,
        created_at,
        retention_policy:retention_policy_id(*)
      `)
      .eq('processing_activity_id', processingActivityId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch retention policies for processing activity: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Get processing activity statistics
   */
  async getStatistics(): Promise<{
    total_activities: number;
    by_lawful_basis: Record<string, number>;
    requiring_dpo_review: number;
    overdue_reviews: number;
    by_status: Record<string, number>;
    with_special_categories: number;
    with_automated_decision_making: number;
    with_profiling: number;
  }> {
    // Get all activities for statistics
    const { data: activities, error } = await this.client
      .from('processing_activities')
      .select('*');

    if (error) {
      throw new Error(`Failed to fetch activities for statistics: ${error.message}`);
    }

    const today = new Date().toISOString().split('T')[0];

    const stats = {
      total_activities: activities.length,
      by_lawful_basis: {} as Record<string, number>,
      requiring_dpo_review: 0,
      overdue_reviews: 0,
      by_status: {} as Record<string, number>,
      with_special_categories: 0,
      with_automated_decision_making: 0,
      with_profiling: 0,
    };

    activities.forEach(activity => {
      // Count by lawful basis
      stats.by_lawful_basis[activity.lawful_basis] = (stats.by_lawful_basis[activity.lawful_basis] || 0) + 1;

      // Count by status
      stats.by_status[activity.status] = (stats.by_status[activity.status] || 0) + 1;

      // Count DPO reviews
      if (activity.dpo_review_required) {
        stats.requiring_dpo_review += 1;
      }

      // Count overdue reviews
      if (activity.review_date && activity.review_date < today && activity.status === 'active') {
        stats.overdue_reviews += 1;
      }

      // Count special categories
      if (activity.special_category_basis) {
        stats.with_special_categories += 1;
      }

      // Count automated decision making
      if (activity.automated_decision_making) {
        stats.with_automated_decision_making += 1;
      }

      // Count profiling
      if (activity.profiling) {
        stats.with_profiling += 1;
      }
    });

    return stats;
  }

  /**
   * Search processing activities with advanced filters
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
    let query = this.client.from('processing_activities').select('*');

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,purpose.ilike.%${filters.search}%`);
    }

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.lawful_bases?.length) {
      query = query.in('lawful_basis', filters.lawful_bases);
    }

    if (filters.special_category_bases?.length) {
      query = query.in('special_category_basis', filters.special_category_bases);
    }

    if (typeof filters.dpo_review_required === 'boolean') {
      query = query.eq('dpo_review_required', filters.dpo_review_required);
    }

    if (typeof filters.automated_decision_making === 'boolean') {
      query = query.eq('automated_decision_making', filters.automated_decision_making);
    }

    if (typeof filters.profiling === 'boolean') {
      query = query.eq('profiling', filters.profiling);
    }

    if (filters.review_overdue) {
      const today = new Date().toISOString().split('T')[0];
      query = query.lt('review_date', today);
    }

    // Filter by related entities
    if (filters.systems?.length) {
      const { data: processingSystems } = await this.client
        .from('processing_systems')
        .select('processing_activity_id')
        .in('system_id', filters.systems);

      if (processingSystems?.length) {
        const activityIds = [...new Set(processingSystems.map(ps => ps.processing_activity_id))];
        query = query.in('id', activityIds);
      }
    }

    if (filters.data_categories?.length) {
      const { data: processingDataCategories } = await this.client
        .from('processing_data_categories')
        .select('processing_activity_id')
        .in('data_category_id', filters.data_categories);

      if (processingDataCategories?.length) {
        const activityIds = [...new Set(processingDataCategories.map(pdc => pdc.processing_activity_id))];
        query = query.in('id', activityIds);
      }
    }

    if (filters.vendors?.length) {
      const { data: processingVendors } = await this.client
        .from('processing_vendors')
        .select('processing_activity_id')
        .in('vendor_id', filters.vendors);

      if (processingVendors?.length) {
        const activityIds = [...new Set(processingVendors.map(pv => pv.processing_activity_id))];
        query = query.in('id', activityIds);
      }
    }

    query = query.order('name', { ascending: true });

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to perform advanced processing activity search: ${error.message}`);
    }

    return data as ProcessingActivity[];
  }
}