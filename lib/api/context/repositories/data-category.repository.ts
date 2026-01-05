/**
 * Context Module - Data Category Repository
 * 
 * Repository for managing GDPR data categories (personal, special, criminal, anonymous).
 * Handles hierarchical data category structure and standard GDPR seeding.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';
import type { 
  DataCategory, 
  CreateDataCategoryRequest,
  UpdateDataCategoryRequest,
  ContextClaims, 
  DataCategoryQueryParams,
  UUID 
} from '../types';
import { BaseRepository } from './base.repository';

export class DataCategoryRepository extends BaseRepository<
  DataCategory,
  CreateDataCategoryRequest,
  UpdateDataCategoryRequest,
  DataCategoryQueryParams
> {
  protected tableName = 'data_categories' as const;

  constructor(context: ContextClaims, client?: SupabaseClient<Database>) {
    super(context, client);
  }

  /**
   * Apply specific filters for data categories
   */
  protected applyFilters(query: any, params: Partial<DataCategoryQueryParams>): any {
    let filteredQuery = query;

    if (params.category_type) {
      filteredQuery = filteredQuery.eq('category_type', params.category_type);
    }

    if (params.sensitivity) {
      filteredQuery = filteredQuery.eq('sensitivity', params.sensitivity);
    }

    if (typeof params.is_standard === 'boolean') {
      filteredQuery = filteredQuery.eq('is_standard', params.is_standard);
    }

    if (params.parent_id) {
      filteredQuery = filteredQuery.eq('parent_id', params.parent_id);
    }

    return filteredQuery;
  }

  /**
   * Apply includes for related data
   */
  protected applyIncludes(query: any, include: string[]): any {
    let selectFields = '*';

    if (include.includes('parent')) {
      selectFields += ', parent:parent_id(*)';
    }

    if (include.includes('children')) {
      selectFields += ', children:data_categories!parent_id(*)';
    }

    return query.select(selectFields);
  }

  /**
   * Get data category with full hierarchy
   */
  async findByIdWithHierarchy(id: UUID): Promise<DataCategory | null> {
    const { data, error } = await this.client
      .from('data_categories')
      .select(`
        *,
        parent:parent_id(*),
        children:data_categories!parent_id(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch data category with hierarchy: ${error.message}`);
    }

    // Transform the data to match DataCategory type with proper type casting
    const transformedData: DataCategory = {
      ...data,
      children: Array.isArray(data.children) 
        ? (data.children as DataCategory[])
        : data.children 
        ? [data.children as DataCategory] 
        : undefined
    } as DataCategory;
    
    return transformedData;
  }

  /**
   * Get hierarchical tree structure
   */
  async getHierarchicalTree(): Promise<DataCategory[]> {
    // Get all categories
    const { data: categories, error } = await this.client
      .from('data_categories')
      .select('*')
      .eq('status', 'active')
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch data categories for hierarchy: ${error.message}`);
    }

    // Build tree structure
    const categoryMap = new Map<UUID, DataCategory & { children: DataCategory[] }>();
    const rootCategories: (DataCategory & { children: DataCategory[] })[] = [];

    // Initialize map with all categories
    categories.forEach(cat => {
      categoryMap.set(cat.id, { ...cat, children: [] } as DataCategory & { children: DataCategory[] });
    });

    // Build parent-child relationships
    categories.forEach(cat => {
      const categoryWithChildren = categoryMap.get(cat.id)!;
      
      if (cat.parent_id) {
        const parent = categoryMap.get(cat.parent_id);
        if (parent) {
          parent.children.push(categoryWithChildren);
        }
      } else {
        rootCategories.push(categoryWithChildren);
      }
    });

    return rootCategories;
  }

  /**
   * Get root categories (no parent)
   */
  async getRootCategories(): Promise<DataCategory[]> {
    const { data, error } = await this.client
      .from('data_categories')
      .select('*')
      .is('parent_id', null)
      .eq('status', 'active')
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch root categories: ${error.message}`);
    }

    return data as DataCategory[];
  }

  /**
   * Get child categories
   */
  async getChildCategories(parentId: UUID): Promise<DataCategory[]> {
    const { data, error } = await this.client
      .from('data_categories')
      .select('*')
      .eq('parent_id', parentId)
      .eq('status', 'active')
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch child categories: ${error.message}`);
    }

    return data as DataCategory[];
  }

  /**
   * Get categories by type
   */
  async findByType(categoryType: 'personal' | 'special' | 'criminal' | 'anonymous'): Promise<DataCategory[]> {
    const { data, error } = await this.client
      .from('data_categories')
      .select('*')
      .eq('category_type', categoryType)
      .eq('status', 'active')
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch categories by type: ${error.message}`);
    }

    return data as DataCategory[];
  }

  /**
   * Get categories by sensitivity level
   */
  async findBySensitivity(sensitivity: 'public' | 'internal' | 'confidential' | 'restricted'): Promise<DataCategory[]> {
    const { data, error } = await this.client
      .from('data_categories')
      .select('*')
      .eq('sensitivity', sensitivity)
      .eq('status', 'active')
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch categories by sensitivity: ${error.message}`);
    }

    return data as DataCategory[];
  }

  /**
   * Get standard GDPR categories
   */
  async getStandardCategories(): Promise<DataCategory[]> {
    const { data, error } = await this.client
      .from('data_categories')
      .select('*')
      .eq('is_standard', true)
      .eq('status', 'active')
      .order('category_type', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch standard categories: ${error.message}`);
    }

    return data as DataCategory[];
  }

  /**
   * Get custom categories (non-standard)
   */
  async getCustomCategories(): Promise<DataCategory[]> {
    const { data, error } = await this.client
      .from('data_categories')
      .select('*')
      .eq('is_standard', false)
      .eq('status', 'active')
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch custom categories: ${error.message}`);
    }

    return data as DataCategory[];
  }

  /**
   * Check if category name exists within the same parent
   */
  async nameExistsInParent(name: string, parentId: UUID | null, excludeId?: UUID): Promise<boolean> {
    let query = this.client
      .from('data_categories')
      .select('id')
      .eq('name', name)
      .eq('status', 'active');

    if (parentId) {
      query = query.eq('parent_id', parentId);
    } else {
      query = query.is('parent_id', null);
    }

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query.single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to check category name existence: ${error.message}`);
    }

    return !!data;
  }

  /**
   * Validate category hierarchy (prevent circular references)
   */
  async validateHierarchy(categoryId: UUID, newParentId: UUID): Promise<boolean> {
    // Check if newParentId is a descendant of categoryId
    const descendants = await this.getAllDescendants(categoryId);
    return !descendants.some(desc => desc.id === newParentId);
  }

  /**
   * Get all descendants of a category
   */
  async getAllDescendants(categoryId: UUID): Promise<DataCategory[]> {
    const descendants: DataCategory[] = [];
    const queue = [categoryId];
    const visited = new Set<UUID>();

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      
      if (visited.has(currentId)) {
        continue; // Prevent infinite loops
      }
      visited.add(currentId);

      const children = await this.getChildCategories(currentId);
      
      for (const child of children) {
        descendants.push(child);
        queue.push(child.id);
      }
    }

    return descendants;
  }

  /**
   * Get category usage statistics
   */
  async getUsageStatistics(categoryId: UUID): Promise<{
    processing_activities_count: number;
    data_flows_count: number;
    children_count: number;
    total_usage: number;
  }> {
    const [processingActivities, dataFlows, children] = await Promise.all([
      this.client
        .from('processing_data_categories')
        .select('*', { count: 'exact', head: true })
        .eq('data_category_id', categoryId),
      
      this.client
        .from('data_flow_data_categories')
        .select('*', { count: 'exact', head: true })
        .eq('data_category_id', categoryId),
      
      this.client
        .from('data_categories')
        .select('*', { count: 'exact', head: true })
        .eq('parent_id', categoryId)
        .eq('status', 'active')
    ]);

    return {
      processing_activities_count: processingActivities.count || 0,
      data_flows_count: dataFlows.count || 0,
      children_count: children.count || 0,
      total_usage: (processingActivities.count || 0) + (dataFlows.count || 0),
    };
  }

  /**
   * Override delete to check for usage and children
   */
  async delete(id: UUID): Promise<void> {
    const usage = await this.getUsageStatistics(id);
    
    if (usage.children_count > 0) {
      throw new Error('Cannot delete category that has child categories');
    }

    if (usage.total_usage > 0) {
      throw new Error('Cannot delete category that is used in processing activities or data flows');
    }

    await super.delete(id);
  }

  /**
   * Move category to different parent
   */
  async moveToParent(categoryId: UUID, newParentId: UUID | null): Promise<DataCategory> {
    // Validate hierarchy if moving to a parent
    if (newParentId && !(await this.validateHierarchy(categoryId, newParentId))) {
      throw new Error('Cannot move category: would create circular reference');
    }

    // Validate parent exists if provided
    if (newParentId && !(await this.exists(newParentId))) {
      throw new Error('Parent category does not exist');
    }

    return await this.update(categoryId, { parent_id: newParentId ?? undefined });
  }

  /**
   * Seed standard GDPR categories for tenant/workspace
   */
  async seedStandardCategories(): Promise<{ success: boolean; message: string; created_count: number }> {
    try {
      // Check if standard categories already exist
      const existingStandard = await this.getStandardCategories();
      
      if (existingStandard.length > 0) {
        return {
          success: false,
          message: 'Standard GDPR categories already exist for this workspace',
          created_count: 0,
        };
      }

      // Call the database function to seed standard categories
      const { error } = await this.client.rpc('seed_standard_data_categories', {
        p_tenant_id: this.context.tenant_id,
        p_workspace_id: this.context.workspace_id,
        p_created_by: this.context.sub,
      });

      if (error) {
        throw new Error(`Failed to seed standard categories: ${error.message}`);
      }

      // Count the newly created categories
      const newStandard = await this.getStandardCategories();

      return {
        success: true,
        message: 'Standard GDPR categories seeded successfully',
        created_count: newStandard.length,
      };

    } catch (error) {
      return {
        success: false,
        message: `Failed to seed standard categories: ${error}`,
        created_count: 0,
      };
    }
  }

  /**
   * Search categories with advanced filters
   */
  async advancedSearch(filters: {
    search?: string;
    category_types?: ('personal' | 'special' | 'criminal' | 'anonymous')[];
    sensitivities?: ('public' | 'internal' | 'confidential' | 'restricted')[];
    is_standard?: boolean;
    has_children?: boolean;
    parent_id?: UUID;
    include_hierarchy?: boolean;
  }): Promise<DataCategory[]> {
    let query = this.client.from('data_categories').select('*');

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    if (filters.category_types?.length) {
      query = query.in('category_type', filters.category_types);
    }

    if (filters.sensitivities?.length) {
      query = query.in('sensitivity', filters.sensitivities);
    }

    if (typeof filters.is_standard === 'boolean') {
      query = query.eq('is_standard', filters.is_standard);
    }

    if (filters.parent_id) {
      query = query.eq('parent_id', filters.parent_id);
    }

    // Filter by children existence
    if (filters.has_children !== undefined) {
      if (filters.has_children) {
        const { data: categoriesWithChildren } = await this.client
          .from('data_categories')
          .select('parent_id')
          .not('parent_id', 'is', null)
          .eq('status', 'active');

        if (categoriesWithChildren?.length) {
          const parentIds = [...new Set(categoriesWithChildren.map(c => c.parent_id))].filter((id): id is string => id !== null);
          if (parentIds.length > 0) {
            query = query.in('id', parentIds);
          }
        }
      } else {
        const { data: categoriesWithChildren } = await this.client
          .from('data_categories')
          .select('parent_id')
          .not('parent_id', 'is', null)
          .eq('status', 'active');

        if (categoriesWithChildren?.length) {
          const parentIds = [...new Set(categoriesWithChildren.map(c => c.parent_id))].filter((id): id is string => id !== null);
          if (parentIds.length > 0) {
            query = query.not('id', 'in', `(${parentIds.join(',')})`);
          }
        }
      }
    }

    query = query.eq('status', 'active').order('name', { ascending: true });

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to perform advanced category search: ${error.message}`);
    }

    if (filters.include_hierarchy) {
      // Enhance results with hierarchy information
      const results = data as DataCategory[];
      for (const category of results) {
        if (category.parent_id) {
          category.parent = await this.findById(category.parent_id);
        }
        category.children = await this.getChildCategories(category.id);
      }
    }

    return data as DataCategory[];
  }

  /**
   * Get category statistics by type
   */
  async getStatisticsByType(): Promise<{
    category_type: string;
    total_count: number;
    standard_count: number;
    custom_count: number;
  }[]> {
    const { data, error } = await this.client
      .from('data_categories')
      .select('category_type, is_standard')
      .eq('status', 'active');

    if (error) {
      throw new Error(`Failed to get category statistics: ${error.message}`);
    }

    // Group by category type
    const stats = new Map();
    
    (data as any[]).forEach(cat => {
      const type = cat.category_type;
      
      if (!stats.has(type)) {
        stats.set(type, {
          category_type: type,
          total_count: 0,
          standard_count: 0,
          custom_count: 0,
        });
      }
      
      const typeStats = stats.get(type);
      typeStats.total_count += 1;
      
      if (cat.is_standard) {
        typeStats.standard_count += 1;
      } else {
        typeStats.custom_count += 1;
      }
    });

    return Array.from(stats.values()).sort((a, b) => a.category_type.localeCompare(b.category_type));
  }
}