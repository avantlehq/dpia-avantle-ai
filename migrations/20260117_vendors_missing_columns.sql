-- ============================================================================
-- Vendors Table - Missing Columns Migration
-- Version: 1.0.0
-- Date: 2026-01-17
-- Purpose: Add vendor_role, status, has_dpa, dpa_expires, location columns
--
-- IMPORTANT: Run this AFTER 20260117_context_schema_alignment.sql
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. Create vendor_role enum type (if doesn't exist)
-- ----------------------------------------------------------------------------

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vendor_role_type') THEN
    CREATE TYPE vendor_role_type AS ENUM ('processor', 'joint_controller', 'recipient', 'sub_processor');
  END IF;
END$$;

-- ----------------------------------------------------------------------------
-- 2. Add vendor_role column
-- ----------------------------------------------------------------------------

ALTER TABLE vendors
  ADD COLUMN IF NOT EXISTS vendor_role vendor_role_type DEFAULT 'processor';

-- Backfill existing records with default value (all existing vendors are processors)
UPDATE vendors SET vendor_role = 'processor' WHERE vendor_role IS NULL;

-- ----------------------------------------------------------------------------
-- 3. Add status column (reuse existing entity_status enum)
-- ----------------------------------------------------------------------------

ALTER TABLE vendors
  ADD COLUMN IF NOT EXISTS status entity_status DEFAULT 'active';

-- ----------------------------------------------------------------------------
-- 4. Add DPA (Data Processing Agreement) tracking columns
-- ----------------------------------------------------------------------------

ALTER TABLE vendors
  ADD COLUMN IF NOT EXISTS has_dpa BOOLEAN DEFAULT false;

ALTER TABLE vendors
  ADD COLUMN IF NOT EXISTS dpa_expires DATE DEFAULT NULL;

-- ----------------------------------------------------------------------------
-- 5. Add location column (free text, not FK to physical_locations)
-- ----------------------------------------------------------------------------

ALTER TABLE vendors
  ADD COLUMN IF NOT EXISTS location VARCHAR(100) DEFAULT NULL;

-- ----------------------------------------------------------------------------
-- 6. Create indexes for filtering and searching
-- ----------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_vendors_vendor_role
  ON vendors(vendor_role);

CREATE INDEX IF NOT EXISTS idx_vendors_status
  ON vendors(status);

CREATE INDEX IF NOT EXISTS idx_vendors_has_dpa
  ON vendors(has_dpa);

CREATE INDEX IF NOT EXISTS idx_vendors_dpa_expires
  ON vendors(dpa_expires) WHERE dpa_expires IS NOT NULL;

COMMIT;

-- ============================================================================
-- Verification Queries
-- ============================================================================

-- Run these queries after migration to verify success:

-- 1. Check vendors has all new columns
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'vendors'
-- AND column_name IN ('vendor_role', 'status', 'has_dpa', 'dpa_expires', 'location')
-- ORDER BY column_name;

-- 2. Check vendor_role enum values
-- SELECT enumlabel FROM pg_enum WHERE enumtypid = 'vendor_role_type'::regtype;

-- 3. Verify existing vendors have default values
-- SELECT id, name, vendor_role, status, has_dpa, dpa_expires, location FROM vendors LIMIT 10;

-- ============================================================================
-- Rollback Script (if needed)
-- ============================================================================

/*
BEGIN;

ALTER TABLE vendors
  DROP COLUMN IF EXISTS vendor_role,
  DROP COLUMN IF EXISTS status,
  DROP COLUMN IF EXISTS has_dpa,
  DROP COLUMN IF EXISTS dpa_expires,
  DROP COLUMN IF EXISTS location;

DROP TYPE IF EXISTS vendor_role_type;

COMMIT;
*/
