/**
 * Context Module - Vendor Service
 * 
 * Service layer for vendor operations with business logic validation.
 * Handles vendor management, contracts, and GDPR compliance tracking.
 */

import type { 
  Vendor, 
  VendorContract,
  CreateVendorRequest,
  UpdateVendorRequest,
  ListQueryParams, 
  PaginatedResponse,
  UUID 
} from '../types';
import type { VendorRepository } from '../repositories/vendor.repository';
import type { PhysicalLocationRepository } from '../repositories/physical-location.repository';

export class VendorService {
  constructor(
    private vendorRepo: VendorRepository,
    private locationRepo: PhysicalLocationRepository
  ) {}

  /**
   * Get all vendors with filtering and pagination
   */
  async getVendors(params: ListQueryParams = {}): Promise<PaginatedResponse<Vendor>> {
    // Use simple findMany instead of complex contract count query
    // TODO: Re-enable findManyWithContractCounts when vendor_contracts table has data
    return await this.vendorRepo.findMany(params);
  }

  /**
   * Get vendor by ID with all relationships
   */
  async getVendorById(id: UUID, include?: string[]): Promise<Vendor | null> {
    if (include?.length) {
      return await this.vendorRepo.findByIdWithRelations(id);
    }
    return await this.vendorRepo.findById(id, include);
  }

  /**
   * Create new vendor
   */
  async createVendor(data: CreateVendorRequest): Promise<Vendor> {
    // Validate business rules
    await this.validateVendorData(data);

    // Create the vendor
    const vendor = await this.vendorRepo.create(data);
    
    return vendor;
  }

  /**
   * Update existing vendor
   */
  async updateVendor(id: UUID, data: UpdateVendorRequest): Promise<Vendor> {
    // Check if vendor exists
    const existingVendor = await this.vendorRepo.findById(id);
    if (!existingVendor) {
      throw new Error('Vendor not found');
    }

    // Validate business rules
    const validationData = {
      ...existingVendor,
      ...data,
      description: data.description ?? existingVendor.description,
      website: data.website ?? existingVendor.website,
      contact_email: data.contact_email ?? existingVendor.contact_email,
      primary_contact: data.primary_contact ?? existingVendor.primary_contact
    };
    await this.validateVendorData(validationData as any, id);

    // Update the vendor
    return await this.vendorRepo.update(id, data);
  }

  /**
   * Delete vendor with usage validation
   */
  async deleteVendor(id: UUID): Promise<void> {
    // Check if vendor exists
    const existingVendor = await this.vendorRepo.findById(id);
    if (!existingVendor) {
      throw new Error('Vendor not found');
    }

    // Check usage before deletion
    const usage = await this.vendorRepo.getUsageStatistics(id);
    
    if (usage.processing_activities_count > 0) {
      throw new Error(
        `Cannot delete vendor "${existingVendor.name}". ` +
        `It is currently used in ${usage.processing_activities_count} processing activities. ` +
        'Remove these associations first.'
      );
    }

    await this.vendorRepo.delete(id);
  }

  /**
   * Get vendor usage statistics and relationships
   */
  async getVendorUsage(id: UUID): Promise<{
    vendor: Vendor;
    usage: {
      processing_activities_count: number;
      active_contracts_count: number;
      locations_count: number;
    };
    contracts: VendorContract[];
    locations: any[];
  }> {
    const vendor = await this.getVendorById(id);
    if (!vendor) {
      throw new Error('Vendor not found');
    }

    const [usage, contracts, locations] = await Promise.all([
      this.vendorRepo.getUsageStatistics(id),
      this.vendorRepo.getContracts(id),
      this.vendorRepo.getLocations(id)
    ]);

    return {
      vendor,
      usage,
      contracts,
      locations,
    };
  }

  // Contract management methods

  /**
   * Add contract to vendor
   */
  async addContract(
    vendorId: UUID, 
    contractData: {
      contract_type: string;
      reference_number?: string;
      start_date: string;
      end_date?: string;
      review_date?: string;
      status?: 'draft' | 'active' | 'expired' | 'terminated';
    }
  ): Promise<VendorContract> {
    // Validate vendor exists
    const vendor = await this.vendorRepo.findById(vendorId);
    if (!vendor) {
      throw new Error('Vendor not found');
    }

    // Validate contract data
    await this.validateContractData(contractData);

    return await this.vendorRepo.addContract(vendorId, contractData);
  }

  /**
   * Update vendor contract
   */
  async updateContract(
    contractId: UUID, 
    contractData: Partial<{
      contract_type: string;
      reference_number: string;
      start_date: string;
      end_date: string;
      review_date: string;
      status: 'draft' | 'active' | 'expired' | 'terminated';
    }>
  ): Promise<VendorContract> {
    // Validate contract data if provided
    if (Object.keys(contractData).length > 0) {
      await this.validateContractData(contractData);
    }

    return await this.vendorRepo.updateContract(contractId, contractData);
  }

  /**
   * Remove contract from vendor
   */
  async removeContract(contractId: UUID): Promise<void> {
    await this.vendorRepo.removeContract(contractId);
  }

  /**
   * Get vendor contracts
   */
  async getVendorContracts(vendorId: UUID): Promise<VendorContract[]> {
    // Validate vendor exists
    const vendor = await this.vendorRepo.findById(vendorId);
    if (!vendor) {
      throw new Error('Vendor not found');
    }

    return await this.vendorRepo.getContracts(vendorId);
  }

  /**
   * Get active contracts for vendor
   */
  async getActiveContracts(vendorId: UUID): Promise<VendorContract[]> {
    return await this.vendorRepo.getActiveContracts(vendorId);
  }

  /**
   * Get contracts requiring review
   */
  async getContractsRequiringReview(vendorId?: UUID): Promise<VendorContract[]> {
    return await this.vendorRepo.getContractsRequiringReview(vendorId);
  }

  /**
   * Mark contract for review
   */
  async scheduleContractReview(contractId: UUID, reviewDate: string): Promise<VendorContract> {
    // Validate date format
    if (!this.isValidDate(reviewDate)) {
      throw new Error('Invalid review date format. Use YYYY-MM-DD');
    }

    return await this.vendorRepo.updateContract(contractId, { review_date: reviewDate });
  }

  // Location management methods

  /**
   * Add location to vendor
   */
  async addLocation(vendorId: UUID, locationId: UUID): Promise<void> {
    // Validate vendor exists
    const vendor = await this.vendorRepo.findById(vendorId);
    if (!vendor) {
      throw new Error('Vendor not found');
    }

    // Validate location exists
    const location = await this.locationRepo.findById(locationId);
    if (!location) {
      throw new Error('Physical location not found');
    }

    await this.vendorRepo.addLocation(vendorId, locationId);
  }

  /**
   * Remove location from vendor
   */
  async removeLocation(vendorId: UUID, locationId: UUID): Promise<void> {
    await this.vendorRepo.removeLocation(vendorId, locationId);
  }

  /**
   * Get vendor locations
   */
  async getVendorLocations(vendorId: UUID): Promise<any[]> {
    // Validate vendor exists
    const vendor = await this.vendorRepo.findById(vendorId);
    if (!vendor) {
      throw new Error('Vendor not found');
    }

    return await this.vendorRepo.getLocations(vendorId);
  }

  /**
   * Advanced vendor search with multiple filters
   */
  async advancedSearch(filters: {
    search?: string;
    status?: 'active' | 'inactive';
    has_active_contracts?: boolean;
    contract_types?: string[];
    locations?: UUID[];
  }): Promise<Vendor[]> {
    return await this.vendorRepo.advancedSearch(filters);
  }

  /**
   * Get vendor GDPR compliance assessment
   */
  async getComplianceAssessment(vendorId: UUID): Promise<{
    vendor: Vendor;
    compliance_score: number; // 0-100
    assessment: {
      contracts: { score: number; issues: string[] };
      locations: { score: number; issues: string[] };
      data_processing: { score: number; issues: string[] };
    };
    recommendations: string[];
    risk_level: 'low' | 'medium' | 'high';
  }> {
    const vendor = await this.getVendorById(vendorId);
    if (!vendor) {
      throw new Error('Vendor not found');
    }

    const [contracts, locations, usage] = await Promise.all([
      this.vendorRepo.getActiveContracts(vendorId),
      this.vendorRepo.getLocations(vendorId),
      this.vendorRepo.getUsageStatistics(vendorId)
    ]);

    // Assess contracts
    const contractsAssessment = this.assessContracts(contracts);
    
    // Assess locations (data residency)
    const locationsAssessment = await this.assessLocations(locations);
    
    // Assess data processing role
    const dataProcessingAssessment = this.assessDataProcessing(usage);

    // Calculate overall compliance score
    const complianceScore = Math.round(
      (contractsAssessment.score * 0.4) +
      (locationsAssessment.score * 0.3) +
      (dataProcessingAssessment.score * 0.3)
    );

    // Generate recommendations
    const recommendations = [
      ...contractsAssessment.issues.map(issue => `Contracts: ${issue}`),
      ...locationsAssessment.issues.map(issue => `Locations: ${issue}`),
      ...dataProcessingAssessment.issues.map(issue => `Data Processing: ${issue}`)
    ];

    // Determine risk level
    let riskLevel: any = 'low';
    if (complianceScore < 70) riskLevel = 'high';
    else if (complianceScore < 85) riskLevel = 'medium';

    return {
      vendor,
      compliance_score: complianceScore,
      assessment: {
        contracts: contractsAssessment,
        locations: locationsAssessment,
        data_processing: dataProcessingAssessment,
      },
      recommendations,
      risk_level: riskLevel,
    };
  }

  /**
   * Get vendor risk profile
   */
  async getVendorRiskProfile(vendorId: UUID): Promise<{
    vendor: Vendor;
    risk_factors: {
      factor: string;
      severity: 'low' | 'medium' | 'high';
      description: string;
    }[];
    mitigation_measures: string[];
    overall_risk: 'low' | 'medium' | 'high';
  }> {
    const complianceAssessment = await this.getComplianceAssessment(vendorId);
    const contracts = await this.vendorRepo.getActiveContracts(vendorId);

    const riskFactors: any[] = [];
    const mitigationMeasures: string[] = [];

    // Analyze risk factors
    if (contracts.length === 0) {
      riskFactors.push({
        factor: 'No Active Contracts',
        severity: 'high',
        description: 'Vendor has no active data processing agreements',
      });
      mitigationMeasures.push('Execute data processing agreement (DPA)');
    }

    // Check for expiring contracts
    const expiringContracts = contracts.filter(contract => {
      if (!contract.end_date) return false;
      const monthsUntilExpiry = this.getMonthsUntilDate(contract.end_date);
      return monthsUntilExpiry <= 3 && monthsUntilExpiry >= 0;
    });

    if (expiringContracts.length > 0) {
      riskFactors.push({
        factor: 'Expiring Contracts',
        severity: 'medium',
        description: `${expiringContracts.length} contracts expiring within 3 months`,
      });
      mitigationMeasures.push('Renew expiring contracts before expiration');
    }

    // Assess location-based risks
    const locations = await this.vendorRepo.getLocations(vendorId);
    const nonAdequateLocations = locations.filter(loc => 
      !loc.physical_locations?.jurisdiction?.gdpr_adequacy
    );

    if (nonAdequateLocations.length > 0) {
      riskFactors.push({
        factor: 'Non-Adequate Jurisdictions',
        severity: 'medium',
        description: `Vendor operates in ${nonAdequateLocations.length} jurisdictions without EU adequacy`,
      });
      mitigationMeasures.push('Implement additional safeguards for non-adequate jurisdictions');
    }

    // Determine overall risk
    const highRiskCount = riskFactors.filter(f => f.severity === 'high').length;
    const mediumRiskCount = riskFactors.filter(f => f.severity === 'medium').length;

    let overallRisk: any = 'low';
    if (highRiskCount > 0) overallRisk = 'high';
    else if (mediumRiskCount > 1) overallRisk = 'medium';

    return {
      vendor: complianceAssessment.vendor,
      risk_factors: riskFactors,
      mitigation_measures: mitigationMeasures,
      overall_risk: overallRisk,
    };
  }

  // Private helper methods

  private async validateVendorData(
    data: CreateVendorRequest | (UpdateVendorRequest & { id?: UUID }), 
    excludeId?: UUID
  ): Promise<void> {
    const errors: string[] = [];

    // Validate required fields for creation
    if ('name' in data && (!data.name || data.name.trim().length === 0)) {
      errors.push('Vendor name is required');
    }

    // Check name uniqueness
    if (data.name) {
      const nameExists = await this.vendorRepo.nameExists(data.name.trim(), excludeId);
      if (nameExists) {
        errors.push('Vendor name already exists in this workspace');
      }
    }

    // Validate email format if provided
    if (data.contact_email && !this.isValidEmail(data.contact_email)) {
      errors.push('Invalid email format');
    }

    // Validate website URL if provided
    if (data.website && !this.isValidUrl(data.website)) {
      errors.push('Invalid website URL format');
    }

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
  }

  private async validateContractData(data: any): Promise<void> {
    const errors: string[] = [];

    // Validate required fields
    if (data.contract_type && data.contract_type.trim().length === 0) {
      errors.push('Contract type is required');
    }

    // Validate date formats
    if (data.start_date && !this.isValidDate(data.start_date)) {
      errors.push('Invalid start date format. Use YYYY-MM-DD');
    }

    if (data.end_date && !this.isValidDate(data.end_date)) {
      errors.push('Invalid end date format. Use YYYY-MM-DD');
    }

    if (data.review_date && !this.isValidDate(data.review_date)) {
      errors.push('Invalid review date format. Use YYYY-MM-DD');
    }

    // Validate date logic
    if (data.start_date && data.end_date) {
      if (new Date(data.start_date) >= new Date(data.end_date)) {
        errors.push('End date must be after start date');
      }
    }

    if (errors.length > 0) {
      throw new Error(`Contract validation failed: ${errors.join(', ')}`);
    }
  }

  private assessContracts(contracts: VendorContract[]): { score: number; issues: string[] } {
    const issues: string[] = [];
    let score = 100;

    if (contracts.length === 0) {
      issues.push('No active contracts found');
      score -= 50;
    }

    // Check for contracts without review dates
    const contractsWithoutReview = contracts.filter(c => !c.review_date);
    if (contractsWithoutReview.length > 0) {
      issues.push('Some contracts lack review dates');
      score -= 20;
    }

    return { score: Math.max(score, 0), issues };
  }

  private async assessLocations(locations: any[]): Promise<{ score: number; issues: string[] }> {
    const issues: string[] = [];
    let score = 100;

    if (locations.length === 0) {
      issues.push('No locations specified');
      score -= 30;
    }

    const nonAdequateLocations = locations.filter(loc => 
      !loc.physical_locations?.jurisdiction?.gdpr_adequacy
    );

    if (nonAdequateLocations.length > 0) {
      issues.push(`${nonAdequateLocations.length} locations in non-adequate jurisdictions`);
      score -= 25;
    }

    return { score: Math.max(score, 0), issues };
  }

  private assessDataProcessing(usage: any): { score: number; issues: string[] } {
    const issues: string[] = [];
    let score = 100;

    if (usage.processing_activities_count === 0) {
      issues.push('Vendor not used in any processing activities');
      score -= 10; // Not necessarily an issue
    }

    return { score: Math.max(score, 0), issues };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private isValidDate(dateString: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }

  private getMonthsUntilDate(dateString: string): number {
    const targetDate = new Date(dateString);
    const now = new Date();
    const diffTime = targetDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30)); // Rough month calculation
  }
}