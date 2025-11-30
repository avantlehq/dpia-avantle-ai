import { NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/services/database'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Simple security check
    if (body.confirm !== 'DELETE_ALL_ASSESSMENTS') {
      return NextResponse.json(
        { error: 'Invalid confirmation' },
        { status: 400 }
      )
    }

    const db = await DatabaseService.create()
    
    // Get all assessments for the workspace
    const assessments = await db.getAssessments('00000000-0000-0000-0000-000000000002')
    
    console.log(`Found ${assessments.length} assessments to delete`)
    
    // Delete each assessment
    for (const assessment of assessments) {
      await db.deleteAssessment(assessment.id)
      console.log(`Deleted assessment: ${assessment.id} - ${assessment.name}`)
    }
    
    return NextResponse.json({
      success: true,
      deleted: assessments.length,
      message: `Successfully deleted ${assessments.length} assessments`
    })

  } catch (error) {
    console.error('Cleanup error:', error)
    return NextResponse.json(
      { error: 'Failed to cleanup assessments' },
      { status: 500 }
    )
  }
}