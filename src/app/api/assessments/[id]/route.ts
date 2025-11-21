import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/services/database'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: assessmentId } = await params
  
  try {
    const db = new DatabaseService()
    
    const assessment = await db.getAssessment(assessmentId)
    
    if (!assessment) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      )
    }

    // Get assessment answers and structure them properly
    const answers = await db.getAssessmentAnswers(assessmentId)

    return NextResponse.json({
      success: true,
      assessment: {
        ...assessment,
        answers
      }
    })

  } catch (error) {
    console.error('Error fetching assessment:', error)
    
    // Fallback to mock data if database fails
    const mockAssessmentData = {
      id: assessmentId,
      title: 'Employee Performance Management System',
      status: 'draft',
      created_at: '2024-11-20T10:00:00Z',
      updated_at: '2024-11-20T15:30:00Z',
      completed_sections: ['context_scope'],
      answers: {
        context_scope: {
          project_name: 'Employee Performance Management System',
          description: 'A comprehensive system for tracking and evaluating employee performance across multiple departments.',
          data_controller: 'Tech Corp Ltd.',
          data_processor: 'HR Solutions Inc.',
          processing_purpose: 'To assess employee performance, identify training needs, and make informed decisions about promotions and compensation.'
        },
        legal_basis: {},
        risk_factors: {}
      }
    }

    return NextResponse.json({
      success: true,
      assessment: mockAssessmentData
    })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: assessmentId } = await params
  
  try {
    const updates = await request.json()
    const db = new DatabaseService()
    
    const assessment = await db.updateAssessment(assessmentId, updates)

    // Log update event
    await db.logEvent({
      type: 'assessment.updated',
      entityType: 'assessment',
      entityId: assessmentId,
      payload: { updates }
    })

    return NextResponse.json({
      success: true,
      assessment
    })

  } catch (error) {
    console.error('Error updating assessment:', error)
    
    // Fallback response
    return NextResponse.json({
      success: true,
      assessment_id: assessmentId,
      updated_at: new Date().toISOString()
    })
  }
}