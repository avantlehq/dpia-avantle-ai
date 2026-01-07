#!/usr/bin/env node

/**
 * Apply Context Migrations via Direct SQL Execution
 * 
 * Uses Supabase API for direct SQL execution without RPC functions
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

async function executeSqlDirect(sql) {
  const url = `${SUPABASE_URL}/rest/v1/rpc/exec_sql`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
    },
    body: JSON.stringify({ sql_query: sql })
  });
  
  return response;
}

async function testConnection() {
  console.log('🔌 Testing connection...');
  
  const response = await fetch(`${SUPABASE_URL}/rest/v1/users?limit=1`, {
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
    }
  });
  
  if (response.ok) {
    console.log('✅ Connection successful');
    return true;
  } else {
    console.error('❌ Connection failed');
    return false;
  }
}

async function createEnum(typeName, values) {
  const sql = `CREATE TYPE ${typeName} AS ENUM (${values.map(v => `'${v}'`).join(', ')});`;
  
  console.log(`📝 Creating enum: ${typeName}`);
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
      body: JSON.stringify({ sql: sql })
    });
    
    if (response.ok) {
      console.log(`✅ Created enum: ${typeName}`);
      return true;
    } else {
      const error = await response.text();
      console.error(`❌ Failed to create enum ${typeName}:`, error);
      return false;
    }
  } catch (err) {
    console.error(`❌ Error creating enum ${typeName}:`, err.message);
    return false;
  }
}

async function main() {
  console.log('🎯 Direct Context Module Migration');
  console.log('===================================\n');
  
  if (!(await testConnection())) {
    process.exit(1);
  }
  
  // Create enums one by one
  const enums = [
    {
      name: 'lawful_basis',
      values: ['consent', 'contract', 'legal_obligation', 'vital_interests', 'public_task', 'legitimate_interests']
    },
    {
      name: 'special_category_basis', 
      values: ['explicit_consent', 'employment_law', 'vital_interests_no_consent', 'public_activities', 'manifestly_public_info', 'legal_claims', 'substantial_public_interest', 'healthcare', 'public_health', 'archiving_research_statistics']
    },
    {
      name: 'data_category_type',
      values: ['personal', 'special', 'criminal']
    },
    {
      name: 'data_sensitivity',
      values: ['public', 'internal', 'confidential', 'restricted']
    },
    {
      name: 'endpoint_type',
      values: ['api', 'database', 'file', 'manual', 'message_bus']
    },
    {
      name: 'vendor_role',
      values: ['processor', 'joint_controller', 'recipient']
    },
    {
      name: 'contract_type',
      values: ['dpa', 'scc', 'bcr', 'adequacy_decision', 'other']
    },
    {
      name: 'transfer_mechanism',
      values: ['adequacy_decision', 'scc', 'bcr', 'certification', 'codes_of_conduct', 'ad_hoc_safeguards', 'derogation']
    },
    {
      name: 'flow_direction',
      values: ['inbound', 'outbound', 'internal']
    }
  ];
  
  let successCount = 0;
  for (const enumDef of enums) {
    const success = await createEnum(enumDef.name, enumDef.values);
    if (success) successCount++;
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`\n📊 Results: ${successCount}/${enums.length} enums created`);
  
  if (successCount === enums.length) {
    console.log('\n🎉 Basic enums created! Continue with manual migration for tables.');
    console.log('📋 Next: Follow MANUAL_MIGRATION_INSTRUCTIONS.md for table creation');
  } else {
    console.log('\n❌ Some enums failed. Check errors above.');
  }
}

main().catch(console.error);