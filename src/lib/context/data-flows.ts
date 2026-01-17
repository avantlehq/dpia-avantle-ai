/**
 * Context Module Client - Data Flows
 *
 * Client-side functions for data flow mapping.
 */

import { contextFetch } from './client'

export interface DataFlow {
  id: string
  tenant_id: string
  workspace_id: string
  name: string
  description?: string
  purpose?: string
  flow_direction: 'inbound' | 'outbound' | 'bidirectional' | 'internal'
  frequency?: string
  volume_estimate?: string
  criticality?: 'low' | 'medium' | 'high' | 'critical'
  status: 'active' | 'inactive'
  from_system?: string
  to_system?: string
  from_vendor?: string
  to_vendor?: string
  encryption_in_transit: boolean
  cross_border_transfer: boolean
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
}

export interface CreateDataFlowData {
  name: string
  description?: string
  purpose?: string
  flow_direction: 'inbound' | 'outbound' | 'bidirectional' | 'internal'
  frequency?: string
  volume_estimate?: string
  criticality?: 'low' | 'medium' | 'high' | 'critical'
  status: 'active' | 'inactive'
  from_system?: string
  to_system?: string
  from_vendor?: string
  to_vendor?: string
  encryption_in_transit: boolean
  cross_border_transfer: boolean
}

export type UpdateDataFlowData = Partial<CreateDataFlowData>

export interface DataFlowsListResponse {
  data: DataFlow[]
  meta: {
    total: number
    page: number
    limit: number
  }
}

export async function getDataFlows(): Promise<DataFlow[]> {
  // Add timestamp to bust any caching
  const timestamp = Date.now()
  const response = await contextFetch<DataFlowsListResponse>(
    `/api/v1/context/data-flows?_t=${timestamp}`
  )
  return response.data
}

export async function getDataFlow(id: string): Promise<DataFlow | null> {
  try {
    // Note: No GET /api/v1/context/data-flows/[id] endpoint exists yet
    // Using fetch-all-then-filter approach (won't work server-side)
    const flows = await getDataFlows()
    return flows.find(f => f.id === id) || null
  } catch (error) {
    console.error('Error fetching data flow:', error)
    return null
  }
}

export async function createDataFlow(data: CreateDataFlowData): Promise<DataFlow> {
  return contextFetch<DataFlow>('/api/v1/context/data-flows', {
    method: 'POST',
    body: data,
  })
}

export async function updateDataFlow(
  id: string,
  data: UpdateDataFlowData
): Promise<DataFlow> {
  return contextFetch<DataFlow>(`/api/v1/context/data-flows/${id}`, {
    method: 'PUT',
    body: data,
  })
}

export async function deleteDataFlow(id: string): Promise<void> {
  await contextFetch<void>(`/api/v1/context/data-flows/${id}`, {
    method: 'DELETE',
  })
}
