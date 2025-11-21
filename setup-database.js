#!/usr/bin/env node

/**
 * DPIA Agent Database Setup Script
 * 
 * This script helps you set up the Supabase database for DPIA Agent.
 * Run with: node setup-database.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function main() {
  console.log('\n🚀 DPIA Agent Database Setup');
  console.log('============================\n');

  console.log('This script will help you:');
  console.log('1. Create .env.local file with Supabase credentials');
  console.log('2. Provide SQL migration script for your Supabase project');
  console.log('3. Test database connectivity\n');

  // Check if .env.local already exists
  const envPath = path.join(__dirname, '.env.local');
  const envExamplePath = path.join(__dirname, '.env.example');

  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env.local already exists.');
    const overwrite = await prompt('Do you want to overwrite it? (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Setup cancelled.');
      rl.close();
      return;
    }
  }

  console.log('\n📋 Supabase Project Configuration');
  console.log('Please provide your Supabase project credentials.\n');
  console.log('You can find these in your Supabase project dashboard:');
  console.log('Project Settings > API\n');

  // Get Supabase credentials
  const supabaseUrl = await prompt('Supabase Project URL (https://xxx.supabase.co): ');
  const supabaseAnonKey = await prompt('Supabase Anon/Public Key: ');
  const supabaseServiceKey = await prompt('Supabase Service Role Key (optional): ');

  // Generate JWT secret
  const jwtSecret = require('crypto').randomBytes(32).toString('hex');

  // Read .env.example
  let envContent = '';
  if (fs.existsSync(envExamplePath)) {
    envContent = fs.readFileSync(envExamplePath, 'utf8');
  }

  // Update with actual values
  envContent = envContent.replace('your_supabase_url_here', supabaseUrl);
  envContent = envContent.replace('your_supabase_anon_key_here', supabaseAnonKey);
  if (supabaseServiceKey) {
    envContent = envContent.replace('your_supabase_service_role_key_here', supabaseServiceKey);
  }
  envContent = envContent.replace('your_jwt_secret_here', jwtSecret);

  // Write .env.local
  fs.writeFileSync(envPath, envContent);
  console.log('\n✅ Created .env.local file with your credentials');

  console.log('\n📄 SQL Migration Script');
  console.log('==========================================\n');
  console.log('Next, you need to run the SQL migration in your Supabase project:');
  console.log('\n1. Go to your Supabase project dashboard');
  console.log('2. Navigate to "SQL Editor"');
  console.log('3. Create a new query');
  console.log('4. Copy and paste the contents of: database/migrations/001_initial_schema.sql');
  console.log('5. Click "Run" to execute the migration');

  const migrationPath = path.join(__dirname, 'database', 'migrations', '001_initial_schema.sql');
  if (fs.existsSync(migrationPath)) {
    console.log('\n📋 Migration file location: ' + migrationPath);
    
    const showSql = await prompt('\nWould you like to see the SQL content? (y/N): ');
    if (showSql.toLowerCase() === 'y') {
      console.log('\n' + '='.repeat(50));
      console.log(fs.readFileSync(migrationPath, 'utf8'));
      console.log('='.repeat(50));
    }
  }

  console.log('\n🔧 Development Setup');
  console.log('==========================================');
  console.log('\nAfter running the SQL migration:');
  console.log('1. Start the development server: pnpm dev');
  console.log('2. Go to http://localhost:3000');
  console.log('3. Create a test assessment to verify database connectivity');
  console.log('4. Check the browser console for any errors');

  console.log('\n🧪 Testing Database Connection');
  console.log('==========================================');
  console.log('\nTo test your database connection:');
  console.log('1. Start the dev server: pnpm dev');
  console.log('2. Open browser network tab');
  console.log('3. Navigate to /dashboard');
  console.log('4. Check API calls to /api/assessments');
  console.log('5. Look for "Database connection successful" in console');

  console.log('\n✨ Troubleshooting');
  console.log('==========================================');
  console.log('\nIf you see "Supabase client error" messages:');
  console.log('1. Verify your .env.local file has correct credentials');
  console.log('2. Make sure the SQL migration was executed successfully');
  console.log('3. Check Supabase dashboard for any RLS policy issues');
  console.log('4. Restart the development server after making changes');

  const testConnection = await prompt('\nWould you like to test the database connection now? (y/N): ');
  
  if (testConnection.toLowerCase() === 'y') {
    console.log('\n🔌 Testing database connection...');
    
    try {
      // Test basic connection
      const { createServerComponentClient } = require('@supabase/auth-helpers-nextjs');
      const { cookies } = require('next/headers');
      
      console.log('✅ Supabase client libraries are available');
      console.log('ℹ️  To fully test the connection, start the dev server and visit /dashboard');
    } catch (error) {
      console.log('❌ Error testing connection:', error.message);
      console.log('ℹ️  This might be normal - full testing requires the Next.js app running');
    }
  }

  console.log('\n🎉 Setup Complete!');
  console.log('==========================================');
  console.log('\nWhat you accomplished:');
  console.log('✅ Created .env.local with Supabase credentials');
  console.log('✅ Generated secure JWT secret');
  console.log('📋 Provided SQL migration instructions');
  console.log('\nNext steps:');
  console.log('1. Run the SQL migration in Supabase');
  console.log('2. Start dev server: pnpm dev');
  console.log('3. Test the application at http://localhost:3000');

  rl.close();
}

main().catch(console.error);