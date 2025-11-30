import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    console.log('Cleanup API: Starting cleanup process')
    
    const body = await request.json()
    console.log('Cleanup API: Request body received')
    
    // Simple security check
    if (body.confirm !== 'DELETE_ALL_ASSESSMENTS') {
      console.log('Cleanup API: Invalid confirmation:', body.confirm)
      return NextResponse.json(
        { error: 'Invalid confirmation' },
        { status: 400 }
      )
    }

    console.log('Cleanup API: Creating Supabase client')
    const supabase = await createServerClient()
    
    if (!supabase) {
      console.error('Cleanup API: Failed to create Supabase client')
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    console.log('Cleanup API: Getting assessments from database')
    
    // Get all assessments directly from Supabase
    const { data: assessments, error: fetchError } = await supabase
      .from('assessments')
      .select('id, name')
      .eq('workspace_id', '00000000-0000-0000-0000-000000000002')
    
    if (fetchError) {
      console.error('Cleanup API: Error fetching assessments:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch assessments', details: fetchError.message },
        { status: 500 }
      )
    }

    console.log(`Cleanup API: Found ${assessments?.length || 0} assessments to delete`)
    
    if (!assessments || assessments.length === 0) {
      return NextResponse.json({
        success: true,
        deleted: 0,
        total: 0,
        message: 'No assessments to delete'
      })
    }
    
    // Delete all assessments at once
    const { error: deleteError } = await supabase
      .from('assessments')
      .delete()
      .eq('workspace_id', '00000000-0000-0000-0000-000000000002')
    
    if (deleteError) {
      console.error('Cleanup API: Error deleting assessments:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete assessments', details: deleteError.message },
        { status: 500 }
      )
    }
    
    console.log(`Cleanup API: Successfully deleted ${assessments.length} assessments`)
    
    return NextResponse.json({
      success: true,
      deleted: assessments.length,
      total: assessments.length,
      message: `Successfully deleted ${assessments.length} assessments`
    })

  } catch (error) {
    console.error('Cleanup API: Main error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to cleanup assessments',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}