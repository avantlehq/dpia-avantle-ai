/**
 * DEBUG ENDPOINT - Temporary debug route for Context API issues
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    // Test direct database access with service role
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

    // Test 1: Count all systems (no filtering)
    const { data: allSystems, error: allError, count: allCount } = await supabase
      .from('systems')
      .select('*', { count: 'exact' });

    // Test 2: Count systems with default workspace filter
    const { data: workspaceSystems, error: workspaceError, count: workspaceCount } = await supabase
      .from('systems')
      .select('*', { count: 'exact' })
      .eq('workspace_id', '00000000-0000-0000-0000-000000000001');

    // Test 3: Check table structure
    const { data: tableInfo, error: tableError } = await supabase
      .from('systems')
      .select('id, workspace_id, tenant_id, name')
      .limit(3);

    return NextResponse.json({
      debug: 'Context API Database Debug',
      tests: {
        all_systems: {
          count: allCount,
          error: allError?.message,
          data: allSystems?.slice(0, 2) // First 2 rows
        },
        workspace_filtered: {
          count: workspaceCount,
          error: workspaceError?.message,
          data: workspaceSystems?.slice(0, 2)
        },
        table_structure: {
          error: tableError?.message,
          data: tableInfo
        }
      },
      environment: process.env.NODE_ENV,
      default_workspace: '00000000-0000-0000-0000-000000000001'
    });

  } catch (error) {
    return NextResponse.json({
      error: 'Debug failed',
      message: String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}