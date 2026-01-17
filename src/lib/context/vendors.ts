/**
 * Context Module Client - Vendors
 *
 * Client-side functions for vendor/processor management.
 */

import { contextFetch } from './client'

export interface Vendor {
  id: string
  tenant_id: string
  workspace_id: string
  name: string
  description?: string
  website?: string
  contact_email?: string
  primary_contact?: string
  vendor_role: 'processor' | 'joint_controller' | 'recipient' | 'sub_processor'
  status: 'active' | 'inactive'
  has_dpa: boolean
  dpa_expires?: string
  location?: string
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
}

export interface CreateVendorData {
  name: string
  description?: string
  website?: string
  contact_email?: string
  primary_contact?: string
  vendor_role: 'processor' | 'joint_controller' | 'recipient' | 'sub_processor'
  status: 'active' | 'inactive'
  has_dpa: boolean
  dpa_expires?: string
  location?: string
}

export type UpdateVendorData = Partial<CreateVendorData>

export interface VendorsListResponse {
  data: Vendor[]
  meta: {
    total: number
    page: number
    limit: number
  }
}

export async function getVendors(): Promise<Vendor[]> {
  // Add timestamp to bust any caching
  const timestamp = Date.now()
  const response = await contextFetch<VendorsListResponse>(
    `/api/v1/context/vendors?_t=${timestamp}`
  )
  return response.data
}

export async function getVendor(id: string): Promise<Vendor | null> {
  try {
    return await contextFetch<Vendor>(`/api/v1/context/vendors/${id}`)
  } catch (error) {
    console.error('Error fetching vendor:', error)
    return null
  }
}

export async function createVendor(data: CreateVendorData): Promise<Vendor> {
  return contextFetch<Vendor>('/api/v1/context/vendors', {
    method: 'POST',
    body: data,
  })
}

export async function updateVendor(
  id: string,
  data: UpdateVendorData
): Promise<Vendor> {
  return contextFetch<Vendor>(`/api/v1/context/vendors/${id}`, {
    method: 'PUT',
    body: data,
  })
}

export async function deleteVendor(id: string): Promise<void> {
  await contextFetch<void>(`/api/v1/context/vendors/${id}`, {
    method: 'DELETE',
  })
}
