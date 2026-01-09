/**
 * Context Module - Main Context Service
 * 
 * Central service orchestrating all Context module operations.
 * Provides high-level business logic and transaction management.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';
import type { ContextClaims } from '../types';
import { EntityStatus } from '../types';

import { JurisdictionRepository } from '../repositories/jurisdiction.repository';
import { PhysicalLocationRepository } from '../repositories/physical-location.repository';
import { VendorRepository } from '../repositories/vendor.repository';
import { SystemRepository } from '../repositories/system.repository';
import { DataCategoryRepository } from '../repositories/data-category.repository';
import { ProcessingActivityRepository } from '../repositories/processing-activity.repository';

import { JurisdictionService } from './jurisdiction.service';
import { PhysicalLocationService } from './physical-location.service';
import { VendorService } from './vendor.service';
import { SystemService } from './system.service';
import { DataCategoryService } from './data-category.service';
import { ProcessingActivityService } from './processing-activity.service';

export class ContextService {
  private client: SupabaseClient<Database>;
  private context: ContextClaims;

  // Repository instances
  private jurisdictionRepo: JurisdictionRepository;
  private physicalLocationRepo: PhysicalLocationRepository;
  private vendorRepo: VendorRepository;
  private systemRepo: SystemRepository;
  private dataCategoryRepo: DataCategoryRepository;
  private processingActivityRepo: ProcessingActivityRepository;

  // Service instances
  public readonly jurisdictions: JurisdictionService;
  public readonly physicalLocations: PhysicalLocationService;
  public readonly vendors: VendorService;
  public readonly systems: SystemService;
  public readonly dataCategories: DataCategoryService;
  public readonly processingActivities: ProcessingActivityService;

  constructor(context: ContextClaims, client?: SupabaseClient<Database>) {
    this.context = context;
    this.client = client!;

    // Initialize repositories
    this.jurisdictionRepo = new JurisdictionRepository(context, client);
    this.physicalLocationRepo = new PhysicalLocationRepository(context, client);
    this.vendorRepo = new VendorRepository(context, client);
    this.systemRepo = new SystemRepository(context, client);
    this.dataCategoryRepo = new DataCategoryRepository(context, client);
    this.processingActivityRepo = new ProcessingActivityRepository(context, client);

    // Initialize services
    this.jurisdictions = new JurisdictionService(this.jurisdictionRepo);
    this.physicalLocations = new PhysicalLocationService(this.physicalLocationRepo, this.jurisdictionRepo);
    this.vendors = new VendorService(this.vendorRepo, this.physicalLocationRepo);
    this.systems = new SystemService(this.systemRepo, this.physicalLocationRepo);
    this.dataCategories = new DataCategoryService(this.dataCategoryRepo);
    this.processingActivities = new ProcessingActivityService(
      this.processingActivityRepo,
      this.systemRepo,
      this.dataCategoryRepo,
      this.vendorRepo
    );
  }

  /**
   * Initialize workspace with standard GDPR data categories
   */
  async initializeWorkspace(): Promise<{
    success: boolean;
    message: string;
    categories_created: number;
  }> {
    try {
      const result = await this.dataCategories.seedStandardCategories();
      return {
        success: result.success,
        message: result.message,
        categories_created: result.created_count
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to initialize workspace: ${error}`,
        categories_created: 0,
      };
    }
  }

  /**
   * Get workspace overview statistics
   */
  async getWorkspaceOverview(): Promise<{
    locations: number;
    vendors: number;
    systems: number;
    data_categories: number;
    processing_activities: number;
    compliance_score: number;
    recent_activity: {
      type: string;
      entity: string;
      action: string;
      timestamp: string;
    }[];
  }> {
    try {
      // Get entity counts
      const [
        locationsCount,
        vendorsCount,
        systemsCount,
        categoriesCount,
        activitiesCount,
        processingStats
      ] = await Promise.all([
        this.physicalLocationRepo.count({ status: EntityStatus.ACTIVE }),
        this.vendorRepo.count({ status: EntityStatus.ACTIVE }),
        this.systemRepo.count({ status: EntityStatus.ACTIVE }),
        this.dataCategoryRepo.count({ status: EntityStatus.ACTIVE }),
        this.processingActivityRepo.count({ status: EntityStatus.ACTIVE }),
        this.processingActivityRepo.getStatistics()
      ]);

      // Calculate compliance score based on various factors
      const complianceScore = await this.calculateComplianceScore(processingStats);

      return {
        locations: locationsCount,
        vendors: vendorsCount,
        systems: systemsCount,
        data_categories: categoriesCount,
        processing_activities: activitiesCount,
        compliance_score: complianceScore,
        recent_activity: [], // TODO: Implement activity tracking
      };

    } catch (error) {
      throw new Error(`Failed to get workspace overview: ${error}`);
    }
  }

  /**
   * Validate data consistency across the workspace
   */
  async validateDataConsistency(): Promise<{
    valid: boolean;
    issues: {
      type: 'warning' | 'error';
      category: string;
      message: string;
      entity_id?: string;
    }[];
  }> {
    const issues: {
      type: 'warning' | 'error';
      category: string;
      message: string;
      entity_id?: string;
    }[] = [];

    try {
      // Check for orphaned relationships
      await this.checkOrphanedRelationships(issues);

      // Check for missing required relationships
      await this.checkMissingRelationships(issues);

      // Check for data consistency issues
      await this.checkDataConsistency(issues);

      return {
        valid: issues.filter(i => i.type === 'error').length === 0,
        issues,
      };

    } catch (error) {
      issues.push({
        type: 'error',
        category: 'system',
        message: `Validation failed: ${error}`,
      });

      return {
        valid: false,
        issues,
      };
    }
  }

  /**
   * Generate GDPR compliance report
   */
  async generateComplianceReport(): Promise<{
    overview: {
      total_processing_activities: number;
      compliant_activities: number;
      compliance_percentage: number;
    };
    lawful_basis_distribution: Record<string, number>;
    special_categories_usage: number;
    cross_border_transfers: number;
    retention_policies_count: number;
    recommendations: {
      priority: 'high' | 'medium' | 'low';
      category: string;
      message: string;
      action_required: string;
    }[];
  }> {
    try {
      const processingStats = await this.processingActivityRepo.getStatistics();
      const recommendations: {
        priority: 'high' | 'medium' | 'low';
        category: string;
        message: string;
        action_required: string;
      }[] = [];

      // Check for high priority compliance issues
      if (processingStats.overdue_reviews > 0) {
        recommendations.push({
          priority: 'high',
          category: 'reviews',
          message: `${processingStats.overdue_reviews} processing activities have overdue reviews`,
          action_required: 'Complete overdue reviews immediately',
        });
      }

      if (processingStats.with_automated_decision_making > 0) {
        recommendations.push({
          priority: 'medium',
          category: 'automated_processing',
          message: `${processingStats.with_automated_decision_making} activities involve automated decision making`,
          action_required: 'Ensure proper safeguards and human oversight',
        });
      }

      // Calculate compliance percentage
      const compliantActivities = processingStats.total_activities - processingStats.overdue_reviews;
      const compliancePercentage = processingStats.total_activities > 0 
        ? Math.round((compliantActivities / processingStats.total_activities) * 100)
        : 100;

      return {
        overview: {
          total_processing_activities: processingStats.total_activities,
          compliant_activities: compliantActivities,
          compliance_percentage: compliancePercentage,
        },
        lawful_basis_distribution: processingStats.by_lawful_basis,
        special_categories_usage: processingStats.with_special_categories,
        cross_border_transfers: 0, // TODO: Count from cross-border transfers
        retention_policies_count: 0, // TODO: Count retention policies
        recommendations,
      };

    } catch (error) {
      throw new Error(`Failed to generate compliance report: ${error}`);
    }
  }

  // Private helper methods

  private async calculateComplianceScore(stats: Record<string, unknown>): Promise<number> {
    let score = 100;

    // Deduct points for overdue reviews
    const overdueReviews = Number(stats.overdue_reviews) || 0;
    if (overdueReviews > 0) {
      score -= Math.min(overdueReviews * 5, 30);
    }

    // Deduct points for activities without DPO review when required
    const requiringDpoReview = Number(stats.requiring_dpo_review) || 0;
    if (requiringDpoReview > 0) {
      score -= Math.min(requiringDpoReview * 2, 20);
    }

    // Deduct points for special category processing without proper basis
    const withSpecialCategories = Number(stats.with_special_categories) || 0;
    if (withSpecialCategories > 0) {
      // TODO: Check if special categories have proper legal basis
      score -= Math.min(withSpecialCategories * 3, 25);
    }

    return Math.max(score, 0);
  }

  private async checkOrphanedRelationships(_issues: {
    type: 'warning' | 'error';
    category: string;
    message: string;
    entity_id?: string;
  }[]): Promise<void> {
    // Check for processing activities referencing non-existent entities
    // Implementation would involve complex queries across tables
    // For now, placeholder for future implementation
  }

  private async checkMissingRelationships(_issues: {
    type: 'warning' | 'error';
    category: string;
    message: string;
    entity_id?: string;
  }[]): Promise<void> {
    // Check for processing activities without required relationships
    // e.g., activities without data categories, systems, or lawful basis
    
    const activitiesWithoutSystems = await this.processingActivityRepo.findMany({});
    
    activitiesWithoutSystems.data.forEach((activity: any) => {
      _issues.push({
        type: 'warning',
        category: 'processing_activities',
        message: `Processing activity "${activity.name}" has no associated systems`,
        entity_id: activity.id,
      });
    });
  }

  private async checkDataConsistency(_issues: {
    type: 'warning' | 'error';
    category: string;
    message: string;
    entity_id?: string;
  }[]): Promise<void> {
    // Check for data consistency issues
    // e.g., special category data without proper legal basis

    const specialCategoryActivities = await this.processingActivityRepo.advancedSearch({
      special_category_bases: ['explicit_consent', 'employment', 'vital_interests', 'public_interest', 'healthcare', 'research', 'legal_claims']
    });

    for (const activity of specialCategoryActivities) {
      if (!activity.special_category_basis) {
        _issues.push({
          type: 'error',
          category: 'data_consistency',
          message: `Processing activity "${activity.name}" processes special category data but lacks proper legal basis`,
          entity_id: activity.id,
        });
      }
    }
  }

  /**
   * Export workspace data for backup or migration
   */
  async exportWorkspaceData(): Promise<{
    metadata: {
      tenant_id: string;
      workspace_id: string;
      exported_at: string;
      version: string;
    };
    data: {
      locations: unknown[];
      vendors: unknown[];
      systems: unknown[];
      data_categories: unknown[];
      processing_activities: unknown[];
    };
  }> {
    try {
      const [
        locations,
        vendors,
        systems,
        dataCategories,
        processingActivities
      ] = await Promise.all([
        this.physicalLocationRepo.findMany({ limit: 1000 }),
        this.vendorRepo.findMany({ limit: 1000 }),
        this.systemRepo.findMany({ limit: 1000 }),
        this.dataCategoryRepo.findMany({ limit: 1000 }),
        this.processingActivityRepo.findMany({ limit: 1000 })
      ]);

      return {
        metadata: {
          tenant_id: this.context.tenant_id,
          workspace_id: this.context.workspace_id,
          exported_at: new Date().toISOString(),
          version: '1.0.0',
        },
        data: {
          locations: locations.data,
          vendors: vendors.data,
          systems: systems.data,
          data_categories: dataCategories.data,
          processing_activities: processingActivities.data,
        },
      };

    } catch (error) {
      throw new Error(`Failed to export workspace data: ${error}`);
    }
  }

  /**
   * Health check for the Context module
   */
  async healthCheck(): Promise<{
    healthy: boolean;
    checks: {
      database: boolean;
      repositories: boolean;
      services: boolean;
    };
    message: string;
  }> {
    const checks = {
      database: false,
      repositories: false,
      services: false,
    };

    try {
      // Check database connection
      const jurisdictions = await this.jurisdictionRepo.findMany({ limit: 1 });
      checks.database = true;

      // Check repositories
      checks.repositories = !!(
        this.jurisdictionRepo &&
        this.physicalLocationRepo &&
        this.vendorRepo &&
        this.systemRepo &&
        this.dataCategoryRepo &&
        this.processingActivityRepo
      );

      // Check services
      checks.services = !!(
        this.jurisdictions &&
        this.physicalLocations &&
        this.vendors &&
        this.systems &&
        this.dataCategories &&
        this.processingActivities
      );

      const healthy = Object.values(checks).every(check => check);

      return {
        healthy,
        checks,
        message: healthy ? 'Context module is healthy' : 'Context module has issues',
      };

    } catch (error) {
      return {
        healthy: false,
        checks,
        message: `Health check failed: ${error}`,
      };
    }
  }
}