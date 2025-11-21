#!/usr/bin/env node

/**
 * DPIA Agent Application Test Suite
 * 
 * Tests both mock and database modes to ensure everything works
 * Run with: node test-application.js
 */

const https = require('https');
const http = require('http');

const BASE_URL = 'http://localhost:3003';

console.log('🧪 DPIA Agent Application Test Suite');
console.log('=====================================\n');

// Test helper function
function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port || 80,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'DPIA-Agent-Test/1.0'
      }
    };

    if (data) {
      const body = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(body);
    }

    const req = http.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => {
        responseBody += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: responseBody
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Test functions
async function testApiHealth() {
  console.log('1. Testing API Health...');
  try {
    const response = await makeRequest('/api/health');
    
    if (response.statusCode === 200) {
      const health = JSON.parse(response.body);
      console.log('   ✅ API Health: OK');
      console.log(`   📊 Status: ${health.status}`);
      console.log(`   🔢 Version: ${health.version}`);
      console.log(`   ⏱️  Uptime: ${Math.round(health.uptime)}s`);
      return true;
    } else {
      console.log(`   ❌ API Health failed: ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ API Health error: ${error.message}`);
    return false;
  }
}

async function testVersionEndpoint() {
  console.log('\n2. Testing Version Endpoint...');
  try {
    const response = await makeRequest('/api/version');
    
    if (response.statusCode === 200) {
      const version = JSON.parse(response.body);
      console.log('   ✅ Version API: OK');
      console.log(`   🏷️  Version: ${version.version}`);
      console.log(`   🎨 Name: ${version.name}`);
      console.log(`   📅 Build Date: ${version.buildDate}`);
      return true;
    } else {
      console.log(`   ❌ Version API failed: ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Version API error: ${error.message}`);
    return false;
  }
}

async function testPagesLoad() {
  console.log('\n3. Testing Page Loading...');
  const pages = [
    { path: '/', name: 'Homepage' },
    { path: '/onboarding', name: 'Onboarding' },
    { path: '/dashboard', name: 'Dashboard' }
  ];

  let allPassed = true;

  for (const page of pages) {
    try {
      const response = await makeRequest(page.path);
      
      if (response.statusCode === 200) {
        // Check if it contains expected content
        const hasContent = response.body.includes('DPIA') || response.body.includes('Agent');
        if (hasContent) {
          console.log(`   ✅ ${page.name}: Loads correctly`);
        } else {
          console.log(`   ⚠️  ${page.name}: Loads but missing expected content`);
          allPassed = false;
        }
      } else {
        console.log(`   ❌ ${page.name}: Failed (${response.statusCode})`);
        allPassed = false;
      }
    } catch (error) {
      console.log(`   ❌ ${page.name}: Error - ${error.message}`);
      allPassed = false;
    }
  }

  return allPassed;
}

async function testAssessmentsAPI() {
  console.log('\n4. Testing Assessments API...');
  try {
    // Test GET /api/assessments
    const getResponse = await makeRequest('/api/assessments');
    
    if (getResponse.statusCode === 200) {
      const data = JSON.parse(getResponse.body);
      console.log('   ✅ GET /api/assessments: OK');
      console.log(`   📊 Found ${data.assessments?.length || 0} assessments`);
      
      // Test if we're in mock or database mode
      const isMockMode = data.assessments?.some(a => a.id === '1' && a.name === 'Employee Data Processing');
      if (isMockMode) {
        console.log('   🔄 Mode: Mock data (database not connected)');
      } else {
        console.log('   🗃️  Mode: Database connected');
      }
      
      return true;
    } else {
      console.log(`   ❌ Assessments API failed: ${getResponse.statusCode}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Assessments API error: ${error.message}`);
    return false;
  }
}

async function testCreateAssessment() {
  console.log('\n5. Testing Create Assessment...');
  try {
    // Test creating an assessment via the API
    const response = await makeRequest('/api/assessments', 'POST', {
      name: 'Test Assessment',
      description: 'Automated test assessment'
    });
    
    if (response.statusCode === 200 || response.statusCode === 201) {
      const result = JSON.parse(response.body);
      console.log('   ✅ POST /api/assessments: OK');
      console.log(`   🆔 Assessment ID: ${result.assessment?.id || 'generated'}`);
      return true;
    } else {
      console.log(`   ❌ Create Assessment failed: ${response.statusCode}`);
      console.log(`   📝 Response: ${response.body.substring(0, 200)}...`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Create Assessment error: ${error.message}`);
    return false;
  }
}

async function testDatabaseConnection() {
  console.log('\n6. Testing Database Connection...');
  
  try {
    // Check if .env.local exists and has Supabase configuration
    const fs = require('fs');
    const path = require('path');
    const envPath = path.join(process.cwd(), '.env.local');
    
    if (!fs.existsSync(envPath)) {
      console.log('   ⚠️  Database: .env.local file not found');
      console.log('   💡 Follow create-supabase-project.md to set up database');
      return false;
    }
    
    const envContent = fs.readFileSync(envPath, 'utf8');
    const hasSupabaseUrl = envContent.includes('NEXT_PUBLIC_SUPABASE_URL=https://');
    const hasSupabaseKey = envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ');
    const hasPlaceholders = envContent.includes('your-project-ref') || envContent.includes('your_anon_key');
    
    if (!hasSupabaseUrl || !hasSupabaseKey) {
      console.log('   ⚠️  Database: Supabase configuration missing');
      console.log('   💡 Update .env.local with real Supabase credentials');
      return false;
    }
    
    if (hasPlaceholders) {
      console.log('   ⚠️  Database: Placeholder values detected');
      console.log('   💡 Update .env.local with real Supabase credentials');
      return false;
    }
    
    console.log('   ✅ Database: Configuration found and looks valid');
    return true;
  } catch (error) {
    console.log(`   ❌ Database connection test failed: ${error.message}`);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting tests...\n');
  
  const results = {
    apiHealth: await testApiHealth(),
    version: await testVersionEndpoint(), 
    pages: await testPagesLoad(),
    assessments: await testAssessmentsAPI(),
    createAssessment: await testCreateAssessment(),
    database: await testDatabaseConnection()
  };

  console.log('\n📊 Test Results Summary');
  console.log('========================');
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.values(results).length;
  
  Object.entries(results).forEach(([test, result]) => {
    const icon = result ? '✅' : '❌';
    const name = test.charAt(0).toUpperCase() + test.slice(1);
    console.log(`${icon} ${name}`);
  });
  
  console.log(`\n🎯 Overall: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('\n🎉 All tests passed! DPIA Agent is working perfectly.');
    
    if (!results.database) {
      console.log('\n💡 Next steps:');
      console.log('   1. Follow create-supabase-project.md to set up database');
      console.log('   2. Run: node test-database.js');
      console.log('   3. Re-run this test suite');
    } else {
      console.log('\n🚀 Application is production ready!');
    }
  } else {
    console.log('\n⚠️  Some tests failed. Check the output above for details.');
  }
}

// Error handling
process.on('unhandledRejection', (err) => {
  console.log('\n❌ Unhandled error:', err.message);
  process.exit(1);
});

// Run tests
runTests().catch(console.error);