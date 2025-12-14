'use server'

import { DatabaseService } from '@/lib/services/database'
import { precheckEngine } from '@/lib/precheck/engine'
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
    // Use precheck engine to evaluate answers properly
    const engineResult = precheckEngine.evaluate({ answers: answers as Record<string, string> })
    
    // Convert engine result to action result format
    const result = {
      requiresDPIA: engineResult.result !== 'not_required',
      riskLevel: engineResult.result === 'required' ? 'high' as const : 
                 engineResult.result === 'recommended' ? 'medium' as const : 'low' as const,
      score: engineResult.score,
      reasons: [engineResult.description],
      recommendations: engineResult.next_steps
    }
    
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
    
    // Fallback: use precheck engine without database
    const engineResult = precheckEngine.evaluate({ answers: answers as Record<string, string> })
    const result = {
      requiresDPIA: engineResult.result !== 'not_required',
      riskLevel: engineResult.result === 'required' ? 'high' as const : 
                 engineResult.result === 'recommended' ? 'medium' as const : 'low' as const,
      score: engineResult.score,
      reasons: [engineResult.description],
      recommendations: engineResult.next_steps
    }
    
    return {
      success: true,
      result
    }
  }
}

// Legacy function removed - now using precheckEngine for consistent scoring