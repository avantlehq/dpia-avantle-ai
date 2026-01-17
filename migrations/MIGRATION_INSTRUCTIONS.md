# Context Module Schema Migration Instructions

**Migration File:** `20260117_context_schema_alignment.sql`
**Status:** Ready for execution
**Date:** 2026-01-17

---

## Pre-Migration Checklist

- [ ] Backup Supabase database (Settings → Database → Create Backup)
- [ ] Review migration script (`20260117_context_schema_alignment.sql`)
- [ ] Update admin email in script (line 166: `admin@avantle.ai`)
- [ ] Notify users of brief maintenance window
- [ ] Verify no active CRUD operations in production

---

## How to Run Migration

### Option 1: Supabase SQL Editor (Recommended)

1. Open Supabase Dashboard: https://supabase.com/dashboard/project/YOUR_PROJECT_ID
2. Navigate to **SQL Editor** in left sidebar
3. Click **New Query**
4. Copy entire contents of `20260117_context_schema_alignment.sql`
5. Paste into SQL editor
6. Review the script one final time
7. Click **Run** (bottom right)
8. Wait for execution (2-5 minutes)
9. Check for success message (no errors)

### Option 2: psql Command Line

```bash
# Connect to Supabase database
psql -h db.PROJECT_REF.supabase.co -U postgres -d postgres

# Run migration file
\i migrations/20260117_context_schema_alignment.sql

# Verify success
\q
```

### Option 3: Supabase CLI

```bash
# Install Supabase CLI if not installed
npm install -g supabase

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Run migration
supabase db push --file migrations/20260117_context_schema_alignment.sql
```

---

## Post-Migration Verification

### Step 1: Run Verification Queries

Open Supabase SQL Editor and run these queries:

```sql
-- 1. Check physical_locations has jurisdiction_id populated
SELECT id, name, country_code, jurisdiction_id
FROM physical_locations
LIMIT 10;
-- Expected: jurisdiction_id should be populated for all rows

-- 2. Check jurisdictions has names populated
SELECT id, country_code, name_en, name_sk
FROM jurisdictions
LIMIT 10;
-- Expected: name_en and name_sk should have values (country codes as fallback)

-- 3. Check data_categories can have parent relationships
SELECT id, name, parent_id
FROM data_categories
LIMIT 10;
-- Expected: parent_id column exists (may be NULL)

-- 4. Check all tables have audit columns
SELECT table_name, column_name
FROM information_schema.columns
WHERE table_name IN ('processing_activities', 'vendors', 'physical_locations', 'data_categories')
  AND column_name IN ('deleted_at', 'created_by', 'updated_by')
ORDER BY table_name, column_name;
-- Expected: All tables should have all three columns
```

### Step 2: Test Context API Endpoints

```bash
# Test all endpoints return 200
curl https://dpia.avantle.ai/api/v1/context/systems
curl https://dpia.avantle.ai/api/v1/context/vendors
curl https://dpia.avantle.ai/api/v1/context/locations
curl https://dpia.avantle.ai/api/v1/context/data-categories
curl https://dpia.avantle.ai/api/v1/context/processing-activities
curl https://dpia.avantle.ai/api/v1/context/jurisdictions
```

### Step 3: Test CRUD Operations in UI

1. Go to https://dpia.avantle.ai/en/context/locations/new
2. Create a new location:
   - Name: "Test Location Post-Migration"
   - Jurisdiction: Select any jurisdiction (dropdown should show full names if localization data added)
   - Description: "Testing migration"
   - Address: "123 Test St"
   - City: "Bratislava"
3. Click Create
4. Expected: Success, no 500 errors

5. Go to https://dpia.avantle.ai/en/context/data-categories/new
6. Create a data category:
   - Name: "Test Category"
   - Type: "Personal"
   - Parent Category: Try selecting one (should work now)
7. Click Create
8. Expected: Success with parent_id saved

### Step 4: Test Edit Form Dropdowns

1. Edit the location you just created
2. Expected: Jurisdiction dropdown pre-selected (no manual re-selection needed)

3. Edit a data category
4. Expected: All dropdowns (Category Type, Sensitivity, Parent) pre-selected

---

## Next Steps After Verification

Once all verification passes, proceed to remove repository workarounds:

1. Create new branch: `git checkout -b remove-schema-workarounds`
2. Follow instructions in DATABASE_SCHEMA_ISSUES.md section "After Migration: Revert Workarounds"
3. Update 8 files to remove overrides
4. Test all CRUD operations
5. Commit and push
6. Deploy to production

---

## Troubleshooting

### Migration Fails with Enum Error

**Error:** `type "special_category_basis" does not exist`

**Solution:** The enum type wasn't created yet. Create it manually:

```sql
CREATE TYPE special_category_basis AS ENUM (
  'none',
  'explicit_consent',
  'employment',
  'vital_interests',
  'public_interest',
  'healthcare',
  'research',
  'legal_claims'
);
```

Then re-run migration.

### Migration Fails with Foreign Key Error

**Error:** `violates foreign key constraint`

**Solution:** Some physical_locations have country_code values that don't match jurisdictions. Find orphaned rows:

```sql
SELECT pl.id, pl.name, pl.country_code
FROM physical_locations pl
LEFT JOIN jurisdictions j ON pl.country_code = j.country_code
WHERE j.id IS NULL;
```

Either delete these rows or add missing jurisdictions, then re-run.

### Rollback Required

If migration causes critical issues, use rollback script at bottom of `20260117_context_schema_alignment.sql` (commented out).

**WARNING:** Rollback will delete all data in new columns (parent relationships, audit trails, etc.)

---

## Migration Timeline

- **Pre-Migration:** 15 minutes (backup, review, update admin email)
- **Migration Execution:** 2-5 minutes
- **Verification:** 10 minutes
- **Total Downtime:** ~20 minutes

---

**Status:** ⏸️ Awaiting execution
**Next Action:** Run migration in Supabase SQL Editor
