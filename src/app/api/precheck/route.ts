import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { precheckEngine } from '@/lib/precheck/engine'
import { precheckSubmissionSchema } from '@/lib/validations/precheck'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

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

    // Save pre-check to database
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: precheckData, error: insertError } = await (supabase as any)
      .from('assessment_precheck')
      .insert({
        user_id: user.id,
        answers: validatedData.answers,
        result: result.result,
        score: result.score,
        recommendation: result.recommendation,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error saving precheck:', insertError)
      return NextResponse.json(
        { error: 'Failed to save assessment' },
        { status: 500 }
      )
    }

    // Log audit event
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from('domain_events')
      .insert({
        type: 'dpia.precheck.completed',
        entity_id: precheckData.id,
        payload: {
          user_id: user.id,
          result: result.result,
          score: result.score,
        },
      })

    return NextResponse.json({
      success: true,
      precheck_id: precheckData.id,
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
      { error: 'Internal server error' },
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