/**
 * Context Module Client - IT Systems
 *
 * Client-side functions for IT system management.
 * Used in both server components (with cache control) and client components.
 */

import { contextFetch } from './client'

export interface System {
  id: string
  tenant_id: string
  workspace_id: string
  name: string
  description?: string
  system_type: string
  criticality: 'low' | 'medium' | 'high' | 'critical'
  status: 'active' | 'inactive'
  owner_team?: string
  technical_contact?: string
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
}

export interface CreateSystemData {
  name: string
  description?: string
  system_type: string
  criticality: 'low' | 'medium' | 'high' | 'critical'
  status: 'active' | 'inactive'
  owner_team?: string
  technical_contact?: string
}

export type UpdateSystemData = Partial<CreateSystemData>

export interface SystemsListResponse {
  data: System[]
  meta: {
    total: number
    page: number
    limit: number
  }
}

/**
 * Get all systems
 */
export async function getSystems(): Promise<System[]> {
  const response = await contextFetch<SystemsListResponse>(
    '/api/v1/context/systems'
  )
  return response.data
}

/**
 * Get single system by ID
 */
export async function getSystem(id: string): Promise<System | null> {
  try {
    const systems = await getSystems()
    return systems.find(s => s.id === id) || null
  } catch (error) {
    console.error('Error fetching system:', error)
    return null
  }
}

/**
 * Create new system
 */
export async function createSystem(data: CreateSystemData): Promise<System> {
  return contextFetch<System>('/api/v1/context/systems', {
    method: 'POST',
    body: data,
  })
}

/**
 * Update existing system
 */
export async function updateSystem(
  id: string,
  data: UpdateSystemData
): Promise<System> {
  return contextFetch<System>(`/api/v1/context/systems/${id}`, {
    method: 'PUT',
    body: data,
  })
}

/**
 * Delete system
 */
export async function deleteSystem(id: string): Promise<void> {
  await contextFetch<void>(`/api/v1/context/systems/${id}`, {
    method: 'DELETE',
  })
}
