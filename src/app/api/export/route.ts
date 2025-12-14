import { NextResponse } from 'next/server'
import { RealExportService } from '@/lib/services/export'
import { DatabaseService } from '@/lib/services/database'

// Handle GET requests (from Link navigation)
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const assessment_id = url.searchParams.get('assessment_id')
    const format = url.searchParams.get('format') || 'pdf'
    
    // Validate request
    if (!assessment_id) {
      return NextResponse.json(
        { error: 'Missing assessment_id parameter' },
        { status: 400 }
      )
    }

    if (!['pdf', 'docx'].includes(format)) {
      return NextResponse.json(
        { error: 'Invalid format. Must be pdf or docx' },
        { status: 400 }
      )
    }

    const body = { assessment_id, format: format as 'pdf' | 'docx' }

    try {
      // Generate PDF/DOCX file directly
      const exportService = await RealExportService.create()
      
      // Get assessment details for filename
      const db = await DatabaseService.create()
      const assessment = await db.getAssessment(body.assessment_id)
      const assessmentName = assessment?.name || 'Unknown Assessment'
      
      // Generate file buffer
      let fileBuffer: Uint8Array
      let contentType: string
      let filename: string
      
      if (body.format === 'pdf') {
        fileBuffer = await exportService.generatePDF(body.assessment_id)
        contentType = 'application/pdf'
        filename = `${assessmentName.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`
      } else {
        fileBuffer = await exportService.generateDOCX(body.assessment_id)
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        filename = `${assessmentName.replace(/[^a-zA-Z0-9]/g, '-')}.docx`
      }
      
      // Return file directly with proper headers
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Content-Length': fileBuffer.length.toString(),
          'Cache-Control': 'no-cache'
        }
      })

    } catch (exportError) {
      console.error('Export generation failed:', exportError)
      
      // Return error response
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to generate export file',
          details: exportError instanceof Error ? exportError.message : 'Unknown error'
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Export API GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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
      // Generate PDF/DOCX file directly
      const exportService = await RealExportService.create()
      
      // Get assessment details for filename
      const db = await DatabaseService.create()
      const assessment = await db.getAssessment(body.assessment_id)
      const assessmentName = assessment?.name || 'Unknown Assessment'
      
      // Generate file buffer
      let fileBuffer: Uint8Array
      let contentType: string
      let filename: string
      
      if (body.format === 'pdf') {
        fileBuffer = await exportService.generatePDF(body.assessment_id)
        contentType = 'application/pdf'
        filename = `${assessmentName.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`
      } else {
        fileBuffer = await exportService.generateDOCX(body.assessment_id)
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        filename = `${assessmentName.replace(/[^a-zA-Z0-9]/g, '-')}.docx`
      }
      
      // Return file directly with proper headers
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Content-Length': fileBuffer.length.toString(),
          'Cache-Control': 'no-cache'
        }
      })
      
    } catch (exportError) {
      console.error('Export generation failed:', exportError)
      
      // Return error response
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to generate export file',
          details: exportError instanceof Error ? exportError.message : 'Unknown error'
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Export API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}