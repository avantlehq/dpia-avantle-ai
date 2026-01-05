-- Migration 5: Systems + Endpoints + Locations (TENANT-SCOPED)
-- Context Module - Database Schema & RLS (Supabase)

-- Systems table
CREATE TABLE systems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  workspace_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  system_type text,
  owner_team text,
  technical_contact text,
  business_contact text,
  criticality text CHECK (criticality IN ('low', 'medium', 'high', 'critical')),
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid NOT NULL,
  updated_by uuid NOT NULL,
  deleted_at timestamptz NULL
);

-- System endpoints table
CREATE TABLE system_endpoints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  workspace_id uuid NOT NULL,
  system_id uuid NOT NULL,
  name text NOT NULL,
  endpoint_type endpoint_type NOT NULL,
  url text,
  description text,
  authentication_method text,
  encryption_in_transit boolean DEFAULT false,
  encryption_at_rest boolean DEFAULT false,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid NOT NULL,
  updated_by uuid NOT NULL,
  deleted_at timestamptz NULL,
  
  CONSTRAINT fk_system_endpoints_system
    FOREIGN KEY (system_id) REFERENCES systems(id)
    ON DELETE CASCADE
);

-- System locations join table
CREATE TABLE system_locations (
  system_id uuid NOT NULL,
  location_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid NOT NULL,
  
  PRIMARY KEY (system_id, location_id),
  
  CONSTRAINT fk_system_locations_system
    FOREIGN KEY (system_id) REFERENCES systems(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_system_locations_location
    FOREIGN KEY (location_id) REFERENCES physical_locations(id)
    ON DELETE CASCADE
);

-- Indexes for systems
CREATE INDEX idx_systems_tenant_workspace ON systems(tenant_id, workspace_id);
CREATE INDEX idx_systems_tenant_workspace_status ON systems(tenant_id, workspace_id, status);
CREATE INDEX idx_systems_created_at ON systems(created_at);
CREATE INDEX idx_systems_name ON systems(name);
CREATE INDEX idx_systems_criticality ON systems(criticality);

-- Indexes for system_endpoints
CREATE INDEX idx_system_endpoints_tenant_workspace ON system_endpoints(tenant_id, workspace_id);
CREATE INDEX idx_system_endpoints_tenant_workspace_status ON system_endpoints(tenant_id, workspace_id, status);
CREATE INDEX idx_system_endpoints_created_at ON system_endpoints(created_at);
CREATE INDEX idx_system_endpoints_system_id ON system_endpoints(system_id);
CREATE INDEX idx_system_endpoints_endpoint_type ON system_endpoints(endpoint_type);

-- Indexes for system_locations
CREATE INDEX idx_system_locations_system_id ON system_locations(system_id);
CREATE INDEX idx_system_locations_location_id ON system_locations(location_id);
CREATE INDEX idx_system_locations_created_at ON system_locations(created_at);

-- Updated at triggers
CREATE TRIGGER trigger_systems_updated_at
  BEFORE UPDATE ON systems
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_system_endpoints_updated_at
  BEFORE UPDATE ON system_endpoints
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS policies for systems
ALTER TABLE systems ENABLE ROW LEVEL SECURITY;

CREATE POLICY systems_select_policy ON systems
  FOR SELECT
  USING (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid AND
    workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
  );

CREATE POLICY systems_insert_policy ON systems
  FOR INSERT
  WITH CHECK (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid AND
    workspace_id = (auth.jwt() ->> 'workspace_id')::uuid AND
    created_by = (auth.jwt() ->> 'sub')::uuid
  );

CREATE POLICY systems_update_policy ON systems
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

-- RLS policies for system_endpoints
ALTER TABLE system_endpoints ENABLE ROW LEVEL SECURITY;

CREATE POLICY system_endpoints_select_policy ON system_endpoints
  FOR SELECT
  USING (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid AND
    workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
  );

CREATE POLICY system_endpoints_insert_policy ON system_endpoints
  FOR INSERT
  WITH CHECK (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid AND
    workspace_id = (auth.jwt() ->> 'workspace_id')::uuid AND
    created_by = (auth.jwt() ->> 'sub')::uuid
  );

CREATE POLICY system_endpoints_update_policy ON system_endpoints
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

-- RLS policies for system_locations
ALTER TABLE system_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY system_locations_select_policy ON system_locations
  FOR SELECT
  USING (
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
    EXISTS (
      SELECT 1 FROM systems s 
      WHERE s.id = system_id 
      AND s.tenant_id = (auth.jwt() ->> 'tenant_id')::uuid 
      AND s.workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
    ) AND
    created_by = (auth.jwt() ->> 'sub')::uuid
  );

CREATE POLICY system_locations_delete_policy ON system_locations
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM systems s 
      WHERE s.id = system_id 
      AND s.tenant_id = (auth.jwt() ->> 'tenant_id')::uuid 
      AND s.workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
    )
  );