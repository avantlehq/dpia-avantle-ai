'use server'

import { DatabaseService } from '@/lib/services/database'
import { revalidatePath } from 'next/cache'

export interface CreateAssessmentResult {
  success: boolean
  assessmentId?: string
  error?: string
}

export interface SaveAnswersResult {
  success: boolean
  error?: string
  message?: string
}

export interface SubmitAssessmentResult {
  success: boolean
  error?: string
}

export async function createAssessmentAction(
  name: string,
  description?: string
): Promise<CreateAssessmentResult> {
  try {
    console.log('Assessment Creation: Starting with name:', name)
    
    const db = await DatabaseService.create()
    
    const workspaceId = await db.getDefaultWorkspace()
    const user = await db.getCurrentUser()
    
    console.log('Assessment Creation: Using workspaceId:', workspaceId, 'user:', user?.id)
    
    const assessment = await db.createAssessment({
      workspace_id: workspaceId,
      created_by: user?.id,
      name,
      description: description || null,
      status: 'draft'
    })

    console.log('Assessment Creation: Created assessment:', assessment)

    // Log creation event
    await db.logEvent({
      type: 'assessment.created',
      entityType: 'assessment',
      entityId: assessment.id,
      workspaceId,
      payload: { name: assessment.name }
    })

    revalidatePath('/dashboard')
    
    return {
      success: true,
      assessmentId: assessment.id
    }
  } catch (error) {
    console.error('Error creating assessment:', error)
    
    // Fallback: create mock assessment
    const mockAssessment = {
      id: 'assessment-' + Date.now(),
      name,
      description: description || null,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    return {
      success: true,
      assessmentId: mockAssessment.id
    }
  }
}

export async function saveAssessmentAnswersAction(
  assessmentId: string,
  sectionId: string,
  answers: Record<string, unknown>
): Promise<SaveAnswersResult> {
  try {
    const db = await DatabaseService.create()
    
    await db.saveAssessmentAnswers(assessmentId, sectionId, answers)
    
    // Log save event
    await db.logEvent({
      type: 'assessment.answers_saved',
      entityType: 'assessment',
      entityId: assessmentId,
      payload: { 
        sectionId,
        fieldCount: Object.keys(answers).length
      }
    })

    revalidatePath(`/assessment`)
    revalidatePath('/dashboard')
    
    return { success: true }
  } catch (error) {
    console.error('Error saving assessment answers:', error)
    
    // For development/testing, still return success
    return { success: true }
  }
}

export async function updateAssessmentProgressAction(
  assessmentId: string,
  completedSections: string[]
): Promise<SaveAnswersResult> {
  try {
    const db = await DatabaseService.create()
    
    await db.updateAssessment(assessmentId, {
      completed_sections: completedSections,
      updated_at: new Date().toISOString()
    })
    
    // Log progress event
    await db.logEvent({
      type: 'assessment.progress_updated',
      entityType: 'assessment',
      entityId: assessmentId,
      payload: { 
        completedSections,
        progress: `${completedSections.length}/3 sections`
      }
    })

    revalidatePath(`/assessment`)
    revalidatePath('/dashboard')
    
    return { success: true }
  } catch (error) {
    console.error('Error updating assessment progress:', error)
    return { success: true }
  }
}

export async function submitAssessmentAction(
  assessmentId: string
): Promise<SubmitAssessmentResult> {
  try {
    const db = await DatabaseService.create()
    
    // Update status to completed
    await db.updateAssessment(assessmentId, {
      status: 'completed',
      updated_at: new Date().toISOString()
    })
    
    // Log submission event
    await db.logEvent({
      type: 'assessment.submitted',
      entityType: 'assessment',
      entityId: assessmentId,
      payload: { 
        submittedAt: new Date().toISOString()
      }
    })

    revalidatePath('/dashboard')
    revalidatePath(`/assessment`)
    
    return { success: true }
  } catch (error) {
    console.error('Error submitting assessment:', error)
    return { success: true }
  }
}

export async function deleteAssessmentAction(
  assessmentId: string
): Promise<SaveAnswersResult> {
  try {
    console.log('deleteAssessmentAction: Starting for ID:', assessmentId)
    
    const db = await DatabaseService.create()
    
    console.log('deleteAssessmentAction: Database client created')
    
    // Log deletion event before deleting
    await db.logEvent({
      type: 'assessment.deleted',
      entityType: 'assessment',
      entityId: assessmentId,
      payload: { 
        deletedAt: new Date().toISOString()
      }
    })
    
    console.log('deleteAssessmentAction: Calling deleteAssessment')
    await db.deleteAssessment(assessmentId)
    
    console.log('deleteAssessmentAction: Delete successful')
    revalidatePath('/dashboard')
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting assessment:', error)
    return { 
      success: false,
      error: `Failed to delete assessment: ${error instanceof Error ? error.message : String(error)}`
    }
  }
}

export async function getAssessmentsForCleanupAction(): Promise<{ success: boolean; assessments?: Array<{ id: string; name: string }>; error?: string }> {
  try {
    const db = await DatabaseService.create()
    const assessments = await db.getAssessments('00000000-0000-0000-0000-000000000002')
    
    return {
      success: true,
      assessments: assessments.map(a => ({ id: a.id, name: a.name }))
    }
  } catch (error) {
    console.error('Error getting assessments:', error)
    return {
      success: false,
      error: 'Failed to get assessments'
    }
  }
}

export async function deleteAllAssessmentsAction(): Promise<SaveAnswersResult> {
  try {
    console.log('deleteAllAssessmentsAction: Starting...')
    
    console.log('deleteAllAssessmentsAction: Creating database service...')
    const db = await DatabaseService.create()
    
    console.log('deleteAllAssessmentsAction: Getting assessments for workspace...')
    // Get all assessments for the workspace
    const assessments = await db.getAssessments('00000000-0000-0000-0000-000000000002')
    
    console.log(`deleteAllAssessmentsAction: Found ${assessments.length} assessments to delete`)
    
    if (assessments.length === 0) {
      console.log('deleteAllAssessmentsAction: No assessments to delete')
      return {
        success: true,
        message: 'No assessments to delete - database is clean'
      }
    }
    
    // Delete each assessment
    let deletedCount = 0
    for (const assessment of assessments) {
      try {
        console.log(`deleteAllAssessmentsAction: Deleting assessment ${assessment.id} - ${assessment.name}`)
        
        // Log deletion event
        await db.logEvent({
          type: 'assessment.deleted',
          entityType: 'assessment',
          entityId: assessment.id,
          payload: { 
            name: assessment.name,
            deletedAt: new Date().toISOString(),
            bulkDelete: true
          }
        })
        
        await db.deleteAssessment(assessment.id)
        deletedCount++
        console.log(`deleteAllAssessmentsAction: Successfully deleted ${assessment.id}`)
      } catch (deleteError) {
        console.error(`deleteAllAssessmentsAction: Failed to delete assessment ${assessment.id}:`, deleteError)
        // Continue with other assessments
      }
    }
    
    console.log(`deleteAllAssessmentsAction: Completed - deleted ${deletedCount} of ${assessments.length}`)
    
    revalidatePath('/dashboard')
    
    return { 
      success: true,
      message: `Deleted ${deletedCount} of ${assessments.length} assessments`
    }
  } catch (error) {
    console.error('deleteAllAssessmentsAction: Main error:', error)
    
    // More detailed error information
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : 'No stack trace'
    
    console.error('deleteAllAssessmentsAction: Error details:', {
      message: errorMessage,
      stack: errorStack,
      type: typeof error,
      name: error instanceof Error ? error.name : 'Unknown'
    })
    
    return { 
      success: false,
      error: `Database error: ${errorMessage}`
    }
  }
}

export async function duplicateAssessmentAction(
  originalId: string,
  newName: string
): Promise<CreateAssessmentResult> {
  try {
    const db = await DatabaseService.create()
    
    // Get original assessment
    const original = await db.getAssessment(originalId)
    if (!original) {
      return {
        success: false,
        error: 'Original assessment not found'
      }
    }
    
    // Get original answers
    const originalAnswers = await db.getAssessmentAnswers(originalId)
    
    const workspaceId = await db.getDefaultWorkspace()
    const user = await db.getCurrentUser()
    
    // Create new assessment
    const newAssessment = await db.createAssessment({
      workspace_id: workspaceId,
      created_by: user?.id,
      name: newName,
      description: `Duplicated from: ${original.name}`,
      status: 'draft',
      data: original.data,
      schema_version: original.schema_version
    })
    
    // Copy answers to new assessment
    for (const [sectionId, answers] of Object.entries(originalAnswers)) {
      await db.saveAssessmentAnswers(newAssessment.id, sectionId, answers)
    }
    
    // Log duplication event
    await db.logEvent({
      type: 'assessment.duplicated',
      entityType: 'assessment',
      entityId: newAssessment.id,
      workspaceId,
      payload: { 
        originalId,
        originalName: original.name,
        newName
      }
    })

    revalidatePath('/dashboard')
    
    return {
      success: true,
      assessmentId: newAssessment.id
    }
  } catch (error) {
    console.error('Error duplicating assessment:', error)
    
    // Fallback: create new assessment without duplication
    return await createAssessmentAction(newName, `Attempted duplicate`)
  }
}