-- Combined Migration 6 & 7: Fix Systems Tables for Context API
-- Part 1: Add audit columns
-- Part 2: Fix RLS policies for service role

-- =====================================================
-- PART 1: Add audit columns to systems tables
-- =====================================================

-- Add audit columns to systems table
DO $$
BEGIN
  -- Add created_by column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'systems' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE systems ADD COLUMN created_by uuid;
    -- Set a default value for existing rows (use system user)
    UPDATE systems SET created_by = '00000000-0000-0000-0000-000000000001' WHERE created_by IS NULL;
    ALTER TABLE systems ALTER COLUMN created_by SET NOT NULL;
  END IF;

  -- Add updated_by column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'systems' AND column_name = 'updated_by'
  ) THEN
    ALTER TABLE systems ADD COLUMN updated_by uuid;
    UPDATE systems SET updated_by = '00000000-0000-0000-0000-000000000001' WHERE updated_by IS NULL;
    ALTER TABLE systems ALTER COLUMN updated_by SET NOT NULL;
  END IF;

  -- Add deleted_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'systems' AND column_name = 'deleted_at'
  ) THEN
    ALTER TABLE systems ADD COLUMN deleted_at timestamptz NULL;
  END IF;
END $$;

-- Add audit columns to system_endpoints table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'system_endpoints' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE system_endpoints ADD COLUMN created_by uuid;
    UPDATE system_endpoints SET created_by = '00000000-0000-0000-0000-000000000001' WHERE created_by IS NULL;
    ALTER TABLE system_endpoints ALTER COLUMN created_by SET NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'system_endpoints' AND column_name = 'updated_by'
  ) THEN
    ALTER TABLE system_endpoints ADD COLUMN updated_by uuid;
    UPDATE system_endpoints SET updated_by = '00000000-0000-0000-0000-000000000001' WHERE updated_by IS NULL;
    ALTER TABLE system_endpoints ALTER COLUMN updated_by SET NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'system_endpoints' AND column_name = 'deleted_at'
  ) THEN
    ALTER TABLE system_endpoints ADD COLUMN deleted_at timestamptz NULL;
  END IF;
END $$;

-- Add audit column to system_locations table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'system_locations' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE system_locations ADD COLUMN created_by uuid;
    UPDATE system_locations SET created_by = '00000000-0000-0000-0000-000000000001' WHERE created_by IS NULL;
    ALTER TABLE system_locations ALTER COLUMN created_by SET NOT NULL;
  END IF;
END $$;

-- =====================================================
-- PART 2: Fix RLS policies for service role
-- =====================================================

-- Drop existing RLS policies for systems
DROP POLICY IF EXISTS systems_select_policy ON systems;
DROP POLICY IF EXISTS systems_insert_policy ON systems;
DROP POLICY IF EXISTS systems_update_policy ON systems;

-- Recreate systems RLS policies with service role support
CREATE POLICY systems_select_policy ON systems
  FOR SELECT
  USING (
    auth.role() = 'service_role' OR
    (
      tenant_id = (auth.jwt() ->> 'tenant_id')::uuid AND
      workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
    )
  );

CREATE POLICY systems_insert_policy ON systems
  FOR INSERT
  WITH CHECK (
    auth.role() = 'service_role' OR
    (
      tenant_id = (auth.jwt() ->> 'tenant_id')::uuid AND
      workspace_id = (auth.jwt() ->> 'workspace_id')::uuid AND
      created_by = (auth.jwt() ->> 'sub')::uuid
    )
  );

CREATE POLICY systems_update_policy ON systems
  FOR UPDATE
  USING (
    auth.role() = 'service_role' OR
    (
      tenant_id = (auth.jwt() ->> 'tenant_id')::uuid AND
      workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
    )
  )
  WITH CHECK (
    auth.role() = 'service_role' OR
    (
      tenant_id = (auth.jwt() ->> 'tenant_id')::uuid AND
      workspace_id = (auth.jwt() ->> 'workspace_id')::uuid AND
      updated_by = (auth.jwt() ->> 'sub')::uuid
    )
  );

-- Drop existing RLS policies for system_endpoints
DROP POLICY IF EXISTS system_endpoints_select_policy ON system_endpoints;
DROP POLICY IF EXISTS system_endpoints_insert_policy ON system_endpoints;
DROP POLICY IF EXISTS system_endpoints_update_policy ON system_endpoints;

-- Recreate system_endpoints RLS policies with service role support
CREATE POLICY system_endpoints_select_policy ON system_endpoints
  FOR SELECT
  USING (
    auth.role() = 'service_role' OR
    (
      tenant_id = (auth.jwt() ->> 'tenant_id')::uuid AND
      workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
    )
  );

CREATE POLICY system_endpoints_insert_policy ON system_endpoints
  FOR INSERT
  WITH CHECK (
    auth.role() = 'service_role' OR
    (
      tenant_id = (auth.jwt() ->> 'tenant_id')::uuid AND
      workspace_id = (auth.jwt() ->> 'workspace_id')::uuid AND
      created_by = (auth.jwt() ->> 'sub')::uuid
    )
  );

CREATE POLICY system_endpoints_update_policy ON system_endpoints
  FOR UPDATE
  USING (
    auth.role() = 'service_role' OR
    (
      tenant_id = (auth.jwt() ->> 'tenant_id')::uuid AND
      workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
    )
  )
  WITH CHECK (
    auth.role() = 'service_role' OR
    (
      tenant_id = (auth.jwt() ->> 'tenant_id')::uuid AND
      workspace_id = (auth.jwt() ->> 'workspace_id')::uuid AND
      updated_by = (auth.jwt() ->> 'sub')::uuid
    )
  );

-- Drop existing RLS policies for system_locations
DROP POLICY IF EXISTS system_locations_select_policy ON system_locations;
DROP POLICY IF EXISTS system_locations_insert_policy ON system_locations;
DROP POLICY IF EXISTS system_locations_delete_policy ON system_locations;

-- Recreate system_locations RLS policies with service role support
CREATE POLICY system_locations_select_policy ON system_locations
  FOR SELECT
  USING (
    auth.role() = 'service_role' OR
    EXISTS (
      SELECT 1 FROM systems s
      WHERE s.id = system_id
      AND s.tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
      AND s.workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
    )
  );

CREATE POLICY system_locations_insert_policy ON system_locations
  FOR INSERT
  WITH CHECK (
    auth.role() = 'service_role' OR
    (
      EXISTS (
        SELECT 1 FROM systems s
        WHERE s.id = system_id
        AND s.tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
        AND s.workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
      ) AND
      created_by = (auth.jwt() ->> 'sub')::uuid
    )
  );

CREATE POLICY system_locations_delete_policy ON system_locations
  FOR DELETE
  USING (
    auth.role() = 'service_role' OR
    EXISTS (
      SELECT 1 FROM systems s
      WHERE s.id = system_id
      AND s.tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
      AND s.workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
    )
  );
