import { useState, useEffect, useCallback } from 'react'
import { templateValidator, type ValidationResult, type SectionValidationResult } from '@/lib/validation/template-validator'
import { DatabaseService } from '@/lib/services/database'
import templateData from '@/lib/templates/dpia-basic-eu-v1.json'

export interface UseTemplateValidationProps {
  assessmentId: string
  autoValidate?: boolean
}

export interface UseTemplateValidationReturn {
  validationResult: ValidationResult | null
  sectionValidations: Record<string, SectionValidationResult>
  isValidating: boolean
  validateAssessment: () => Promise<ValidationResult>
  validateSection: (sectionId: string) => Promise<SectionValidationResult>
  refreshValidation: () => Promise<void>
  hasErrors: boolean
  hasWarnings: boolean
  completionPercentage: number
}

export function useTemplateValidation({ 
  assessmentId, 
  autoValidate = true 
}: UseTemplateValidationProps): UseTemplateValidationReturn {
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [sectionValidations, setSectionValidations] = useState<Record<string, SectionValidationResult>>({})
  const [isValidating, setIsValidating] = useState(false)

  const validateAssessment = useCallback(async (): Promise<ValidationResult> => {
    setIsValidating(true)
    try {
      // Try to load assessment data from database
      const db = await DatabaseService.create()
      let assessmentData: Record<string, Record<string, unknown>> = {}
      
      try {
        if (!db.isConfigured()) {
          console.warn('Database not configured - missing environment variables. Using empty data for validation.')
          throw new Error('Database not configured')
        }
        assessmentData = await db.getAssessmentAnswers(assessmentId)
      } catch (dbError) {
        console.warn('Database not available for validation, using empty data fallback:', dbError)
        // Provide empty data structure for validation when database is not available
        assessmentData = {}
        Object.keys(templateData.sections).forEach(sectionId => {
          assessmentData[sectionId] = {}
        })
      }
      
      // Validate using template validator
      const result = templateValidator.validateAssessment(assessmentData)
      setValidationResult(result)
      
      // Update section validations (validate all sections defined in template)
      const sectionResults: Record<string, SectionValidationResult> = {}
      for (const sectionId of Object.keys(templateData.sections)) {
        const sectionData = assessmentData[sectionId] || {}
        sectionResults[sectionId] = templateValidator.validateSection(sectionId, sectionData)
      }
      setSectionValidations(sectionResults)
      
      return result
    } catch (error) {
      console.error('Error validating assessment:', error)
      const fallbackResult: ValidationResult = {
        isValid: false,
        errors: [{
          sectionId: 'general',
          message: 'Validation system temporarily unavailable',
          severity: 'error'
        }],
        warnings: [{
          sectionId: 'general',
          message: 'Database connection issue - validation may be limited',
          suggestion: 'Check your environment configuration or try again later'
        }],
        completionPercentage: 0,
        missingSections: Object.keys(templateData.sections),
        missingRequiredFields: []
      }
      setValidationResult(fallbackResult)
      return fallbackResult
    } finally {
      setIsValidating(false)
    }
  }, [assessmentId])

  const validateSection = useCallback(async (sectionId: string): Promise<SectionValidationResult> => {
    try {
      // Try to load section data
      const db = await DatabaseService.create()
      let sectionData: Record<string, unknown> = {}
      
      try {
        if (!db.isConfigured()) {
          console.warn(`Database not configured for section ${sectionId} validation - missing environment variables.`)
          throw new Error('Database not configured')
        }
        const assessmentData = await db.getAssessmentAnswers(assessmentId)
        sectionData = assessmentData[sectionId] || {}
      } catch (dbError) {
        console.warn(`Database not available for section ${sectionId} validation, using empty data:`, dbError)
        sectionData = {}
      }
      
      // Validate section (works even with empty data)
      const result = templateValidator.validateSection(sectionId, sectionData)
      
      // Update section validations
      setSectionValidations(prev => ({
        ...prev,
        [sectionId]: result
      }))
      
      return result
    } catch (error) {
      console.error(`Error validating section ${sectionId}:`, error)
      const fallbackResult: SectionValidationResult = {
        sectionId,
        isComplete: false,
        requiredFieldsCount: 0,
        completedFieldsCount: 0,
        errors: [{
          sectionId,
          message: `Failed to validate section ${sectionId}`,
          severity: 'error'
        }],
        warnings: []
      }
      setSectionValidations(prev => ({
        ...prev,
        [sectionId]: fallbackResult
      }))
      return fallbackResult
    }
  }, [assessmentId])

  const refreshValidation = useCallback(async () => {
    await validateAssessment()
  }, [validateAssessment])

  // Auto-validate on mount and when assessment changes
  useEffect(() => {
    if (autoValidate && assessmentId) {
      validateAssessment()
    }
  }, [assessmentId, autoValidate, validateAssessment])

  // Computed properties
  const hasErrors = (validationResult?.errors?.length ?? 0) > 0
  const hasWarnings = (validationResult?.warnings?.length ?? 0) > 0
  const completionPercentage = validationResult?.completionPercentage || 0

  return {
    validationResult,
    sectionValidations,
    isValidating,
    validateAssessment,
    validateSection,
    refreshValidation,
    hasErrors,
    hasWarnings,
    completionPercentage
  }
}