/**
 * Context Module - System Service
 * 
 * Service layer for system operations with business logic validation.
 * Handles system management, endpoints, and security assessment.
 */

import type { 
  System, 
  SystemEndpoint,
  CreateSystemRequest,
  UpdateSystemRequest,
  CreateSystemEndpointRequest,
  UpdateSystemEndpointRequest,
  SystemQueryParams, 
  PaginatedResponse,
  UUID 
} from '../types';
import type { SystemRepository } from '../repositories/system.repository';
import type { PhysicalLocationRepository } from '../repositories/physical-location.repository';

export class SystemService {
  constructor(
    private systemRepo: SystemRepository,
    private locationRepo: PhysicalLocationRepository
  ) {}

  /**
   * Get all systems with filtering and pagination
   */
  async getSystems(params: SystemQueryParams = {}): Promise<PaginatedResponse<System & { endpoint_count: number }>> {
    return await this.systemRepo.findManyWithEndpointCounts(params);
  }

  /**
   * Get system by ID with all relationships
   */
  async getSystemById(id: UUID, include?: string[]): Promise<System | null> {
    if (include?.length) {
      return await this.systemRepo.findByIdWithRelations(id);
    }
    return await this.systemRepo.findById(id, include);
  }

  /**
   * Create new system
   */
  async createSystem(data: CreateSystemRequest): Promise<System> {
    // Validate business rules
    await this.validateSystemData(data);

    // Create the system
    const system = await this.systemRepo.create(data);
    
    return system;
  }

  /**
   * Update existing system
   */
  async updateSystem(id: UUID, data: UpdateSystemRequest): Promise<System> {
    // Check if system exists
    const existingSystem = await this.systemRepo.findById(id);
    if (!existingSystem) {
      throw new Error('System not found');
    }

    // Validate business rules
    await this.validateSystemData({ ...existingSystem, ...data }, id);

    // Update the system
    return await this.systemRepo.update(id, data);
  }

  /**
   * Delete system with usage validation
   */
  async deleteSystem(id: UUID): Promise<void> {
    // Check if system exists
    const existingSystem = await this.systemRepo.findById(id);
    if (!existingSystem) {
      throw new Error('System not found');
    }

    // Check usage before deletion
    const usage = await this.systemRepo.getUsageStatistics(id);
    
    if (usage.processing_activities_count > 0 || usage.data_flows_in_count > 0 || usage.data_flows_out_count > 0) {
      throw new Error(
        `Cannot delete system "${existingSystem.name}". ` +
        `It is currently used in ${usage.processing_activities_count} processing activities ` +
        `and ${usage.data_flows_in_count + usage.data_flows_out_count} data flows. ` +
        'Remove these associations first.'
      );
    }

    await this.systemRepo.delete(id);
  }

  /**
   * Get system usage statistics and relationships
   */
  async getSystemUsage(id: UUID): Promise<{
    system: System;
    usage: {
      processing_activities_count: number;
      endpoints_count: number;
      data_flows_in_count: number;
      data_flows_out_count: number;
      locations_count: number;
    };
    endpoints: SystemEndpoint[];
    locations: any[];
  }> {
    const system = await this.getSystemById(id);
    if (!system) {
      throw new Error('System not found');
    }

    const [usage, endpoints, locations] = await Promise.all([
      this.systemRepo.getUsageStatistics(id),
      this.systemRepo.getEndpoints(id),
      this.systemRepo.getLocations(id)
    ]);

    return {
      system,
      usage,
      endpoints,
      locations,
    };
  }

  /**
   * Get systems by criticality level
   */
  async getSystemsByCriticality(criticality: 'low' | 'medium' | 'high' | 'critical'): Promise<System[]> {
    return await this.systemRepo.findByCriticality(criticality);
  }

  /**
   * Get systems by owner team
   */
  async getSystemsByOwnerTeam(ownerTeam: string): Promise<System[]> {
    if (!ownerTeam || ownerTeam.trim().length === 0) {
      throw new Error('Owner team name is required');
    }

    return await this.systemRepo.findByOwnerTeam(ownerTeam.trim());
  }

  // Endpoint management methods

  /**
   * Add endpoint to system
   */
  async addEndpoint(
    systemId: UUID, 
    endpointData: CreateSystemEndpointRequest
  ): Promise<SystemEndpoint> {
    // Validate system exists
    const system = await this.systemRepo.findById(systemId);
    if (!system) {
      throw new Error('System not found');
    }

    // Validate endpoint data
    await this.validateEndpointData(endpointData);

    return await this.systemRepo.addEndpoint(systemId, endpointData);
  }

  /**
   * Update system endpoint
   */
  async updateEndpoint(
    endpointId: UUID, 
    endpointData: UpdateSystemEndpointRequest
  ): Promise<SystemEndpoint> {
    // Validate endpoint data if provided
    if (Object.keys(endpointData).length > 0) {
      await this.validateEndpointData(endpointData);
    }

    return await this.systemRepo.updateEndpoint(endpointId, endpointData);
  }

  /**
   * Remove endpoint from system
   */
  async removeEndpoint(endpointId: UUID): Promise<void> {
    await this.systemRepo.removeEndpoint(endpointId);
  }

  /**
   * Get system endpoints
   */
  async getSystemEndpoints(systemId: UUID): Promise<SystemEndpoint[]> {
    // Validate system exists
    const system = await this.systemRepo.findById(systemId);
    if (!system) {
      throw new Error('System not found');
    }

    return await this.systemRepo.getEndpoints(systemId);
  }

  /**
   * Get endpoints by type
   */
  async getEndpointsByType(systemId: UUID, endpointType: string): Promise<SystemEndpoint[]> {
    return await this.systemRepo.getEndpointsByType(systemId, endpointType);
  }

  // Location management methods

  /**
   * Add location to system
   */
  async addLocation(systemId: UUID, locationId: UUID): Promise<void> {
    // Validate system exists
    const system = await this.systemRepo.findById(systemId);
    if (!system) {
      throw new Error('System not found');
    }

    // Validate location exists
    const location = await this.locationRepo.findById(locationId);
    if (!location) {
      throw new Error('Physical location not found');
    }

    await this.systemRepo.addLocation(systemId, locationId);
  }

  /**
   * Remove location from system
   */
  async removeLocation(systemId: UUID, locationId: UUID): Promise<void> {
    await this.systemRepo.removeLocation(systemId, locationId);
  }

  /**
   * Get system locations
   */
  async getSystemLocations(systemId: UUID): Promise<any[]> {
    // Validate system exists
    const system = await this.systemRepo.findById(systemId);
    if (!system) {
      throw new Error('System not found');
    }

    return await this.systemRepo.getLocations(systemId);
  }

  /**
   * Get systems topology for visualization
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
    return await this.systemRepo.getSystemsTopology();
  }

  /**
   * Advanced system search with multiple filters
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
    return await this.systemRepo.advancedSearch(filters);
  }

  /**
   * Get system security overview
   */
  async getSecurityOverview(systemId: UUID): Promise<{
    system: System;
    security_metrics: {
      encryption_in_transit_percentage: number;
      encryption_at_rest_percentage: number;
      authenticated_endpoints_percentage: number;
      total_endpoints: number;
      security_score: number;
    };
    security_assessment: {
      level: 'excellent' | 'good' | 'fair' | 'poor';
      issues: string[];
      recommendations: string[];
    };
  }> {
    const system = await this.getSystemById(systemId);
    if (!system) {
      throw new Error('System not found');
    }

    const securityMetrics = await this.systemRepo.getSecurityOverview(systemId);
    
    // Assess security level
    const assessment = this.assessSystemSecurity(securityMetrics);

    return {
      system,
      security_metrics: securityMetrics,
      security_assessment: assessment,
    };
  }

  /**
   * Get system compliance assessment
   */
  async getComplianceAssessment(systemId: UUID): Promise<{
    system: System;
    compliance_score: number; // 0-100
    assessment: {
      security: { score: number; issues: string[] };
      data_location: { score: number; issues: string[] };
      documentation: { score: number; issues: string[] };
    };
    recommendations: string[];
    risk_level: 'low' | 'medium' | 'high';
  }> {
    const system = await this.getSystemById(systemId);
    if (!system) {
      throw new Error('System not found');
    }

    const [securityOverview, locations, usage] = await Promise.all([
      this.systemRepo.getSecurityOverview(systemId),
      this.systemRepo.getLocations(systemId),
      this.systemRepo.getUsageStatistics(systemId)
    ]);

    // Assess different compliance areas
    const securityAssessment = this.assessSystemSecurityCompliance(securityOverview);
    const dataLocationAssessment = await this.assessDataLocationCompliance(locations);
    const documentationAssessment = this.assessDocumentationCompliance(system, usage);

    // Calculate overall compliance score
    const complianceScore = Math.round(
      (securityAssessment.score * 0.4) +
      (dataLocationAssessment.score * 0.3) +
      (documentationAssessment.score * 0.3)
    );

    // Generate recommendations
    const recommendations = [
      ...securityAssessment.issues.map(issue => `Security: ${issue}`),
      ...dataLocationAssessment.issues.map(issue => `Data Location: ${issue}`),
      ...documentationAssessment.issues.map(issue => `Documentation: ${issue}`)
    ];

    // Determine risk level
    let riskLevel: any = 'low';
    if (complianceScore < 70) riskLevel = 'high';
    else if (complianceScore < 85) riskLevel = 'medium';

    return {
      system,
      compliance_score: complianceScore,
      assessment: {
        security: securityAssessment,
        data_location: dataLocationAssessment,
        documentation: documentationAssessment,
      },
      recommendations,
      risk_level: riskLevel,
    };
  }

  /**
   * Get system inventory report
   */
  async getSystemInventory(): Promise<{
    summary: {
      total_systems: number;
      by_criticality: Record<string, number>;
      by_status: Record<string, number>;
      by_owner_team: Record<string, number>;
    };
    security_overview: {
      average_security_score: number;
      systems_with_poor_security: number;
      total_endpoints: number;
      encrypted_endpoints: number;
    };
    systems: (System & { 
      endpoint_count: number; 
      security_score: number;
      compliance_status: 'compliant' | 'needs_attention' | 'non_compliant';
    })[];
  }> {
    // Get all systems with endpoint counts
    const systemsResponse = await this.systemRepo.findManyWithEndpointCounts({ limit: 1000 });
    const systems = systemsResponse.data;

    // Calculate summary statistics
    const summary = {
      total_systems: systems.length,
      by_criticality: {} as Record<string, number>,
      by_status: {} as Record<string, number>,
      by_owner_team: {} as Record<string, number>,
    };

    let totalSecurityScore = 0;
    let systemsWithPoorSecurity = 0;
    let totalEndpoints = 0;
    let encryptedEndpoints = 0;

    const enrichedSystems: any[] = [];

    // Process each system
    for (const system of systems) {
      // Count by criticality
      if (system.criticality) {
        summary.by_criticality[system.criticality] = (summary.by_criticality[system.criticality] || 0) + 1;
      }

      // Count by status
      summary.by_status[system.status] = (summary.by_status[system.status] || 0) + 1;

      // Count by owner team
      if (system.owner_team) {
        summary.by_owner_team[system.owner_team] = (summary.by_owner_team[system.owner_team] || 0) + 1;
      }

      // Get security overview for each system
      const securityOverview = await this.systemRepo.getSecurityOverview(system.id);
      totalSecurityScore += securityOverview.security_score;
      totalEndpoints += securityOverview.total_endpoints;
      
      if (securityOverview.security_score < 70) {
        systemsWithPoorSecurity++;
      }

      // Calculate encrypted endpoints (approximation)
      const encryptedCount = Math.round(
        securityOverview.total_endpoints * 
        (securityOverview.encryption_in_transit_percentage / 100)
      );
      encryptedEndpoints += encryptedCount;

      // Determine compliance status
      let complianceStatus: any = 'compliant';
      if (securityOverview.security_score < 70) complianceStatus = 'non_compliant';
      else if (securityOverview.security_score < 85) complianceStatus = 'needs_attention';

      enrichedSystems.push({
        ...system,
        security_score: securityOverview.security_score,
        compliance_status: complianceStatus,
      });
    }

    const averageSecurityScore = systems.length > 0 ? Math.round(totalSecurityScore / systems.length) : 0;

    return {
      summary,
      security_overview: {
        average_security_score: averageSecurityScore,
        systems_with_poor_security: systemsWithPoorSecurity,
        total_endpoints: totalEndpoints,
        encrypted_endpoints: encryptedEndpoints,
      },
      systems: enrichedSystems,
    };
  }

  // Private helper methods

  private async validateSystemData(
    data: CreateSystemRequest | (UpdateSystemRequest & { id?: UUID }), 
    excludeId?: UUID
  ): Promise<void> {
    const errors: string[] = [];

    // Validate required fields for creation
    if ('name' in data && (!data.name || data.name.trim().length === 0)) {
      errors.push('System name is required');
    }

    // Check name uniqueness
    if (data.name) {
      const nameExists = await this.systemRepo.nameExists(data.name.trim(), excludeId);
      if (nameExists) {
        errors.push('System name already exists in this workspace');
      }
    }

    // Validate criticality if provided
    if (data.criticality && !['low', 'medium', 'high', 'critical'].includes(data.criticality)) {
      errors.push('Invalid criticality level. Must be: low, medium, high, or critical');
    }

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
  }

  private async validateEndpointData(data: any): Promise<void> {
    const errors: string[] = [];

    // Validate required fields
    if (data.name && data.name.trim().length === 0) {
      errors.push('Endpoint name is required');
    }

    if (data.endpoint_type && !['api', 'database', 'file_share', 'email', 'web_interface', 'other'].includes(data.endpoint_type)) {
      errors.push('Invalid endpoint type');
    }

    // Validate URL format if provided
    if (data.url && !this.isValidUrl(data.url)) {
      errors.push('Invalid URL format');
    }

    if (errors.length > 0) {
      throw new Error(`Endpoint validation failed: ${errors.join(', ')}`);
    }
  }

  private assessSystemSecurity(metrics: any): {
    level: 'excellent' | 'good' | 'fair' | 'poor';
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];

    if (metrics.encryption_in_transit_percentage < 80) {
      issues.push('Low encryption in transit coverage');
      recommendations.push('Enable encryption in transit for all endpoints');
    }

    if (metrics.encryption_at_rest_percentage < 80) {
      issues.push('Low encryption at rest coverage');
      recommendations.push('Enable encryption at rest for all endpoints');
    }

    if (metrics.authenticated_endpoints_percentage < 90) {
      issues.push('Some endpoints lack authentication');
      recommendations.push('Implement authentication for all endpoints');
    }

    let level: any = 'excellent';
    if (metrics.security_score < 70) level = 'poor';
    else if (metrics.security_score < 80) level = 'fair';
    else if (metrics.security_score < 90) level = 'good';

    return { level, issues, recommendations };
  }

  private assessSystemSecurityCompliance(securityOverview: any): { score: number; issues: string[] } {
    const issues: string[] = [];
    let score = securityOverview.security_score;

    if (score < 80) {
      issues.push('Security score below recommended threshold');
    }

    return { score: Math.max(score, 0), issues };
  }

  private async assessDataLocationCompliance(locations: any[]): Promise<{ score: number; issues: string[] }> {
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

  private assessDocumentationCompliance(system: System, usage: any): { score: number; issues: string[] } {
    const issues: string[] = [];
    let score = 100;

    if (!system.description) {
      issues.push('Missing system description');
      score -= 20;
    }

    if (!system.owner_team) {
      issues.push('No owner team specified');
      score -= 15;
    }

    if (!system.technical_contact) {
      issues.push('No technical contact specified');
      score -= 15;
    }

    if (usage.endpoints_count === 0) {
      issues.push('No endpoints documented');
      score -= 20;
    }

    return { score: Math.max(score, 0), issues };
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}