import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    console.log('DB Test: Starting database connection test...')
    
    // Test environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY
    const jwtSecret = process.env.JWT_SECRET
    
    console.log('Environment variables check:', {
      supabaseUrl: supabaseUrl ? 'SET' : 'MISSING',
      anonKey: supabaseAnonKey ? `SET (${supabaseAnonKey.substring(0, 10)}...)` : 'MISSING',
      serviceRole: supabaseServiceRole ? `SET (${supabaseServiceRole.substring(0, 10)}...)` : 'MISSING',
      jwtSecret: jwtSecret ? `SET (${jwtSecret.substring(0, 8)}...)` : 'MISSING'
    })

    // Test Supabase client creation
    const supabase = await createServerClient()
    
    if (!supabase) {
      return NextResponse.json({
        error: 'Failed to create Supabase client',
        envCheck: {
          supabaseUrl: supabaseUrl ? 'SET' : 'MISSING',
          anonKey: supabaseAnonKey ? 'SET' : 'MISSING',
          serviceRole: supabaseServiceRole ? 'SET' : 'MISSING',
          jwtSecret: jwtSecret ? 'SET' : 'MISSING'
        }
      }, { status: 500 })
    }

    console.log('DB Test: Supabase client created successfully')

    // Test basic query
    const { data: assessments, error: queryError } = await supabase
      .from('assessments')
      .select('id, name, status')
      .eq('workspace_id', '00000000-0000-0000-0000-000000000002')
      .limit(5)
    
    if (queryError) {
      console.error('DB Test: Query error:', queryError)
      return NextResponse.json({
        error: 'Query failed',
        details: queryError.message,
        code: queryError.code,
        envCheck: {
          supabaseUrl: supabaseUrl ? 'SET' : 'MISSING',
          anonKey: supabaseAnonKey ? 'SET' : 'MISSING',
          serviceRole: supabaseServiceRole ? 'SET' : 'MISSING',
          jwtSecret: jwtSecret ? 'SET' : 'MISSING'
        }
      }, { status: 500 })
    }

    console.log('DB Test: Query successful, found', assessments?.length || 0, 'assessments')

    return NextResponse.json({
      success: true,
      message: 'Database connection working!',
      assessmentsFound: assessments?.length || 0,
      assessments: assessments?.map((a: any) => ({ id: a.id, name: a.name, status: a.status })),
      envCheck: {
        supabaseUrl: supabaseUrl ? 'SET' : 'MISSING',
        anonKey: supabaseAnonKey ? 'SET' : 'MISSING',
        serviceRole: supabaseServiceRole ? 'SET' : 'MISSING',
        jwtSecret: jwtSecret ? 'SET' : 'MISSING'
      }
    })

  } catch (error) {
    console.error('DB Test: Main error:', error)
    return NextResponse.json({
      error: 'Database test failed',
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'No stack'
    }, { status: 500 })
  }
}