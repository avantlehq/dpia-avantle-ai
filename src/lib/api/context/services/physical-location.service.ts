/**
 * Context Module - Physical Location Service
 * 
 * Service layer for physical location operations with business logic validation.
 * Handles location management with jurisdiction validation and usage tracking.
 */

import type { 
  PhysicalLocation, 
  CreatePhysicalLocationRequest,
  UpdatePhysicalLocationRequest,
  PhysicalLocationQueryParams, 
  PaginatedResponse,
  UUID 
} from '../types';
import type { PhysicalLocationRepository } from '../repositories/physical-location.repository';
import type { JurisdictionRepository } from '../repositories/jurisdiction.repository';

export class PhysicalLocationService {
  constructor(
    private locationRepo: PhysicalLocationRepository,
    private jurisdictionRepo: JurisdictionRepository
  ) {}

  /**
   * Get all physical locations with filtering and pagination
   */
  async getLocations(params: PhysicalLocationQueryParams = {}): Promise<PaginatedResponse<PhysicalLocation>> {
    return await this.locationRepo.findManyWithJurisdictions(params);
  }

  /**
   * Get location by ID with jurisdiction details
   */
  async getLocationById(id: UUID): Promise<PhysicalLocation | null> {
    return await this.locationRepo.findByIdWithJurisdiction(id);
  }

  /**
   * Create new physical location
   */
  async createLocation(data: CreatePhysicalLocationRequest): Promise<PhysicalLocation> {
    // Validate business rules
    await this.validateLocationData(data);

    // Create the location
    const location = await this.locationRepo.create(data);
    
    // Return with jurisdiction details
    return (await this.getLocationById(location.id))!;
  }

  /**
   * Update existing physical location
   */
  async updateLocation(id: UUID, data: UpdatePhysicalLocationRequest): Promise<PhysicalLocation> {
    // Check if location exists
    const existingLocation = await this.locationRepo.findById(id);
    if (!existingLocation) {
      throw new Error('Physical location not found');
    }

    // Validate business rules
    const validationData = {
      ...existingLocation,
      ...data,
      description: data.description ?? existingLocation.description,
      address: data.address ?? existingLocation.address,
      city: data.city ?? existingLocation.city
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await this.validateLocationData(validationData as any, id);

    // Update the location
    const updatedLocation = await this.locationRepo.update(id, data);
    
    // Return with jurisdiction details
    return (await this.getLocationById(updatedLocation.id))!;
  }

  /**
   * Delete physical location with usage validation
   */
  async deleteLocation(id: UUID): Promise<void> {
    // Check if location exists
    const existingLocation = await this.locationRepo.findById(id);
    if (!existingLocation) {
      throw new Error('Physical location not found');
    }

    // Check usage before deletion
    const usage = await this.locationRepo.getLocationUsage(id);
    
    if (usage.total_usage > 0) {
      throw new Error(
        `Cannot delete location "${existingLocation.name}". ` +
        `It is currently used by ${usage.systems_count} systems and ${usage.vendors_count} vendors. ` +
        'Remove these associations first.'
      );
    }

    await this.locationRepo.delete(id);
  }

  /**
   * Get locations by jurisdiction
   */
  async getLocationsByJurisdiction(jurisdictionId: UUID): Promise<PhysicalLocation[]> {
    // Validate jurisdiction exists
    const jurisdiction = await this.jurisdictionRepo.findById(jurisdictionId);
    if (!jurisdiction) {
      throw new Error('Jurisdiction not found');
    }

    return await this.locationRepo.findByJurisdiction(jurisdictionId);
  }

  /**
   * Get locations by city
   */
  async getLocationsByCity(city: string): Promise<PhysicalLocation[]> {
    if (!city || city.trim().length < 2) {
      throw new Error('City name must be at least 2 characters long');
    }

    return await this.locationRepo.findByCity(city.trim());
  }

  /**
   * Get location usage statistics
   */
  async getLocationUsage(id: UUID): Promise<{
    location: PhysicalLocation;
    usage: {
      systems_count: number;
      vendors_count: number;
      total_usage: number;
    };
    systems: unknown[]; // Systems using this location
    vendors: unknown[]; // Vendors using this location
  }> {
    const location = await this.getLocationById(id);
    if (!location) {
      throw new Error('Physical location not found');
    }

    const usage = await this.locationRepo.getLocationUsage(id);

    // TODO: Get actual systems and vendors lists
    const systems: unknown[] = [];
    const vendors: unknown[] = [];

    return {
      location,
      usage,
      systems,
      vendors,
    };
  }

  /**
   * Get statistics by jurisdiction
   */
  async getStatisticsByJurisdiction(): Promise<{
    jurisdiction_id: UUID;
    jurisdiction_name: string;
    country_code: string;
    location_count: number;
    gdpr_adequacy: boolean;
  }[]> {
    return await this.locationRepo.getStatisticsByJurisdiction();
  }

  /**
   * Get available locations for dropdown/selection
   */
  async getAvailableLocations(): Promise<PhysicalLocation[]> {
    return await this.locationRepo.getAvailableLocations();
  }

  /**
   * Advanced location search with multiple filters
   */
  async advancedSearch(filters: {
    search?: string;
    jurisdictions?: UUID[];
    cities?: string[];
    status?: 'active' | 'inactive';
    gdpr_adequacy_only?: boolean;
  }): Promise<PhysicalLocation[]> {
    // Validate filters
    if (filters.cities) {
      filters.cities = filters.cities.filter(city => city.trim().length >= 2);
    }

    return await this.locationRepo.advancedSearch(filters);
  }

  /**
   * Validate location against data residency requirements
   */
  async validateDataResidency(
    locationId: UUID, 
    dataCategories: string[]
  ): Promise<{
    compliant: boolean;
    jurisdiction: unknown;
    issues: {
      category: string;
      severity: 'warning' | 'error';
      message: string;
    }[];
    recommendations: string[];
  }> {
    const location = await this.getLocationById(locationId);
    if (!location || !location.jurisdiction) {
      throw new Error('Location or jurisdiction not found');
    }

    const issues: { category: string; severity: 'error' | 'warning'; message: string; }[] = [];
    const recommendations: string[] = [];

    // Check GDPR adequacy for sensitive data
    const hasSpecialCategories = dataCategories.some(cat => 
      cat.toLowerCase().includes('health') || 
      cat.toLowerCase().includes('biometric') ||
      cat.toLowerCase().includes('genetic')
    );

    if (hasSpecialCategories && !location.jurisdiction.gdpr_adequacy) {
      issues.push({
        category: 'data_residency',
        severity: 'error',
        message: `Special category data cannot be stored in ${location.jurisdiction.name_en} without adequate safeguards`,
      });
      
      recommendations.push(
        'Consider moving special category data to an EU/EEA location',
        'Implement additional technical and organizational safeguards',
        'Conduct a Transfer Impact Assessment (TIA)'
      );
    }

    // Check for financial data
    const hasFinancialData = dataCategories.some(cat => 
      cat.toLowerCase().includes('financial') || 
      cat.toLowerCase().includes('payment')
    );

    if (hasFinancialData && !location.jurisdiction.gdpr_adequacy) {
      issues.push({
        category: 'financial_data',
        severity: 'warning',
        message: `Financial data in ${location.jurisdiction.name_en} may require additional compliance measures`,
      });
      
      recommendations.push(
        'Review local financial data protection requirements',
        'Ensure PCI DSS compliance if handling payment data'
      );
    }

    const compliant = issues.filter(i => i.severity === 'error').length === 0;

    return {
      compliant,
      jurisdiction: location.jurisdiction,
      issues,
      recommendations,
    };
  }

  /**
   * Get location compliance score
   */
  async getLocationComplianceScore(locationId: UUID): Promise<{
    location: PhysicalLocation;
    compliance_score: number; // 0-100
    factors: {
      gdpr_adequacy: { score: number; weight: number; description: string };
      supervisory_authority: { score: number; weight: number; description: string };
      data_usage: { score: number; weight: number; description: string };
    };
    overall_rating: 'excellent' | 'good' | 'fair' | 'poor';
  }> {
    const location = await this.getLocationById(locationId);
    if (!location || !location.jurisdiction) {
      throw new Error('Location or jurisdiction not found');
    }

    const usage = await this.locationRepo.getLocationUsage(locationId);

    // Calculate compliance factors
    const factors = {
      gdpr_adequacy: {
        score: location.jurisdiction.gdpr_adequacy ? 100 : 60,
        weight: 0.5,
        description: location.jurisdiction.gdpr_adequacy 
          ? 'EU adequacy decision provides strong data protection'
          : 'No EU adequacy decision - additional safeguards required',
      },
      supervisory_authority: {
        score: location.jurisdiction.supervisory_authority ? 90 : 70,
        weight: 0.3,
        description: location.jurisdiction.supervisory_authority
          ? 'Designated supervisory authority available'
          : 'Limited supervisory authority information',
      },
      data_usage: {
        score: usage.total_usage > 10 ? 85 : usage.total_usage > 5 ? 75 : 95,
        weight: 0.2,
        description: `Location used by ${usage.total_usage} entities`,
      },
    };

    // Calculate weighted compliance score
    const complianceScore = Math.round(
      Object.values(factors).reduce((total, factor) => 
        total + (factor.score * factor.weight), 0
      )
    );

    // Determine overall rating
    let overallRating: 'excellent' | 'good' | 'fair' | 'poor' = 'poor';
    if (complianceScore >= 90) overallRating = 'excellent';
    else if (complianceScore >= 80) overallRating = 'good';
    else if (complianceScore >= 70) overallRating = 'fair';

    return {
      location,
      compliance_score: complianceScore,
      factors,
      overall_rating: overallRating,
    };
  }

  // Private helper methods

  private async validateLocationData(
    data: CreatePhysicalLocationRequest | (UpdatePhysicalLocationRequest & { id?: UUID }), 
    excludeId?: UUID
  ): Promise<void> {
    const errors: string[] = [];

    // Validate required fields for creation
    if ('name' in data && (!data.name || data.name.trim().length === 0)) {
      errors.push('Location name is required');
    }

    if ('jurisdiction_id' in data && !data.jurisdiction_id) {
      errors.push('Jurisdiction is required');
    }

    // Validate jurisdiction exists
    if (data.jurisdiction_id) {
      const jurisdiction = await this.jurisdictionRepo.findById(data.jurisdiction_id);
      if (!jurisdiction) {
        errors.push('Invalid jurisdiction specified');
      }
    }

    // Check name uniqueness
    if (data.name) {
      const nameExists = await this.locationRepo.nameExists(data.name.trim(), excludeId);
      if (nameExists) {
        errors.push('Location name already exists in this workspace');
      }
    }

    // Validate address format if provided
    if (data.address && data.address.length > 500) {
      errors.push('Address must be less than 500 characters');
    }

    // Validate city format if provided
    if (data.city && data.city.length > 100) {
      errors.push('City name must be less than 100 characters');
    }

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
  }
}