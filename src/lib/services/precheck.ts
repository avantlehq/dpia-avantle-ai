import { Result, createSuccess, createError } from '@/lib/types/result'
import { submitPrecheckAction, PrecheckSubmissionResult } from '@/lib/actions/precheck-actions'

// Import types for compatibility
import type { PrecheckResult as ValidationPrecheckResult } from '@/lib/validations/precheck'

// Internal result type from server action
export interface ServerPrecheckResult {
  requiresDPIA: boolean
  riskLevel: 'low' | 'medium' | 'high'
  score: number
  reasons: string[]
  recommendations: string[]
}

export interface PrecheckQuestion {
  id: string
  question: string
  description?: string
  type: 'radio'
  required: boolean
  options: Array<{
    value: 'yes' | 'no' | 'unsure'
    label: string
    score: number
  }>
}

export class PrecheckService {
  /**
   * Submit precheck assessment with proper authentication and error handling
   */
  static async submitAssessment(
    answers: Record<string, string>
  ): Promise<Result<ValidationPrecheckResult>> {
    try {
      // Validate answers
      if (!answers || Object.keys(answers).length === 0) {
        return createError(
          'VALIDATION_ERROR',
          'Please answer all questions before submitting'
        )
      }

      // Precheck is available to all users (authenticated or anonymous)
      // This ensures public access while still providing full functionality

      // Call the server action
      const result: PrecheckSubmissionResult = await submitPrecheckAction(answers)
      
      // Handle server action result
      if (!result.success) {
        return createError(
          'SERVER_ERROR',
          result.error || 'Failed to process precheck assessment',
          result.error
        )
      }

      // Ensure we have the result data
      if (!result.result) {
        return createError(
          'SERVER_ERROR',
          'Invalid response from precheck service'
        )
      }

      // Transform to validation format expected by UI
      const precheckResult: ValidationPrecheckResult = {
        score: result.result.score,
        result: result.result.requiresDPIA ? (
          result.result.riskLevel === 'high' ? 'required' : 'recommended'
        ) : 'not_required',
        title: this.getResultTitle(result.result.requiresDPIA, result.result.riskLevel),
        description: this.getResultDescription(result.result.requiresDPIA, result.result.riskLevel),
        recommendation: result.result.recommendations.join(' '),
        next_steps: result.result.reasons.length > 0 ? result.result.reasons : ['No specific actions required']
      }

      return createSuccess(precheckResult)
    } catch (error) {
      console.error('Precheck: Error submitting assessment:', error)
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.message.includes('unauthorized') || error.message.includes('42501')) {
          return createError(
            'UNAUTHORIZED',
            'Access denied. Please check your permissions.',
            error.message
          )
        }
        
        if (error.message.includes('not found')) {
          return createError(
            'NOT_FOUND',
            'Workspace not found. Please complete onboarding first.',
            error.message
          )
        }
      }
      
      return createError(
        'SERVER_ERROR',
        'An unexpected error occurred while processing your assessment',
        error instanceof Error ? error.message : 'Unknown error'
      )
    }
  }

  /**
   * Get precheck questions from template
   */
  static getQuestions(): PrecheckQuestion[] {
    // Import template dynamically to avoid build issues
    try {
      // Using dynamic import with require() for synchronous loading
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const template = require('@/lib/templates/dpia-precheck-v1.json')
      return template.template.questions as PrecheckQuestion[]
    } catch (error) {
      console.error('Failed to load precheck template:', error)
      // Fallback questions
      return [
        {
          id: 'q1',
          question: 'Does your processing involve systematic monitoring of a publicly accessible area on a large scale?',
          description: 'Examples: CCTV surveillance, facial recognition systems in public spaces',
          type: 'radio',
          required: true,
          options: [
            { value: 'yes', label: 'Yes', score: 3 },
            { value: 'no', label: 'No', score: 0 },
            { value: 'unsure', label: "I'm not sure", score: 1 }
          ]
        }
      ]
    }
  }

  /**
   * Helper method to get result title
   */
  private static getResultTitle(requiresDPIA: boolean, riskLevel: string): string {
    if (!requiresDPIA) return "DPIA Not Required"
    if (riskLevel === 'high') return "DPIA Required"
    return "DPIA Recommended"
  }

  /**
   * Helper method to get result description
   */
  private static getResultDescription(requiresDPIA: boolean, riskLevel: string): string {
    if (!requiresDPIA) {
      return "Based on your answers, your processing activities have a low risk profile and may not require a formal DPIA under GDPR Article 35."
    }
    if (riskLevel === 'high') {
      return "Your processing activities present high risk to data subjects and require a mandatory Data Protection Impact Assessment before processing begins."
    }
    return "Your processing activities present medium risk. While not strictly mandatory, conducting a DPIA is strongly recommended as best practice."
  }
}