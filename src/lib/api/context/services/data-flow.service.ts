/**
 * Context Module - Data Flow Service
 *
 * Business logic layer for data flow management.
 * Handles validation, relationships, and cross-border transfer detection.
 */

import type {
  DataFlow,
  CreateDataFlowRequest,
  UpdateDataFlowRequest,
  DataFlowQueryParams,
  UUID
} from '../types';
import { DataFlowRepository } from '../repositories/data-flow.repository';
import { SystemRepository } from '../repositories/system.repository';
import { VendorRepository } from '../repositories/vendor.repository';

export class DataFlowService {
  constructor(
    private dataFlowRepo: DataFlowRepository,
    private systemRepo: SystemRepository,
    private vendorRepo: VendorRepository
  ) {}

  /**
   * Get all data flows with optional filters
   */
  async getDataFlows(params: DataFlowQueryParams = {}): Promise<{
    data: DataFlow[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }> {
    return this.dataFlowRepo.findManyWithFilters(params);
  }

  /**
   * Get data flow by ID
   */
  async getDataFlowById(id: UUID): Promise<DataFlow | null> {
    return this.dataFlowRepo.findByIdWithRelations(id);
  }

  /**
   * Create new data flow
   */
  async createDataFlow(data: CreateDataFlowRequest): Promise<DataFlow> {
    // Validate flow direction and endpoints
    await this.validateFlowEndpoints(data);

    return this.dataFlowRepo.create(data);
  }

  /**
   * Update existing data flow
   */
  async updateDataFlow(id: UUID, data: UpdateDataFlowRequest): Promise<DataFlow> {
    // Validate flow endpoints if being updated
    if (data.from_system || data.to_system || data.from_vendor || data.to_vendor) {
      const existing = await this.dataFlowRepo.findById(id);
      if (!existing) {
        throw new Error('Data flow not found');
      }

      // Merge existing data with updates for validation
      const mergedData = {
        ...existing,
        ...data,
      };
      await this.validateFlowEndpoints(mergedData as CreateDataFlowRequest);
    }

    return this.dataFlowRepo.update(id, data);
  }

  /**
   * Delete data flow (soft delete)
   */
  async deleteDataFlow(id: UUID): Promise<void> {
    await this.dataFlowRepo.delete(id);
  }

  /**
   * Validate that flow has proper endpoints based on direction
   */
  private async validateFlowEndpoints(data: CreateDataFlowRequest | UpdateDataFlowRequest): Promise<void> {
    const hasFromSystem = !!data.from_system;
    const hasToSystem = !!data.to_system;
    const hasFromVendor = !!data.from_vendor;
    const hasToVendor = !!data.to_vendor;

    // At least one source and one destination should be defined
    const hasSource = hasFromSystem || hasFromVendor;
    const hasDestination = hasToSystem || hasToVendor;

    if (!hasSource || !hasDestination) {
      throw new Error('Data flow must have at least one source (system/vendor) and one destination (system/vendor)');
    }

    // Validate referenced systems exist
    if (data.from_system) {
      const system = await this.systemRepo.findById(data.from_system);
      if (!system) {
        throw new Error(`Source system ${data.from_system} not found`);
      }
    }

    if (data.to_system) {
      const system = await this.systemRepo.findById(data.to_system);
      if (!system) {
        throw new Error(`Destination system ${data.to_system} not found`);
      }
    }

    // Validate referenced vendors exist
    if (data.from_vendor) {
      const vendor = await this.vendorRepo.findById(data.from_vendor);
      if (!vendor) {
        throw new Error(`Source vendor ${data.from_vendor} not found`);
      }
    }

    if (data.to_vendor) {
      const vendor = await this.vendorRepo.findById(data.to_vendor);
      if (!vendor) {
        throw new Error(`Destination vendor ${data.to_vendor} not found`);
      }
    }
  }
}
