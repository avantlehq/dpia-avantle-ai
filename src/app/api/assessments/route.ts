import { NextResponse } from 'next/server'

export async function GET() {
  // Mock assessments for now
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

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Mock assessment creation
    const mockAssessment = {
      id: 'assessment-' + Date.now(),
      name: body.name,
      description: body.description,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    return NextResponse.json({ assessment: mockAssessment }, { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}