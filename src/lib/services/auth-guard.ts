import { DatabaseService } from './database'
import { Result, createSuccess, createError } from '@/lib/types/result'
import type { Database } from '@/lib/supabase/database.types'
import type { User } from '@supabase/supabase-js'

type Assessment = Database['public']['Tables']['assessments']['Row']

// Guard against client-side usage
function ensureServerSide() {
  if (typeof window !== 'undefined') {
    throw new Error('AuthGuard can only be used on the server side')
  }
}

export interface AuthGuardContext {
  user: User | null
  workspaceId: string
}

export interface AssessmentGuardContext extends AuthGuardContext {
  assessment: Assessment
}

export class AuthGuard {
  /**
   * Check if user is authenticated and has workspace access
   */
  static async checkUserAccess(): Promise<Result<AuthGuardContext>> {
    ensureServerSide()
    
    try {
      // TEMPORARY: Allow demo access without authentication until auth is implemented
      // TODO: Remove this and implement proper authentication
      console.log('AuthGuard: Allowing demo access (auth not implemented yet)')
      return createSuccess({
        user: null, // Demo mode - no user required
        workspaceId: '00000000-0000-0000-0000-000000000002'
      })

      // Future implementation when auth is ready:
      /*
      const db = await DatabaseService.create()
      
      // Get current user
      const user = await db.getCurrentUser()
      
      if (!user) {
        return createError(
          'UNAUTHORIZED',
          'Authentication required. Please sign in to continue.',
          'No valid session found'
        )
      }

      // Get user's workspace
      const workspaceId = await db.getDefaultWorkspace()
      
      if (!workspaceId) {
        return createError(
          'NOT_FOUND',
          'No workspace found. Please complete onboarding first.',
          'User has no workspace assigned'
        )
      }

      return createSuccess({ user, workspaceId })
      */
    } catch (error) {
      console.error('AuthGuard: Error checking user access:', error)
      
      // For development: allow access with mock context
      if (process.env.NODE_ENV === 'development') {
        return createSuccess({
          user: null, // Development mode uses mock user
          workspaceId: '00000000-0000-0000-0000-000000000002'
        })
      }
      
      return createError(
        'SERVER_ERROR',
        'Unable to verify access permissions.',
        error instanceof Error ? error.message : 'Unknown error'
      )
    }
  }

  /**
   * Check if user can access specific assessment
   */
  static async checkAssessmentAccess(
    assessmentId: string
  ): Promise<Result<AssessmentGuardContext>> {
    ensureServerSide()
    
    try {
      // First check user access
      const userAccessResult = await this.checkUserAccess()
      
      if (!userAccessResult.success) {
        return userAccessResult as Result<AssessmentGuardContext>
      }

      const { user, workspaceId } = userAccessResult.data

      // Get the assessment
      const db = await DatabaseService.create()
      const assessment = await db.getAssessment(assessmentId)
      
      if (!assessment) {
        return createError(
          'NOT_FOUND',
          'Assessment not found or access denied.',
          'Assessment does not exist or user lacks permissions'
        )
      }

      // Check workspace ownership
      if (assessment.workspace_id !== workspaceId) {
        return createError(
          'UNAUTHORIZED',
          'Access denied. You do not have permission to view this assessment.',
          'Assessment belongs to different workspace'
        )
      }

      return createSuccess({ user, workspaceId, assessment })
    } catch (error) {
      console.error('AuthGuard: Error checking assessment access:', error)
      
      return createError(
        'SERVER_ERROR',
        'Unable to verify assessment permissions.',
        error instanceof Error ? error.message : 'Unknown error'
      )
    }
  }

  /**
   * Check if user can modify assessment (additional write permissions)
   */
  static async checkAssessmentWriteAccess(
    assessmentId: string
  ): Promise<Result<AssessmentGuardContext>> {
    ensureServerSide()
    
    try {
      // Get assessment access first
      const accessResult = await this.checkAssessmentAccess(assessmentId)
      
      if (!accessResult.success) {
        return accessResult
      }

      const { assessment } = accessResult.data

      // Check if assessment is in a modifiable state
      if (assessment.status === 'submitted' || assessment.status === 'archived') {
        return createError(
          'VALIDATION_ERROR',
          'Assessment cannot be modified in its current state.',
          `Assessment status: ${assessment.status}`
        )
      }

      return accessResult
    } catch (error) {
      console.error('AuthGuard: Error checking write access:', error)
      
      return createError(
        'SERVER_ERROR',
        'Unable to verify write permissions.',
        error instanceof Error ? error.message : 'Unknown error'
      )
    }
  }
}