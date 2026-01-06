/**
 * Context Module - Data Category Service
 * 
 * Service layer for data category operations with business logic validation.
 * Handles GDPR data category hierarchy and compliance validation.
 */

import type { 
  DataCategory, 
  CreateDataCategoryRequest,
  UpdateDataCategoryRequest,
  DataCategoryQueryParams, 
  PaginatedResponse,
  UUID 
} from '../types';
import type { DataCategoryRepository } from '../repositories/data-category.repository';

export class DataCategoryService {
  constructor(private dataCategoryRepo: DataCategoryRepository) {}

  /**
   * Get all data categories with filtering and pagination
   */
  async getDataCategories(params: DataCategoryQueryParams = {}): Promise<PaginatedResponse<DataCategory>> {
    return await this.dataCategoryRepo.findMany(params);
  }

  /**
   * Get data category by ID with hierarchy
   */
  async getDataCategoryById(id: UUID, includeHierarchy: boolean = false): Promise<DataCategory | null> {
    if (includeHierarchy) {
      return await this.dataCategoryRepo.findByIdWithHierarchy(id);
    }
    return await this.dataCategoryRepo.findById(id);
  }

  /**
   * Get hierarchical tree structure of all categories
   */
  async getCategoryHierarchy(): Promise<DataCategory[]> {
    return await this.dataCategoryRepo.getHierarchicalTree();
  }

  /**
   * Get root categories (top-level categories without parent)
   */
  async getRootCategories(): Promise<DataCategory[]> {
    return await this.dataCategoryRepo.getRootCategories();
  }

  /**
   * Get child categories for a parent
   */
  async getChildCategories(parentId: UUID): Promise<DataCategory[]> {
    // Validate parent exists
    const parent = await this.dataCategoryRepo.findById(parentId);
    if (!parent) {
      throw new Error('Parent category not found');
    }

    return await this.dataCategoryRepo.getChildCategories(parentId);
  }

  /**
   * Create new data category
   */
  async createDataCategory(data: CreateDataCategoryRequest): Promise<DataCategory> {
    // Validate business rules
    await this.validateDataCategoryData(data);

    // Create the category
    const category = await this.dataCategoryRepo.create(data);
    
    return category;
  }

  /**
   * Update existing data category
   */
  async updateDataCategory(id: UUID, data: UpdateDataCategoryRequest): Promise<DataCategory> {
    // Check if category exists
    const existingCategory = await this.dataCategoryRepo.findById(id);
    if (!existingCategory) {
      throw new Error('Data category not found');
    }

    // Validate business rules
    const validationData = {
      ...existingCategory,
      ...data,
      description: data.description ?? existingCategory.description
    };
    await this.validateDataCategoryData(validationData as any, id);

    // Special validation for parent changes
    if (data.parent_id !== undefined && data.parent_id !== existingCategory.parent_id) {
      await this.validateParentChange(id, data.parent_id);
    }

    // Update the category
    return await this.dataCategoryRepo.update(id, data);
  }

  /**
   * Delete data category with validation
   */
  async deleteDataCategory(id: UUID): Promise<void> {
    // Check if category exists
    const existingCategory = await this.dataCategoryRepo.findById(id);
    if (!existingCategory) {
      throw new Error('Data category not found');
    }

    // Check for children
    const children = await this.dataCategoryRepo.getChildCategories(id);
    if (children.length > 0) {
      throw new Error(
        `Cannot delete category "${existingCategory.name}". ` +
        `It has ${children.length} child categories. Remove or move child categories first.`
      );
    }

    // Check usage
    const usage = await this.dataCategoryRepo.getUsageStatistics(id);
    if (usage.total_usage > 0) {
      throw new Error(
        `Cannot delete category "${existingCategory.name}". ` +
        `It is used in ${usage.processing_activities_count} processing activities ` +
        `and ${usage.data_flows_count} data flows. Remove these associations first.`
      );
    }

    // Prevent deletion of standard categories
    if (existingCategory.is_standard) {
      throw new Error('Cannot delete standard GDPR data categories');
    }

    await this.dataCategoryRepo.delete(id);
  }

  /**
   * Get categories by type
   */
  async getCategoriesByType(categoryType: 'personal' | 'special' | 'criminal' | 'anonymous'): Promise<DataCategory[]> {
    return await this.dataCategoryRepo.findByType(categoryType);
  }

  /**
   * Get categories by sensitivity level
   */
  async getCategoriesBySensitivity(sensitivity: 'public' | 'internal' | 'confidential' | 'restricted'): Promise<DataCategory[]> {
    return await this.dataCategoryRepo.findBySensitivity(sensitivity);
  }

  /**
   * Get standard GDPR categories
   */
  async getStandardCategories(): Promise<DataCategory[]> {
    return await this.dataCategoryRepo.getStandardCategories();
  }

  /**
   * Get custom (non-standard) categories
   */
  async getCustomCategories(): Promise<DataCategory[]> {
    return await this.dataCategoryRepo.getCustomCategories();
  }

  /**
   * Seed standard GDPR categories for the workspace
   */
  async seedStandardCategories(): Promise<{ success: boolean; message: string; created_count: number }> {
    return await this.dataCategoryRepo.seedStandardCategories();
  }

  /**
   * Move category to different parent
   */
  async moveCategoryToParent(categoryId: UUID, newParentId: UUID | null): Promise<DataCategory> {
    // Validate category exists
    const category = await this.dataCategoryRepo.findById(categoryId);
    if (!category) {
      throw new Error('Data category not found');
    }

    // Validate new parent exists if provided
    if (newParentId) {
      const newParent = await this.dataCategoryRepo.findById(newParentId);
      if (!newParent) {
        throw new Error('Target parent category not found');
      }
    }

    // Validate hierarchy (prevent circular references)
    if (newParentId && !(await this.dataCategoryRepo.validateHierarchy(categoryId, newParentId))) {
      throw new Error('Cannot move category: would create circular reference in hierarchy');
    }

    return await this.dataCategoryRepo.moveToParent(categoryId, newParentId);
  }

  /**
   * Get category usage statistics
   */
  async getCategoryUsage(id: UUID): Promise<{
    category: DataCategory;
    usage: {
      processing_activities_count: number;
      data_flows_count: number;
      children_count: number;
      total_usage: number;
    };
    descendants: DataCategory[];
  }> {
    const category = await this.getDataCategoryById(id);
    if (!category) {
      throw new Error('Data category not found');
    }

    const [usage, descendants] = await Promise.all([
      this.dataCategoryRepo.getUsageStatistics(id),
      this.dataCategoryRepo.getAllDescendants(id)
    ]);

    return {
      category,
      usage,
      descendants,
    };
  }

  /**
   * Advanced category search with multiple filters
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
    return await this.dataCategoryRepo.advancedSearch(filters);
  }

  /**
   * Get category statistics by type
   */
  async getCategoryStatisticsByType(): Promise<{
    category_type: string;
    total_count: number;
    standard_count: number;
    custom_count: number;
  }[]> {
    return await this.dataCategoryRepo.getStatisticsByType();
  }

  /**
   * Validate data category compliance
   */
  async validateCategoryCompliance(categoryId: UUID): Promise<{
    category: DataCategory;
    compliance_status: 'compliant' | 'needs_attention' | 'non_compliant';
    issues: {
      type: 'error' | 'warning';
      message: string;
    }[];
    recommendations: string[];
  }> {
    const category = await this.getDataCategoryById(categoryId, true);
    if (!category) {
      throw new Error('Data category not found');
    }

    const issues: any[] = [];
    const recommendations: string[] = [];

    // Validate special category basis
    if (category.category_type === 'special' && !category.special_category_basis) {
      issues.push({
        type: 'error',
        message: 'Special category data must have a legal basis specified'
      });
      recommendations.push('Specify appropriate special category legal basis (Article 9 GDPR)');
    }

    // Check if non-special categories have special basis (data inconsistency)
    if (category.category_type !== 'special' && category.special_category_basis) {
      issues.push({
        type: 'warning',
        message: 'Non-special category has special category basis specified'
      });
      recommendations.push('Remove special category basis for non-special data categories');
    }

    // Validate sensitivity level for special categories
    if (category.category_type === 'special' && category.sensitivity !== 'restricted') {
      issues.push({
        type: 'warning',
        message: 'Special category data should typically have "restricted" sensitivity level'
      });
      recommendations.push('Consider setting sensitivity level to "restricted" for special category data');
    }

    // Check for missing description
    if (!category.description || category.description.trim().length === 0) {
      issues.push({
        type: 'warning',
        message: 'Category lacks description'
      });
      recommendations.push('Add descriptive explanation to help users understand the data category');
    }

    // Determine compliance status
    const errorCount = issues.filter(issue => issue.type === 'error').length;
    const warningCount = issues.filter(issue => issue.type === 'warning').length;

    let complianceStatus: any = 'compliant';
    if (errorCount > 0) complianceStatus = 'non_compliant';
    else if (warningCount > 0) complianceStatus = 'needs_attention';

    return {
      category,
      compliance_status: complianceStatus,
      issues,
      recommendations,
    };
  }

  /**
   * Get GDPR Article 9 special categories guidance
   */
  async getSpecialCategoriesGuidance(): Promise<{
    special_categories: {
      name: string;
      description: string;
      legal_bases: {
        basis: string;
        description: string;
        conditions: string[];
      }[];
      examples: string[];
    }[];
  }> {
    return {
      special_categories: [
        {
          name: 'Health Data',
          description: 'Data concerning physical or mental health, including healthcare services',
          legal_bases: [
            {
              basis: 'healthcare',
              description: 'Healthcare and social protection',
              conditions: ['Provided by healthcare professional', 'Subject to professional secrecy']
            },
            {
              basis: 'explicit_consent',
              description: 'Explicit consent of the data subject',
              conditions: ['Clear and specific consent', 'Freely given and withdrawable']
            }
          ],
          examples: ['Medical records', 'Health insurance data', 'Fitness tracker data', 'Mental health records']
        },
        {
          name: 'Biometric Data',
          description: 'Data resulting from technical processing relating to physical or behavioral characteristics',
          legal_bases: [
            {
              basis: 'explicit_consent',
              description: 'Explicit consent of the data subject',
              conditions: ['Clear purpose explanation', 'Opt-in consent mechanism']
            }
          ],
          examples: ['Fingerprints', 'Facial recognition', 'Voice patterns', 'Iris scans']
        },
        {
          name: 'Racial or Ethnic Origin',
          description: 'Information about racial or ethnic background',
          legal_bases: [
            {
              basis: 'explicit_consent',
              description: 'Explicit consent of the data subject',
              conditions: ['Specific purpose', 'No coercion']
            },
            {
              basis: 'public_interest',
              description: 'Substantial public interest',
              conditions: ['Proportionate to aim', 'Legal basis in EU/national law']
            }
          ],
          examples: ['Ethnicity surveys', 'Diversity monitoring', 'Census data']
        }
      ]
    };
  }

  /**
   * Get data minimization recommendations
   */
  async getDataMinimizationRecommendations(categoryIds: UUID[]): Promise<{
    analysis: {
      category_id: UUID;
      category_name: string;
      sensitivity_level: string;
      risk_score: number;
      recommendations: string[];
    }[];
    overall_risk: 'low' | 'medium' | 'high';
    general_recommendations: string[];
  }> {
    const analysis: any[] = [];
    let totalRisk = 0;

    for (const categoryId of categoryIds) {
      const category = await this.dataCategoryRepo.findById(categoryId);
      if (!category) continue;

      // Calculate risk score based on category type and sensitivity
      let riskScore = 0;
      
      // Base risk by category type
      switch (category.category_type) {
        case 'special': riskScore += 40; break;
        case 'criminal': riskScore += 35; break;
        case 'personal': riskScore += 20; break;
        case 'anonymous': riskScore += 5; break;
      }

      // Additional risk by sensitivity
      switch (category.sensitivity) {
        case 'restricted': riskScore += 25; break;
        case 'confidential': riskScore += 15; break;
        case 'internal': riskScore += 10; break;
        case 'public': riskScore += 0; break;
      }

      const recommendations: string[] = [];

      // Generate category-specific recommendations
      if (category.category_type === 'special') {
        recommendations.push('Implement additional safeguards for special category data');
        recommendations.push('Regular review of processing necessity');
        recommendations.push('Consider pseudonymization or anonymization where possible');
      }

      if (category.sensitivity === 'restricted') {
        recommendations.push('Limit access to authorized personnel only');
        recommendations.push('Implement strong encryption and access controls');
      }

      analysis.push({
        category_id: categoryId,
        category_name: category.name,
        sensitivity_level: category.sensitivity,
        risk_score: Math.min(riskScore, 100),
        recommendations,
      });

      totalRisk += riskScore;
    }

    // Calculate overall risk
    const averageRisk = categoryIds.length > 0 ? totalRisk / categoryIds.length : 0;
    let overallRisk: any = 'low';
    if (averageRisk > 60) overallRisk = 'high';
    else if (averageRisk > 35) overallRisk = 'medium';

    const generalRecommendations = [
      'Regularly review data categories for continued necessity',
      'Implement data retention policies to minimize data storage time',
      'Consider data aggregation or statistical analysis instead of individual records',
      'Provide clear privacy notices explaining data category usage',
    ];

    if (overallRisk === 'high') {
      generalRecommendations.unshift(
        'Conduct Data Protection Impact Assessment (DPIA)',
        'Consult with Data Protection Officer (DPO)'
      );
    }

    return {
      analysis,
      overall_risk: overallRisk,
      general_recommendations: generalRecommendations,
    };
  }

  // Private helper methods

  private async validateDataCategoryData(
    data: CreateDataCategoryRequest | (UpdateDataCategoryRequest & { id?: UUID }), 
    excludeId?: UUID
  ): Promise<void> {
    const errors: string[] = [];

    // Validate required fields for creation
    if ('name' in data && (!data.name || data.name.trim().length === 0)) {
      errors.push('Category name is required');
    }

    // Validate category type and special basis consistency
    if (data.category_type === 'special' && !data.special_category_basis) {
      errors.push('Special category data must have special category basis specified');
    }

    if (data.category_type !== 'special' && data.special_category_basis) {
      errors.push('Special category basis can only be set for special category data');
    }

    // Validate parent exists if specified
    if (data.parent_id) {
      const parent = await this.dataCategoryRepo.findById(data.parent_id);
      if (!parent) {
        errors.push('Invalid parent category specified');
      }
    }

    // Check name uniqueness within the same parent
    if (data.name) {
      const nameExists = await this.dataCategoryRepo.nameExistsInParent(
        data.name.trim(), 
        data.parent_id || null, 
        excludeId
      );
      if (nameExists) {
        errors.push('Category name already exists within the same parent category');
      }
    }

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
  }

  private async validateParentChange(categoryId: UUID, newParentId: UUID | null): Promise<void> {
    if (newParentId) {
      // Check if new parent exists
      const newParent = await this.dataCategoryRepo.findById(newParentId);
      if (!newParent) {
        throw new Error('Target parent category does not exist');
      }

      // Validate hierarchy to prevent circular references
      const validHierarchy = await this.dataCategoryRepo.validateHierarchy(categoryId, newParentId);
      if (!validHierarchy) {
        throw new Error('Cannot set parent: would create circular reference in category hierarchy');
      }
    }
  }
}