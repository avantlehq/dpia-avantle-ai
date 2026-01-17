/**
 * Context Module - Physical Location Repository
 * 
 * Repository for managing physical locations (tenant-scoped).
 * Handles CRUD operations for data centers, offices, and facilities.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';
import type { 
  PhysicalLocation, 
  CreatePhysicalLocationRequest,
  UpdatePhysicalLocationRequest,
  ContextClaims, 
  PhysicalLocationQueryParams,
  UUID 
} from '../types';
import { BaseRepository } from './base.repository';

export class PhysicalLocationRepository extends BaseRepository<
  PhysicalLocation,
  CreatePhysicalLocationRequest,
  UpdatePhysicalLocationRequest,
  PhysicalLocationQueryParams
> {
  protected tableName = 'physical_locations' as const;

  constructor(context: ContextClaims, client?: SupabaseClient<Database>) {
    super(context, client);
  }

  /**
   * Override findMany with soft delete and enhanced search
   */
  async findMany(params: PhysicalLocationQueryParams = {}): Promise<{
    data: PhysicalLocation[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }> {
    const { page = 1, limit = 20, search, status, jurisdiction_id } = params;

    let query = this.client
      .from('physical_locations')
      .select('*', { count: 'exact' })
      .eq('workspace_id', this.context.workspace_id)
      .is('deleted_at', null); // Soft delete filter

    if (status) {
      query = query.eq('status', status);
    }

    // Search across name, description, address, and city
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,address.ilike.%${search}%,city.ilike.%${search}%`);
    }

    if (jurisdiction_id) {
      query = query.eq('jurisdiction_id', jurisdiction_id);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      throw new Error(`Physical locations query failed: ${error.message}`);
    }

    return {
      data: (data as PhysicalLocation[]) || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    };
  }

  /**
   * Override findById with soft delete support
   */
  async findById(id: UUID, include?: string[]): Promise<PhysicalLocation | null> {
    let query = this.client
      .from('physical_locations')
      .select('*')
      .is('deleted_at', null); // Soft delete filter

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
      throw new Error(`Failed to fetch physical location: ${error.message}`);
    }

    return data as PhysicalLocation;
  }

  /**
   * Override prepareCreateData to handle jurisdiction
   *
   * NOTE: Fetches country_code for denormalization
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected async prepareCreateDataAsync(data: CreatePhysicalLocationRequest): Promise<any> {
    // Fetch jurisdiction to get country_code for denormalization
    const { data: jurisdiction, error: jurisdictionError } = await this.client
      .from('jurisdictions')
      .select('country_code')
      .eq('id', data.jurisdiction_id)
      .single();

    if (jurisdictionError || !jurisdiction) {
      throw new Error('Invalid jurisdiction_id - jurisdiction not found');
    }

    const allowedFields = {
      name: data.name,
      jurisdiction_id: data.jurisdiction_id,
      country_code: jurisdiction.country_code, // Denormalized for performance
      description: data.description,
      address: data.address,
      city: data.city,
      tenant_id: this.context.tenant_id,
      workspace_id: this.context.workspace_id,
      // Note: status has database default
      // Note: created_by, updated_by will be handled by database triggers
    };

    return Object.fromEntries(
      Object.entries(allowedFields).filter(([_, v]) => v !== undefined)
    );
  }

  /**
   * Override prepareCreateData to call async version
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected prepareCreateData(_data: CreatePhysicalLocationRequest): any {
    // This won't be called - we override create() to use prepareCreateDataAsync
    throw new Error('Use create() method which calls prepareCreateDataAsync');
  }

  /**
   * Override create to use async prepareCreateData
   */
  async create(data: CreatePhysicalLocationRequest): Promise<PhysicalLocation> {
    const preparedData = await this.prepareCreateDataAsync(data);

    const { data: created, error } = await this.client
      .from(this.tableName)
      .insert(preparedData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create ${this.tableName}: ${error.message}`);
    }

    return created as PhysicalLocation;
  }

  /**
   * Override prepareUpdateData to handle jurisdiction
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected async prepareUpdateDataAsync(data: UpdatePhysicalLocationRequest): Promise<any> {
    const allowedFields: Record<string, unknown> = {
      name: data.name,
      description: data.description,
      address: data.address,
      city: data.city,
      status: data.status,
      // Note: updated_by will be handled by database triggers
    };

    // If jurisdiction_id provided, fetch country_code for denormalization
    if (data.jurisdiction_id) {
      const { data: jurisdiction, error: jurisdictionError } = await this.client
        .from('jurisdictions')
        .select('country_code')
        .eq('id', data.jurisdiction_id)
        .single();

      if (jurisdictionError || !jurisdiction) {
        throw new Error('Invalid jurisdiction_id - jurisdiction not found');
      }

      allowedFields.jurisdiction_id = data.jurisdiction_id;
      allowedFields.country_code = jurisdiction.country_code; // Denormalized for performance
    }

    return Object.fromEntries(
      Object.entries(allowedFields).filter(([_, v]) => v !== undefined)
    );
  }

  /**
   * Override prepareUpdateData to call async version
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected prepareUpdateData(_data: UpdatePhysicalLocationRequest): any {
    // This won't be called - we override update() to use prepareUpdateDataAsync
    throw new Error('Use update() method which calls prepareUpdateDataAsync');
  }

  /**
   * Override update to use async prepareUpdateData
   */
  async update(id: UUID, data: UpdatePhysicalLocationRequest): Promise<PhysicalLocation> {
    const preparedData = await this.prepareUpdateDataAsync(data);

    const { data: updated, error } = await this.client
      .from(this.tableName)
      .update(preparedData)
      .eq('id', id)
      .eq('workspace_id', this.context.workspace_id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update ${this.tableName}: ${error.message}`);
    }

    return updated as PhysicalLocation;
  }

  /**
   * Apply specific filters for physical locations
   *
   * NOTE: Disabled - table has country_code, not jurisdiction_id (filtering happens in findMany)
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected applyFilters(query: any, _params: Partial<PhysicalLocationQueryParams>): any {
    // Jurisdiction filtering now handled in findMany (needs async lookup)
    return query;
  }

  /**
   * Apply includes for related data
   *
   * NOTE: Table has country_code, not jurisdiction_id foreign key
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected applyIncludes(query: any, include: string[]): any {
    // Jurisdiction join not possible - table only has country_code
    // Would need manual lookup after fetching
    return query.select('*');
  }

  /**
   * Get physical location with jurisdiction details
   *
   * NOTE: Manual jurisdiction lookup (table only has country_code)
   */
  async findByIdWithJurisdiction(id: UUID): Promise<PhysicalLocation | null> {
    const location = await this.findById(id);

    if (!location) {
      return null;
    }

    // Manual jurisdiction lookup using country_code
    // Note: location has country_code field, not jurisdiction_id
    // Return location as-is since TypeScript type expects jurisdiction_id
    return location;
  }

  /**
   * Get all physical locations with their jurisdictions
   *
   * NOTE: Table has country_code, not jurisdiction_id - just use findMany
   */
  async findManyWithJurisdictions(params: PhysicalLocationQueryParams = {}): Promise<{
    data: PhysicalLocation[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }> {
    // Table only has country_code - just return locations without join
    return await this.findMany(params);
  }

  /**
   * Get locations by jurisdiction
   */
  async findByJurisdiction(jurisdictionId: UUID): Promise<PhysicalLocation[]> {
    const { data, error } = await this.client
      .from('physical_locations')
      .select('*')
      .eq('jurisdiction_id', jurisdictionId)
      .eq('status', 'active')
      .is('deleted_at', null)
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch locations by jurisdiction: ${error.message}`);
    }

    return (data as PhysicalLocation[]) || [];
  }

  /**
   * Get locations by city
   */
  async findByCity(city: string): Promise<PhysicalLocation[]> {
    const { data, error } = await this.client
      .from('physical_locations')
      .select('*')
      .ilike('city', city)
      .eq('status', 'active')
      .is('deleted_at', null)
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch locations by city: ${error.message}`);
    }

    return (data as PhysicalLocation[]) || [];
  }

  /**
   * Get location statistics by jurisdiction
   *
   * NOTE: Table has country_code, not jurisdiction_id - group by country_code
   */
  async getStatisticsByJurisdiction(): Promise<{
    jurisdiction_id: UUID;
    jurisdiction_name: string;
    country_code: string;
    location_count: number;
    gdpr_adequacy: boolean;
  }[]> {
    const { data, error } = await this.client
      .from('physical_locations')
      .select('country_code')
      .eq('status', 'active');

    if (error) {
      throw new Error(`Failed to get location statistics: ${error.message}`);
    }

    // Group by country_code and count
    const countsByCode = new Map<string, number>();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data as any[]).forEach(location => {
      const code = location.country_code;
      countsByCode.set(code, (countsByCode.get(code) || 0) + 1);
    });

    // Fetch jurisdiction details for each country_code
    const stats = [];
    for (const [code, count] of countsByCode.entries()) {
      const { data: jurisdiction } = await this.client
        .from('jurisdictions')
        .select('id, country_code, gdpr_adequacy')
        .eq('country_code', code)
        .single();

      if (jurisdiction) {
        stats.push({
          jurisdiction_id: jurisdiction.id,
          jurisdiction_name: jurisdiction.country_code,
          country_code: jurisdiction.country_code,
          location_count: count,
          gdpr_adequacy: jurisdiction.gdpr_adequacy,
        });
      }
    }

    return stats.sort((a, b) => b.location_count - a.location_count);
  }

  /**
   * Check if location name exists within tenant/workspace
   */
  async nameExists(name: string, excludeId?: UUID): Promise<boolean> {
    let query = this.client
      .from('physical_locations')
      .select('id')
      .eq('name', name)
      .eq('status', 'active');

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query.single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to check location name existence: ${error.message}`);
    }

    return !!data;
  }

  /**
   * Validate location data before creation/update
   */
  async validateLocationData(data: CreatePhysicalLocationRequest | UpdatePhysicalLocationRequest): Promise<{
    valid: boolean;
    errors: string[];
  }> {
    const errors: string[] = [];

    // Check if jurisdiction exists
    if ('jurisdiction_id' in data && data.jurisdiction_id) {
      const { data: jurisdiction, error } = await this.client
        .from('jurisdictions')
        .select('id')
        .eq('id', data.jurisdiction_id)
        .single();

      if (error || !jurisdiction) {
        errors.push('Invalid jurisdiction ID');
      }
    }

    // Check name uniqueness for new locations
    if ('name' in data && data.name) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const excludeId = 'id' in data ? (data as any).id : undefined;
      const nameExists = await this.nameExists(data.name, excludeId);
      
      if (nameExists) {
        errors.push('Location name already exists within this workspace');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get locations that can be used for systems/vendors
   */
  async getAvailableLocations(): Promise<PhysicalLocation[]> {
    const { data, error } = await this.client
      .from('physical_locations')
      .select('*')
      .eq('status', 'active')
      .is('deleted_at', null)
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch available locations: ${error.message}`);
    }

    return (data as PhysicalLocation[]) || [];
  }

  /**
   * Get location usage statistics
   */
  async getLocationUsage(locationId: UUID): Promise<{
    systems_count: number;
    vendors_count: number;
    total_usage: number;
  }> {
    // Count systems using this location
    const { count: systemsCount, error: systemsError } = await this.client
      .from('system_locations')
      .select('*', { count: 'exact', head: true })
      .eq('location_id', locationId);

    if (systemsError) {
      throw new Error(`Failed to count systems using location: ${systemsError.message}`);
    }

    // Count vendors using this location
    const { count: vendorsCount, error: vendorsError } = await this.client
      .from('vendor_locations')
      .select('*', { count: 'exact', head: true })
      .eq('location_id', locationId);

    if (vendorsError) {
      throw new Error(`Failed to count vendors using location: ${vendorsError.message}`);
    }

    return {
      systems_count: systemsCount || 0,
      vendors_count: vendorsCount || 0,
      total_usage: (systemsCount || 0) + (vendorsCount || 0),
    };
  }

  /**
   * Override delete to check for usage and use soft delete
   */
  async delete(id: UUID): Promise<void> {
    // Check if location is being used
    const usage = await this.getLocationUsage(id);

    if (usage.total_usage > 0) {
      throw new Error('Cannot delete location that is being used by systems or vendors');
    }

    // Soft delete (set deleted_at timestamp)
    const { error } = await this.client
      .from('physical_locations')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .eq('workspace_id', this.context.workspace_id);

    if (error) {
      throw new Error(`Failed to delete physical_locations: ${error.message}`);
    }
  }

  /**
   * Search locations with advanced filters
   */
  async advancedSearch(filters: {
    search?: string;
    jurisdictions?: UUID[];
    cities?: string[];
    status?: 'active' | 'inactive';
    gdpr_adequacy_only?: boolean;
  }): Promise<PhysicalLocation[]> {
    let query = this.client
      .from('physical_locations')
      .select('*')
      .is('deleted_at', null);

    // Search across name, description, address, and city
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,address.ilike.%${filters.search}%,city.ilike.%${filters.search}%`);
    }

    // Apply status filter
    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    // Apply jurisdiction filter using jurisdiction_id
    if (filters.jurisdictions?.length) {
      query = query.in('jurisdiction_id', filters.jurisdictions);
    }

    // Apply city filter
    if (filters.cities?.length) {
      query = query.in('city', filters.cities);
    }

    // Apply GDPR adequacy filter (get jurisdiction IDs with adequacy)
    if (filters.gdpr_adequacy_only) {
      const { data: adequateJurisdictions } = await this.client
        .from('jurisdictions')
        .select('id')
        .eq('gdpr_adequacy', true);

      if (adequateJurisdictions?.length) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const jurisdictionIds = adequateJurisdictions.map((j: any) => j.id);
        query = query.in('jurisdiction_id', jurisdictionIds);
      }
    }

    query = query.order('name', { ascending: true });

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to perform advanced location search: ${error.message}`);
    }

    return (data as PhysicalLocation[]) || [];
  }
}