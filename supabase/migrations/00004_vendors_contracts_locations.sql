-- Migration 4: Vendors + Contracts + Locations (TENANT-SCOPED)
-- Context Module - Database Schema & RLS (Supabase)

-- Vendors table
CREATE TABLE vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  workspace_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  contact_email text,
  contact_person text,
  website text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid NOT NULL,
  updated_by uuid NOT NULL,
  deleted_at timestamptz NULL,
  
  CONSTRAINT vendors_contact_email_check 
    CHECK (contact_email IS NULL OR is_valid_email(contact_email))
);

-- Vendor contracts table
CREATE TABLE vendor_contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  workspace_id uuid NOT NULL,
  vendor_id uuid NOT NULL,
  contract_type contract_type NOT NULL,
  title text NOT NULL,
  description text,
  effective_date date NOT NULL,
  expiry_date date,
  review_date date,
  attachment_id uuid,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid NOT NULL,
  updated_by uuid NOT NULL,
  deleted_at timestamptz NULL,
  
  CONSTRAINT fk_vendor_contracts_vendor
    FOREIGN KEY (vendor_id) REFERENCES vendors(id)
    ON DELETE CASCADE,
  CONSTRAINT vendor_contracts_dates_check
    CHECK (expiry_date IS NULL OR expiry_date > effective_date)
);

-- Vendor locations join table
CREATE TABLE vendor_locations (
  vendor_id uuid NOT NULL,
  location_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid NOT NULL,
  
  PRIMARY KEY (vendor_id, location_id),
  
  CONSTRAINT fk_vendor_locations_vendor
    FOREIGN KEY (vendor_id) REFERENCES vendors(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_vendor_locations_location
    FOREIGN KEY (location_id) REFERENCES physical_locations(id)
    ON DELETE CASCADE
);

-- Indexes for vendors
CREATE INDEX idx_vendors_tenant_workspace ON vendors(tenant_id, workspace_id);
CREATE INDEX idx_vendors_tenant_workspace_status ON vendors(tenant_id, workspace_id, status);
CREATE INDEX idx_vendors_created_at ON vendors(created_at);
CREATE INDEX idx_vendors_name ON vendors(name);

-- Indexes for vendor_contracts
CREATE INDEX idx_vendor_contracts_tenant_workspace ON vendor_contracts(tenant_id, workspace_id);
CREATE INDEX idx_vendor_contracts_tenant_workspace_status ON vendor_contracts(tenant_id, workspace_id, status);
CREATE INDEX idx_vendor_contracts_created_at ON vendor_contracts(created_at);
CREATE INDEX idx_vendor_contracts_vendor_id ON vendor_contracts(vendor_id);
CREATE INDEX idx_vendor_contracts_expiry_date ON vendor_contracts(expiry_date);

-- Indexes for vendor_locations
CREATE INDEX idx_vendor_locations_vendor_id ON vendor_locations(vendor_id);
CREATE INDEX idx_vendor_locations_location_id ON vendor_locations(location_id);
CREATE INDEX idx_vendor_locations_created_at ON vendor_locations(created_at);

-- Updated at triggers
CREATE TRIGGER trigger_vendors_updated_at
  BEFORE UPDATE ON vendors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_vendor_contracts_updated_at
  BEFORE UPDATE ON vendor_contracts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS policies for vendors
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY vendors_select_policy ON vendors
  FOR SELECT
  USING (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid AND
    workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
  );

CREATE POLICY vendors_insert_policy ON vendors
  FOR INSERT
  WITH CHECK (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid AND
    workspace_id = (auth.jwt() ->> 'workspace_id')::uuid AND
    created_by = (auth.jwt() ->> 'sub')::uuid
  );

CREATE POLICY vendors_update_policy ON vendors
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

-- RLS policies for vendor_contracts
ALTER TABLE vendor_contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY vendor_contracts_select_policy ON vendor_contracts
  FOR SELECT
  USING (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid AND
    workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
  );

CREATE POLICY vendor_contracts_insert_policy ON vendor_contracts
  FOR INSERT
  WITH CHECK (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid AND
    workspace_id = (auth.jwt() ->> 'workspace_id')::uuid AND
    created_by = (auth.jwt() ->> 'sub')::uuid
  );

CREATE POLICY vendor_contracts_update_policy ON vendor_contracts
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

-- RLS policies for vendor_locations (inherits security from parent tables)
ALTER TABLE vendor_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY vendor_locations_select_policy ON vendor_locations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM vendors v 
      WHERE v.id = vendor_id 
      AND v.tenant_id = (auth.jwt() ->> 'tenant_id')::uuid 
      AND v.workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
    )
  );

CREATE POLICY vendor_locations_insert_policy ON vendor_locations
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM vendors v 
      WHERE v.id = vendor_id 
      AND v.tenant_id = (auth.jwt() ->> 'tenant_id')::uuid 
      AND v.workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
    ) AND
    created_by = (auth.jwt() ->> 'sub')::uuid
  );

CREATE POLICY vendor_locations_delete_policy ON vendor_locations
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM vendors v 
      WHERE v.id = vendor_id 
      AND v.tenant_id = (auth.jwt() ->> 'tenant_id')::uuid 
      AND v.workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
    )
  );