import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    console.log('API-Direct: Starting direct assessment fetch...')
    
    // Use service role key to bypass RLS policies
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('API-Direct: Missing environment variables')
      return NextResponse.json({ 
        assessments: [],
        error: 'Configuration error',
        details: 'Missing Supabase environment variables'
      })
    }
    
    console.log('API-Direct: Creating service client...')
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })
    
    // Direct query to assessments table with hardcoded workspace ID
    console.log('API-Direct: Querying assessments directly...')
    const { data: assessments, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('workspace_id', '00000000-0000-0000-0000-000000000002') // Use default workspace
      .order('created_at', { ascending: false })
    
    console.log('API-Direct: Query result - error:', error)
    console.log('API-Direct: Query result - data count:', assessments?.length || 0)
    console.log('API-Direct: Assessment details:', assessments)
    
    if (error) {
      console.error('API-Direct: Database error:', error)
      return NextResponse.json({ 
        assessments: [],
        error: 'Database query failed',
        details: error.message
      })
    }
    
    console.log('API-Direct: Successfully fetched', assessments?.length || 0, 'assessments')
    return NextResponse.json({ assessments: assessments || [] })
    
  } catch (error) {
    console.error('API-Direct: Error:', error)
    return NextResponse.json({ 
      assessments: [],
      error: 'Service error',
      details: error instanceof Error ? error.message : String(error)
    })
  }
}