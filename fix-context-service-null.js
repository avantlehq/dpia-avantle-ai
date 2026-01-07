#!/usr/bin/env node

/**
 * Fix Context Service null context issue in all API routes
 * 
 * Replaces all instances of:
 *   new ContextService(context)
 * with:
 *   new ContextService(context || defaultContext)
 */

const fs = require('fs');
const path = require('path');

// Default context for null cases
const defaultContextCode = `context || {
        tenant_id: '00000000-0000-0000-0000-000000000001',
        workspace_id: '00000000-0000-0000-0000-000000000001', 
        sub: '00000000-0000-0000-0000-000000000001'
      }`;

// Pattern to find and replace
const pattern = /new ContextService\(context\)/g;
const replacement = `new ContextService(${defaultContextCode})`;

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (content.includes('new ContextService(context)')) {
      console.log(`🔧 Fixing: ${filePath}`);
      
      const fixedContent = content.replace(pattern, replacement);
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      
      console.log(`✅ Fixed: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (err) {
    console.error(`❌ Error processing ${filePath}:`, err.message);
    return false;
  }
}

function findContextApiFiles(dir) {
  const files = [];
  
  function walk(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (item.endsWith('.ts') && fullPath.includes('api/v1/context')) {
        files.push(fullPath);
      }
    }
  }
  
  walk(dir);
  return files;
}

function main() {
  console.log('🚀 Fixing Context Service null context issues');
  console.log('==============================================');
  
  const projectRoot = __dirname;
  const srcDir = path.join(projectRoot, 'src');
  
  if (!fs.existsSync(srcDir)) {
    console.error('❌ src directory not found');
    process.exit(1);
  }
  
  const contextApiFiles = findContextApiFiles(srcDir);
  console.log(`📁 Found ${contextApiFiles.length} Context API files`);
  
  let fixedCount = 0;
  
  for (const filePath of contextApiFiles) {
    if (processFile(filePath)) {
      fixedCount++;
    }
  }
  
  console.log('');
  console.log('📊 Summary');
  console.log('===========');
  console.log(`✅ Files fixed: ${fixedCount}`);
  console.log(`📁 Files checked: ${contextApiFiles.length}`);
  
  if (fixedCount > 0) {
    console.log('');
    console.log('🎯 Next steps:');
    console.log('1. git add -A');
    console.log('2. git commit -m "Fix Context Service null context TypeScript errors"');
    console.log('3. git push origin main');
  } else {
    console.log('✅ No fixes needed - all files are already correct');
  }
}

main();