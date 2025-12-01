import { NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/services/database'

export async function GET() {
  try {
    console.log('API: Starting to fetch assessments...')
    
    const db = await DatabaseService.create()
    console.log('API: Database service created')
    
    const workspaceId = await db.getDefaultWorkspace()
    console.log('API: Got workspace ID:', workspaceId)
    
    const assessments = await db.getAssessments(workspaceId)
    console.log('API: Fetched assessments:', assessments?.length || 0, 'items')
    console.log('API: Assessment details:', assessments)

    return NextResponse.json({ assessments: assessments || [] })
  } catch (error) {
    console.error('API: Error fetching assessments:', error)
    console.error('API: Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'No stack trace',
      type: typeof error,
      name: error instanceof Error ? error.name : 'Unknown'
    })
    
    // Return empty assessments instead of mock data
    console.log('API: Returning empty assessments due to database error')
    return NextResponse.json({ 
      assessments: [],
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : String(error)
    })
  }
}

export async function POST(request: Request) {
  const body = await request.json()
  
  try {
    console.log('API: Creating assessment:', body.name)
    
    const db = await DatabaseService.create()
    console.log('API: Database service created for POST')
    
    const workspaceId = await db.getDefaultWorkspace()
    const user = await db.getCurrentUser()
    console.log('API: Using workspace:', workspaceId, 'user:', user?.id)
    
    const assessment = await db.createAssessment({
      workspace_id: workspaceId,
      created_by: user?.id,
      name: body.name,
      description: body.description,
      status: 'draft'
    })

    console.log('API: Assessment created:', assessment)

    // Log creation event
    await db.logEvent({
      type: 'assessment.created',
      entityType: 'assessment',
      entityId: assessment.id,
      workspaceId,
      payload: { name: assessment.name }
    })

    return NextResponse.json({ assessment }, { status: 201 })
  } catch (error) {
    console.error('API: Error creating assessment:', error)
    console.error('API: Creation error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'No stack trace',
    })
    
    return NextResponse.json({ 
      error: 'Failed to create assessment',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}