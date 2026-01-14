/**
 * Context Module Client - Processing Activities
 *
 * Client-side functions for processing activity (ROPA) management.
 */

import { contextFetch } from './client'

export interface ProcessingActivity {
  id: string
  tenant_id: string
  workspace_id: string
  name: string
  description?: string
  purpose: string
  lawful_basis: 'consent' | 'contract' | 'legal_obligation' | 'vital_interests' | 'public_task' | 'legitimate_interests'
  lawful_basis_explanation?: string
  data_subject_categories?: string
  special_category_basis?: 'none' | 'explicit_consent' | 'employment' | 'vital_interests' | 'public_interest' | 'healthcare' | 'research' | 'legal_claims'
  automated_decision_making: boolean
  profiling: boolean
  data_source?: string
  dpo_review_required: boolean
  review_date?: string
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
}

export interface CreateProcessingActivityData {
  name: string
  description?: string
  purpose: string
  lawful_basis: 'consent' | 'contract' | 'legal_obligation' | 'vital_interests' | 'public_task' | 'legitimate_interests'
  lawful_basis_explanation?: string
  data_subject_categories?: string
  special_category_basis?: 'none' | 'explicit_consent' | 'employment' | 'vital_interests' | 'public_interest' | 'healthcare' | 'research' | 'legal_claims'
  automated_decision_making: boolean
  profiling: boolean
  data_source?: string
  dpo_review_required: boolean
  review_date?: string
}

export type UpdateProcessingActivityData = Partial<CreateProcessingActivityData>

export interface ProcessingActivitiesListResponse {
  data: ProcessingActivity[]
  meta: {
    total: number
    page: number
    limit: number
  }
}

export async function getProcessingActivities(): Promise<ProcessingActivity[]> {
  const response = await contextFetch<ProcessingActivitiesListResponse>(
    '/api/v1/context/processing-activities'
  )
  return response.data
}

export async function getProcessingActivity(id: string): Promise<ProcessingActivity | null> {
  try {
    return await contextFetch<ProcessingActivity>(`/api/v1/context/processing-activities/${id}`)
  } catch (error) {
    console.error('Error fetching processing activity:', error)
    return null
  }
}

export async function createProcessingActivity(data: CreateProcessingActivityData): Promise<ProcessingActivity> {
  return contextFetch<ProcessingActivity>('/api/v1/context/processing-activities', {
    method: 'POST',
    body: data,
  })
}

export async function updateProcessingActivity(
  id: string,
  data: UpdateProcessingActivityData
): Promise<ProcessingActivity> {
  return contextFetch<ProcessingActivity>(`/api/v1/context/processing-activities/${id}`, {
    method: 'PUT',
    body: data,
  })
}

export async function deleteProcessingActivity(id: string): Promise<void> {
  await contextFetch<void>(`/api/v1/context/processing-activities/${id}`, {
    method: 'DELETE',
  })
}
