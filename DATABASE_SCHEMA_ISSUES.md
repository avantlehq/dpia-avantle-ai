# Database Schema Mismatch Issues

**Status:** 🔴 CRITICAL - Production database schema differs from TypeScript types
**Impact:** Context module CRUD operations failing with 500 errors
**Root Cause:** TypeScript types (database.types.ts) generated from different schema version than production database

---

## Summary

Production database is missing columns and enum values that TypeScript types declare. This causes runtime errors when repository code tries to insert/update data with non-existent columns or enum values.

## Affected Tables

### 1. `processing_activities`

**Missing Columns:**
- `deleted_at` (TIMESTAMP)
- `created_by` (UUID)
- `updated_by` (UUID)
- `data_source` (VARCHAR)

**Missing Enum Values:**
- `special_category_basis` enum missing value: `'employment'`

**Impact:**
- Soft delete not possible (hard delete only)
- No audit trail for who created/modified records
- Cannot track data lineage
- "employment" basis silently mapped to null

**Workaround Applied:** v3.25.24, v3.25.26, v3.25.27, v3.25.29
- Override `findMany()` - skip deleted_at filter
- Override `findById()` - skip deleted_at filter
- Override `prepareCreateData()` - whitelist fields, filter employment enum
- Override `prepareUpdateData()` - whitelist fields, filter employment enum
- Override `delete()` - use hard delete

---

### 2. `vendors`

**Missing Columns:**
- `deleted_at` (TIMESTAMP)
- Possibly `created_by`, `updated_by` (not confirmed)

**Impact:**
- Soft delete not possible
- GET /api/v1/context/vendors returned 500

**Workaround Applied:** v3.25.28
- Override `findMany()` - skip deleted_at filter
- Override `findById()` - skip deleted_at filter
- Override `findByIdWithRelations()` - skip deleted_at filter

---

### 3. `physical_locations`

**Potentially Missing Columns:**
- `deleted_at` (TIMESTAMP)
- `created_by` (UUID)
- `updated_by` (UUID)

**Status:** Preventive fix applied (v3.25.30)

**Workaround Applied:** v3.25.30
- Override `findMany()` - skip deleted_at filter
- Override `findById()` - skip deleted_at filter
- Override `prepareCreateData()` - whitelist fields
- Override `prepareUpdateData()` - whitelist fields

---

### 4. `data_categories`

**Missing Columns:**
- `parent_id` (UUID) - **CONFIRMED v3.25.32** - POST failed with "column data_categories.parent_id does not exist"
- `deleted_at` (TIMESTAMP)
- `created_by` (UUID)
- `updated_by` (UUID)

**Missing Enum Values:**
- `special_category_basis` enum missing value: `'employment'`

**Impact:**
- Cannot create hierarchical category structure
- POST /api/v1/context/data-categories returned 500
- nameExistsInParent validation failed

**Workaround Applied:** v3.25.30, v3.25.32
- Override `findMany()` - skip deleted_at filter
- Override `findById()` - skip deleted_at filter
- Override `prepareCreateData()` - whitelist fields, filter employment enum, skip parent_id
- Override `prepareUpdateData()` - whitelist fields, filter employment enum, skip parent_id
- Override `nameExistsInParent()` - check name uniqueness globally instead of per-parent

---

### 5. `systems`

**Potentially Missing Columns:**
- Status: UNKNOWN (systems endpoint working but may have deleted_at column)
- Has `.is('deleted_at', null)` in repository code (lines 57, 123)

**Status:** Needs investigation. If errors occur, apply same pattern as other repositories.

---

## Proper Fix: Database Migration

**RECOMMENDED:** Apply these migrations to production database to resolve schema mismatches permanently.

### Migration Script

```sql
-- ============================================================================
-- Context Module - Schema Alignment Migration
-- Version: 1.0.0
-- Date: 2026-01-17
-- Purpose: Add missing columns to align production DB with TypeScript types
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. Add soft delete support to all Context tables
-- ----------------------------------------------------------------------------

ALTER TABLE processing_activities
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP DEFAULT NULL;

ALTER TABLE vendors
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP DEFAULT NULL;

ALTER TABLE physical_locations
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP DEFAULT NULL;

ALTER TABLE data_categories
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP DEFAULT NULL;

ALTER TABLE systems
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP DEFAULT NULL;

-- Create index for soft delete queries
CREATE INDEX IF NOT EXISTS idx_processing_activities_deleted_at
  ON processing_activities(deleted_at) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_vendors_deleted_at
  ON vendors(deleted_at) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_physical_locations_deleted_at
  ON physical_locations(deleted_at) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_data_categories_deleted_at
  ON data_categories(deleted_at) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_systems_deleted_at
  ON systems(deleted_at) WHERE deleted_at IS NULL;

-- ----------------------------------------------------------------------------
-- 2. Add audit trail columns
-- ----------------------------------------------------------------------------

ALTER TABLE processing_activities
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);

ALTER TABLE vendors
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);

ALTER TABLE physical_locations
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);

ALTER TABLE data_categories
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);

-- ----------------------------------------------------------------------------
-- 3. Add data lineage column
-- ----------------------------------------------------------------------------

ALTER TABLE processing_activities
  ADD COLUMN IF NOT EXISTS data_source VARCHAR(255) DEFAULT 'manual';

-- ----------------------------------------------------------------------------
-- 4. Fix enum values
-- ----------------------------------------------------------------------------

-- Check if 'employment' value exists in enum
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumlabel = 'employment'
    AND enumtypid = 'special_category_basis'::regtype
  ) THEN
    ALTER TYPE special_category_basis ADD VALUE 'employment';
  END IF;
END$$;

-- ----------------------------------------------------------------------------
-- 5. Add parent_id column for hierarchical structure
-- ----------------------------------------------------------------------------

ALTER TABLE data_categories
  ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES data_categories(id) ON DELETE SET NULL;

-- Create index for hierarchy queries
CREATE INDEX IF NOT EXISTS idx_data_categories_parent_id
  ON data_categories(parent_id);

-- ----------------------------------------------------------------------------
-- 6. Update existing records with default values
-- ----------------------------------------------------------------------------

-- Set created_by/updated_by to first admin user for existing records
-- Adjust this based on your actual admin user ID
UPDATE processing_activities
SET created_by = (SELECT id FROM auth.users WHERE email = 'admin@avantle.ai' LIMIT 1),
    updated_by = (SELECT id FROM auth.users WHERE email = 'admin@avantle.ai' LIMIT 1)
WHERE created_by IS NULL;

UPDATE vendors
SET created_by = (SELECT id FROM auth.users WHERE email = 'admin@avantle.ai' LIMIT 1),
    updated_by = (SELECT id FROM auth.users WHERE email = 'admin@avantle.ai' LIMIT 1)
WHERE created_by IS NULL;

UPDATE physical_locations
SET created_by = (SELECT id FROM auth.users WHERE email = 'admin@avantle.ai' LIMIT 1),
    updated_by = (SELECT id FROM auth.users WHERE email = 'admin@avantle.ai' LIMIT 1)
WHERE created_by IS NULL;

UPDATE data_categories
SET created_by = (SELECT id FROM auth.users WHERE email = 'admin@avantle.ai' LIMIT 1),
    updated_by = (SELECT id FROM auth.users WHERE email = 'admin@avantle.ai' LIMIT 1)
WHERE created_by IS NULL;

COMMIT;
```

---

## After Migration: Revert Workarounds

Once migration is applied to production, **remove repository overrides** to use BaseRepository default behavior:

### Files to Update

1. **processing-activity.repository.ts**
   - Remove `findMany()` override
   - Remove `findById()` override
   - Remove `prepareCreateData()` override (or simplify to not filter employment)
   - Remove `prepareUpdateData()` override (or simplify to not filter employment)
   - Remove `delete()` override

2. **vendor.repository.ts**
   - Remove `findMany()` override
   - Remove `findById()` override
   - Remove `findByIdWithRelations()` modifications

3. **physical-location.repository.ts**
   - Remove `findMany()` override
   - Remove `findById()` override
   - Remove `prepareCreateData()` override
   - Remove `prepareUpdateData()` override

4. **data-category.repository.ts**
   - Remove `findMany()` override
   - Remove `findById()` override
   - Remove `prepareCreateData()` override (or simplify to not filter employment)
   - Remove `prepareUpdateData()` override (or simplify to not filter employment)

---

## Verification Steps

After applying migration:

```bash
# 1. Verify columns exist
psql -h <host> -U <user> -d <database> -c "
  SELECT column_name, data_type
  FROM information_schema.columns
  WHERE table_name = 'processing_activities'
  AND column_name IN ('deleted_at', 'created_by', 'updated_by', 'data_source');
"

# 2. Verify enum values
psql -h <host> -U <user> -d <database> -c "
  SELECT enumlabel
  FROM pg_enum
  WHERE enumtypid = 'special_category_basis'::regtype;
"

# 3. Test endpoints
curl https://dpia.avantle.ai/api/v1/context/processing-activities
curl -X POST https://dpia.avantle.ai/api/v1/context/processing-activities \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","purpose":"Test","lawful_basis":"consent"}'
```

---

## Technical Debt

**Current State:**
- ✅ Workarounds functional (v3.25.19 - v3.25.30)
- ❌ Soft delete unavailable
- ❌ Audit trail incomplete
- ❌ Data lineage tracking missing

**Target State:**
- ✅ Schema aligned with types
- ✅ Soft delete operational
- ✅ Full audit trail
- ✅ Data lineage tracked

**Migration Priority:** HIGH
**Estimated Effort:** 30 minutes (migration) + 2 hours (testing + revert workarounds)

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| v3.25.24 | 2026-01-17 | Processing activities: deleted_at workaround |
| v3.25.26 | 2026-01-17 | Processing activities: audit columns workaround |
| v3.25.27 | 2026-01-17 | Processing activities: data_source whitelist |
| v3.25.28 | 2026-01-17 | Vendors: deleted_at workaround |
| v3.25.29 | 2026-01-17 | Processing activities: employment enum filter |
| v3.25.30 | 2026-01-17 | Preventive: locations, data-categories |

---

**Generated:** 2026-01-17
**Author:** Claude Code
**Contact:** See CLAUDE.md for development context
