#!/usr/bin/env node

/**
 * Test Database Connection for DPIA Agent
 * 
 * This script tests your Supabase database connection.
 * Run with: node test-database.js
 */

require('dotenv').config({ path: '.env.local' });

async function testDatabaseConnection() {
    console.log('🧪 Testing DPIA Agent Database Connection');
    console.log('=========================================\n');

    // Check environment variables
    console.log('1. Checking environment variables...');
    const requiredEnvs = [
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        'JWT_SECRET'
    ];

    const missingEnvs = requiredEnvs.filter(env => !process.env[env]);
    
    if (missingEnvs.length > 0) {
        console.log('❌ Missing environment variables:', missingEnvs);
        console.log('Please update your .env.local file\n');
        return;
    }
    
    console.log('✅ All environment variables present');
    
    // Check if placeholder values are still present
    if (process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-ref')) {
        console.log('❌ Placeholder values detected in .env.local');
        console.log('Please update with your actual Supabase credentials\n');
        return;
    }
    
    console.log('✅ Environment variables configured\n');

    // Test Supabase connection
    console.log('2. Testing Supabase connection...');
    
    try {
        const { createClient } = require('@supabase/supabase-js');
        
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );
        
        // Test connection by querying the tenants table
        const { data, error } = await supabase
            .from('tenants')
            .select('id, name')
            .limit(1);
            
        if (error) {
            console.log('❌ Database connection failed:', error.message);
            console.log('Check if SQL migration was run successfully\n');
            return;
        }
        
        console.log('✅ Database connection successful');
        
        if (data && data.length > 0) {
            console.log('✅ Sample data found:', data[0]);
        }
        
        console.log('\n3. Testing workspace query...');
        
        const { data: workspaces, error: workspaceError } = await supabase
            .from('workspaces')
            .select('id, name, tenant_id')
            .limit(1);
            
        if (workspaceError) {
            console.log('❌ Workspace query failed:', workspaceError.message);
            return;
        }
        
        console.log('✅ Workspace query successful');
        
        if (workspaces && workspaces.length > 0) {
            console.log('✅ Default workspace found:', workspaces[0]);
        }
        
        console.log('\n🎉 Database Connection Test Passed!');
        console.log('===================================');
        console.log('Your DPIA Agent is ready to use the database.');
        console.log('You can now:');
        console.log('- Create assessments in the dashboard');
        console.log('- Use the DPIA builder wizard');
        console.log('- Export PDF/DOCX documents');
        console.log('- All data will be persisted to Supabase\n');
        
    } catch (error) {
        console.log('❌ Connection test failed:', error.message);
        console.log('Make sure Supabase packages are installed: pnpm install\n');
    }
}

// Run the test
testDatabaseConnection().catch(console.error);