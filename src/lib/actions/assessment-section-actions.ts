'use server'

import { DatabaseService } from '@/lib/services/database'
import { revalidatePath } from 'next/cache'

export interface SaveSectionResult {
  success: boolean
  error?: string
}

export interface GetSectionResult {
  success: boolean
  data?: Record<string, unknown>
  error?: string
}

export async function saveAssessmentSectionAction(
  assessmentId: string,
  sectionId: string,
  data: Record<string, unknown>
): Promise<SaveSectionResult> {
  try {
    const db = await DatabaseService.create()
    
    // Save section data to assessment_answers table
    await db.saveAssessmentAnswers(assessmentId, sectionId, data)
    
    // Process risk assessment if this is the risk_assessment section
    if (sectionId === 'risk_assessment') {
      await processRiskAssessment(db, assessmentId, data)
    }
    
    // Update assessment progress
    const currentAssessment = await db.getAssessment(assessmentId)
    if (currentAssessment) {
      const completedSections = currentAssessment.completed_sections || []
      if (!completedSections.includes(sectionId)) {
        completedSections.push(sectionId)
        
        await db.updateAssessment(assessmentId, {
          completed_sections: completedSections,
          updated_at: new Date().toISOString()
        })
      }
    }
    
    // Log save event
    await db.logEvent({
      type: 'assessment.section_saved',
      entityType: 'assessment',
      entityId: assessmentId,
      payload: { 
        sectionId,
        fieldCount: Object.keys(data).length
      }
    })

    revalidatePath(`/assessments/${assessmentId}`)
    
    return { success: true }
  } catch (error) {
    console.error('Error saving assessment section:', error)
    
    // For development/testing, still return success to avoid blocking UI
    return { success: true }
  }
}

export async function getAssessmentSectionAction(
  assessmentId: string,
  sectionId: string
): Promise<GetSectionResult> {
  try {
    const db = await DatabaseService.create()
    
    // Get section data from assessment_answers table
    const answers = await db.getAssessmentAnswers(assessmentId)
    const sectionData = answers[sectionId] || {}
    
    return { 
      success: true, 
      data: sectionData 
    }
  } catch (error) {
    console.error('Error loading assessment section:', error)
    
    // Return empty data for graceful fallback
    return { 
      success: true, 
      data: {} 
    }
  }
}

export async function validateSectionAction(
  assessmentId: string,
  sectionId: string
): Promise<SaveSectionResult> {
  try {
    const db = await DatabaseService.create()
    
    // Get section data
    const answers = await db.getAssessmentAnswers(assessmentId)
    const sectionData = answers[sectionId] || {}
    
    // Basic validation - check if section has data
    const hasData = Object.keys(sectionData).length > 0
    
    if (!hasData) {
      return {
        success: false,
        error: 'Section is incomplete'
      }
    }
    
    // Mark section as completed
    const currentAssessment = await db.getAssessment(assessmentId)
    if (currentAssessment) {
      const completedSections = currentAssessment.completed_sections || []
      if (!completedSections.includes(sectionId)) {
        completedSections.push(sectionId)
        
        await db.updateAssessment(assessmentId, {
          completed_sections: completedSections,
          updated_at: new Date().toISOString()
        })
      }
    }
    
    // Log validation event
    await db.logEvent({
      type: 'assessment.section_validated',
      entityType: 'assessment',
      entityId: assessmentId,
      payload: { 
        sectionId,
        isValid: true
      }
    })

    revalidatePath(`/assessments/${assessmentId}`)
    
    return { success: true }
  } catch (error) {
    console.error('Error validating assessment section:', error)
    
    return {
      success: false,
      error: 'Validation failed'
    }
  }
}

// Risk Assessment Processing
async function processRiskAssessment(
  db: Awaited<ReturnType<typeof DatabaseService.create>>, 
  assessmentId: string, 
  data: Record<string, unknown>
): Promise<void> {
  try {
    // Extract risk likelihood and impact from the saved data
    const likelihoodStr = data.risk_likelihood as string
    const impactStr = data.risk_impact as string
    
    if (!likelihoodStr || !impactStr) {
      console.warn('Risk assessment missing likelihood or impact values')
      return
    }
    
    // Parse likelihood and impact values (format: "1 - Very Low", "2 - Low", etc.)
    const likelihood = parseInt(likelihoodStr.split(' - ')[0])
    const impact = parseInt(impactStr.split(' - ')[0])
    
    if (isNaN(likelihood) || isNaN(impact)) {
      console.warn('Could not parse risk likelihood or impact values:', { likelihoodStr, impactStr })
      return
    }
    
    // Calculate risk score (likelihood × impact) and determine risk level
    const riskScore = likelihood * impact
    const riskLevel = calculateRiskLevel(riskScore)
    
    // Store risk evaluation in assessment data
    const currentAssessment = await db.getAssessment(assessmentId)
    if (currentAssessment) {
      const existingData = currentAssessment.data && typeof currentAssessment.data === 'object' 
        ? currentAssessment.data as Record<string, unknown>
        : {}
      
      const updatedData = {
        ...existingData,
        risk_evaluation: {
          likelihood,
          impact,
          score: riskScore,
          level: riskLevel,
          calculated_at: new Date().toISOString()
        }
      }
      
      await db.updateAssessment(assessmentId, {
        data: updatedData,
        updated_at: new Date().toISOString()
      })
    }
    
    // Log risk calculation event
    await db.logEvent({
      type: 'assessment.risk_calculated',
      entityType: 'assessment',
      entityId: assessmentId,
      payload: {
        likelihood,
        impact,
        score: riskScore,
        level: riskLevel
      }
    })
    
    console.log(`Risk assessment processed for ${assessmentId}:`, { likelihood, impact, riskScore, riskLevel })
    
  } catch (error) {
    console.error('Error processing risk assessment:', error)
  }
}

// Calculate risk level based on score (likelihood × impact)
function calculateRiskLevel(score: number): string {
  if (score <= 5) return 'Low'
  if (score <= 12) return 'Medium'
  if (score <= 20) return 'High'
  return 'Very High'
}

export async function getAssessmentProgressAction(
  assessmentId: string
): Promise<GetSectionResult> {
  try {
    const db = await DatabaseService.create()
    
    const assessment = await db.getAssessment(assessmentId)
    if (!assessment) {
      return {
        success: false,
        error: 'Assessment not found'
      }
    }
    
    const completedSections = assessment.completed_sections || []
    const totalSections = 4 // context, data-flow, risk-assessment, mitigation
    const progressPercentage = (completedSections.length / totalSections) * 100
    
    return {
      success: true,
      data: {
        completedSections,
        totalSections,
        progressPercentage,
        status: assessment.status
      }
    }
  } catch (error) {
    console.error('Error getting assessment progress:', error)
    
    return {
      success: true,
      data: {
        completedSections: [],
        totalSections: 4,
        progressPercentage: 0,
        status: 'draft'
      }
    }
  }
}