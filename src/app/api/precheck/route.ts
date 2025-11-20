import { NextRequest, NextResponse } from 'next/server'
import { precheckEngine } from '@/lib/precheck/engine'
import { precheckSubmissionSchema } from '@/lib/validations/precheck'

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validatedData = precheckSubmissionSchema.parse(body)

    // Validate submission completeness
    const validation = precheckEngine.validateSubmission(validatedData.answers)
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          error: 'Incomplete submission', 
          missingQuestions: validation.missingQuestions 
        },
        { status: 400 }
      )
    }

    // Evaluate answers
    const result = precheckEngine.evaluate(validatedData)

    // TODO: Save to database when auth system is implemented
    console.log('Precheck evaluation completed:', {
      score: result.score,
      result: result.result,
      timestamp: new Date().toISOString(),
      answers_count: Object.keys(validatedData.answers).length
    })

    return NextResponse.json({
      success: true,
      result,
    })

  } catch (error) {
    console.error('Pre-check API error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Assessment evaluation failed' },
      { status: 500 }
    )
  }
}

// Get template questions
export async function GET() {
  try {
    const questions = precheckEngine.getQuestions()
    const metadata = precheckEngine.getMetadata()

    return NextResponse.json({
      metadata,
      questions,
    })

  } catch (error) {
    console.error('Pre-check template API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}