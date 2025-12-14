import { useState, useEffect, useCallback } from 'react'
import { templateValidator, type ValidationResult, type SectionValidationResult } from '@/lib/validation/template-validator'
import { DatabaseService } from '@/lib/services/database'

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
      // Load assessment data
      const db = await DatabaseService.create()
      const assessmentData = await db.getAssessmentAnswers(assessmentId)
      
      // Validate using template validator
      const result = templateValidator.validateAssessment(assessmentData)
      setValidationResult(result)
      
      // Update section validations
      const sectionResults: Record<string, SectionValidationResult> = {}
      for (const sectionId of Object.keys(assessmentData)) {
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
          message: 'Failed to validate assessment',
          severity: 'error'
        }],
        warnings: [],
        completionPercentage: 0,
        missingSections: [],
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
      // Load section data
      const db = await DatabaseService.create()
      const assessmentData = await db.getAssessmentAnswers(assessmentId)
      const sectionData = assessmentData[sectionId] || {}
      
      // Validate section
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