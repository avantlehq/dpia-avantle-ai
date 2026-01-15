-- Migration 6: Fix Systems RLS Policies for Service Role
-- Allow service role to bypass RLS checks for Context API operations

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
