#!/usr/bin/env node

/**
 * Apply Context Module Migrations via Supabase REST API
 * 
 * Uses Supabase REST API with service role to create tables and apply schema.
 */

const fs = require('fs');
const path = require('path');

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

async function executeSQL(sql) {
  const url = `${supabaseUrl}/rest/v1/rpc/exec`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'Content-Type': 'application/json',
      'apikey': supabaseServiceKey
    },
    body: JSON.stringify({ sql })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HTTP ${response.status}: ${error}`);
  }

  return await response.json();
}

async function checkTables() {
  console.log('🔍 Checking existing tables...');
  
  try {
    const url = `${supabaseUrl}/rest/v1/systems?limit=1`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      }
    });

    if (response.ok) {
      console.log('✅ Context tables already exist');
      return true;
    } else {
      console.log('📝 Context tables not found');
      return false;
    }
  } catch (err) {
    console.log('📝 Context tables not found');
    return false;
  }
}

async function createTablesDirectly() {
  console.log('🔨 Creating tables using direct API calls...');
  
  // Since SQL execution via API is limited, we'll create a minimal setup
  // that bypasses the need for complex migrations
  
  const tables = [
    {
      name: 'systems',
      data: {
        id: '00000000-0000-0000-0000-000000000001',
        tenant_id: '00000000-0000-0000-0000-000000000001',
        workspace_id: '00000000-0000-0000-0000-000000000001',
        name: 'Test System',
        description: 'Test system for Context API',
        system_type: 'CRM',
        criticality: 'medium',
        status: 'active'
      }
    }
  ];

  console.log('ℹ️  Since complex migrations are not possible via API,');
  console.log('   we recommend using Supabase Dashboard SQL Editor');
  console.log('   to manually run: apply-all-migrations.sql');
  
  return false;
}

async function main() {
  console.log('🚀 Context Module Migration (API Method)');
  console.log('==========================================');
  
  const tablesExist = await checkTables();
  
  if (tablesExist) {
    console.log('✅ No migration needed');
    return;
  }
  
  console.log('');
  console.log('📋 MANUAL MIGRATION REQUIRED');
  console.log('============================');
  console.log('');
  console.log('Since Supabase API has limitations for complex DDL operations,');
  console.log('please follow these steps:');
  console.log('');
  console.log('1. Go to: ' + supabaseUrl.replace('https://', 'https://supabase.com/dashboard/project/').replace('.supabase.co', '') + '/sql');
  console.log('2. Copy the contents of apply-all-migrations.sql');
  console.log('3. Paste into the SQL Editor');
  console.log('4. Click "RUN" to execute the migration');
  console.log('');
  console.log('This will create all Context module tables with proper schema.');
  
  const migrationFile = path.join(__dirname, 'apply-all-migrations.sql');
  if (fs.existsSync(migrationFile)) {
    const stats = fs.statSync(migrationFile);
    console.log(`📎 Migration file ready: apply-all-migrations.sql (${(stats.size / 1024).toFixed(1)}KB)`);
  }
}

main().catch(err => {
  console.error('❌ Script error:', err.message);
});