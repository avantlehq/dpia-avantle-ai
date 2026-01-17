# Database Schema Migration Plan

**Status:** 📋 PLANNED - Ready for implementation
**Created:** 2026-01-17
**Priority:** HIGH
**Estimated Total Time:** 3-4 hours

---

## Overview

Systematic approach to fix all Context module database schema mismatches in one migration instead of piecemeal fixes.

---

## Phase 1: Test Remaining Modules (30-45 min)

Test full CRUD operations on each module to discover all database issues.

### **1.1 Data Flows** (/context/data-flows)

**Status:** ⚠️ **API NOT IMPLEMENTED**

**Current Implementation:**
- GET returns mock data (5 hardcoded flows)
- POST returns 501 "This endpoint is a placeholder for future implementation"
- PUT endpoint doesn't exist
- DELETE endpoint doesn't exist

**Blocker:**
Data flows API needs full implementation before database schema can be tested.

**TODO (separate from migration):**
1. Implement POST /api/v1/context/data-flows
2. Implement PUT /api/v1/context/data-flows/[id]
3. Implement DELETE /api/v1/context/data-flows/[id]
4. Create data-flow.repository.ts
5. Create data-flow.service.ts
6. Then test for schema issues

**Skip for now** - Focus on Vendors and Locations which have real endpoints.

---

### **1.2 Vendors** (/context/vendors)

**Test Sequence:**
1. Navigate to https://dpia.avantle.ai/en/context/vendors
2. Click "Add Vendor" - create new vendor with all fields
3. Edit existing vendor - change fields and save
4. Delete vendor - verify deletion works

**Watch For:**
- POST 500 errors on create
- PUT 500 errors on update
- DELETE 500 errors on delete (likely soft delete issue)
- Check Vercel logs for specific column errors

**Known Issues:**
- deleted_at column missing (confirmed v3.25.28)
- May have created_by/updated_by missing

---

### **1.3 Locations** (/context/locations)

**Test Sequence:**
1. Navigate to https://dpia.avantle.ai/en/context/locations
2. Click "Add Location" - create new location with all fields
3. Edit existing location - change fields and save
4. Delete location - verify deletion works

**Watch For:**
- POST 500 errors on create
- PUT 500 errors on update
- DELETE 500 errors on delete (likely soft delete issue)
- Check Vercel logs for specific column errors

**Known Issues:**
- Preventive fixes applied (v3.25.30)
- Need to confirm if deleted_at actually missing

---

### **1.4 Systems** (/context/systems)

**Test Sequence:**
1. Navigate to https://dpia.avantle.ai/en/context/systems
2. Verify create/edit work (already known to work)
3. **DELETE operation** - ✅ CONFIRMED WORKING

**Status:**
- ✅ GET/POST/PUT working
- ✅ DELETE working
- **CONCLUSION:** Systems table likely has deleted_at column OR repository using hard delete
- Need to verify: Is this soft delete or hard delete?
- Check database to confirm deleted_at column exists

---

## Phase 2: Update Documentation (15 min)

### **2.1 Update DATABASE_SCHEMA_ISSUES.md**

For each module tested, add/update section with:

**Template:**
```markdown
### X. `table_name`

**Missing Columns:**
- column_name (TYPE) - **CONFIRMED vX.XX.XX** - OPERATION failed with "error message"

**Impact:**
- Specific functionality broken
- API endpoint returning 500

**Workaround Applied:** vX.XX.XX
- List of overrides applied

**Files Modified:**
- repository file
- service file (if applicable)
```

### **2.2 Update Migration Script**

Add any newly discovered missing columns to the migration SQL:

```sql
ALTER TABLE table_name
  ADD COLUMN IF NOT EXISTS column_name TYPE DEFAULT value;
```

### **2.3 Update Revert Instructions**

Add files that will need workarounds removed after migration:
- data-flow.repository.ts (if workarounds needed)
- vendor.repository.ts (confirm all overrides listed)
- physical-location.repository.ts (confirm all overrides listed)
- system.repository.ts (if workarounds needed)

---

## Phase 3: Single Migration (30 min + 2h testing)

### **3.1 Pre-Migration Checklist**

- [ ] All modules tested (Phase 1 complete)
- [ ] DATABASE_SCHEMA_ISSUES.md updated with all findings
- [ ] Migration script reviewed and complete
- [ ] Backup plan ready (rollback strategy)
- [ ] Maintenance window scheduled (optional)

### **3.2 Run Migration**

**Location:** Supabase SQL Editor or psql command line

**Script:** Use complete migration script from DATABASE_SCHEMA_ISSUES.md

**Steps:**
1. Copy SQL from DATABASE_SCHEMA_ISSUES.md (lines 115-247)
2. Review migration script one final time
3. Run in production database
4. Verify success (check for errors in output)

**Expected Duration:** 2-5 minutes

### **3.3 Revert Workarounds**

Remove all temporary fixes from code:

#### **File: processing-activity.repository.ts**
- [ ] Remove `findMany()` override
- [ ] Remove `findById()` override
- [ ] Remove `prepareCreateData()` override
- [ ] Remove `prepareUpdateData()` override
- [ ] Remove `delete()` override

#### **File: vendor.repository.ts**
- [ ] Remove `findMany()` override
- [ ] Remove `findById()` override
- [ ] Remove `findByIdWithRelations()` modifications

#### **File: physical-location.repository.ts**
- [ ] Remove `findMany()` override
- [ ] Remove `findById()` override
- [ ] Remove `prepareCreateData()` override
- [ ] Remove `prepareUpdateData()` override

#### **File: data-category.repository.ts**
- [ ] Remove `findMany()` override
- [ ] Remove `findById()` override
- [ ] Remove `prepareCreateData()` override
- [ ] Remove `prepareUpdateData()` override
- [ ] Remove `nameExistsInParent()` override (restore parent_id filtering)
- [ ] Remove `getChildCategories()` override (restore parent_id query)
- [ ] Remove `delete()` override (use soft delete)

#### **File: data-category.service.ts**
- [ ] Re-enable `validateParentChange()` call in updateDataCategory()
- [ ] Re-enable `special_category_basis` validation in validateDataCategoryData()
- [ ] Re-enable `parent_id` validation in validateDataCategoryData()

#### **File: data-flow.repository.ts** (if applicable)
- [ ] TBD based on Phase 1 findings

#### **File: system.repository.ts** (if applicable)
- [ ] TBD based on Phase 1 findings

### **3.4 Testing After Migration**

Test ALL Context module CRUD operations:

#### **Processing Activities**
- [ ] GET /api/v1/context/processing-activities (list)
- [ ] POST /api/v1/context/processing-activities (create)
- [ ] GET /api/v1/context/processing-activities/[id] (read)
- [ ] PUT /api/v1/context/processing-activities/[id] (update)
- [ ] DELETE /api/v1/context/processing-activities/[id] (soft delete)
- [ ] Verify soft delete (record has deleted_at timestamp)
- [ ] Verify audit trail (created_by/updated_by populated)

#### **Vendors**
- [ ] GET /api/v1/context/vendors (list)
- [ ] POST /api/v1/context/vendors (create)
- [ ] GET /api/v1/context/vendors/[id] (read)
- [ ] PUT /api/v1/context/vendors/[id] (update)
- [ ] DELETE /api/v1/context/vendors/[id] (soft delete)
- [ ] Verify soft delete works

#### **Locations**
- [ ] GET /api/v1/context/locations (list)
- [ ] POST /api/v1/context/locations (create)
- [ ] GET /api/v1/context/locations/[id] (read)
- [ ] PUT /api/v1/context/locations/[id] (update)
- [ ] DELETE /api/v1/context/locations/[id] (soft delete)
- [ ] Verify soft delete works

#### **Data Categories**
- [ ] GET /api/v1/context/data-categories (list)
- [ ] POST /api/v1/context/data-categories (create with special_category_basis)
- [ ] POST /api/v1/context/data-categories (create with parent_id - hierarchy)
- [ ] GET /api/v1/context/data-categories/[id] (read)
- [ ] PUT /api/v1/context/data-categories/[id] (update)
- [ ] DELETE /api/v1/context/data-categories/[id] (soft delete)
- [ ] Verify hierarchical structure works (parent/child)
- [ ] Verify special_category_basis validation works

#### **Data Flows**
- [ ] GET /api/v1/context/data-flows (list)
- [ ] POST /api/v1/context/data-flows (create)
- [ ] GET /api/v1/context/data-flows/[id] (read)
- [ ] PUT /api/v1/context/data-flows/[id] (update)
- [ ] DELETE /api/v1/context/data-flows/[id] (soft delete)

#### **Systems**
- [ ] GET /api/v1/context/systems (list)
- [ ] POST /api/v1/context/systems (create)
- [ ] GET /api/v1/context/systems/[id] (read)
- [ ] PUT /api/v1/context/systems/[id] (update)
- [ ] DELETE /api/v1/context/systems/[id] (soft delete)

### **3.5 Verify Schema Alignment**

```sql
-- Check all tables have required columns
SELECT
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN (
    'processing_activities',
    'vendors',
    'physical_locations',
    'data_categories',
    'systems',
    'data_flows'
  )
  AND column_name IN (
    'deleted_at',
    'created_by',
    'updated_by',
    'parent_id',
    'special_category_basis',
    'data_source'
  )
ORDER BY table_name, column_name;
```

### **3.6 Commit Changes**

After successful testing:

```bash
git add -A
git commit -m "MIGRATION COMPLETE: Remove all schema workarounds

Database migration applied successfully.
All Context tables now have proper schema.

REMOVED WORKAROUNDS:
- processing-activity.repository.ts (5 overrides)
- vendor.repository.ts (3 overrides)
- physical-location.repository.ts (4 overrides)
- data-category.repository.ts (7 overrides)
- data-category.service.ts (3 validation disables)

VERIFIED:
- All CRUD operations working
- Soft delete functional
- Audit trail capturing created_by/updated_by
- Data categories hierarchy working
- Special category basis validation working

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

git push origin main
```

---

## Rollback Plan

If migration fails:

### **Option 1: Rollback Database**

```sql
BEGIN;

-- Drop newly added columns
ALTER TABLE processing_activities
  DROP COLUMN IF EXISTS deleted_at,
  DROP COLUMN IF EXISTS created_by,
  DROP COLUMN IF EXISTS updated_by,
  DROP COLUMN IF EXISTS data_source;

-- Repeat for other tables...

COMMIT;
```

### **Option 2: Keep Migration, Restore Workarounds**

If migration succeeds but code changes break:
- Revert git commit
- Keep database schema changes
- Debug code issues separately

---

## Success Criteria

- [ ] All 6 Context modules have complete CRUD working
- [ ] Soft delete operational (deleted_at timestamps visible)
- [ ] Audit trail working (created_by/updated_by populated)
- [ ] Data categories hierarchy functional
- [ ] Special category basis validation working
- [ ] Zero schema-related 500 errors
- [ ] All workarounds removed from codebase
- [ ] Build passes with no TypeScript errors

---

## Risk Assessment

**Low Risk:**
- Migration uses `IF NOT EXISTS` - safe to run multiple times
- Existing data preserved (only adding columns)
- Code changes are removals (reverting to standard behavior)

**Medium Risk:**
- Soft delete behavior change (hard delete → soft delete)
- Need to verify frontend properly handles soft-deleted records

**Mitigation:**
- Test thoroughly in Phase 3.4
- Have rollback plan ready
- Can revert code independently of database

---

## Notes

- Current version: v3.25.35
- All data_categories CRUD working with workarounds
- Processing activities working with workarounds (v3.25.24-29)
- Vendors GET working with workarounds (v3.25.28)
- Locations have preventive fixes (v3.25.30)
- **Systems DELETE confirmed working** - table may already have deleted_at column

---

**Next Step:** Begin Phase 1 - Test Data Flows module
