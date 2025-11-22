import { DatabaseService } from './database'
import { AuthGuard } from './auth-guard'
import { Result, createSuccess, createError, isError } from '@/lib/types/result'
import type { Database } from '@/lib/supabase/database.types'

type Assessment = Database['public']['Tables']['assessments']['Row']

export class AssessmentGuard {
  /**
   * Guard for assessment list/dashboard pages
   */
  static async requireUserAccess() {
    const result = await AuthGuard.checkUserAccess()
    
    if (isError(result)) {
      // Redirect to onboarding for better UX
      if (result.error === 'NOT_FOUND') {
        throw new Error('REDIRECT:/onboarding')
      }
      
      if (result.error === 'UNAUTHORIZED') {
        throw new Error('REDIRECT:/login')
      }
      
      throw new Error(`Access denied: ${result.message}`)
    }
    
    return result.data
  }

  /**
   * Guard for specific assessment pages
   */
  static async requireAssessmentAccess(assessmentId: string) {
    const result = await AuthGuard.checkAssessmentAccess(assessmentId)
    
    if (isError(result)) {
      // Provide specific redirect guidance
      if (result.error === 'NOT_FOUND') {
        throw new Error('REDIRECT:/dashboard')
      }
      
      if (result.error === 'UNAUTHORIZED') {
        throw new Error('REDIRECT:/login')
      }
      
      throw new Error(`Assessment access denied: ${result.message}`)
    }
    
    return result.data
  }

  /**
   * Guard for assessment modification
   */
  static async requireAssessmentWriteAccess(assessmentId: string) {
    const result = await AuthGuard.checkAssessmentWriteAccess(assessmentId)
    
    if (isError(result)) {
      if (result.error === 'VALIDATION_ERROR') {
        throw new Error('REDIRECT:/dashboard?error=read-only')
      }
      
      if (result.error === 'NOT_FOUND') {
        throw new Error('REDIRECT:/dashboard')
      }
      
      if (result.error === 'UNAUTHORIZED') {
        throw new Error('REDIRECT:/login')
      }
      
      throw new Error(`Write access denied: ${result.message}`)
    }
    
    return result.data
  }

  /**
   * Safe assessment loader with fallback
   */
  static async loadAssessmentSafely(assessmentId: string): Promise<Result<Assessment>> {
    try {
      const context = await this.requireAssessmentAccess(assessmentId)
      return createSuccess(context.assessment)
    } catch (error) {
      console.error('AssessmentGuard: Failed to load assessment:', error)
      
      if (error instanceof Error && error.message.startsWith('REDIRECT:')) {
        return createError(
          'UNAUTHORIZED',
          'Access denied. Redirecting to appropriate page.',
          error.message.replace('REDIRECT:', '')
        )
      }
      
      return createError(
        'SERVER_ERROR',
        'Unable to load assessment.',
        error instanceof Error ? error.message : 'Unknown error'
      )
    }
  }

  /**
   * Check if user has any assessments (for empty state detection)
   */
  static async hasAnyAssessments(): Promise<boolean> {
    try {
      const context = await this.requireUserAccess()
      const db = await DatabaseService.create()
      const assessments = await db.getAssessments(context.workspaceId)
      return assessments.length > 0
    } catch (error) {
      console.error('AssessmentGuard: Error checking assessments:', error)
      return false
    }
  }

  /**
   * Validate assessment state for operations
   */
  static validateAssessmentState(
    assessment: Assessment, 
    operation: 'view' | 'edit' | 'submit' | 'export'
  ): Result<true> {
    switch (operation) {
      case 'view':
        // All assessments can be viewed
        return createSuccess(true)
        
      case 'edit':
        if (assessment.status === 'submitted' || assessment.status === 'archived') {
          return createError(
            'VALIDATION_ERROR',
            'This assessment cannot be edited in its current state.',
            `Current status: ${assessment.status}`
          )
        }
        return createSuccess(true)
        
      case 'submit':
        if (assessment.status !== 'draft' && assessment.status !== 'in_progress') {
          return createError(
            'VALIDATION_ERROR',
            'Assessment must be in draft or in-progress state to submit.',
            `Current status: ${assessment.status}`
          )
        }
        
        // Check if assessment has required sections completed
        const requiredSections = ['context', 'legal-basis', 'risk-assessment']
        const completedSections = assessment.completed_sections || []
        const missingSection = requiredSections.find(section => !completedSections.includes(section))
        
        if (missingSection) {
          return createError(
            'VALIDATION_ERROR',
            'Assessment must have all required sections completed before submission.',
            `Missing section: ${missingSection}`
          )
        }
        
        return createSuccess(true)
        
      case 'export':
        if (assessment.status === 'draft' && (!assessment.completed_sections?.length)) {
          return createError(
            'VALIDATION_ERROR',
            'Assessment must have at least one completed section to export.',
            'No completed sections found'
          )
        }
        return createSuccess(true)
        
      default:
        return createError(
          'VALIDATION_ERROR',
          'Invalid operation specified.',
          `Unknown operation: ${operation}`
        )
    }
  }
}