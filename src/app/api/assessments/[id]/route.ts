import { NextRequest, NextResponse } from 'next/server'

// Mock assessment data for development
const mockAssessmentData = {
  id: 'assessment_123',
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
  },
  risk_evaluation: {
    overall_score: 12,
    overall_level: 'medium',
    last_calculated: '2024-11-20T15:30:00Z'
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: assessmentId } = await params
    
    // TODO: Fetch from database when DB is implemented
    // For now, return mock data with the requested ID
    const assessment = {
      ...mockAssessmentData,
      id: assessmentId
    }

    return NextResponse.json({
      success: true,
      assessment
    })

  } catch (error) {
    console.error('Error fetching assessment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assessment' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: assessmentId } = await params
    const updates = await request.json()
    
    // TODO: Update assessment in database when DB is implemented
    console.log('Updating assessment:', {
      assessment_id: assessmentId,
      updates,
      updated_at: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      assessment_id: assessmentId,
      updated_at: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error updating assessment:', error)
    return NextResponse.json(
      { error: 'Failed to update assessment' },
      { status: 500 }
    )
  }
}