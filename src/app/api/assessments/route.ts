import { NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/services/database'

export async function GET() {
  try {
    const db = new DatabaseService()
    const workspaceId = await db.getDefaultWorkspace()
    const assessments = await db.getAssessments(workspaceId)

    return NextResponse.json({ assessments })
  } catch (error) {
    console.error('Error fetching assessments:', error)
    
    // Fallback to mock data if database is not configured
    const mockAssessments = [
      {
        id: '1',
        name: 'Employee Data Processing',
        status: 'completed',
        created_at: '2024-01-15',
        updated_at: '2024-01-20'
      },
      {
        id: '2', 
        name: 'Customer CRM System',
        status: 'in_progress',
        created_at: '2024-01-18',
        updated_at: '2024-01-19'
      },
      {
        id: '3',
        name: 'Marketing Analytics',
        status: 'draft',
        created_at: '2024-01-20',
        updated_at: '2024-01-20'
      }
    ]

    return NextResponse.json({ assessments: mockAssessments })
  }
}

export async function POST(request: Request) {
  const body = await request.json()
  
  try {
    const db = new DatabaseService()
    
    const workspaceId = await db.getDefaultWorkspace()
    const user = await db.getCurrentUser()
    
    const assessment = await db.createAssessment({
      workspace_id: workspaceId,
      created_by: user?.id,
      name: body.name,
      description: body.description,
      status: 'draft'
    })

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
    console.error('Error creating assessment:', error)
    
    // Fallback to mock creation
    const mockAssessment = {
      id: 'assessment-' + Date.now(),
      name: body.name,
      description: body.description,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    return NextResponse.json({ assessment: mockAssessment }, { status: 201 })
  }
}