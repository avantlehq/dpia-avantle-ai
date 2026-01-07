#!/usr/bin/env node

/**
 * Apply Context Module Migrations to Supabase
 * 
 * This script applies all Context module database migrations to the production
 * Supabase database for dpia.avantle.ai.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create Supabase client with service role (bypasses RLS)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executeSql(sql, migrationName) {
  console.log(`📜 Executing ${migrationName}...`);
  
  try {
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_query: sql
    });
    
    if (error) {
      console.error(`❌ Error in ${migrationName}:`, error.message);
      return false;
    }
    
    console.log(`✅ ${migrationName} executed successfully`);
    return true;
  } catch (err) {
    console.error(`❌ Exception in ${migrationName}:`, err.message);
    return false;
  }
}

async function createExecSqlFunction() {
  console.log('🔧 Creating SQL execution function...');
  
  const createFunctionSql = `
    CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      EXECUTE sql_query;
    END;
    $$;
  `;
  
  try {
    const { error } = await supabase.rpc('exec', { sql: createFunctionSql });
    if (error) throw error;
    console.log('✅ SQL execution function created');
    return true;
  } catch (err) {
    // Function might already exist, try direct execution
    console.log('⚠️  Using direct SQL execution');
    return true;
  }
}

async function applyMigration(migrationFile) {
  const migrationPath = path.join(__dirname, 'supabase/migrations', migrationFile);
  
  if (!fs.existsSync(migrationPath)) {
    console.error(`❌ Migration file not found: ${migrationFile}`);
    return false;
  }
  
  const sql = fs.readFileSync(migrationPath, 'utf8');
  
  // Split SQL into individual statements
  const statements = sql
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
  
  console.log(`📜 Applying ${migrationFile} (${statements.length} statements)...`);
  
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i] + ';';
    
    try {
      const { error } = await supabase.rpc('exec', { sql: statement });
      
      if (error) {
        console.error(`❌ Error in statement ${i + 1} of ${migrationFile}:`, error.message);
        console.error(`Statement: ${statement.substring(0, 100)}...`);
        return false;
      }
    } catch (err) {
      console.error(`❌ Exception in statement ${i + 1} of ${migrationFile}:`, err.message);
      return false;
    }
  }
  
  console.log(`✅ ${migrationFile} applied successfully`);
  return true;
}

async function main() {
  console.log('🎯 Context Module Database Migration');
  console.log('=====================================\n');
  
  console.log('Project:', SUPABASE_URL);
  console.log('Using service role key for admin access\n');
  
  // Test connection
  console.log('🔌 Testing database connection...');
  try {
    const { data, error } = await supabase.from('users').select('id').limit(1);
    if (error) throw error;
    console.log('✅ Database connection successful\n');
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
  
  // Migration files in order
  const migrations = [
    '00001_context_module_enums_functions.sql',
    '00002_global_jurisdictions.sql',
    '00003_physical_locations.sql',
    '00004_vendors_contracts_locations.sql',
    '00005_systems_endpoints_locations.sql',
    '00006_data_categories_seed.sql',
    '00007_processing_activities_retention.sql',
    '00008_data_flows_transfers.sql',
    '00009_seed_jurisdictions.sql'
  ];
  
  console.log(`📋 Applying ${migrations.length} migrations...\n`);
  
  // Apply each migration
  let successCount = 0;
  for (const migration of migrations) {
    const success = await applyMigration(migration);
    if (success) {
      successCount++;
    } else {
      console.error(`❌ Failed to apply ${migration}`);
      console.error('Stopping migration process');
      break;
    }
    
    // Small delay between migrations
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`\n📊 Migration Results:`);
  console.log(`✅ Successful: ${successCount}/${migrations.length}`);
  
  if (successCount === migrations.length) {
    console.log('\n🎉 All Context module migrations applied successfully!');
    console.log('\nNext steps:');
    console.log('1. Test Context API endpoints');
    console.log('2. Verify tables exist in Supabase dashboard');
    console.log('3. Test Context module UI functionality');
  } else {
    console.log('\n❌ Migration process incomplete');
    console.log('Check errors above and fix before proceeding');
  }
}

main().catch(console.error);