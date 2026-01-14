/**
 * Context Module Client - Data Categories
 *
 * Client-side functions for data category management.
 */

import { contextFetch } from './client'

export interface DataCategory {
  id: string
  tenant_id: string
  workspace_id: string
  name: string
  description?: string
  category_type: 'personal' | 'special' | 'criminal' | 'anonymous'
  sensitivity: 'public' | 'internal' | 'confidential' | 'restricted'
  special_category_basis?: 'none' | 'explicit_consent' | 'employment' | 'vital_interests' | 'public_interest' | 'healthcare' | 'research' | 'legal_claims'
  is_standard: boolean
  parent_id?: string
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
}

export interface CreateDataCategoryData {
  name: string
  description?: string
  category_type: 'personal' | 'special' | 'criminal' | 'anonymous'
  sensitivity: 'public' | 'internal' | 'confidential' | 'restricted'
  special_category_basis?: 'none' | 'explicit_consent' | 'employment' | 'vital_interests' | 'public_interest' | 'healthcare' | 'research' | 'legal_claims'
  is_standard: boolean
  parent_id?: string
}

export interface UpdateDataCategoryData extends Partial<CreateDataCategoryData> {}

export interface DataCategoriesListResponse {
  data: DataCategory[]
  meta: {
    total: number
    page: number
    limit: number
  }
}

export async function getDataCategories(): Promise<DataCategory[]> {
  const response = await contextFetch<DataCategoriesListResponse>(
    '/api/v1/context/data-categories'
  )
  return response.data
}

export async function getDataCategory(id: string): Promise<DataCategory | null> {
  try {
    return await contextFetch<DataCategory>(`/api/v1/context/data-categories/${id}`)
  } catch (error) {
    console.error('Error fetching data category:', error)
    return null
  }
}

export async function createDataCategory(data: CreateDataCategoryData): Promise<DataCategory> {
  return contextFetch<DataCategory>('/api/v1/context/data-categories', {
    method: 'POST',
    body: data,
  })
}

export async function updateDataCategory(
  id: string,
  data: UpdateDataCategoryData
): Promise<DataCategory> {
  return contextFetch<DataCategory>(`/api/v1/context/data-categories/${id}`, {
    method: 'PUT',
    body: data,
  })
}

export async function deleteDataCategory(id: string): Promise<void> {
  await contextFetch<void>(`/api/v1/context/data-categories/${id}`, {
    method: 'DELETE',
  })
}
