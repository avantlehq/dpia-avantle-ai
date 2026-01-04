/**
 * Core API Client for avantle.ai admin console
 * Integrates with core.avantle.ai control plane
 */

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    correlation_id: string
  }
  meta?: {
    correlation_id: string
    timestamp: string
    version: string
    pagination?: {
      total_count: number
      page: number
      page_size: number
      total_pages: number
      has_next: boolean
      has_prev: boolean
    }
  }
}

export interface Partner {
  id: string
  name: string
  billing_email: string
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED'
  tenant_count: number
  created_at: string
  updated_at: string
}

export interface Tenant {
  id: string
  partner_id: string
  name: string
  slug: string
  tenant_type: 'UI' | 'API' | 'HYBRID'
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING'
  created_at: string
  custom_domain?: string
  partner: {
    id: string
    name: string
  }
  domains: Array<{
    id: string
    hostname: string
    status: string
  }>
}

export interface AdminStats {
  overview: {
    total_partners: number
    total_tenants: number
    total_users: number
    total_domains: number
  }
  activity: {
    new_tenants_this_month: number
    domains_verified_today: number
    total_usage_this_month: number
  }
  top_partners: Array<{
    partner_name: string
    tenant_count: number
    total_usage: number
  }>
  recent_signups: Array<{
    tenant_name: string
    partner_name: string
    created_at: string
  }>
}

export interface AdminActivity {
  timestamp: string
  type: string
  description: string
  actor: string
  tenant_name?: string
  partner_name?: string
}

class CoreApiClient {
  private baseUrl: string
  private token: string = ''

  constructor(baseUrl: string = 'https://core-avantle-ezuyyhjei-ramix24s-projects.vercel.app') {
    this.baseUrl = baseUrl
    
    // Get token from localStorage in browser
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('core_api_token') || ''
    }
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error || {
            code: 'HTTP_ERROR',
            message: `HTTP ${response.status}: ${response.statusText}`,
            correlation_id: 'unknown'
          }
        }
      }

      return data
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Network request failed',
          correlation_id: 'unknown'
        }
      }
    }
  }

  // Authentication
  async login(email: string, password: string): Promise<ApiResponse<{
    access_token: string
    token_type: string
    expires_in: number
    user: {
      id: string
      email: string
      name: string
      role: string
    }
  }>> {
    const response = await this.request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })

    if (response.success && response.data && response.data.access_token) {
      this.token = response.data.access_token
      if (typeof window !== 'undefined') {
        localStorage.setItem('core_api_token', this.token)
        localStorage.setItem('user_data', JSON.stringify(response.data.user))
      }
    }

    return response
  }

  async logout(): Promise<void> {
    this.token = ''
    if (typeof window !== 'undefined') {
      localStorage.removeItem('core_api_token')
      localStorage.removeItem('user_data')
    }
  }

  getCurrentUser(): any {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user_data')
      return userData ? JSON.parse(userData) : null
    }
    return null
  }

  isAuthenticated(): boolean {
    return this.token !== ''
  }

  // Partners API
  async getPartners(page = 1, pageSize = 20): Promise<ApiResponse<Partner[]>> {
    return this.request<Partner[]>(`/partners?page=${page}&page_size=${pageSize}`)
  }

  async createPartner(data: { 
    name: string; 
    billing_email: string;
    metadata?: Record<string, any>
  }): Promise<ApiResponse<Partner>> {
    return this.request<Partner>('/partners', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async getPartner(id: string): Promise<ApiResponse<Partner>> {
    return this.request<Partner>(`/partners/${id}`)
  }

  async updatePartner(id: string, data: Partial<Partner>): Promise<ApiResponse<Partner>> {
    return this.request<Partner>(`/partners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  // Tenants API
  async getTenants(page = 1, pageSize = 20, partnerId?: string): Promise<ApiResponse<Tenant[]>> {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString()
    })
    if (partnerId) params.append('partner_id', partnerId)

    return this.request<Tenant[]>(`/tenants?${params}`)
  }

  async createTenant(data: { 
    id: string
    partner_id: string
    name: string
    tenant_type: 'UI' | 'API' | 'HYBRID'
    api_client?: {
      name: string
      client_id: string
    }
  }): Promise<ApiResponse<Tenant>> {
    return this.request<Tenant>('/tenants', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async getTenant(id: string): Promise<ApiResponse<Tenant>> {
    return this.request<Tenant>(`/tenants/${id}`)
  }

  async updateTenant(id: string, data: Partial<Tenant>): Promise<ApiResponse<Tenant>> {
    return this.request<Tenant>(`/tenants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  // Admin API
  async getAdminStats(): Promise<ApiResponse<AdminStats>> {
    return this.request<AdminStats>('/admin/stats')
  }

  async getAdminActivity(page = 1, pageSize = 50): Promise<ApiResponse<AdminActivity[]>> {
    return this.request<AdminActivity[]>(`/admin/activity?page=${page}&page_size=${pageSize}`)
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{
    service: string
    version: string
    timestamp: string
  }>> {
    return this.request<any>('/')
  }
}

// Export singleton instance
export const coreApi = new CoreApiClient()
export default coreApi