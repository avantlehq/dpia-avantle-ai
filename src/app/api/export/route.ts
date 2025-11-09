import { NextResponse } from 'next/server'
import { exportService } from '@/lib/services/export'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Generate export (mock for now)
    const result = await exportService.generate(body)

    return NextResponse.json({
      export: result,
      assessment: {
        id: body.assessment_id,
        name: 'Mock Assessment'
      }
    })
  } catch (error) {
    console.error('Export API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}