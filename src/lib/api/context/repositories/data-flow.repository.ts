/**
 * Context Module - Data Flow Repository
 *
 * Repository for managing data flows between systems and vendors.
 * Handles CRUD operations and relationship management.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';
import type {
  DataFlow,
  CreateDataFlowRequest,
  UpdateDataFlowRequest,
  ContextClaims,
  DataFlowQueryParams,
  UUID
} from '../types';
import { BaseRepository } from './base.repository';

export class DataFlowRepository extends BaseRepository<
  DataFlow,
  CreateDataFlowRequest,
  UpdateDataFlowRequest,
  DataFlowQueryParams
> {
  protected tableName = 'data_flows' as const;

  constructor(context: ContextClaims, client?: SupabaseClient<Database>) {
    super(context, client);
  }

  /**
   * Prepare data for creation
   * Whitelists only valid columns for data_flows table
   */
  protected prepareCreateData(data: CreateDataFlowRequest): Partial<Database['public']['Tables']['data_flows']['Insert']> {
    return {
      name: data.name,
      description: data.description,
      purpose: data.purpose,
      flow_direction: data.flow_direction,
      frequency: data.frequency,
      volume_estimate: data.volume_estimate,
      criticality: data.criticality,
      status: data.status || 'active',
      from_system: data.from_system,
      to_system: data.to_system,
      from_vendor: data.from_vendor,
      to_vendor: data.to_vendor,
      encryption_in_transit: data.encryption_in_transit ?? true,
      cross_border_transfer: data.cross_border_transfer ?? false,
      tenant_id: this.context.tenant_id,
      workspace_id: this.context.workspace_id,
      created_by: this.context.sub,
      updated_by: this.context.sub,
    };
  }

  /**
   * Prepare data for update
   * Whitelists only valid columns for data_flows table
   */
  protected prepareUpdateData(data: UpdateDataFlowRequest): Partial<Database['public']['Tables']['data_flows']['Update']> {
    const updateData: Partial<Database['public']['Tables']['data_flows']['Update']> = {
      updated_by: this.context.sub,
    };

    // Only include fields that are present in the request
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.purpose !== undefined) updateData.purpose = data.purpose;
    if (data.flow_direction !== undefined) updateData.flow_direction = data.flow_direction;
    if (data.frequency !== undefined) updateData.frequency = data.frequency;
    if (data.volume_estimate !== undefined) updateData.volume_estimate = data.volume_estimate;
    if (data.criticality !== undefined) updateData.criticality = data.criticality;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.from_system !== undefined) updateData.from_system = data.from_system;
    if (data.to_system !== undefined) updateData.to_system = data.to_system;
    if (data.from_vendor !== undefined) updateData.from_vendor = data.from_vendor;
    if (data.to_vendor !== undefined) updateData.to_vendor = data.to_vendor;
    if (data.encryption_in_transit !== undefined) updateData.encryption_in_transit = data.encryption_in_transit;
    if (data.cross_border_transfer !== undefined) updateData.cross_border_transfer = data.cross_border_transfer;

    return updateData;
  }

  /**
   * Find data flow by ID with optional relationships
   */
  async findByIdWithRelations(id: UUID): Promise<DataFlow | null> {
    const { data, error } = await this.client
      .from('data_flows')
      .select(`
        *,
        from_system:systems!data_flows_from_system_fkey(id, name),
        to_system:systems!data_flows_to_system_fkey(id, name),
        from_vendor:vendors!data_flows_from_vendor_fkey(id, name),
        to_vendor:vendors!data_flows_to_vendor_fkey(id, name)
      `)
      .eq('id', id)
      .eq('workspace_id', this.context.workspace_id)
      .is('deleted_at', null)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch data flow: ${error.message}`);
    }

    return data as unknown as DataFlow;
  }

  /**
   * Find all data flows with optional filters
   */
  async findManyWithFilters(params: DataFlowQueryParams = {}): Promise<{
    data: DataFlow[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }> {
    const { page = 1, limit = 20, flow_direction, criticality, status, cross_border_transfer } = params;

    let query = this.client
      .from('data_flows')
      .select('*', { count: 'exact' })
      .eq('workspace_id', this.context.workspace_id)
      .is('deleted_at', null);

    // Apply filters
    if (flow_direction) {
      query = query.eq('flow_direction', flow_direction);
    }
    if (criticality) {
      query = query.eq('criticality', criticality);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (cross_border_transfer !== undefined) {
      query = query.eq('cross_border_transfer', cross_border_transfer);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      throw new Error(`Data flows query failed: ${error.message}`);
    }

    return {
      data: data as DataFlow[],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    };
  }
}
