# Manual Context Module Migration Instructions

## 🎯 **Mission: Apply Context Module Database Schema**

Since automated migration failed, follow these manual steps to apply Context module migrations to your Supabase database.

## 📋 **Step-by-Step Process**

### **Step 1: Access Supabase SQL Editor**
1. Go to: https://supabase.com/dashboard
2. Select your project: `dpia-avantle-ai` (rfvxmxbysfzwtiqzhijg)
3. Navigate to **"SQL Editor"** in the left sidebar
4. Click **"+ New Query"**

### **Step 2: Apply Migrations in Order**

Apply these migrations **ONE BY ONE** in the exact order below. **Do not skip any!**

#### **Migration 1: Enums & Functions**
```sql
-- Migration 1: Enums + Helper Functions + Triggers
-- Context Module - Database Schema & RLS (Supabase)

-- Enums
CREATE TYPE lawful_basis AS ENUM (
  'consent',
  'contract', 
  'legal_obligation',
  'vital_interests',
  'public_task',
  'legitimate_interests'
);

CREATE TYPE special_category_basis AS ENUM (
  'explicit_consent',
  'employment_law',
  'vital_interests_no_consent',
  'public_activities',
  'manifestly_public_info',
  'legal_claims',
  'substantial_public_interest',
  'healthcare',
  'public_health',
  'archiving_research_statistics'
);

CREATE TYPE data_category_type AS ENUM (
  'personal',
  'special',
  'criminal'
);

CREATE TYPE data_sensitivity AS ENUM (
  'public',
  'internal',
  'confidential',
  'restricted'
);

CREATE TYPE endpoint_type AS ENUM (
  'api',
  'database', 
  'file',
  'manual',
  'message_bus'
);

CREATE TYPE vendor_role AS ENUM (
  'processor',
  'joint_controller',
  'recipient'
);

CREATE TYPE contract_type AS ENUM (
  'dpa',
  'scc',
  'bcr',
  'adequacy_decision',
  'other'
);

CREATE TYPE transfer_mechanism AS ENUM (
  'adequacy_decision',
  'scc',
  'bcr',
  'certification',
  'codes_of_conduct',
  'ad_hoc_safeguards',
  'derogation'
);

CREATE TYPE flow_direction AS ENUM (
  'inbound',
  'outbound',
  'internal'
);

-- Helper function for updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Helper function for email validation
CREATE OR REPLACE FUNCTION is_valid_email(email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Helper function for ISO 3166-1 alpha-2 validation
CREATE OR REPLACE FUNCTION is_valid_country_code(code TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN code ~* '^[A-Z]{2}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Helper function for UUID validation
CREATE OR REPLACE FUNCTION is_valid_uuid(input TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN input ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to get default workspace for user
CREATE OR REPLACE FUNCTION get_default_workspace(user_uuid UUID)
RETURNS UUID AS $$
DECLARE
  workspace_uuid UUID;
BEGIN
  SELECT w.id INTO workspace_uuid
  FROM workspaces w
  JOIN members m ON w.id = m.workspace_id
  WHERE m.user_id = user_uuid
  LIMIT 1;
  
  RETURN workspace_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get tenant for workspace
CREATE OR REPLACE FUNCTION get_tenant_for_workspace(workspace_uuid UUID)
RETURNS UUID AS $$
DECLARE
  tenant_uuid UUID;
BEGIN
  SELECT tenant_id INTO tenant_uuid
  FROM workspaces
  WHERE id = workspace_uuid;
  
  RETURN tenant_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Click "Run" and verify it completes successfully before proceeding.**

---

### **Next Steps**

After completing Migration 1:

1. ✅ **Verify Success**: Check that you see "Success. No rows returned" 
2. 📁 **Get Next Migration**: Copy content from `supabase/migrations/00002_global_jurisdictions.sql`
3. 🔄 **Repeat Process**: Paste into new SQL query and run
4. 📋 **Continue**: Repeat for migrations 00003 through 00009

### **Migration Order Checklist**

- [ ] 00001_context_module_enums_functions.sql ← **START HERE**
- [ ] 00002_global_jurisdictions.sql
- [ ] 00003_physical_locations.sql  
- [ ] 00004_vendors_contracts_locations.sql
- [ ] 00005_systems_endpoints_locations.sql
- [ ] 00006_data_categories_seed.sql
- [ ] 00007_processing_activities_retention.sql
- [ ] 00008_data_flows_transfers.sql
- [ ] 00009_seed_jurisdictions.sql ← **FINISH HERE**

### **Troubleshooting**

**❌ If you see "type already exists" errors:**
- Skip that CREATE TYPE statement and continue with the rest
- This means the type was already created

**❌ If you see function errors:**
- Make sure you're in a new query for each migration
- Check that previous migration completed successfully

**✅ Success indicators:**
- "Success. No rows returned" message
- No red error text in the output panel

### **Verification**

After completing all migrations, verify by running this test query:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('systems', 'processing_activities', 'vendors', 'global_jurisdictions', 'data_categories');
```

**Expected result:** All 5 tables should be listed.

---

### **💡 Pro Tip**

- Keep this document open while applying migrations
- Check off each migration as you complete it
- If any migration fails, stop and debug before proceeding
- After all migrations: test Context API endpoints

### **🎯 Goal**

Successfully create all Context module tables so the API returns real data instead of mock fallbacks.

**Current Status:** Context UI ✅ | Context API ✅ | **Context Database ❌ ← YOU ARE HERE**