/**
 * Context Module - System Repository
 * 
 * Repository for managing IT systems and applications.
 * Handles system CRUD operations, endpoints, and location relationships.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';
import type { 
  System, 
  SystemEndpoint,
  CreateSystemRequest,
  UpdateSystemRequest,
  CreateSystemEndpointRequest,
  UpdateSystemEndpointRequest,
  ContextClaims, 
  SystemQueryParams,
  PaginatedResponse,
  UUID,
  Criticality,
  EntityStatus,
  EndpointType
} from '../types';
import { BaseRepository } from './base.repository';

export class SystemRepository extends BaseRepository<
  System,
  CreateSystemRequest,
  UpdateSystemRequest,
  SystemQueryParams
> {
  protected tableName = 'systems' as const;

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
   * Override findMany with simplified query - debug BaseRepository issues
   */
  async findMany(params: SystemQueryParams = {}): Promise<PaginatedResponse<System>> {
    const { page = 1, limit = 20 } = params;

    // Simple direct query without complex BaseRepository logic
    const { data, error, count } = await this.client
      .from('systems')
      .select('*', { count: 'exact' })
      .eq('workspace_id', this.context.workspace_id)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      throw new Error(`Systems query failed: ${error.message}`);
    }

    return {
      data: data as System[],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    };
  }

  /**
   * Apply specific filters for systems
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected applyFilters(query: any, params: Partial<SystemQueryParams>): any {
    let filteredQuery = query;

    if (params.criticality) {
      filteredQuery = filteredQuery.eq('criticality', params.criticality);
    }

    return filteredQuery;
  }

  /**
   * Apply includes for related data
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected applyIncludes(query: any, include: string[]): any {
    let selectFields = '*';

    if (include.includes('endpoints')) {
      selectFields += ', endpoints:system_endpoints(*)';
    }

    if (include.includes('locations')) {
      selectFields += ', locations:system_locations(location_id, physical_locations(*, jurisdiction:jurisdiction_id(*)))';
    }

    return query.select(selectFields);
  }

  /**
   * Get system with all related data
   */
  async findByIdWithRelations(id: UUID): Promise<System | null> {
    const { data, error } = await this.client
      .from('systems')
      .select(`
        *,
        endpoints:system_endpoints(*),
        locations:system_locations(
          location_id,
          physical_locations(*, jurisdiction:jurisdiction_id(*))
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch system with relations: ${error.message}`);
    }

    // Transform the data to match System type
    const transformedData: System = {
      ...data,
      locations: data.locations?.map((loc: any) => loc.physical_locations) || [],
      criticality: data.criticality as Criticality | null,
      status: data.status as EntityStatus,
      endpoints: data.endpoints?.map((endpoint: any) => ({
        ...endpoint,
        endpoint_type: endpoint.endpoint_type as EndpointType
      })) || []
    };
    
    return transformedData;
  }

  /**
   * Get systems by criticality with endpoint counts
   */
  async findManyWithEndpointCounts(params: SystemQueryParams = {}): Promise<{
    data: (System & { endpoint_count: number })[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }> {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      criticality,
    } = params;

    let query = this.client
      .from('systems')
      .select(`
        *,
        endpoints:system_endpoints(count)
      `, { count: 'exact' });

    if (status) {
      query = query.eq('status', status);
    }

    if (criticality) {
      query = query.eq('criticality', criticality);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,system_type.ilike.%${search}%`);
    }

    query = query.order('created_at', { ascending: false });

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch systems with endpoint counts: ${error.message}`);
    }

    return {
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
   * Check if system name exists
   */
  async nameExists(name: string, excludeId?: UUID): Promise<boolean> {
    let query = this.client
      .from('systems')
      .select('id')
      .eq('name', name)
      .eq('status', 'active');

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query.single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to check system name existence: ${error.message}`);
    }

    return !!data;
  }

  /**
   * Get system usage statistics
   */
  async getUsageStatistics(systemId: UUID): Promise<{
    processing_activities_count: number;
    endpoints_count: number;
    data_flows_in_count: number;
    data_flows_out_count: number;
    locations_count: number;
  }> {
    const [
      processingActivities,
      endpoints,
      dataFlowsIn,
      dataFlowsOut,
      locations
    ] = await Promise.all([
      this.client
        .from('processing_systems')
        .select('*', { count: 'exact', head: true })
        .eq('system_id', systemId),
      
      this.client
        .from('system_endpoints')
        .select('*', { count: 'exact', head: true })
        .eq('system_id', systemId)
        .eq('status', 'active'),
      
      this.client
        .from('data_flow_edges')
        .select('*', { count: 'exact', head: true })
        .eq('to_system_id', systemId)
        .eq('status', 'active'),
      
      this.client
        .from('data_flow_edges')
        .select('*', { count: 'exact', head: true })
        .eq('from_system_id', systemId)
        .eq('status', 'active'),
      
      this.client
        .from('system_locations')
        .select('*', { count: 'exact', head: true })
        .eq('system_id', systemId)
    ]);

    return {
      processing_activities_count: processingActivities.count || 0,
      endpoints_count: endpoints.count || 0,
      data_flows_in_count: dataFlowsIn.count || 0,
      data_flows_out_count: dataFlowsOut.count || 0,
      locations_count: locations.count || 0,
    };
  }

  /**
   * Override delete to check for usage
   */
  async delete(id: UUID): Promise<void> {
    const usage = await this.getUsageStatistics(id);
    
    if (usage.processing_activities_count > 0 || usage.data_flows_in_count > 0 || usage.data_flows_out_count > 0) {
      throw new Error('Cannot delete system that is used in processing activities or data flows');
    }

    await super.delete(id);
  }

  /**
   * Get systems by criticality
   */
  async findByCriticality(criticality: 'low' | 'medium' | 'high' | 'critical'): Promise<System[]> {
    const { data, error } = await this.client
      .from('systems')
      .select('*')
      .eq('criticality', criticality)
      .eq('status', 'active')
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch systems by criticality: ${error.message}`);
    }

    return data as System[];
  }

  /**
   * Get systems by owner team
   */
  async findByOwnerTeam(ownerTeam: string): Promise<System[]> {
    const { data, error } = await this.client
      .from('systems')
      .select('*')
      .eq('owner_team', ownerTeam)
      .eq('status', 'active')
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch systems by owner team: ${error.message}`);
    }

    return data as System[];
  }

  // Endpoint management methods

  /**
   * Add endpoint to system
   */
  async addEndpoint(systemId: UUID, endpointData: CreateSystemEndpointRequest): Promise<SystemEndpoint> {
    const { data, error } = await this.client
      .from('system_endpoints')
      .insert({
        ...endpointData,
        system_id: systemId,
        tenant_id: this.context.tenant_id,
        workspace_id: this.context.workspace_id,
        created_by: this.context.sub,
        updated_by: this.context.sub,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to add system endpoint: ${error.message}`);
    }

    return data as SystemEndpoint;
  }

  /**
   * Update system endpoint
   */
  async updateEndpoint(endpointId: UUID, endpointData: UpdateSystemEndpointRequest): Promise<SystemEndpoint> {
    const { data, error } = await this.client
      .from('system_endpoints')
      .update({
        ...endpointData,
        updated_by: this.context.sub,
      })
      .eq('id', endpointId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update system endpoint: ${error.message}`);
    }

    return data as SystemEndpoint;
  }

  /**
   * Remove endpoint from system
   */
  async removeEndpoint(endpointId: UUID): Promise<void> {
    const { error } = await this.client
      .from('system_endpoints')
      .update({
        deleted_at: new Date().toISOString(),
        updated_by: this.context.sub,
      })
      .eq('id', endpointId);

    if (error) {
      throw new Error(`Failed to remove system endpoint: ${error.message}`);
    }
  }

  /**
   * Get system endpoints
   */
  async getEndpoints(systemId: UUID): Promise<SystemEndpoint[]> {
    const { data, error } = await this.client
      .from('system_endpoints')
      .select('*')
      .eq('system_id', systemId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch system endpoints: ${error.message}`);
    }

    return data as SystemEndpoint[];
  }

  /**
   * Get endpoints by type
   */
  async getEndpointsByType(systemId: UUID, endpointType: EndpointType): Promise<SystemEndpoint[]> {
    const { data, error } = await this.client
      .from('system_endpoints')
      .select('*')
      .eq('system_id', systemId)
      .eq('endpoint_type', endpointType)
      .eq('status', 'active')
      .is('deleted_at', null)
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch endpoints by type: ${error.message}`);
    }

    return data as SystemEndpoint[];
  }

  // Location management methods

  /**
   * Add location to system
   */
  async addLocation(systemId: UUID, locationId: UUID): Promise<void> {
    const { error } = await this.client
      .from('system_locations')
      .insert({
        system_id: systemId,
        location_id: locationId,
        created_by: this.context.sub,
      });

    if (error) {
      throw new Error(`Failed to add location to system: ${error.message}`);
    }
  }

  /**
   * Remove location from system
   */
  async removeLocation(systemId: UUID, locationId: UUID): Promise<void> {
    const { error } = await this.client
      .from('system_locations')
      .delete()
      .eq('system_id', systemId)
      .eq('location_id', locationId);

    if (error) {
      throw new Error(`Failed to remove location from system: ${error.message}`);
    }
  }

  /**
   * Get system locations
   */
  async getLocations(systemId: UUID): Promise<any[]> {
    const { data, error } = await this.client
      .from('system_locations')
      .select(`
        location_id,
        created_at,
        physical_locations(*, jurisdiction:jurisdiction_id(*))
      `)
      .eq('system_id', systemId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch system locations: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Get systems topology for data flow visualization
   */
  async getSystemsTopology(): Promise<{
    systems: (System & { endpoint_count: number })[];
    connections: {
      from_system: string;
      to_system: string;
      flow_count: number;
      has_cross_border: boolean;
    }[];
  }> {
    // Get all systems with endpoint counts
    const { data: systems, error: systemsError } = await this.client
      .from('systems')
      .select(`
        *,
        endpoints:system_endpoints(count)
      `)
      .eq('status', 'active');

    if (systemsError) {
      throw new Error(`Failed to fetch systems topology: ${systemsError.message}`);
    }

    // Get data flow connections between systems
    const { data: connections, error: connectionsError } = await this.client
      .from('data_flow_edges')
      .select(`
        from_system_id,
        to_system_id,
        cross_border_transfers(count)
      `)
      .eq('status', 'active')
      .not('from_system_id', 'is', null)
      .not('to_system_id', 'is', null);

    if (connectionsError) {
      throw new Error(`Failed to fetch data flow connections: ${connectionsError.message}`);
    }

    // Group connections and count flows
    const connectionMap = new Map();
    (connections as any[]).forEach(conn => {
      const key = `${conn.from_system_id}-${conn.to_system_id}`;
      if (!connectionMap.has(key)) {
        connectionMap.set(key, {
          from_system: conn.from_system_id,
          to_system: conn.to_system_id,
          flow_count: 0,
          has_cross_border: false,
        });
      }
      connectionMap.get(key).flow_count += 1;
      if (conn.cross_border_transfers?.length > 0) {
        connectionMap.get(key).has_cross_border = true;
      }
    });

    return {
      systems: systems as any,
      connections: Array.from(connectionMap.values()),
    };
  }

  /**
   * Search systems with advanced filters
   */
  async advancedSearch(filters: {
    search?: string;
    status?: 'active' | 'inactive';
    criticality?: ('low' | 'medium' | 'high' | 'critical')[];
    system_types?: string[];
    owner_teams?: string[];
    has_endpoints?: boolean;
    locations?: UUID[];
  }): Promise<System[]> {
    let query = this.client.from('systems').select('*');

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,system_type.ilike.%${filters.search}%`);
    }

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.criticality?.length) {
      query = query.in('criticality', filters.criticality);
    }

    if (filters.system_types?.length) {
      query = query.in('system_type', filters.system_types);
    }

    if (filters.owner_teams?.length) {
      query = query.in('owner_team', filters.owner_teams);
    }

    // Filter by endpoints existence
    if (filters.has_endpoints !== undefined) {
      if (filters.has_endpoints) {
        const { data: systemsWithEndpoints } = await this.client
          .from('system_endpoints')
          .select('system_id')
          .eq('status', 'active')
          .is('deleted_at', null);

        if (systemsWithEndpoints?.length) {
          const systemIds = [...new Set(systemsWithEndpoints.map((e: any) => e.system_id))];
          query = query.in('id', systemIds);
        }
      }
    }

    // Filter by locations
    if (filters.locations?.length) {
      const { data: systemLocations } = await this.client
        .from('system_locations')
        .select('system_id')
        .in('location_id', filters.locations);

      if (systemLocations?.length) {
        const systemIds = [...new Set(systemLocations.map((sl: any) => sl.system_id))];
        query = query.in('id', systemIds);
      }
    }

    query = query.order('name', { ascending: true });

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to perform advanced system search: ${error.message}`);
    }

    return data as System[];
  }

  /**
   * Get system security overview
   */
  async getSecurityOverview(systemId: UUID): Promise<{
    encryption_in_transit_percentage: number;
    encryption_at_rest_percentage: number;
    authenticated_endpoints_percentage: number;
    total_endpoints: number;
    security_score: number;
  }> {
    const { data: endpoints, error } = await this.client
      .from('system_endpoints')
      .select('encryption_in_transit, encryption_at_rest, authentication_method')
      .eq('system_id', systemId)
      .eq('status', 'active')
      .is('deleted_at', null);

    if (error) {
      throw new Error(`Failed to fetch system security overview: ${error.message}`);
    }

    const totalEndpoints = endpoints.length;
    
    if (totalEndpoints === 0) {
      return {
        encryption_in_transit_percentage: 0,
        encryption_at_rest_percentage: 0,
        authenticated_endpoints_percentage: 0,
        total_endpoints: 0,
        security_score: 0,
      };
    }

    const encryptedInTransit = endpoints.filter((e: any) => e.encryption_in_transit).length;
    const encryptedAtRest = endpoints.filter((e: any) => e.encryption_at_rest).length;
    const authenticated = endpoints.filter((e: any) => e.authentication_method).length;

    const encryptionInTransitPct = (encryptedInTransit / totalEndpoints) * 100;
    const encryptionAtRestPct = (encryptedAtRest / totalEndpoints) * 100;
    const authenticatedPct = (authenticated / totalEndpoints) * 100;

    // Calculate security score (weighted average)
    const securityScore = (encryptionInTransitPct * 0.4 + encryptionAtRestPct * 0.3 + authenticatedPct * 0.3);

    return {
      encryption_in_transit_percentage: Math.round(encryptionInTransitPct),
      encryption_at_rest_percentage: Math.round(encryptionAtRestPct),
      authenticated_endpoints_percentage: Math.round(authenticatedPct),
      total_endpoints: totalEndpoints,
      security_score: Math.round(securityScore),
    };
  }
}