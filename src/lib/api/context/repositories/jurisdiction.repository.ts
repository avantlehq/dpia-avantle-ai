/**
 * Context Module - Jurisdiction Repository
 * 
 * Repository for managing jurisdictions (global reference data).
 * Jurisdictions are not tenant-scoped and are read-only for most operations.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';
import type { 
  Jurisdiction, 
  ContextClaims, 
  PaginatedResponse, 
  JurisdictionQueryParams 
} from '../types';
import { createContextClient } from '../supabase-client';

export class JurisdictionRepository {
  protected client: SupabaseClient<Database>;
  protected context: ContextClaims;

  constructor(context: ContextClaims, client?: SupabaseClient<Database>) {
    this.context = context;
    this.client = client || createContextClient(context);
  }

  /**
   * Get all jurisdictions with pagination and filtering
   *
   * NOTE: name_en and name_sk columns don't exist in production - using country_code only
   */
  async findMany(params: JurisdictionQueryParams = {}): Promise<PaginatedResponse<Jurisdiction>> {
    const {
      page = 1,
      limit = 20,
      search,
      gdpr_adequacy,
    } = params;

    let query = this.client
      .from('jurisdictions')
      .select('*', { count: 'exact' });

    // Apply GDPR adequacy filtering
    if (typeof gdpr_adequacy === 'boolean') {
      query = query.eq('gdpr_adequacy', gdpr_adequacy);
    }

    // Apply search filtering (only country_code - name columns don't exist)
    if (search) {
      query = query.ilike('country_code', `%${search}%`);
    }

    // Apply ordering by country_code (name_en doesn't exist)
    query = query.order('country_code', { ascending: true });

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch jurisdictions: ${error.message}`);
    }

    return {
      data: data as Jurisdiction[],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    };
  }

  /**
   * Get a single jurisdiction by ID
   */
  async findById(id: string): Promise<Jurisdiction | null> {
    const { data, error } = await this.client
      .from('jurisdictions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to fetch jurisdiction by ID: ${error.message}`);
    }

    return data as Jurisdiction;
  }

  /**
   * Get jurisdiction by country code
   */
  async findByCountryCode(countryCode: string): Promise<Jurisdiction | null> {
    const { data, error } = await this.client
      .from('jurisdictions')
      .select('*')
      .eq('country_code', countryCode.toUpperCase())
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to fetch jurisdiction by country code: ${error.message}`);
    }

    return data as Jurisdiction;
  }

  /**
   * Get all EU/EEA jurisdictions (with GDPR adequacy)
   *
   * NOTE: name_en column doesn't exist - using country_code for ordering
   */
  async findEuEeaJurisdictions(): Promise<Jurisdiction[]> {
    const { data, error } = await this.client
      .from('jurisdictions')
      .select('*')
      .eq('gdpr_adequacy', true)
      .order('country_code', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch EU/EEA jurisdictions: ${error.message}`);
    }

    return data as Jurisdiction[];
  }

  /**
   * Get jurisdictions with adequacy decisions
   *
   * NOTE: name_en column doesn't exist - using country_code for ordering
   */
  async findWithAdequacyDecision(): Promise<Jurisdiction[]> {
    const { data, error } = await this.client
      .from('jurisdictions')
      .select('*')
      .eq('gdpr_adequacy', true)
      .order('country_code', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch jurisdictions with adequacy decisions: ${error.message}`);
    }

    return data as Jurisdiction[];
  }

  /**
   * Get jurisdictions without adequacy decisions
   *
   * NOTE: name_en column doesn't exist - using country_code for ordering
   */
  async findWithoutAdequacyDecision(): Promise<Jurisdiction[]> {
    const { data, error } = await this.client
      .from('jurisdictions')
      .select('*')
      .eq('gdpr_adequacy', false)
      .order('country_code', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch jurisdictions without adequacy decisions: ${error.message}`);
    }

    return data as Jurisdiction[];
  }

  /**
   * Search jurisdictions by country code
   *
   * NOTE: name_en and name_sk columns don't exist - using country_code only
   */
  async search(searchTerm: string, limit: number = 10): Promise<Jurisdiction[]> {
    const { data, error } = await this.client
      .from('jurisdictions')
      .select('*')
      .ilike('country_code', `%${searchTerm}%`)
      .order('country_code', { ascending: true })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to search jurisdictions: ${error.message}`);
    }

    return data as Jurisdiction[];
  }

  /**
   * Get jurisdiction statistics
   */
  async getStatistics(): Promise<{
    total: number;
    with_adequacy: number;
    without_adequacy: number;
    with_supervisory_authority: number;
  }> {
    // Get total count
    const { count: total, error: totalError } = await this.client
      .from('jurisdictions')
      .select('*', { count: 'exact', head: true });

    if (totalError) {
      throw new Error(`Failed to get total jurisdictions count: ${totalError.message}`);
    }

    // Get count with adequacy
    const { count: withAdequacy, error: adequacyError } = await this.client
      .from('jurisdictions')
      .select('*', { count: 'exact', head: true })
      .eq('gdpr_adequacy', true);

    if (adequacyError) {
      throw new Error(`Failed to get jurisdictions with adequacy count: ${adequacyError.message}`);
    }

    // Get count with supervisory authority
    const { count: withSupervisoryAuthority, error: authorityError } = await this.client
      .from('jurisdictions')
      .select('*', { count: 'exact', head: true })
      .not('supervisory_authority', 'is', null);

    if (authorityError) {
      throw new Error(`Failed to get jurisdictions with supervisory authority count: ${authorityError.message}`);
    }

    return {
      total: total || 0,
      with_adequacy: withAdequacy || 0,
      without_adequacy: (total || 0) - (withAdequacy || 0),
      with_supervisory_authority: withSupervisoryAuthority || 0,
    };
  }

  /**
   * Check if a jurisdiction has GDPR adequacy
   */
  async hasGdprAdequacy(countryCode: string): Promise<boolean> {
    const jurisdiction = await this.findByCountryCode(countryCode);
    return jurisdiction?.gdpr_adequacy ?? false;
  }

  /**
   * Get popular jurisdictions for dropdowns
   *
   * NOTE: name_en column doesn't exist - using country_code for ordering
   */
  async getPopularJurisdictions(): Promise<Jurisdiction[]> {
    // Return commonly used jurisdictions (EU, US, UK, etc.)
    const popularCodes = ['SK', 'CZ', 'DE', 'US', 'GB', 'FR', 'AT', 'PL', 'HU', 'NL'];

    const { data, error } = await this.client
      .from('jurisdictions')
      .select('*')
      .in('country_code', popularCodes)
      .order('country_code', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch popular jurisdictions: ${error.message}`);
    }

    return data as Jurisdiction[];
  }

  /**
   * Validate country code format
   */
  validateCountryCode(countryCode: string): boolean {
    return /^[A-Z]{2}$/.test(countryCode);
  }

  /**
   * Check if jurisdiction exists
   */
  async exists(id: string): Promise<boolean> {
    const { data, error } = await this.client
      .from('jurisdictions')
      .select('id')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to check jurisdiction existence: ${error.message}`);
    }

    return !!data;
  }

  /**
   * Check if country code exists
   */
  async countryCodeExists(countryCode: string): Promise<boolean> {
    const { data, error } = await this.client
      .from('jurisdictions')
      .select('id')
      .eq('country_code', countryCode.toUpperCase())
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to check country code existence: ${error.message}`);
    }

    return !!data;
  }
}