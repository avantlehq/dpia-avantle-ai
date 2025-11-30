import { NextResponse } from 'next/server'
import { deleteAllAssessmentsAction } from '@/lib/actions/assessment-actions'

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

    console.log('Cleanup API: Calling server action')
    
    // Use the server action
    const result = await deleteAllAssessmentsAction()
    
    console.log('Cleanup API: Server action result:', result)
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message || 'Successfully deleted all assessments'
      })
    } else {
      return NextResponse.json(
        { 
          error: result.error || 'Failed to delete assessments'
        },
        { status: 500 }
      )
    }

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