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
    
    // First, check ALL assessments in database to see what's there
    console.log('API-Direct: Querying ALL assessments in database...')
    const { data: allAssessments, error: allError } = await supabase
      .from('assessments')
      .select('*')
      .order('created_at', { ascending: false })
    
    console.log('API-Direct: ALL assessments query - error:', allError)
    console.log('API-Direct: ALL assessments count:', allAssessments?.length || 0)
    console.log('API-Direct: ALL assessments details:', allAssessments)
    
    if (allAssessments && allAssessments.length > 0) {
      console.log('API-Direct: Assessment workspace IDs found:', 
        allAssessments.map(a => ({ id: a.id, name: a.name, workspace_id: a.workspace_id })))
    }
    
    // Now query with specific workspace ID
    console.log('API-Direct: Querying assessments for workspace 00000000-0000-0000-0000-000000000002...')
    const { data: assessments, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('workspace_id', '00000000-0000-0000-0000-000000000002') // Use default workspace
      .order('created_at', { ascending: false })
    
    console.log('API-Direct: Workspace query - error:', error)
    console.log('API-Direct: Workspace query - data count:', assessments?.length || 0)
    console.log('API-Direct: Workspace assessment details:', assessments)
    
    // If no assessments for default workspace, try without workspace filter
    if (!assessments || assessments.length === 0) {
      console.log('API-Direct: No assessments found for default workspace, returning ALL assessments')
      return NextResponse.json({ 
        assessments: allAssessments || [],
        debug: {
          totalInDatabase: allAssessments?.length || 0,
          workspaceFiltered: assessments?.length || 0,
          defaultWorkspaceId: '00000000-0000-0000-0000-000000000002'
        }
      })
    }
    
    if (error) {
      console.error('API-Direct: Database error:', error)
      return NextResponse.json({ 
        assessments: [],
        error: 'Database query failed',
        details: error?.message || String(error)
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