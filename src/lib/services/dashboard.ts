import { DatabaseService } from './database'
import { AuthGuard } from './auth-guard'
import { Result, createSuccess, createError, isError } from '@/lib/types/result'
import type { Database } from '@/lib/supabase/database.types'

// Use database types
export type Assessment = Database['public']['Tables']['assessments']['Row']

export interface DashboardStats {
  totalAssessments: number
  completed: number
  inProgress: number
  drafts: number
}

export class DashboardService {
  /**
   * Load assessments with proper authentication and error handling
   */
  static async loadAssessments(): Promise<Result<Assessment[]>> {
    try {
      console.log('Dashboard: Starting to load assessments')
      
      // Check user authentication and workspace access first
      const authResult = await AuthGuard.checkUserAccess()
      console.log('Dashboard: Auth result:', authResult)
      
      if (isError(authResult)) {
        console.log('Dashboard: Auth failed:', authResult)
        return authResult
      }

      const { workspaceId } = authResult.data
      console.log('Dashboard: Using workspace ID:', workspaceId)
      
      const db = await DatabaseService.create()
      console.log('Dashboard: Database service created')
      
      const assessments = await db.getAssessments(workspaceId)
      console.log('Dashboard: Loaded assessments:', assessments.length, 'items')
      console.log('Dashboard: Assessment details:', assessments)
      
      return createSuccess(assessments || [])
    } catch (error) {
      console.error('Dashboard: Error loading assessments:', error)
      
      // Check for specific error types
      if (error instanceof Error) {
        if (error.message.includes('unauthorized') || error.message.includes('42501')) {
          return createError(
            'UNAUTHORIZED', 
            'Access denied. Please check your permissions.',
            error.message
          )
        }
        
        if (error.message.includes('not found') || error.message.includes('PGRST116')) {
          return createError(
            'NOT_FOUND',
            'No assessments found for your workspace.',
            error.message
          )
        }
      }
      
      // Return the actual error instead of mock data
      return createError(
        'SERVER_ERROR',
        'Database connection failed. Please try again.',
        error.message
      )
    }
  }

  /**
   * Calculate dashboard statistics
   */
  static calculateStats(assessments: Assessment[]): DashboardStats {
    return {
      totalAssessments: assessments.length,
      completed: assessments.filter(a => a.status === 'completed').length,
      inProgress: assessments.filter(a => a.status === 'in_progress').length,
      drafts: assessments.filter(a => a.status === 'draft').length,
    }
  }
}