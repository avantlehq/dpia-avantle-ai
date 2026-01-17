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
   * Override findMany - table has country_code, not jurisdiction_id
   */
  async findMany(params: PhysicalLocationQueryParams = {}): Promise<{
    data: PhysicalLocation[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }> {
    const { page = 1, limit = 20, search, status, jurisdiction_id } = params;

    // Direct query without deleted_at filter (column doesn't exist)
    let query = this.client
      .from('physical_locations')
      .select('*', { count: 'exact' })
      .eq('workspace_id', this.context.workspace_id);

    if (status) {
      query = query.eq('status', status);
    }

    // Search only by name (description, city, address columns don't exist)
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    // If filtering by jurisdiction_id, fetch country_code first
    if (jurisdiction_id) {
      const { data: jurisdiction } = await this.client
        .from('jurisdictions')
        .select('country_code')
        .eq('id', jurisdiction_id)
        .single();

      if (jurisdiction) {
        query = query.eq('country_code', jurisdiction.country_code);
      }
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      throw new Error(`Physical locations query failed: ${error.message}`);
    }

    // Enrich all locations with jurisdiction_id from country_code
    const enrichedData = await Promise.all(
      (data || []).map(location => this.enrichWithJurisdictionId(location))
    );

    return {
      data: enrichedData,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    };
  }

  /**
   * Helper: Enrich location with jurisdiction_id from country_code
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async enrichWithJurisdictionId(location: any): Promise<PhysicalLocation> {
    if (location.country_code) {
      const { data: jurisdiction } = await this.client
        .from('jurisdictions')
        .select('id')
        .eq('country_code', location.country_code)
        .single();

      if (jurisdiction) {
        location.jurisdiction_id = jurisdiction.id;
      }
    }

    return location as PhysicalLocation;
  }

  /**
   * Override findById - physical_locations table may be missing deleted_at column
   */
  async findById(id: UUID, include?: string[]): Promise<PhysicalLocation | null> {
    let query = this.client
      .from('physical_locations')
      .select('*');

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

    // Enrich with jurisdiction_id from country_code
    return this.enrichWithJurisdictionId(data);
  }

  /**
   * Override prepareCreateData - table has country_code, not jurisdiction_id
   *
   * NOTE: This method must fetch jurisdiction to get country_code
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected async prepareCreateDataAsync(data: CreatePhysicalLocationRequest): Promise<any> {
    // Fetch jurisdiction to get country_code
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
      country_code: jurisdiction.country_code, // Table has country_code, not jurisdiction_id
      tenant_id: this.context.tenant_id,
      workspace_id: this.context.workspace_id,
      // Note: description, address, city columns don't exist in production
      // Note: status has database default
      // Note: created_by, updated_by columns don't exist in production
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

    // Enrich with jurisdiction_id from country_code
    return this.enrichWithJurisdictionId(created);
  }

  /**
   * Override prepareUpdateData - table has country_code, not jurisdiction_id
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected async prepareUpdateDataAsync(data: UpdatePhysicalLocationRequest): Promise<any> {
    const allowedFields: Record<string, unknown> = {
      name: data.name,
      status: data.status,
      // Note: description, address, city columns don't exist in production
      // Note: updated_by column doesn't exist in production
    };

    // If jurisdiction_id provided, fetch country_code
    if (data.jurisdiction_id) {
      const { data: jurisdiction, error: jurisdictionError } = await this.client
        .from('jurisdictions')
        .select('country_code')
        .eq('id', data.jurisdiction_id)
        .single();

      if (jurisdictionError || !jurisdiction) {
        throw new Error('Invalid jurisdiction_id - jurisdiction not found');
      }

      allowedFields.country_code = jurisdiction.country_code;
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

    // Enrich with jurisdiction_id from country_code
    return this.enrichWithJurisdictionId(updated);
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
   *
   * NOTE: Table has country_code, not jurisdiction_id
   */
  async findByJurisdiction(jurisdictionId: UUID): Promise<PhysicalLocation[]> {
    // Fetch jurisdiction to get country_code
    const { data: jurisdiction } = await this.client
      .from('jurisdictions')
      .select('country_code')
      .eq('id', jurisdictionId)
      .single();

    if (!jurisdiction) {
      return [];
    }

    const { data, error } = await this.client
      .from('physical_locations')
      .select('*')
      .eq('country_code', jurisdiction.country_code)
      .eq('status', 'active')
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch locations by jurisdiction: ${error.message}`);
    }

    // Enrich all locations with jurisdiction_id from country_code
    return Promise.all((data || []).map(location => this.enrichWithJurisdictionId(location)));
  }

  /**
   * Get locations by city
   *
   * NOTE: city column doesn't exist in production - method disabled
   */
  async findByCity(_city: string): Promise<PhysicalLocation[]> {
    // city column doesn't exist in production - return empty array
    return [];
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
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch available locations: ${error.message}`);
    }

    // Enrich all locations with jurisdiction_id from country_code
    return Promise.all((data || []).map(location => this.enrichWithJurisdictionId(location)));
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
   * Override delete to check for usage and use hard delete (deleted_at column doesn't exist)
   */
  async delete(id: UUID): Promise<void> {
    // Check if location is being used
    const usage = await this.getLocationUsage(id);

    if (usage.total_usage > 0) {
      throw new Error('Cannot delete location that is being used by systems or vendors');
    }

    // Hard delete since deleted_at column doesn't exist
    const { error } = await this.client
      .from('physical_locations')
      .delete()
      .eq('id', id)
      .eq('workspace_id', this.context.workspace_id);

    if (error) {
      throw new Error(`Failed to delete physical_locations: ${error.message}`);
    }
  }

  /**
   * Search locations with advanced filters
   *
   * NOTE: Table has country_code, not jurisdiction_id
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
      .select('*');

    // Search only by name (description, address columns don't exist)
    if (filters.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }

    // Apply status filter
    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    // Apply jurisdiction filter (convert jurisdiction IDs to country codes)
    if (filters.jurisdictions?.length) {
      const { data: jurisdictions } = await this.client
        .from('jurisdictions')
        .select('country_code')
        .in('id', filters.jurisdictions);

      if (jurisdictions?.length) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const countryCodes = jurisdictions.map((j: any) => j.country_code);
        query = query.in('country_code', countryCodes);
      }
    }

    // City filter ignored (city column doesn't exist)
    // if (filters.cities?.length) { ... }

    // Apply GDPR adequacy filter (convert to country codes)
    if (filters.gdpr_adequacy_only) {
      const { data: adequateJurisdictions } = await this.client
        .from('jurisdictions')
        .select('country_code')
        .eq('gdpr_adequacy', true);

      if (adequateJurisdictions?.length) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const countryCodes = adequateJurisdictions.map((j: any) => j.country_code);
        query = query.in('country_code', countryCodes);
      }
    }

    query = query.order('name', { ascending: true });

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to perform advanced location search: ${error.message}`);
    }

    // Enrich all locations with jurisdiction_id from country_code
    return Promise.all((data || []).map(location => this.enrichWithJurisdictionId(location)));
  }
}