/**
 * Context Module Client - Physical Locations
 *
 * Client-side functions for physical location management.
 */

import { contextFetch } from './client'

export interface Location {
  id: string
  tenant_id: string
  workspace_id: string
  name: string
  description?: string
  address?: string
  city?: string
  jurisdiction_id: string
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
  deleted_at?: string
}

export interface CreateLocationData {
  name: string
  description?: string
  address?: string
  city?: string
  jurisdiction_id: string
  status?: 'active' | 'inactive'
}

export type UpdateLocationData = Partial<CreateLocationData>

export interface LocationsListResponse {
  data: Location[]
  meta: {
    total: number
    page: number
    limit: number
  }
}

export async function getLocations(): Promise<Location[]> {
  // Add timestamp to bust any caching
  const timestamp = Date.now()
  const response = await contextFetch<LocationsListResponse>(
    `/api/v1/context/locations?_t=${timestamp}`
  )
  return response.data
}

export async function getLocation(id: string): Promise<Location | null> {
  try {
    return await contextFetch<Location>(`/api/v1/context/locations/${id}`)
  } catch (error) {
    console.error('Error fetching location:', error)
    return null
  }
}

export async function createLocation(data: CreateLocationData): Promise<Location> {
  return contextFetch<Location>('/api/v1/context/locations', {
    method: 'POST',
    body: data,
  })
}

export async function updateLocation(
  id: string,
  data: UpdateLocationData
): Promise<Location> {
  return contextFetch<Location>(`/api/v1/context/locations/${id}`, {
    method: 'PUT',
    body: data,
  })
}

export async function deleteLocation(id: string): Promise<void> {
  await contextFetch<void>(`/api/v1/context/locations/${id}`, {
    method: 'DELETE',
  })
}
