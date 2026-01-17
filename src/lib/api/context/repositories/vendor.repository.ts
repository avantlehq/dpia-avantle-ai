/**
 * Context Module - Vendor Repository
 * 
 * Repository for managing vendors (external service providers and processors).
 * Handles vendor CRUD operations, contracts, and location relationships.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';
import type { 
  Vendor, 
  VendorContract,
  CreateVendorRequest,
  UpdateVendorRequest,
  ContextClaims, 
  ListQueryParams,
  PaginatedResponse,
  UUID,
  EntityStatus,
  ContractStatus
} from '../types';
import { BaseRepository } from './base.repository';

export class VendorRepository extends BaseRepository<
  Vendor,
  CreateVendorRequest,
  UpdateVendorRequest,
  ListQueryParams
> {
  protected tableName = 'vendors' as const;

  constructor(context: ContextClaims, client?: SupabaseClient<Database>) {
    super(context, client);
  }

  /**
   * Override to disable automatic status filtering - causing issues
   */
  protected supportsStatus(): boolean {
    return false; // Temporarily disable until status enum is fixed
  }

  /**
   * Override prepareCreateData - handle vendor-specific fields
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected prepareCreateData(data: CreateVendorRequest): any {
    const allowedFields = {
      name: data.name,
      description: data.description,
      website: data.website,
      contact_email: data.contact_email,
      primary_contact: data.primary_contact,
      vendor_role: data.vendor_role || 'processor', // Use provided value or default
      status: data.status,
      has_dpa: data.has_dpa,
      dpa_expires: data.dpa_expires,
      location: data.location,
      tenant_id: this.context.tenant_id,
      workspace_id: this.context.workspace_id,
      // Note: created_by and updated_by will be handled by database triggers
    };

    return Object.fromEntries(
      Object.entries(allowedFields).filter(([_, v]) => v !== undefined)
    );
  }

  /**
   * Override prepareUpdateData - handle vendor-specific fields
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected prepareUpdateData(data: UpdateVendorRequest): any {
    const allowedFields = {
      name: data.name,
      description: data.description,
      website: data.website,
      contact_email: data.contact_email,
      primary_contact: data.primary_contact,
      vendor_role: data.vendor_role,
      status: data.status,
      has_dpa: data.has_dpa,
      dpa_expires: data.dpa_expires,
      location: data.location,
      // Note: updated_by will be handled by database triggers
    };

    return Object.fromEntries(
      Object.entries(allowedFields).filter(([_, v]) => v !== undefined)
    );
  }

  /**
   * Override findById - vendors table doesn't have deleted_at column
   */
  async findById(id: UUID, include?: string[]): Promise<Vendor | null> {
    let query = this.client
      .from('vendors')
      .select('*');

    // Apply includes if supported
    if (include?.length) {
      query = this.applyIncludes(query, include);
    }

    const { data, error } = await query
      .eq('id', id)
      .eq('workspace_id', this.context.workspace_id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch vendor: ${error.message}`);
    }

    return data as Vendor;
  }

  /**
   * Override findMany - vendors table doesn't have deleted_at column
   */
  async findMany(params: ListQueryParams = {}): Promise<PaginatedResponse<Vendor>> {
    const { page = 1, limit = 20 } = params;

    // Direct query without deleted_at filter (column doesn't exist)
    const { data, error, count } = await this.client
      .from('vendors')
      .select('*', { count: 'exact' })
      .eq('workspace_id', this.context.workspace_id)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      throw new Error(`Vendors query failed: ${error.message}`);
    }

    return {
      data: data as Vendor[],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    };
  }

  /**
   * Apply includes for related data
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected applyIncludes(query: any, include: string[]): any {
    let selectFields = '*';

    if (include.includes('contracts')) {
      selectFields += ', contracts:vendor_contracts(*)';
    }

    if (include.includes('locations')) {
      selectFields += ', locations:vendor_locations(location_id, physical_locations(*))';
    }

    return query.select(selectFields);
  }

  /**
   * Get vendor with all related data
   */
  async findByIdWithRelations(id: UUID): Promise<Vendor | null> {
    const { data, error } = await this.client
      .from('vendors')
      .select(`
        *,
        contracts:vendor_contracts(*),
        locations:vendor_locations(
          location_id,
          physical_locations(*, jurisdiction:jurisdiction_id(*))
        )
      `)
      .eq('id', id)
      .eq('workspace_id', this.context.workspace_id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch vendor with relations: ${error.message}`);
    }

    // Transform the data to match Vendor type
    const transformedData: Vendor = {
      ...data,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      locations: data.locations?.map((loc: any) => loc.physical_locations) || [],
      status: data.status as EntityStatus,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      contracts: data.contracts?.map((contract: any) => ({
        ...contract,
        status: contract.status as ContractStatus
      })) || []
    };

    return transformedData;
  }

  /**
   * Get vendors by status with contract counts
   */
  async findManyWithContractCounts(params: ListQueryParams = {}): Promise<{
    data: (Vendor & { contract_count: number })[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }> {
    const {
      page = 1,
      limit = 20,
      search,
      status,
    } = params;

    let query = this.client
      .from('vendors')
      .select(`
        *,
        contracts:vendor_contracts(count)
      `, { count: 'exact' });

    if (status) {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,website.ilike.%${search}%`);
    }

    query = query.order('created_at', { ascending: false });

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch vendors with contract counts: ${error.message}`);
    }

    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: data as any,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    };
  }

  /**
   * Check if vendor name exists
   */
  async nameExists(name: string, excludeId?: UUID): Promise<boolean> {
    let query = this.client
      .from('vendors')
      .select('id')
      .eq('name', name)
      .eq('status', 'active');

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query.single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to check vendor name existence: ${error.message}`);
    }

    return !!data;
  }

  /**
   * Get vendor usage in processing activities
   */
  async getUsageStatistics(vendorId: UUID): Promise<{
    processing_activities_count: number;
    active_contracts_count: number;
    locations_count: number;
  }> {
    const [processingActivities, activeContracts, locations] = await Promise.all([
      this.client
        .from('processing_vendors')
        .select('*', { count: 'exact', head: true })
        .eq('vendor_id', vendorId),
      
      this.client
        .from('vendor_contracts')
        .select('*', { count: 'exact', head: true })
        .eq('vendor_id', vendorId)
        .eq('status', 'active'),
      
      this.client
        .from('vendor_locations')
        .select('*', { count: 'exact', head: true })
        .eq('vendor_id', vendorId)
    ]);

    if (processingActivities.error) {
      throw new Error(`Failed to count processing activities: ${processingActivities.error.message}`);
    }
    if (activeContracts.error) {
      throw new Error(`Failed to count active contracts: ${activeContracts.error.message}`);
    }
    if (locations.error) {
      throw new Error(`Failed to count locations: ${locations.error.message}`);
    }

    return {
      processing_activities_count: processingActivities.count || 0,
      active_contracts_count: activeContracts.count || 0,
      locations_count: locations.count || 0,
    };
  }

  /**
   * Override delete to check for usage
   *
   * NOTE: deleted_at column doesn't exist in production - using hard delete
   */
  async delete(id: UUID): Promise<void> {
    const usage = await this.getUsageStatistics(id);

    if (usage.processing_activities_count > 0) {
      throw new Error('Cannot delete vendor that is used in processing activities');
    }

    // Hard delete since deleted_at column doesn't exist
    const { error } = await this.client
      .from('vendors')
      .delete()
      .eq('id', id)
      .eq('workspace_id', this.context.workspace_id);

    if (error) {
      throw new Error(`Failed to delete vendors: ${error.message}`);
    }
  }

  // Contract management methods

  /**
   * Add contract to vendor
   */
  async addContract(vendorId: UUID, contractData: {
    contract_type: string;
    reference_number?: string;
    start_date: string;
    end_date?: string;
    review_date?: string;
    status?: 'draft' | 'active' | 'expired' | 'terminated';
  }): Promise<VendorContract> {
    const { data, error } = await this.client
      .from('vendor_contracts')
      .insert({
        ...contractData,
        vendor_id: vendorId,
        tenant_id: this.context.tenant_id,
        workspace_id: this.context.workspace_id,
        created_by: this.context.sub,
        updated_by: this.context.sub,
        status: contractData.status || 'draft',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to add vendor contract: ${error.message}`);
    }

    return data as VendorContract;
  }

  /**
   * Update vendor contract
   */
  async updateContract(contractId: UUID, contractData: Partial<{
    contract_type: string;
    reference_number: string;
    start_date: string;
    end_date: string;
    review_date: string;
    status: 'draft' | 'active' | 'expired' | 'terminated';
  }>): Promise<VendorContract> {
    const { data, error } = await this.client
      .from('vendor_contracts')
      .update({
        ...contractData,
        updated_by: this.context.sub,
      })
      .eq('id', contractId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update vendor contract: ${error.message}`);
    }

    return data as VendorContract;
  }

  /**
   * Remove contract from vendor
   */
  async removeContract(contractId: UUID): Promise<void> {
    const { error } = await this.client
      .from('vendor_contracts')
      .update({
        deleted_at: new Date().toISOString(),
        updated_by: this.context.sub,
      })
      .eq('id', contractId);

    if (error) {
      throw new Error(`Failed to remove vendor contract: ${error.message}`);
    }
  }

  /**
   * Get vendor contracts
   */
  async getContracts(vendorId: UUID): Promise<VendorContract[]> {
    const { data, error } = await this.client
      .from('vendor_contracts')
      .select('*')
      .eq('vendor_id', vendorId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch vendor contracts: ${error.message}`);
    }

    return data as VendorContract[];
  }

  /**
   * Get active contracts
   */
  async getActiveContracts(vendorId: UUID): Promise<VendorContract[]> {
    const { data, error } = await this.client
      .from('vendor_contracts')
      .select('*')
      .eq('vendor_id', vendorId)
      .eq('status', 'active')
      .is('deleted_at', null)
      .order('start_date', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch active vendor contracts: ${error.message}`);
    }

    return data as VendorContract[];
  }

  /**
   * Get contracts requiring review
   */
  async getContractsRequiringReview(vendorId?: UUID): Promise<VendorContract[]> {
    const today = new Date().toISOString().split('T')[0];
    
    let query = this.client
      .from('vendor_contracts')
      .select('*, vendor:vendor_id(*)')
      .lte('review_date', today)
      .eq('status', 'active')
      .is('deleted_at', null);

    if (vendorId) {
      query = query.eq('vendor_id', vendorId);
    }

    query = query.order('review_date', { ascending: true });

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch contracts requiring review: ${error.message}`);
    }

    return data as VendorContract[];
  }

  // Location management methods

  /**
   * Add location to vendor
   */
  async addLocation(vendorId: UUID, locationId: UUID): Promise<void> {
    const { error } = await this.client
      .from('vendor_locations')
      .insert({
        vendor_id: vendorId,
        location_id: locationId,
        created_by: this.context.sub,
      });

    if (error) {
      throw new Error(`Failed to add location to vendor: ${error.message}`);
    }
  }

  /**
   * Remove location from vendor
   */
  async removeLocation(vendorId: UUID, locationId: UUID): Promise<void> {
    const { error } = await this.client
      .from('vendor_locations')
      .delete()
      .eq('vendor_id', vendorId)
      .eq('location_id', locationId);

    if (error) {
      throw new Error(`Failed to remove location from vendor: ${error.message}`);
    }
  }

  /**
   * Get vendor locations
   */
  async getLocations(vendorId: UUID): Promise<unknown[]> {
    const { data, error } = await this.client
      .from('vendor_locations')
      .select(`
        location_id,
        created_at,
        physical_locations(*, jurisdiction:jurisdiction_id(*))
      `)
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch vendor locations: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Search vendors with advanced filters
   */
  async advancedSearch(filters: {
    search?: string;
    status?: 'active' | 'inactive';
    has_active_contracts?: boolean;
    contract_types?: string[];
    locations?: UUID[];
  }): Promise<Vendor[]> {
    let query = this.client.from('vendors').select('*');

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,website.ilike.%${filters.search}%`);
    }

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    // Filter by active contracts
    if (filters.has_active_contracts !== undefined) {
      if (filters.has_active_contracts) {
        const { data: vendorsWithContracts } = await this.client
          .from('vendor_contracts')
          .select('vendor_id')
          .eq('status', 'active')
          .is('deleted_at', null);

        if (vendorsWithContracts?.length) {
          const vendorIds = [...new Set(vendorsWithContracts.map((v: Record<string, unknown>) => v.vendor_id as string))];
          query = query.in('id', vendorIds);
        }
      }
    }

    // Filter by locations
    if (filters.locations?.length) {
      const { data: vendorLocations } = await this.client
        .from('vendor_locations')
        .select('vendor_id')
        .in('location_id', filters.locations);

      if (vendorLocations?.length) {
        const vendorIds = [...new Set(vendorLocations.map((vl: Record<string, unknown>) => vl.vendor_id as string))];
        query = query.in('id', vendorIds);
      }
    }

    query = query.order('name', { ascending: true });

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to perform advanced vendor search: ${error.message}`);
    }

    return data as Vendor[];
  }
}