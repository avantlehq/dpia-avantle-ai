/**
 * Authentication utilities for avantle.ai admin console
 */

import { coreApi } from './api/core-client'

export interface User {
  id: string
  email: string
  name: string
  role: 'PLATFORM_ADMIN' | 'PARTNER_ADMIN' | 'TENANT_ADMIN' | 'TENANT_USER'
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Check if user has admin privileges
export function isAdmin(user: User | null): boolean {
  return user?.role === 'PLATFORM_ADMIN'
}

export function isPartnerAdmin(user: User | null): boolean {
  return user?.role === 'PARTNER_ADMIN' || user?.role === 'PLATFORM_ADMIN'
}

// Get current user from localStorage
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null
  
  try {
    const userData = localStorage.getItem('user_data')
    return userData ? JSON.parse(userData) as User : null
  } catch {
    return null
  }
}

// Login function
export async function login(email: string, password: string): Promise<{
  success: boolean
  user?: User
  error?: string
}> {
  try {
    const response = await coreApi.login(email, password)
    
    if (response.success && response.data) {
      return {
        success: true,
        user: response.data.user as User
      }
    } else {
      return {
        success: false,
        error: response.error?.message || 'Login failed'
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Login failed'
    }
  }
}

// Logout function
export async function logout(): Promise<void> {
  await coreApi.logout()
  
  // Redirect to home page
  if (typeof window !== 'undefined') {
    window.location.href = '/'
  }
}

// Check authentication status
export function checkAuth(): AuthState {
  const user = getCurrentUser()
  const isAuthenticated = coreApi.isAuthenticated()
  
  return {
    user,
    isAuthenticated: isAuthenticated && !!user,
    isLoading: false
  }
}

// Protect admin routes
export function requireAuth(requiredRole?: User['role']): User | null {
  const user = getCurrentUser()
  
  if (!user || !coreApi.isAuthenticated()) {
    // Redirect to login
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    return null
  }
  
  if (requiredRole && user.role !== requiredRole && user.role !== 'PLATFORM_ADMIN') {
    // Insufficient permissions
    if (typeof window !== 'undefined') {
      window.location.href = '/unauthorized'
    }
    return null
  }
  
  return user
}