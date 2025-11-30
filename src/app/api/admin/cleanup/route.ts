import { NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/services/database'

export async function POST(request: Request) {
  try {
    console.log('Cleanup API: Starting cleanup process')
    
    const body = await request.json()
    console.log('Cleanup API: Request body received')
    
    // Simple security check
    if (body.confirm !== 'DELETE_ALL_ASSESSMENTS') {
      console.log('Cleanup API: Invalid confirmation:', body.confirm)
      return NextResponse.json(
        { error: 'Invalid confirmation' },
        { status: 400 }
      )
    }

    console.log('Cleanup API: Creating database service')
    const db = await DatabaseService.create()
    
    console.log('Cleanup API: Getting assessments for workspace')
    // Get all assessments for the workspace
    const assessments = await db.getAssessments('00000000-0000-0000-0000-000000000002')
    
    console.log(`Cleanup API: Found ${assessments.length} assessments to delete`)
    
    // Delete each assessment
    let deletedCount = 0
    for (const assessment of assessments) {
      try {
        console.log(`Cleanup API: Deleting assessment ${assessment.id} - ${assessment.name}`)
        await db.deleteAssessment(assessment.id)
        deletedCount++
        console.log(`Cleanup API: Successfully deleted ${assessment.id}`)
      } catch (deleteError) {
        console.error(`Cleanup API: Failed to delete assessment ${assessment.id}:`, deleteError)
        // Continue with other assessments
      }
    }
    
    console.log(`Cleanup API: Successfully deleted ${deletedCount} of ${assessments.length} assessments`)
    
    return NextResponse.json({
      success: true,
      deleted: deletedCount,
      total: assessments.length,
      message: `Successfully deleted ${deletedCount} assessments`
    })

  } catch (error) {
    console.error('Cleanup API: Main error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to cleanup assessments',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}