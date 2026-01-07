/**
 * Context Module - Base Repository
 * 
 * Abstract base class for all Context module repositories with common
 * CRUD operations, RLS enforcement, and multi-tenant support.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';
import type { UUID, ContextClaims, PaginatedResponse, ListQueryParams } from '../types';
import { createContextClient } from '../supabase-client';

export abstract class BaseRepository<
  TEntity,
  TCreate,
  TUpdate,
  TQueryParams extends ListQueryParams = ListQueryParams
> {
  protected client: SupabaseClient<Database>;
  protected abstract tableName: keyof Database['public']['Tables'];
  protected context: ContextClaims;

  constructor(context: ContextClaims, client?: SupabaseClient<Database>) {
    this.context = context;
    this.client = client || createContextClient(context);
  }

  /**
   * Get all entities with pagination and filtering
   */
  async findMany(params: TQueryParams = {} as TQueryParams): Promise<PaginatedResponse<TEntity>> {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      ...otherParams
    } = params;

    let query = this.client
      .from(this.tableName as keyof Database['public']['Tables'])
      .select('*', { count: 'exact' });

    // Apply workspace filtering for multi-tenant isolation
    query = query.eq('workspace_id', this.context.workspace_id);

    // Additional filtering is implemented in subclasses

    // Apply status filtering if supported
    if (status && this.supportsStatus()) {
      query = query.eq('status', status);
    }

    // Apply search filtering if supported
    if (search && this.supportsSearch()) {
      query = this.applySearch(query, search);
    }

    // Apply additional filters
    query = this.applyFilters(query, otherParams);

    // Apply ordering
    query = this.applyOrdering(query);

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch ${this.tableName}: ${error.message}`);
    }

    return {
      data: data as TEntity[],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    };
  }

  /**
   * Get a single entity by ID
   */
  async findById(id: UUID, include?: string[]): Promise<TEntity | null> {
    let query = this.client.from(this.tableName as keyof Database['public']['Tables']).select('*');

    // Apply workspace filtering for multi-tenant isolation
    query = query.eq('workspace_id', this.context.workspace_id);

    // Apply includes if supported
    if (include?.length) {
      query = this.applyIncludes(query, include);
    }

    const { data, error } = await query.eq('id', id).single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to fetch ${this.tableName} by ID: ${error.message}`);
    }

    return data as TEntity;
  }

  /**
   * Create a new entity
   */
  async create(data: TCreate): Promise<TEntity> {
    const entityData = this.prepareCreateData(data);

    const { data: created, error } = await this.client
      .from(this.tableName as keyof Database['public']['Tables'])
      .insert(entityData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create ${this.tableName}: ${error.message}`);
    }

    return created as TEntity;
  }

  /**
   * Update an entity by ID
   */
  async update(id: UUID, data: TUpdate): Promise<TEntity> {
    const entityData = this.prepareUpdateData(data);

    const { data: updated, error } = await this.client
      .from(this.tableName as keyof Database['public']['Tables'])
      .update(entityData)
      .eq('id', id)
      .eq('workspace_id', this.context.workspace_id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update ${this.tableName}: ${error.message}`);
    }

    return updated as TEntity;
  }

  /**
   * Soft delete an entity by ID
   */
  async delete(id: UUID): Promise<void> {
    const { error } = await this.client
      .from(this.tableName as keyof Database['public']['Tables'])
      .update({
        deleted_at: new Date().toISOString(),
        updated_by: this.context.sub,
      })
      .eq('id', id)
      .eq('workspace_id', this.context.workspace_id);

    if (error) {
      throw new Error(`Failed to delete ${this.tableName}: ${error.message}`);
    }
  }

  /**
   * Hard delete an entity by ID (use with caution)
   */
  async hardDelete(id: UUID): Promise<void> {
    const { error } = await this.client
      .from(this.tableName as keyof Database['public']['Tables'])
      .delete()
      .eq('id', id)
      .eq('workspace_id', this.context.workspace_id);

    if (error) {
      throw new Error(`Failed to hard delete ${this.tableName}: ${error.message}`);
    }
  }

  /**
   * Check if an entity exists
   */
  async exists(id: UUID): Promise<boolean> {
    const { data, error } = await this.client
      .from(this.tableName as keyof Database['public']['Tables'])
      .select('id')
      .eq('id', id)
      .eq('workspace_id', this.context.workspace_id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to check existence of ${this.tableName}: ${error.message}`);
    }

    return !!data;
  }

  /**
   * Count entities with filtering
   */
  async count(params: Partial<TQueryParams> = {}): Promise<number> {
    let query = this.client
      .from(this.tableName as keyof Database['public']['Tables'])
      .select('*', { count: 'exact', head: true });

    // Apply workspace filtering for multi-tenant isolation
    query = query.eq('workspace_id', this.context.workspace_id);

    // Apply filters
    query = this.applyFilters(query, params);

    const { count, error } = await query;

    if (error) {
      throw new Error(`Failed to count ${this.tableName}: ${error.message}`);
    }

    return count || 0;
  }

  // Protected methods for subclasses to override

  /**
   * Prepare data for creation (add tenant/workspace/audit fields)
   */
  protected prepareCreateData(data: TCreate): any {
    return {
      ...data,
      tenant_id: this.context.tenant_id,
      workspace_id: this.context.workspace_id,
      created_by: this.context.sub,
      updated_by: this.context.sub,
    };
  }

  /**
   * Prepare data for update (add audit fields)
   */
  protected prepareUpdateData(data: TUpdate): any {
    return {
      ...data,
      updated_by: this.context.sub,
    };
  }

  /**
   * Whether this entity supports status filtering
   */
  protected supportsStatus(): boolean {
    return true; // Most entities have status
  }

  /**
   * Whether this entity supports search
   */
  protected supportsSearch(): boolean {
    return true; // Most entities support search
  }

  /**
   * Apply search filters to query
   */
  protected applySearch(query: any, search: string): any {
    // Default implementation searches by name and description
    return query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  }

  /**
   * Apply additional filters to query
   */
  protected applyFilters(query: any, params: unknown): any {
    // Default implementation - subclasses override for specific filters
    return query;
  }

  /**
   * Apply ordering to query
   */
  protected applyOrdering(query: any): any {
    // Default ordering by created_at desc
    return query.order('created_at', { ascending: false });
  }

  /**
   * Apply includes for related data
   */
  protected applyIncludes(query: any, include: string[]): any {
    // Default implementation - subclasses override for specific includes
    return query;
  }

  /**
   * Get entity by field value
   */
  protected async findByField(field: string, value: any): Promise<TEntity | null> {
    const { data, error } = await this.client
      .from(this.tableName as keyof Database['public']['Tables'])
      .select('*')
      .eq(field, value)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to fetch ${this.tableName} by ${field}: ${error.message}`);
    }

    return data as TEntity;
  }

  /**
   * Get entities by field value
   */
  protected async findManyByField(field: string, value: any): Promise<TEntity[]> {
    const { data, error } = await this.client
      .from(this.tableName as keyof Database['public']['Tables'])
      .select('*')
      .eq(field, value);

    if (error) {
      throw new Error(`Failed to fetch ${this.tableName} by ${field}: ${error.message}`);
    }

    return data as TEntity[];
  }

  /**
   * Bulk create entities
   */
  async bulkCreate(items: TCreate[]): Promise<TEntity[]> {
    const entityData = items.map(item => this.prepareCreateData(item));

    const { data, error } = await this.client
      .from(this.tableName as keyof Database['public']['Tables'])
      .insert(entityData)
      .select();

    if (error) {
      throw new Error(`Failed to bulk create ${this.tableName}: ${error.message}`);
    }

    return data as TEntity[];
  }

  /**
   * Bulk update entities
   */
  async bulkUpdate(updates: Array<{ id: UUID; data: TUpdate }>): Promise<TEntity[]> {
    const results: TEntity[] = [];

    // Use transaction for bulk updates
    for (const update of updates) {
      const result = await this.update(update.id, update.data);
      results.push(result);
    }

    return results;
  }

  /**
   * Bulk delete entities
   */
  async bulkDelete(ids: UUID[]): Promise<void> {
    const { error } = await this.client
      .from(this.tableName as keyof Database['public']['Tables'])
      .update({
        deleted_at: new Date().toISOString(),
        updated_by: this.context.sub,
      })
      .in('id', ids);

    if (error) {
      throw new Error(`Failed to bulk delete ${this.tableName}: ${error.message}`);
    }
  }

  /**
   * Restore soft-deleted entity
   */
  async restore(id: UUID): Promise<TEntity> {
    const { data, error } = await this.client
      .from(this.tableName as keyof Database['public']['Tables'])
      .update({
        deleted_at: null,
        updated_by: this.context.sub,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to restore ${this.tableName}: ${error.message}`);
    }

    return data as TEntity;
  }

  /**
   * Get entities that are soft-deleted
   */
  async getDeleted(params: TQueryParams = {} as TQueryParams): Promise<PaginatedResponse<TEntity>> {
    const {
      page = 1,
      limit = 20,
    } = params;

    let query = this.client
      .from(this.tableName as keyof Database['public']['Tables'])
      .select('*', { count: 'exact' })
      .not('deleted_at', 'is', null);

    // Apply ordering
    query = query.order('deleted_at', { ascending: false });

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch deleted ${this.tableName}: ${error.message}`);
    }

    return {
      data: data as TEntity[],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    };
  }
}