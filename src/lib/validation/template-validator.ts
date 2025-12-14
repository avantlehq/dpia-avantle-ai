// Template validation system for DPIA compliance
import templateData from '@/lib/templates/dpia-basic-eu-v1.json'

// Validation result interface
export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
  completionPercentage: number
  missingSections: string[]
  missingRequiredFields: string[]
}

export interface ValidationError {
  sectionId: string
  fieldId?: string
  message: string
  severity: 'error' | 'warning'
}

export interface ValidationWarning {
  sectionId: string
  fieldId?: string
  message: string
  suggestion?: string
}

export interface SectionValidationResult {
  sectionId: string
  isComplete: boolean
  requiredFieldsCount: number
  completedFieldsCount: number
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

export class TemplateValidator {
  private template: typeof templateData

  constructor() {
    this.template = templateData
  }

  /**
   * Validate complete assessment data
   */
  validateAssessment(assessmentData: Record<string, Record<string, unknown>>): ValidationResult {
    const results: SectionValidationResult[] = []
    const allErrors: ValidationError[] = []
    const allWarnings: ValidationWarning[] = []

    // Validate each section
    Object.values(this.template.sections).forEach(section => {
      const sectionData = assessmentData[section.sectionId] || {}
      const sectionResult = this.validateSection(section.sectionId, sectionData)
      results.push(sectionResult)
      allErrors.push(...sectionResult.errors)
      allWarnings.push(...sectionResult.warnings)
    })

    // Calculate overall completion
    const totalFields = results.reduce((sum, result) => sum + result.requiredFieldsCount, 0)
    const completedFields = results.reduce((sum, result) => sum + result.completedFieldsCount, 0)
    const completionPercentage = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0

    // Identify missing sections and fields
    const missingSections = results.filter(r => !r.isComplete).map(r => r.sectionId)
    const missingRequiredFields: string[] = []

    results.forEach(result => {
      const section = this.template.sections[result.sectionId as keyof typeof this.template.sections]
      section.fields.forEach(field => {
        if (field.required && !assessmentData[result.sectionId]?.[field.id]) {
          missingRequiredFields.push(`${result.sectionId}.${field.id}`)
        }
      })
    })

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
      completionPercentage,
      missingSections,
      missingRequiredFields
    }
  }

  /**
   * Validate individual section
   */
  validateSection(sectionId: string, sectionData: Record<string, unknown>): SectionValidationResult {
    const section = this.template.sections[sectionId as keyof typeof this.template.sections]
    if (!section) {
      return {
        sectionId,
        isComplete: false,
        requiredFieldsCount: 0,
        completedFieldsCount: 0,
        errors: [{ sectionId, message: `Unknown section: ${sectionId}`, severity: 'error' }],
        warnings: []
      }
    }

    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []
    let requiredFieldsCount = 0
    let completedFieldsCount = 0

    // Validate each field in the section
    section.fields.forEach(field => {
      if (field.required) {
        requiredFieldsCount++
      }

      const value = sectionData[field.id]
      const fieldValidation = this.validateField(sectionId, field, value)
      
      if (fieldValidation.isValid && value !== undefined && value !== null && value !== '') {
        if (field.required) {
          completedFieldsCount++
        }
      }

      errors.push(...fieldValidation.errors)
      warnings.push(...fieldValidation.warnings)
    })

    // Section-specific validation
    const sectionSpecificValidation = this.validateSectionSpecific(sectionId, sectionData)
    errors.push(...sectionSpecificValidation.errors)
    warnings.push(...sectionSpecificValidation.warnings)

    return {
      sectionId,
      isComplete: requiredFieldsCount === completedFieldsCount && errors.length === 0,
      requiredFieldsCount,
      completedFieldsCount,
      errors,
      warnings
    }
  }

  /**
   * Validate individual field
   */
  private validateField(
    sectionId: string, 
    field: { id: string; label: string; type: string; required?: boolean; options?: string[] }, 
    value: unknown
  ): { isValid: boolean; errors: ValidationError[]; warnings: ValidationWarning[] } {
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []

    // Required field validation
    if (field.required && (value === undefined || value === null || value === '')) {
      errors.push({
        sectionId,
        fieldId: field.id,
        message: `${field.label} is required`,
        severity: 'error'
      })
      return { isValid: false, errors, warnings }
    }

    // Skip validation for empty optional fields
    if (!field.required && (value === undefined || value === null || value === '')) {
      return { isValid: true, errors, warnings }
    }

    // Type-specific validation
    switch (field.type) {
      case 'text':
        this.validateTextField(sectionId, field, value as string, errors, warnings)
        break
      case 'textarea':
        this.validateTextareaField(sectionId, field, value as string, errors, warnings)
        break
      case 'select':
        this.validateSelectField(sectionId, field, value as string, errors, warnings)
        break
      case 'multiselect':
        this.validateMultiselectField(sectionId, field, value as string[], errors, warnings)
        break
      case 'radio':
        this.validateRadioField(sectionId, field, value as string, errors, warnings)
        break
      case 'checkbox':
        this.validateCheckboxField(sectionId, field, value as boolean, errors, warnings)
        break
    }

    return { isValid: errors.length === 0, errors, warnings }
  }

  /**
   * Text field validation
   */
  private validateTextField(
    sectionId: string, 
    field: any, 
    value: string, 
    errors: ValidationError[], 
    warnings: ValidationWarning[]
  ) {
    if (typeof value !== 'string') {
      errors.push({
        sectionId,
        fieldId: field.id,
        message: `${field.label} must be text`,
        severity: 'error'
      })
      return
    }

    // Length validation
    if (value.length < 3) {
      warnings.push({
        sectionId,
        fieldId: field.id,
        message: `${field.label} is very short`,
        suggestion: 'Consider providing more detailed information'
      })
    }

    if (field.id === 'processing_name' && value.length < 5) {
      warnings.push({
        sectionId,
        fieldId: field.id,
        message: 'Processing activity name is too short',
        suggestion: 'Use a descriptive name that clearly identifies the processing activity'
      })
    }
  }

  /**
   * Textarea field validation
   */
  private validateTextareaField(
    sectionId: string, 
    field: any, 
    value: string, 
    errors: ValidationError[], 
    warnings: ValidationWarning[]
  ) {
    if (typeof value !== 'string') {
      errors.push({
        sectionId,
        fieldId: field.id,
        message: `${field.label} must be text`,
        severity: 'error'
      })
      return
    }

    // Content quality validation
    if (value.length < 20) {
      warnings.push({
        sectionId,
        fieldId: field.id,
        message: `${field.label} needs more detail`,
        suggestion: 'Provide more comprehensive information for better DPIA quality'
      })
    }

    if (value.length > 5000) {
      warnings.push({
        sectionId,
        fieldId: field.id,
        message: `${field.label} is very long`,
        suggestion: 'Consider breaking down into smaller, more focused descriptions'
      })
    }
  }

  /**
   * Select field validation
   */
  private validateSelectField(
    sectionId: string, 
    field: any, 
    value: string, 
    errors: ValidationError[], 
    warnings: ValidationWarning[]
  ) {
    if (!field.options || !field.options.includes(value)) {
      errors.push({
        sectionId,
        fieldId: field.id,
        message: `Invalid option selected for ${field.label}`,
        severity: 'error'
      })
    }
  }

  /**
   * Multiselect field validation
   */
  private validateMultiselectField(
    sectionId: string, 
    field: any, 
    value: string[], 
    errors: ValidationError[], 
    warnings: ValidationWarning[]
  ) {
    if (!Array.isArray(value)) {
      errors.push({
        sectionId,
        fieldId: field.id,
        message: `${field.label} must be an array`,
        severity: 'error'
      })
      return
    }

    // Check for invalid options
    const invalidOptions = value.filter(v => !field.options.includes(v))
    if (invalidOptions.length > 0) {
      errors.push({
        sectionId,
        fieldId: field.id,
        message: `Invalid options selected: ${invalidOptions.join(', ')}`,
        severity: 'error'
      })
    }

    // Provide suggestions for common scenarios
    if (field.id === 'risk_scenarios' && value.length < 2) {
      warnings.push({
        sectionId,
        fieldId: field.id,
        message: 'Consider identifying multiple risk scenarios',
        suggestion: 'Most processing activities have several potential risks'
      })
    }
  }

  /**
   * Radio field validation
   */
  private validateRadioField(
    sectionId: string, 
    field: any, 
    value: string, 
    errors: ValidationError[], 
    warnings: ValidationWarning[]
  ) {
    if (!field.options || !field.options.includes(value)) {
      errors.push({
        sectionId,
        fieldId: field.id,
        message: `Invalid option selected for ${field.label}`,
        severity: 'error'
      })
    }
  }

  /**
   * Checkbox field validation
   */
  private validateCheckboxField(
    sectionId: string, 
    field: any, 
    value: boolean, 
    errors: ValidationError[], 
    warnings: ValidationWarning[]
  ) {
    if (typeof value !== 'boolean') {
      errors.push({
        sectionId,
        fieldId: field.id,
        message: `${field.label} must be true or false`,
        severity: 'error'
      })
    }
  }

  /**
   * Section-specific business logic validation
   */
  private validateSectionSpecific(
    sectionId: string, 
    sectionData: Record<string, unknown>
  ): { errors: ValidationError[]; warnings: ValidationWarning[] } {
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []

    switch (sectionId) {
      case 'context_scope':
        this.validateContextScope(sectionData, errors, warnings)
        break
      case 'data_flow_processing':
        this.validateDataFlow(sectionData, errors, warnings)
        break
      case 'risk_assessment':
        this.validateRiskAssessment(sectionData, errors, warnings)
        break
      case 'mitigation_measures':
        this.validateMitigationMeasures(sectionData, errors, warnings)
        break
    }

    return { errors, warnings }
  }

  /**
   * Context & Scope specific validation
   */
  private validateContextScope(
    data: Record<string, unknown>, 
    errors: ValidationError[], 
    warnings: ValidationWarning[]
  ) {
    // Special categories validation
    if (data.special_categories_processed === 'Yes' && data.legal_basis === 'Consent (Art. 6(1)(a))') {
      warnings.push({
        sectionId: 'context_scope',
        message: 'Special categories require additional legal basis under Article 9',
        suggestion: 'Ensure you have a valid Article 9 condition for processing special categories'
      })
    }

    // International transfers validation
    if (Array.isArray(data.data_processing_location)) {
      const locations = data.data_processing_location as string[]
      if (locations.some(loc => ['United States', 'Other Third Countries'].includes(loc))) {
        warnings.push({
          sectionId: 'context_scope',
          message: 'International data transfers detected',
          suggestion: 'Ensure appropriate safeguards are in place for transfers outside EU/EEA'
        })
      }
    }
  }

  /**
   * Data Flow specific validation
   */
  private validateDataFlow(
    data: Record<string, unknown>, 
    errors: ValidationError[], 
    warnings: ValidationWarning[]
  ) {
    // Processors validation
    if (data.processors_involved === 'Yes, one or more processors' && !data.processors_description) {
      errors.push({
        sectionId: 'data_flow_processing',
        fieldId: 'processors_description',
        message: 'Processor description required when processors are involved',
        severity: 'error'
      })
    }

    // Storage security validation
    if (Array.isArray(data.storage_security_level)) {
      const measures = data.storage_security_level as string[]
      if (measures.includes('No specific protection measures')) {
        warnings.push({
          sectionId: 'data_flow_processing',
          message: 'No security measures specified',
          suggestion: 'Consider implementing encryption and access controls'
        })
      }
    }
  }

  /**
   * Risk Assessment specific validation
   */
  private validateRiskAssessment(
    data: Record<string, unknown>, 
    errors: ValidationError[], 
    warnings: ValidationWarning[]
  ) {
    // Risk score validation
    const likelihood = data.risk_likelihood as string
    const impact = data.risk_impact as string

    if (likelihood && impact) {
      const likelihoodNum = parseInt(likelihood.split(' - ')[0])
      const impactNum = parseInt(impact.split(' - ')[0])
      const riskScore = likelihoodNum * impactNum

      if (riskScore >= 15) {
        warnings.push({
          sectionId: 'risk_assessment',
          message: 'High risk score detected',
          suggestion: 'Consider if prior consultation with supervisory authority is needed'
        })
      }
    }

    // Vulnerable subjects validation
    if (data.vulnerable_data_subjects !== 'No' && data.high_risk_remains !== 'No') {
      warnings.push({
        sectionId: 'risk_assessment',
        message: 'Vulnerable subjects with remaining high risk',
        suggestion: 'Extra attention required for mitigation measures'
      })
    }
  }

  /**
   * Mitigation Measures specific validation
   */
  private validateMitigationMeasures(
    data: Record<string, unknown>, 
    errors: ValidationError[], 
    warnings: ValidationWarning[]
  ) {
    // Technical measures validation
    if (Array.isArray(data.technical_measures)) {
      const measures = data.technical_measures as string[]
      if (measures.length < 3) {
        warnings.push({
          sectionId: 'mitigation_measures',
          message: 'Consider implementing more technical measures',
          suggestion: 'Multiple layered security controls provide better protection'
        })
      }
    }

    // Residual risk validation
    const residualLikelihood = data.residual_likelihood as string
    const residualImpact = data.residual_impact as string

    if (residualLikelihood && residualImpact) {
      const likelihoodNum = parseInt(residualLikelihood.split(' - ')[0])
      const impactNum = parseInt(residualImpact.split(' - ')[0])
      const residualScore = likelihoodNum * impactNum

      if (residualScore >= 12) {
        warnings.push({
          sectionId: 'mitigation_measures',
          message: 'Residual risk remains high',
          suggestion: 'Consider additional mitigation measures or supervisory authority consultation'
        })
      }
    }

    // Consultation validation
    if (data.high_residual_risk_remains === 'Yes' && data.consultation_decision === 'Not needed') {
      warnings.push({
        sectionId: 'mitigation_measures',
        message: 'High residual risk but no consultation planned',
        suggestion: 'Consider if prior consultation is actually required under Article 36'
      })
    }
  }
}

// Singleton instance
export const templateValidator = new TemplateValidator()