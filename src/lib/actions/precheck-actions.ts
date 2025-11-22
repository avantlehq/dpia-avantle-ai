'use server'

import { DatabaseService } from '@/lib/services/database'
import { revalidatePath } from 'next/cache'

export interface PrecheckSubmissionResult {
  success: boolean
  result?: {
    requiresDPIA: boolean
    riskLevel: 'low' | 'medium' | 'high'
    score: number
    reasons: string[]
    recommendations: string[]
  }
  assessmentId?: string
  error?: string
}

export async function submitPrecheckAction(
  answers: Record<string, string | string[]>
): Promise<PrecheckSubmissionResult> {
  try {
    // Calculate DPIA necessity based on answers
    const result = calculatePrecheckResult(answers)
    
    const db = await DatabaseService.create()
    const workspaceId = await db.getDefaultWorkspace()
    const user = await db.getCurrentUser()
    
    // Save precheck assessment to database
    const precheckAssessment = await db.createPrecheckAssessment({
      workspaceId,
      answers,
      result
    })
    
    // Log precheck completion
    await db.logEvent({
      type: 'precheck.completed',
      entityType: 'precheck_assessment',
      entityId: precheckAssessment.id,
      workspaceId,
      payload: {
        requiresDPIA: result.requiresDPIA,
        riskLevel: result.riskLevel,
        score: result.score
      }
    })
    
    // If DPIA is required, we could automatically create a draft assessment
    let assessmentId: string | undefined
    if (result.requiresDPIA && result.riskLevel === 'high') {
      try {
        const assessment = await db.createAssessment({
          workspace_id: workspaceId,
          created_by: user?.id,
          name: `DPIA Assessment - ${new Date().toLocaleDateString()}`,
          description: 'Generated from precheck assessment',
          status: 'draft',
          precheck_result: result
        })
        
        assessmentId = assessment.id
        
        // Log auto-creation
        await db.logEvent({
          type: 'assessment.auto_created',
          entityType: 'assessment',
          entityId: assessment.id,
          workspaceId,
          payload: {
            fromPrecheckId: precheckAssessment.id,
            riskLevel: result.riskLevel
          }
        })
      } catch (error) {
        console.warn('Could not auto-create assessment:', error)
      }
    }
    
    revalidatePath('/precheck')
    revalidatePath('/dashboard')
    
    return {
      success: true,
      result,
      assessmentId
    }
  } catch (error) {
    console.error('Error submitting precheck:', error)
    
    // Fallback: calculate result without database
    const result = calculatePrecheckResult(answers)
    
    return {
      success: true,
      result
    }
  }
}

function calculatePrecheckResult(answers: Record<string, string | string[]>) {
  // GDPR Article 35 criteria for DPIA necessity
  const criteria = {
    systematicEvaluation: answers.automaticDecisionMaking === 'yes' || answers.profilingActivities === 'yes',
    largescaleProcessing: answers.dataVolume === 'large' || answers.geographicScope === 'multiple_countries',
    sensitiveData: answers.dataTypes?.includes('special_categories') || answers.dataTypes?.includes('criminal'),
    publiclyAccessible: answers.dataLocation?.includes('public_spaces'),
    newTechnology: answers.processingMethods?.includes('ai_ml') || answers.processingMethods?.includes('iot'),
    systematicMonitoring: answers.processingMethods?.includes('tracking') || answers.processingMethods?.includes('behavioral_analysis'),
    vulnerableDataSubjects: answers.dataSubjects?.includes('children') || answers.dataSubjects?.includes('employees') || answers.dataSubjects?.includes('vulnerable_groups'),
    innovativeUse: answers.processingMethods?.includes('blockchain') || answers.processingMethods?.includes('biometric')
  }
  
  // Count how many criteria are met
  const criteriaCount = Object.values(criteria).filter(Boolean).length
  
  // Calculate risk score (0-100)
  let score = 0
  
  // High-risk indicators (20 points each)
  if (criteria.systematicEvaluation) score += 20
  if (criteria.sensitiveData) score += 20
  if (criteria.newTechnology) score += 15
  if (criteria.systematicMonitoring) score += 15
  
  // Medium-risk indicators (10 points each)
  if (criteria.largescaleProcessing) score += 10
  if (criteria.vulnerableDataSubjects) score += 10
  if (criteria.publiclyAccessible) score += 5
  if (criteria.innovativeUse) score += 5
  
  // Determine risk level and DPIA requirement
  let riskLevel: 'low' | 'medium' | 'high'
  let requiresDPIA = false
  
  if (score >= 50 || criteriaCount >= 3) {
    riskLevel = 'high'
    requiresDPIA = true
  } else if (score >= 30 || criteriaCount >= 2) {
    riskLevel = 'medium'
    requiresDPIA = true
  } else {
    riskLevel = 'low'
    requiresDPIA = score >= 20 || criteriaCount >= 1
  }
  
  // Generate reasons based on criteria met
  const reasons = []
  if (criteria.systematicEvaluation) {
    reasons.push('Systematic evaluation of personal data for decision-making or profiling')
  }
  if (criteria.largescaleProcessing) {
    reasons.push('Large-scale processing of personal data')
  }
  if (criteria.sensitiveData) {
    reasons.push('Processing of special categories of personal data')
  }
  if (criteria.systematicMonitoring) {
    reasons.push('Systematic monitoring of publicly accessible areas')
  }
  if (criteria.newTechnology) {
    reasons.push('Use of new technologies (AI, ML, IoT)')
  }
  if (criteria.vulnerableDataSubjects) {
    reasons.push('Processing data of vulnerable data subjects')
  }
  if (criteria.innovativeUse) {
    reasons.push('Innovative use of technology (blockchain, biometrics)')
  }
  if (criteria.publiclyAccessible) {
    reasons.push('Processing in publicly accessible areas')
  }
  
  // Generate recommendations
  const recommendations = []
  
  if (requiresDPIA) {
    recommendations.push('Conduct a full Data Protection Impact Assessment (DPIA)')
    recommendations.push('Consult with your Data Protection Officer (DPO) if applicable')
    recommendations.push('Consider necessity and proportionality of the processing')
    
    if (riskLevel === 'high') {
      recommendations.push('Consider consulting with supervisory authorities before processing')
      recommendations.push('Implement additional safeguards and security measures')
      recommendations.push('Document all risk mitigation measures')
    }
    
    if (criteria.sensitiveData) {
      recommendations.push('Implement explicit consent mechanisms for special category data')
      recommendations.push('Apply additional security measures for sensitive data')
    }
    
    if (criteria.newTechnology) {
      recommendations.push('Conduct privacy by design assessment for new technologies')
      recommendations.push('Implement algorithmic transparency measures where applicable')
    }
    
    if (criteria.vulnerableDataSubjects) {
      recommendations.push('Implement additional protections for vulnerable data subjects')
      recommendations.push('Ensure appropriate consent mechanisms for vulnerable groups')
    }
  } else {
    recommendations.push('DPIA may not be required, but consider implementing privacy by design principles')
    recommendations.push('Document your assessment of DPIA necessity')
    recommendations.push('Regular review of processing activities as they evolve')
    recommendations.push('Maintain records of processing activities under Article 30 GDPR')
  }
  
  return {
    requiresDPIA,
    riskLevel,
    score,
    reasons: reasons.length > 0 ? reasons : ['Standard personal data processing activities'],
    recommendations
  }
}