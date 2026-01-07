#!/usr/bin/env node

/**
 * Apply Context Module Migrations to Supabase Database
 * 
 * This script applies all Context module database migrations using the
 * Supabase service role key to bypass RLS.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create Supabase admin client with service role
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration(filename, sql) {
  console.log(`📦 Applying migration: ${filename}`);
  
  try {
    const { data, error } = await supabase.rpc('exec', {
      sql: sql
    });

    if (error) {
      console.error(`❌ Migration ${filename} failed:`, error);
      return false;
    }

    console.log(`✅ Migration ${filename} completed successfully`);
    return true;
  } catch (err) {
    console.error(`❌ Migration ${filename} error:`, err.message);
    return false;
  }
}

async function checkTablesExist() {
  console.log('🔍 Checking if Context tables already exist...');
  
  try {
    const { data, error } = await supabase
      .from('systems')
      .select('id')
      .limit(1);

    if (!error) {
      console.log('ℹ️  Context tables already exist');
      return true;
    }
    
    if (error.code === '42P01') { // table does not exist
      console.log('📝 Context tables not found, migration needed');
      return false;
    }

    console.error('❓ Unknown error checking tables:', error);
    return false;
  } catch (err) {
    console.log('📝 Context tables not found, migration needed');
    return false;
  }
}

async function main() {
  console.log('🚀 Context Module Database Setup');
  console.log('================================');
  console.log(`📍 Database URL: ${supabaseUrl}`);
  
  // Check if migration is needed
  const tablesExist = await checkTablesExist();
  
  if (tablesExist) {
    console.log('✅ Migration not needed - tables already exist');
    
    // Quick verification
    try {
      const { data, error } = await supabase
        .from('data_categories')
        .select('count')
        .single();
        
      if (!error) {
        console.log('✅ Database connection verified');
      }
    } catch (err) {
      console.log('⚠️  Database verification incomplete');
    }
    
    return;
  }

  // Read and apply the consolidated migration
  const migrationFile = path.join(__dirname, 'apply-all-migrations.sql');
  
  if (!fs.existsSync(migrationFile)) {
    console.error(`❌ Migration file not found: ${migrationFile}`);
    process.exit(1);
  }

  const migrationSQL = fs.readFileSync(migrationFile, 'utf8');
  console.log(`📋 Migration file size: ${(migrationSQL.length / 1024).toFixed(1)}KB`);

  // Split migration into chunks (Supabase has SQL size limits)
  const chunks = migrationSQL
    .split(/-- ===/)
    .filter(chunk => chunk.trim().length > 0)
    .map(chunk => chunk.trim());

  console.log(`📦 Migration split into ${chunks.length} chunks`);

  let successCount = 0;
  
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const chunkName = `chunk-${i + 1}-of-${chunks.length}`;
    
    if (await runMigration(chunkName, chunk)) {
      successCount++;
    } else {
      console.error(`❌ Migration failed at chunk ${i + 1}`);
      process.exit(1);
    }
    
    // Small delay between chunks
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('');
  console.log('🎉 Migration Summary');
  console.log('===================');
  console.log(`✅ Chunks completed: ${successCount}/${chunks.length}`);
  
  if (successCount === chunks.length) {
    console.log('✅ Context Module database setup completed successfully!');
    console.log('');
    console.log('📋 Created tables:');
    console.log('  - jurisdictions');
    console.log('  - physical_locations');
    console.log('  - vendors');
    console.log('  - systems');
    console.log('  - data_categories');
    console.log('  - processing_activities');
    console.log('');
    console.log('🔒 Row Level Security enabled on all tables');
    console.log('📝 Default data seeded for testing');
  } else {
    console.log('❌ Migration completed with errors');
    process.exit(1);
  }
}

// Run the migration
main().catch(error => {
  console.error('❌ Migration script failed:', error);
  process.exit(1);
});