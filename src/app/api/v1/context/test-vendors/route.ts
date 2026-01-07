/**
 * SIMPLE TEST - Direct vendors query
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

    // Simple vendors query
    const { data, error, count } = await supabase
      .from('vendors')
      .select('*', { count: 'exact' })
      .eq('workspace_id', '00000000-0000-0000-0000-000000000001')
      .limit(10);

    if (error) {
      return NextResponse.json({
        error: 'QUERY_ERROR',
        message: error.message,
        code: error.code,
        hint: error.hint
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      count,
      vendors: data
    });

  } catch (error) {
    return NextResponse.json({
      error: 'EXCEPTION',
      message: String(error)
    }, { status: 500 });
  }
}