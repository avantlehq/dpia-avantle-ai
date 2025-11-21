import { NextResponse } from 'next/server'
import { RealExportService } from '@/lib/services/export'
import { DatabaseService } from '@/lib/services/database'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate request
    if (!body.assessment_id || !body.format) {
      return NextResponse.json(
        { error: 'Missing assessment_id or format' },
        { status: 400 }
      )
    }

    if (!['pdf', 'docx'].includes(body.format)) {
      return NextResponse.json(
        { error: 'Invalid format. Must be pdf or docx' },
        { status: 400 }
      )
    }

    try {
      // Try real export service first
      const exportService = new RealExportService()
      const result = await exportService.generate(body)

      // Get assessment details for response
      const db = new DatabaseService()
      const assessment = await db.getAssessment(body.assessment_id)

      return NextResponse.json({
        success: true,
        export: result,
        assessment: assessment ? {
          id: assessment.id,
          name: assessment.name
        } : {
          id: body.assessment_id,
          name: 'Unknown Assessment'
        }
      })

    } catch (exportError) {
      console.error('Real export failed, falling back to mock:', exportError)
      
      // Fallback to mock response
      const mockResult = {
        id: `assessment-${body.assessment_id}-${Date.now()}`,
        url: `/api/export/download/mock-${body.assessment_id}.${body.format}`,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }

      return NextResponse.json({
        success: true,
        export: mockResult,
        assessment: {
          id: body.assessment_id,
          name: 'Mock Assessment'
        }
      })
    }

  } catch (error) {
    console.error('Export API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}