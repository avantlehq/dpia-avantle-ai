/**
 * Context Module Client - Physical Locations
 *
 * Client-side functions for jurisdiction/location management.
 */

import { contextFetch } from './client'

export interface Location {
  id: string
  tenant_id: string
  workspace_id: string
  name: string
  country_code: string
  jurisdiction_type: 'eu_member_state' | 'eea_country' | 'third_country' | 'international'
  adequacy_status: 'adequate' | 'not_adequate' | 'partial' | 'under_review'
  adequacy_decision_date?: string
  adequacy_decision_reference?: string
  safeguards_required: boolean
  safeguards_description?: string
  data_localization_requirements: boolean
  status: 'active' | 'inactive'
  notes?: string
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
}

export interface CreateLocationData {
  name: string
  country_code: string
  jurisdiction_type: 'eu_member_state' | 'eea_country' | 'third_country' | 'international'
  adequacy_status: 'adequate' | 'not_adequate' | 'partial' | 'under_review'
  adequacy_decision_date?: string
  adequacy_decision_reference?: string
  safeguards_required: boolean
  safeguards_description?: string
  data_localization_requirements: boolean
  status: 'active' | 'inactive'
  notes?: string
}

export interface UpdateLocationData extends Partial<CreateLocationData> {}

export interface LocationsListResponse {
  data: Location[]
  meta: {
    total: number
    page: number
    limit: number
  }
}

export async function getLocations(): Promise<Location[]> {
  const response = await contextFetch<LocationsListResponse>(
    '/api/v1/context/locations'
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
