#!/usr/bin/env node

/**
 * Interactive Supabase Setup for DPIA Agent
 * 
 * This script guides you through setting up Supabase for the DPIA Agent.
 * Run with: node setup-supabase.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 DPIA Agent - Supabase Setup');
console.log('==============================\n');

console.log('This will guide you through:');
console.log('1. 📝 Creating your Supabase project');
console.log('2. 🗃️  Running the SQL migration');
console.log('3. 🔑 Configuring environment variables');
console.log('4. ✅ Testing the database connection\n');

console.log('📋 Step 1: Create Supabase Project');
console.log('==================================');
console.log('1. Go to https://supabase.com');
console.log('2. Sign in or create an account');
console.log('3. Click "New Project"');
console.log('4. Choose your organization');
console.log('5. Enter project details:');
console.log('   - Name: "DPIA Agent"');
console.log('   - Database Password: (choose a strong password)');
console.log('   - Region: Choose closest to your users');
console.log('6. Click "Create new project"');
console.log('7. Wait for project initialization (2-3 minutes)\n');

console.log('📋 Step 2: Run SQL Migration');
console.log('============================');
console.log('1. In your Supabase dashboard, go to "SQL Editor"');
console.log('2. Click "New query"');
console.log('3. Copy the SQL migration content below and paste it:');

console.log('\n' + '='.repeat(80));
console.log('📄 SQL MIGRATION CONTENT (copy this):');
console.log('='.repeat(80));

const migrationPath = path.join(__dirname, 'database', 'migrations', '001_initial_schema.sql');
if (fs.existsSync(migrationPath)) {
  const migration = fs.readFileSync(migrationPath, 'utf8');
  console.log(migration);
} else {
  console.log('❌ Migration file not found at:', migrationPath);
}

console.log('='.repeat(80));
console.log('4. Click "Run" to execute the migration');
console.log('5. You should see "Success. No rows returned" message\n');

console.log('📋 Step 3: Get API Credentials');
console.log('==============================');
console.log('1. In Supabase dashboard, go to "Settings" → "API"');
console.log('2. Copy the following values:');
console.log('   - Project URL (https://xxx.supabase.co)');
console.log('   - anon/public key (starts with eyJ...)');
console.log('   - service_role key (starts with eyJ...)');

console.log('\n📋 Step 4: Update Environment Variables');
console.log('=======================================');
console.log('Update your .env.local file with the credentials from Step 3:');

console.log(`
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your_anon_key
SUPABASE_SERVICE_ROLE_KEY=eyJ...your_service_key
JWT_SECRET=${require('crypto').randomBytes(32).toString('hex')}
`);

console.log('📋 Step 5: Test Database Connection');
console.log('==================================');
console.log('1. Save your .env.local file');
console.log('2. Restart the development server:');
console.log('   pnpm dev');
console.log('3. Go to http://localhost:3001/dashboard');
console.log('4. Check browser console for "Database connection successful"');
console.log('5. Try creating a new assessment\n');

console.log('🔧 Troubleshooting');
console.log('==================');
console.log('If you see errors:');
console.log('- ❌ "Supabase client error" → Check your .env.local credentials');
console.log('- ❌ "Failed to fetch assessments" → Verify SQL migration ran successfully');
console.log('- ❌ "RLS policy" errors → Migration creates proper RLS policies');
console.log('- ❌ Build errors → Restart dev server after env changes\n');

console.log('🎉 Next Steps After Setup');
console.log('==========================');
console.log('Once your database is connected:');
console.log('1. ✅ Create test assessments in the dashboard');
console.log('2. ✅ Test the 3-section DPIA builder');
console.log('3. ✅ Verify PDF/DOCX export functionality');
console.log('4. ✅ Deploy to production (Vercel)');

console.log('\n🚀 Ready to start? Follow the steps above!');
console.log('Need help? Check DATABASE_SETUP.md for detailed instructions.\n');