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
   * Apply specific filters for physical locations
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected applyFilters(query: any, params: Partial<PhysicalLocationQueryParams>): any {
    let filteredQuery = query;

    // Filter by jurisdiction
    if (params.jurisdiction_id) {
      filteredQuery = filteredQuery.eq('jurisdiction_id', params.jurisdiction_id);
    }

    return filteredQuery;
  }

  /**
   * Apply includes for related data
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected applyIncludes(query: any, include: string[]): any {
    let selectFields = '*';

    if (include.includes('jurisdiction')) {
      selectFields += ', jurisdiction:jurisdiction_id(*)';
    }

    return query.select(selectFields);
  }

  /**
   * Get physical location with jurisdiction details
   */
  async findByIdWithJurisdiction(id: UUID): Promise<PhysicalLocation | null> {
    const { data, error } = await this.client
      .from('physical_locations')
      .select(`
        *,
        jurisdiction:jurisdiction_id(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to fetch physical location with jurisdiction: ${error.message}`);
    }

    return data as PhysicalLocation;
  }

  /**
   * Get all physical locations with their jurisdictions
   */
  async findManyWithJurisdictions(params: PhysicalLocationQueryParams = {}): Promise<{
    data: PhysicalLocation[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }> {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      jurisdiction_id,
    } = params;

    let query = this.client
      .from('physical_locations')
      .select(`
        *,
        jurisdiction:jurisdiction_id(*)
      `, { count: 'exact' });

    // Apply status filtering
    if (status) {
      query = query.eq('status', status);
    }

    // Apply search filtering
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,city.ilike.%${search}%,address.ilike.%${search}%`);
    }

    // Filter by jurisdiction
    if (jurisdiction_id) {
      query = query.eq('jurisdiction_id', jurisdiction_id);
    }

    // Apply ordering
    query = query.order('created_at', { ascending: false });

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch physical locations with jurisdictions: ${error.message}`);
    }

    return {
      data: data as PhysicalLocation[],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    };
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
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch locations by jurisdiction: ${error.message}`);
    }

    return data as PhysicalLocation[];
  }

  /**
   * Get locations by city
   */
  async findByCity(city: string): Promise<PhysicalLocation[]> {
    const { data, error } = await this.client
      .from('physical_locations')
      .select('*')
      .ilike('city', `%${city}%`)
      .eq('status', 'active')
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch locations by city: ${error.message}`);
    }

    return data as PhysicalLocation[];
  }

  /**
   * Get location statistics by jurisdiction
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
      .select(`
        jurisdiction_id,
        jurisdiction:jurisdiction_id(name_en, country_code, gdpr_adequacy)
      `)
      .eq('status', 'active');

    if (error) {
      throw new Error(`Failed to get location statistics: ${error.message}`);
    }

    // Group by jurisdiction and count
    const stats = new Map();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data as any[]).forEach(location => {
      const jurisdictionId = location.jurisdiction_id;
      const jurisdiction = location.jurisdiction;
      
      if (!stats.has(jurisdictionId)) {
        stats.set(jurisdictionId, {
          jurisdiction_id: jurisdictionId,
          jurisdiction_name: jurisdiction.name_en,
          country_code: jurisdiction.country_code,
          location_count: 0,
          gdpr_adequacy: jurisdiction.gdpr_adequacy,
        });
      }
      
      stats.get(jurisdictionId).location_count += 1;
    });

    return Array.from(stats.values()).sort((a, b) => b.location_count - a.location_count);
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
      .select(`
        *,
        jurisdiction:jurisdiction_id(*)
      `)
      .eq('status', 'active')
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch available locations: ${error.message}`);
    }

    return data as PhysicalLocation[];
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
   * Override delete to check for usage
   */
  async delete(id: UUID): Promise<void> {
    // Check if location is being used
    const usage = await this.getLocationUsage(id);
    
    if (usage.total_usage > 0) {
      throw new Error('Cannot delete location that is being used by systems or vendors');
    }

    await super.delete(id);
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
      .select(`
        *,
        jurisdiction:jurisdiction_id(*)
      `);

    // Apply search filter
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,address.ilike.%${filters.search}%`);
    }

    // Apply status filter
    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    // Apply jurisdiction filter
    if (filters.jurisdictions?.length) {
      query = query.in('jurisdiction_id', filters.jurisdictions);
    }

    // Apply city filter
    if (filters.cities?.length) {
      query = query.in('city', filters.cities);
    }

    // Apply GDPR adequacy filter
    if (filters.gdpr_adequacy_only) {
      // This requires a more complex query with join
      const { data: adequateJurisdictions } = await this.client
        .from('jurisdictions')
        .select('id')
        .eq('gdpr_adequacy', true);

      if (adequateJurisdictions?.length) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const adequateIds = adequateJurisdictions.map((j: any) => j.id);
        query = query.in('jurisdiction_id', adequateIds);
      }
    }

    query = query.order('name', { ascending: true });

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to perform advanced location search: ${error.message}`);
    }

    return data as PhysicalLocation[];
  }
}