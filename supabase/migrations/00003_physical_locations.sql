-- Migration 3: Physical Locations (TENANT-SCOPED)
-- Context Module - Database Schema & RLS (Supabase)

-- Physical locations table
CREATE TABLE physical_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  workspace_id uuid NOT NULL,
  name text NOT NULL,
  address text,
  jurisdiction_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid NOT NULL,
  updated_by uuid NOT NULL,
  deleted_at timestamptz NULL,
  
  CONSTRAINT fk_physical_locations_jurisdiction 
    FOREIGN KEY (jurisdiction_id) REFERENCES jurisdictions(id)
    ON DELETE RESTRICT
);

-- Indexes
CREATE INDEX idx_physical_locations_tenant_workspace ON physical_locations(tenant_id, workspace_id);
CREATE INDEX idx_physical_locations_tenant_workspace_status ON physical_locations(tenant_id, workspace_id, status);
CREATE INDEX idx_physical_locations_created_at ON physical_locations(created_at);
CREATE INDEX idx_physical_locations_jurisdiction_id ON physical_locations(jurisdiction_id);
CREATE INDEX idx_physical_locations_name ON physical_locations(name);

-- Updated at trigger
CREATE TRIGGER trigger_physical_locations_updated_at
  BEFORE UPDATE ON physical_locations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS policies
ALTER TABLE physical_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY physical_locations_select_policy ON physical_locations
  FOR SELECT
  USING (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid AND
    workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
  );

CREATE POLICY physical_locations_insert_policy ON physical_locations
  FOR INSERT
  WITH CHECK (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid AND
    workspace_id = (auth.jwt() ->> 'workspace_id')::uuid AND
    created_by = (auth.jwt() ->> 'sub')::uuid
  );

CREATE POLICY physical_locations_update_policy ON physical_locations
  FOR UPDATE
  USING (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid AND
    workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
  )
  WITH CHECK (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid AND
    workspace_id = (auth.jwt() ->> 'workspace_id')::uuid AND
    updated_by = (auth.jwt() ->> 'sub')::uuid
  );

-- No delete policy - soft delete only via updated_by and deleted_at