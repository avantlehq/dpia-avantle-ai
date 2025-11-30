import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    console.log('Test API: Starting test')
    
    const supabase = await createServerClient()
    
    if (!supabase) {
      console.error('Test API: Failed to create Supabase client')
      return NextResponse.json({
        error: 'Database connection failed',
        step: 'client_creation'
      }, { status: 500 })
    }

    console.log('Test API: Supabase client created successfully')
    
    // Test basic query
    const { data, error } = await supabase
      .from('assessments')
      .select('count')
      .eq('workspace_id', '00000000-0000-0000-0000-000000000002')
    
    if (error) {
      console.error('Test API: Query error:', error)
      return NextResponse.json({
        error: 'Query failed',
        details: error.message,
        step: 'query_execution'
      }, { status: 500 })
    }

    console.log('Test API: Query successful, data:', data)
    
    return NextResponse.json({
      success: true,
      message: 'Database connection working',
      queryResult: data
    })

  } catch (error) {
    console.error('Test API: Main error:', error)
    return NextResponse.json({
      error: 'Test failed',
      details: error instanceof Error ? error.message : String(error),
      step: 'main_catch'
    }, { status: 500 })
  }
}