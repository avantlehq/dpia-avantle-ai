/**
 * Context Module - Jurisdiction Service
 * 
 * Service layer for jurisdiction operations with business logic validation.
 * Handles GDPR adequacy checking and jurisdiction-related operations.
 */

import type { Jurisdiction, JurisdictionQueryParams, PaginatedResponse } from '../types';
import type { JurisdictionRepository } from '../repositories/jurisdiction.repository';

export class JurisdictionService {
  constructor(private jurisdictionRepo: JurisdictionRepository) {}

  /**
   * Get all jurisdictions with filtering and pagination
   */
  async getJurisdictions(params: JurisdictionQueryParams = {}): Promise<PaginatedResponse<Jurisdiction>> {
    return await this.jurisdictionRepo.findMany(params);
  }

  /**
   * Get jurisdiction by ID
   */
  async getJurisdictionById(id: string): Promise<Jurisdiction | null> {
    return await this.jurisdictionRepo.findById(id);
  }

  /**
   * Get jurisdiction by country code
   */
  async getJurisdictionByCountryCode(countryCode: string): Promise<Jurisdiction | null> {
    // Validate country code format
    if (!this.jurisdictionRepo.validateCountryCode(countryCode)) {
      throw new Error('Invalid country code format. Must be 2-letter ISO code (e.g., SK, US, DE)');
    }

    return await this.jurisdictionRepo.findByCountryCode(countryCode);
  }

  /**
   * Check if a jurisdiction has GDPR adequacy
   */
  async checkGdprAdequacy(countryCode: string): Promise<{
    country_code: string;
    has_adequacy: boolean;
    jurisdiction: Jurisdiction | null;
  }> {
    const jurisdiction = await this.getJurisdictionByCountryCode(countryCode);
    
    return {
      country_code: countryCode.toUpperCase(),
      has_adequacy: jurisdiction?.gdpr_adequacy ?? false,
      jurisdiction,
    };
  }

  /**
   * Get all EU/EEA jurisdictions
   */
  async getEuEeaJurisdictions(): Promise<Jurisdiction[]> {
    return await this.jurisdictionRepo.findEuEeaJurisdictions();
  }

  /**
   * Get jurisdictions with adequacy decisions
   */
  async getJurisdictionsWithAdequacy(): Promise<Jurisdiction[]> {
    return await this.jurisdictionRepo.findWithAdequacyDecision();
  }

  /**
   * Get jurisdictions without adequacy decisions
   */
  async getJurisdictionsWithoutAdequacy(): Promise<Jurisdiction[]> {
    return await this.jurisdictionRepo.findWithoutAdequacyDecision();
  }

  /**
   * Search jurisdictions by name or country code
   */
  async searchJurisdictions(searchTerm: string, limit: number = 10): Promise<Jurisdiction[]> {
    if (!searchTerm || searchTerm.trim().length < 2) {
      throw new Error('Search term must be at least 2 characters long');
    }

    return await this.jurisdictionRepo.search(searchTerm.trim(), limit);
  }

  /**
   * Get popular jurisdictions for UI dropdowns
   */
  async getPopularJurisdictions(): Promise<Jurisdiction[]> {
    return await this.jurisdictionRepo.getPopularJurisdictions();
  }

  /**
   * Get jurisdiction statistics
   */
  async getJurisdictionStatistics(): Promise<{
    total: number;
    with_adequacy: number;
    without_adequacy: number;
    adequacy_percentage: number;
    with_supervisory_authority: number;
    coverage_analysis: {
      eu_eea_count: number;
      third_countries_with_adequacy: number;
      major_economies_without_adequacy: string[];
    };
  }> {
    const [stats, euEea, withAdequacy, withoutAdequacy] = await Promise.all([
      this.jurisdictionRepo.getStatistics(),
      this.jurisdictionRepo.findEuEeaJurisdictions(),
      this.jurisdictionRepo.findWithAdequacyDecision(),
      this.jurisdictionRepo.findWithoutAdequacyDecision()
    ]);

    // Identify major economies without adequacy
    const majorEconomies = ['US', 'CN', 'IN', 'BR', 'RU', 'JP']; // Japan actually has adequacy
    const majorEconomiesWithoutAdequacy = withoutAdequacy
      .filter(j => majorEconomies.includes(j.country_code))
      .map(j => j.country_code);

    // Count third countries with adequacy (non-EU/EEA)
    const euEeaCodes = new Set(euEea.map(j => j.country_code));
    const thirdCountriesWithAdequacy = withAdequacy.filter(j => !euEeaCodes.has(j.country_code)).length;

    return {
      ...stats,
      adequacy_percentage: stats.total > 0 ? Math.round((stats.with_adequacy / stats.total) * 100) : 0,
      coverage_analysis: {
        eu_eea_count: euEea.length,
        third_countries_with_adequacy: thirdCountriesWithAdequacy,
        major_economies_without_adequacy: majorEconomiesWithoutAdequacy,
      },
    };
  }

  /**
   * Validate country code and check existence
   */
  async validateCountryCode(countryCode: string): Promise<{
    valid_format: boolean;
    exists: boolean;
    jurisdiction: Jurisdiction | null;
  }> {
    const validFormat = this.jurisdictionRepo.validateCountryCode(countryCode);
    
    if (!validFormat) {
      return {
        valid_format: false,
        exists: false,
        jurisdiction: null,
      };
    }

    const jurisdiction = await this.jurisdictionRepo.findByCountryCode(countryCode);
    
    return {
      valid_format: true,
      exists: !!jurisdiction,
      jurisdiction,
    };
  }

  /**
   * Get transfer requirements between jurisdictions
   */
  async getTransferRequirements(
    fromCountryCode: string, 
    toCountryCode: string
  ): Promise<{
    from_jurisdiction: Jurisdiction | null;
    to_jurisdiction: Jurisdiction | null;
    transfer_allowed: boolean;
    requirements: {
      adequacy_decision: boolean;
      safeguards_required: boolean;
      transfer_mechanism: 'adequacy_decision' | 'standard_contractual_clauses' | 'binding_corporate_rules' | 'derogation' | 'prohibited';
      risk_level: 'low' | 'medium' | 'high';
      additional_measures: string[];
    };
  }> {
    const [fromJurisdiction, toJurisdiction] = await Promise.all([
      this.getJurisdictionByCountryCode(fromCountryCode),
      this.getJurisdictionByCountryCode(toCountryCode),
    ]);

    if (!fromJurisdiction || !toJurisdiction) {
      throw new Error('One or both jurisdictions not found');
    }

    // Same jurisdiction - no transfer requirements
    if (fromCountryCode.toUpperCase() === toCountryCode.toUpperCase()) {
      return {
        from_jurisdiction: fromJurisdiction,
        to_jurisdiction: toJurisdiction,
        transfer_allowed: true,
        requirements: {
          adequacy_decision: false,
          safeguards_required: false,
          transfer_mechanism: 'adequacy_decision',
          risk_level: 'low',
          additional_measures: [],
        },
      };
    }

    // Determine transfer requirements based on GDPR adequacy
    const fromEuEea = fromJurisdiction.gdpr_adequacy;
    const toEuEea = toJurisdiction.gdpr_adequacy;

    const transferAllowed = true;
    let transferMechanism: 'adequacy_decision' | 'standard_contractual_clauses' | 'binding_corporate_rules' | 'derogation' | 'prohibited' = 'adequacy_decision';
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    let safeguardsRequired = false;
    let additionalMeasures: string[] = [];

    // Transfer from EU/EEA to third country without adequacy
    if (fromEuEea && !toEuEea) {
      safeguardsRequired = true;
      transferMechanism = 'standard_contractual_clauses';
      riskLevel = 'medium';
      additionalMeasures = [
        'Standard Contractual Clauses (SCCs) required',
        'Transfer Impact Assessment (TIA) recommended',
        'Additional safeguards may be required',
      ];
    }

    // Transfer between EU/EEA jurisdictions or to adequate third country
    else if (toEuEea) {
      transferMechanism = 'adequacy_decision';
      riskLevel = 'low';
      additionalMeasures = ['No additional safeguards required'];
    }

    // Transfer between third countries
    else if (!fromEuEea && !toEuEea) {
      transferMechanism = 'standard_contractual_clauses';
      riskLevel = 'medium';
      additionalMeasures = ['Consider local data protection requirements'];
    }

    return {
      from_jurisdiction: fromJurisdiction,
      to_jurisdiction: toJurisdiction,
      transfer_allowed: transferAllowed,
      requirements: {
        adequacy_decision: toEuEea,
        safeguards_required: safeguardsRequired,
        transfer_mechanism: transferMechanism,
        risk_level: riskLevel,
        additional_measures: additionalMeasures,
      },
    };
  }

  /**
   * Get jurisdiction compliance guidance
   */
  async getComplianceGuidance(countryCode: string): Promise<{
    jurisdiction: Jurisdiction;
    guidance: {
      data_protection_law: string | null;
      supervisory_authority: string | null;
      gdpr_adequacy: boolean;
      key_requirements: string[];
      resources: {
        title: string;
        description: string;
        url?: string;
      }[];
    };
  }> {
    const jurisdiction = await this.getJurisdictionByCountryCode(countryCode);
    
    if (!jurisdiction) {
      throw new Error(`Jurisdiction not found for country code: ${countryCode}`);
    }

    // Basic guidance based on GDPR adequacy status
    const keyRequirements: string[] = [];
    const resources: { title: string; description: string; url?: string; }[] = [];

    if (jurisdiction.gdpr_adequacy) {
      keyRequirements.push(
        'GDPR or equivalent data protection law applies',
        'Data transfers from EU/EEA permitted without additional safeguards',
        'Individual rights similar to GDPR must be respected'
      );
      
      resources.push({
        title: 'GDPR Adequacy Decision',
        description: `EU Commission adequacy decision for ${jurisdiction.name_en}`,
      });
    } else {
      keyRequirements.push(
        'Additional safeguards required for EU/EEA data transfers',
        'Standard Contractual Clauses or other transfer mechanisms needed',
        'Transfer Impact Assessment may be required'
      );
      
      resources.push({
        title: 'Transfer Safeguards',
        description: 'Information on safeguards for international data transfers',
      });
    }

    return {
      jurisdiction,
      guidance: {
        data_protection_law: jurisdiction.gdpr_adequacy ? 'GDPR or equivalent' : 'Local data protection law',
        supervisory_authority: jurisdiction.supervisory_authority,
        gdpr_adequacy: jurisdiction.gdpr_adequacy,
        key_requirements: keyRequirements,
        resources,
      },
    };
  }
}