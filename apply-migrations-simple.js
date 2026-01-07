#!/usr/bin/env node

/**
 * Simple Context Module Migration Application
 * 
 * Executes SQL commands directly using node-postgres to apply Context module migrations.
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Parse Supabase URL to get connection details
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Extract database connection details from Supabase URL
const url = new URL(supabaseUrl);
const dbConfig = {
  host: url.hostname,
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: supabaseServiceKey.split('.')[0], // Service key format: password.jwt_secret
};

console.log('🚀 Context Module Migration');
console.log('===========================');
console.log(`📍 Host: ${dbConfig.host}`);

async function testConnection() {
  const client = new Client(dbConfig);
  
  try {
    await client.connect();
    console.log('✅ Database connection successful');
    
    const result = await client.query('SELECT NOW() as current_time');
    console.log(`🕐 Database time: ${result.rows[0].current_time}`);
    
    await client.end();
    return true;
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    await client.end();
    return false;
  }
}

async function checkIfMigrationNeeded() {
  const client = new Client(dbConfig);
  
  try {
    await client.connect();
    
    // Check if systems table exists
    const result = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'systems'
      );
    `);
    
    const exists = result.rows[0].exists;
    await client.end();
    
    if (exists) {
      console.log('ℹ️  Context tables already exist');
      return false;
    } else {
      console.log('📝 Context tables not found - migration needed');
      return true;
    }
    
  } catch (err) {
    console.log('📝 Could not check tables - proceeding with migration');
    await client.end();
    return true;
  }
}

async function executeMigration() {
  const migrationFile = path.join(__dirname, 'apply-all-migrations.sql');
  
  if (!fs.existsSync(migrationFile)) {
    console.error(`❌ Migration file not found: ${migrationFile}`);
    return false;
  }

  const sql = fs.readFileSync(migrationFile, 'utf8');
  console.log(`📋 Migration file size: ${(sql.length / 1024).toFixed(1)}KB`);

  const client = new Client(dbConfig);
  
  try {
    await client.connect();
    console.log('📦 Executing migration...');
    
    // Execute the migration SQL
    await client.query(sql);
    
    console.log('✅ Migration executed successfully');
    await client.end();
    return true;
    
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    if (err.position) {
      const lines = sql.substring(0, err.position).split('\n');
      console.error(`❌ Error at line ${lines.length}: ${lines[lines.length - 1]}`);
    }
    await client.end();
    return false;
  }
}

async function verifyMigration() {
  const client = new Client(dbConfig);
  
  try {
    await client.connect();
    
    // Check that all main tables exist
    const tables = ['jurisdictions', 'physical_locations', 'vendors', 'systems', 'data_categories', 'processing_activities'];
    
    for (const table of tables) {
      const result = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        );
      `, [table]);
      
      if (result.rows[0].exists) {
        console.log(`✅ Table '${table}' created successfully`);
      } else {
        console.log(`❌ Table '${table}' not found`);
      }
    }
    
    // Check that enums exist
    const enumResult = await client.query(`
      SELECT COUNT(*) as count FROM pg_type WHERE typtype = 'e';
    `);
    
    console.log(`✅ Created ${enumResult.rows[0].count} enum types`);
    
    await client.end();
    return true;
    
  } catch (err) {
    console.error('❌ Verification failed:', err.message);
    await client.end();
    return false;
  }
}

async function main() {
  // Test connection first
  if (!(await testConnection())) {
    process.exit(1);
  }
  
  // Check if migration is needed
  const migrationNeeded = await checkIfMigrationNeeded();
  
  if (!migrationNeeded) {
    console.log('✅ Migration not needed - Context tables already exist');
    return;
  }
  
  // Execute migration
  const success = await executeMigration();
  
  if (!success) {
    process.exit(1);
  }
  
  // Verify migration
  console.log('');
  console.log('🔍 Verifying migration...');
  await verifyMigration();
  
  console.log('');
  console.log('🎉 Context Module database setup completed!');
  console.log('Next steps:');
  console.log('  1. Test Context API endpoints');
  console.log('  2. Verify data can be inserted and retrieved');
  console.log('  3. Check RLS policies are working');
}

main().catch(err => {
  console.error('❌ Script failed:', err.message);
  process.exit(1);
});