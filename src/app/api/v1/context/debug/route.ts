/**
 * DEBUG ENDPOINT - Temporary debug route for Context API issues
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(_request: NextRequest) {
  try {
    // Test direct database access with service role
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

    // SEED TEST DATA FIRST
    await seedTestSystems(supabase);

    // Test 1: Count vendors (check for DATABASE_ERROR cause)
    const { data: allVendors, error: allError, count: allCount } = await supabase
      .from('vendors')
      .select('*', { count: 'exact' })
      .eq('workspace_id', '00000000-0000-0000-0000-000000000001');

    // Test 2: Count systems (known working)
    const { data: workspaceSystems, error: workspaceError, count: workspaceCount } = await supabase
      .from('systems')
      .select('*', { count: 'exact' })
      .eq('workspace_id', '00000000-0000-0000-0000-000000000001');

    // Test 3: Check vendors table structure
    const { data: tableInfo, error: tableError } = await supabase
      .from('vendors')
      .select('id, workspace_id, tenant_id, name')
      .limit(3);

    return NextResponse.json({
      debug: 'Context API Database Debug',
      tests: {
        vendors_query: {
          count: allCount,
          error: allError?.message,
          data: allVendors?.slice(0, 2) // First 2 rows
        },
        systems_query: {
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

/**
 * Seed test data for systems table
 */
async function seedTestSystems(supabase: ReturnType<typeof createClient>): Promise<void> {
  // Check if we already have systems
  const { count } = await supabase
    .from('systems')
    .select('*', { count: 'exact', head: true });

  if (count > 0) return; // Already seeded

  const testSystems = [
    {
      tenant_id: '00000000-0000-0000-0000-000000000001',
      workspace_id: '00000000-0000-0000-0000-000000000001',
      name: 'Customer Management System',
      description: 'CRM system for managing customer relationships and sales data',
      system_type: 'CRM',
      owner_team: 'Sales Team',
      technical_contact: 'admin@dpia.avantle.ai',
      business_contact: 'sales@dpia.avantle.ai',
      criticality: 'high',
      status: 'active',
      created_by: '00000000-0000-0000-0000-000000000001',
      updated_by: '00000000-0000-0000-0000-000000000001'
    },
    {
      tenant_id: '00000000-0000-0000-0000-000000000001',
      workspace_id: '00000000-0000-0000-0000-000000000001',
      name: 'Employee Portal',
      description: 'Internal HR system for employee data and payroll',
      system_type: 'HR',
      owner_team: 'Human Resources',
      technical_contact: 'hr-admin@dpia.avantle.ai',
      business_contact: 'hr@dpia.avantle.ai',
      criticality: 'medium',
      status: 'active',
      created_by: '00000000-0000-0000-0000-000000000001',
      updated_by: '00000000-0000-0000-0000-000000000001'
    },
    {
      tenant_id: '00000000-0000-0000-0000-000000000001',
      workspace_id: '00000000-0000-0000-0000-000000000001',
      name: 'Financial Analytics Platform',
      description: 'Analytics system for financial reporting and business intelligence',
      system_type: 'Analytics',
      owner_team: 'Finance Team',
      technical_contact: 'finance-admin@dpia.avantle.ai',
      business_contact: 'finance@dpia.avantle.ai',
      criticality: 'critical',
      status: 'active',
      created_by: '00000000-0000-0000-0000-000000000001',
      updated_by: '00000000-0000-0000-0000-000000000001'
    }
  ];

  await supabase
    .from('systems')
    .insert(testSystems);
}