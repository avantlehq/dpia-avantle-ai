-- Migration 7: Processing Activities + Joins + Retention (TENANT-SCOPED)
-- Context Module - Database Schema & RLS (Supabase)

-- Processing activities table
CREATE TABLE processing_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  workspace_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  purpose text NOT NULL,
  lawful_basis lawful_basis NOT NULL,
  lawful_basis_explanation text,
  data_subject_categories text,
  special_category_basis special_category_basis,
  automated_decision_making boolean DEFAULT false,
  profiling boolean DEFAULT false,
  data_source text,
  dpo_review_required boolean DEFAULT false,
  review_date date,
  last_review_date date,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid NOT NULL,
  updated_by uuid NOT NULL,
  deleted_at timestamptz NULL
);

-- Processing-Systems join table
CREATE TABLE processing_systems (
  processing_activity_id uuid NOT NULL,
  system_id uuid NOT NULL,
  system_role text CHECK (system_role IN ('primary', 'secondary', 'backup')),
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid NOT NULL,
  
  PRIMARY KEY (processing_activity_id, system_id),
  
  CONSTRAINT fk_processing_systems_activity
    FOREIGN KEY (processing_activity_id) REFERENCES processing_activities(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_processing_systems_system
    FOREIGN KEY (system_id) REFERENCES systems(id)
    ON DELETE CASCADE
);

-- Processing-Data Categories join table
CREATE TABLE processing_data_categories (
  processing_activity_id uuid NOT NULL,
  data_category_id uuid NOT NULL,
  necessity_justification text,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid NOT NULL,
  
  PRIMARY KEY (processing_activity_id, data_category_id),
  
  CONSTRAINT fk_processing_data_categories_activity
    FOREIGN KEY (processing_activity_id) REFERENCES processing_activities(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_processing_data_categories_category
    FOREIGN KEY (data_category_id) REFERENCES data_categories(id)
    ON DELETE CASCADE
);

-- Processing-Vendors join table
CREATE TABLE processing_vendors (
  processing_activity_id uuid NOT NULL,
  vendor_id uuid NOT NULL,
  vendor_role vendor_role NOT NULL,
  contract_required boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid NOT NULL,
  
  PRIMARY KEY (processing_activity_id, vendor_id),
  
  CONSTRAINT fk_processing_vendors_activity
    FOREIGN KEY (processing_activity_id) REFERENCES processing_activities(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_processing_vendors_vendor
    FOREIGN KEY (vendor_id) REFERENCES vendors(id)
    ON DELETE CASCADE
);

-- Retention policies table
CREATE TABLE retention_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  workspace_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  retention_period_years integer,
  retention_period_months integer,
  retention_criteria text NOT NULL,
  disposal_method text,
  legal_basis_for_retention text,
  review_frequency_months integer DEFAULT 12,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid NOT NULL,
  updated_by uuid NOT NULL,
  deleted_at timestamptz NULL,
  
  CONSTRAINT retention_policies_period_check
    CHECK (retention_period_years > 0 OR retention_period_months > 0)
);

-- Processing-Retention join table
CREATE TABLE processing_retention (
  processing_activity_id uuid NOT NULL,
  retention_policy_id uuid NOT NULL,
  applies_to_category text,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid NOT NULL,
  
  PRIMARY KEY (processing_activity_id, retention_policy_id),
  
  CONSTRAINT fk_processing_retention_activity
    FOREIGN KEY (processing_activity_id) REFERENCES processing_activities(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_processing_retention_policy
    FOREIGN KEY (retention_policy_id) REFERENCES retention_policies(id)
    ON DELETE CASCADE
);

-- Indexes for processing_activities
CREATE INDEX idx_processing_activities_tenant_workspace ON processing_activities(tenant_id, workspace_id);
CREATE INDEX idx_processing_activities_tenant_workspace_status ON processing_activities(tenant_id, workspace_id, status);
CREATE INDEX idx_processing_activities_created_at ON processing_activities(created_at);
CREATE INDEX idx_processing_activities_name ON processing_activities(name);
CREATE INDEX idx_processing_activities_lawful_basis ON processing_activities(lawful_basis);
CREATE INDEX idx_processing_activities_review_date ON processing_activities(review_date);

-- Indexes for join tables
CREATE INDEX idx_processing_systems_activity_id ON processing_systems(processing_activity_id);
CREATE INDEX idx_processing_systems_system_id ON processing_systems(system_id);
CREATE INDEX idx_processing_systems_created_at ON processing_systems(created_at);

CREATE INDEX idx_processing_data_categories_activity_id ON processing_data_categories(processing_activity_id);
CREATE INDEX idx_processing_data_categories_category_id ON processing_data_categories(data_category_id);
CREATE INDEX idx_processing_data_categories_created_at ON processing_data_categories(created_at);

CREATE INDEX idx_processing_vendors_activity_id ON processing_vendors(processing_activity_id);
CREATE INDEX idx_processing_vendors_vendor_id ON processing_vendors(vendor_id);
CREATE INDEX idx_processing_vendors_created_at ON processing_vendors(created_at);

CREATE INDEX idx_processing_retention_activity_id ON processing_retention(processing_activity_id);
CREATE INDEX idx_processing_retention_policy_id ON processing_retention(retention_policy_id);
CREATE INDEX idx_processing_retention_created_at ON processing_retention(created_at);

-- Indexes for retention_policies
CREATE INDEX idx_retention_policies_tenant_workspace ON retention_policies(tenant_id, workspace_id);
CREATE INDEX idx_retention_policies_tenant_workspace_status ON retention_policies(tenant_id, workspace_id, status);
CREATE INDEX idx_retention_policies_created_at ON retention_policies(created_at);
CREATE INDEX idx_retention_policies_name ON retention_policies(name);

-- Updated at triggers
CREATE TRIGGER trigger_processing_activities_updated_at
  BEFORE UPDATE ON processing_activities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_retention_policies_updated_at
  BEFORE UPDATE ON retention_policies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS policies for processing_activities
ALTER TABLE processing_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY processing_activities_select_policy ON processing_activities
  FOR SELECT
  USING (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid AND
    workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
  );

CREATE POLICY processing_activities_insert_policy ON processing_activities
  FOR INSERT
  WITH CHECK (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid AND
    workspace_id = (auth.jwt() ->> 'workspace_id')::uuid AND
    created_by = (auth.jwt() ->> 'sub')::uuid
  );

CREATE POLICY processing_activities_update_policy ON processing_activities
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

-- RLS policies for retention_policies
ALTER TABLE retention_policies ENABLE ROW LEVEL SECURITY;

CREATE POLICY retention_policies_select_policy ON retention_policies
  FOR SELECT
  USING (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid AND
    workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
  );

CREATE POLICY retention_policies_insert_policy ON retention_policies
  FOR INSERT
  WITH CHECK (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid AND
    workspace_id = (auth.jwt() ->> 'workspace_id')::uuid AND
    created_by = (auth.jwt() ->> 'sub')::uuid
  );

CREATE POLICY retention_policies_update_policy ON retention_policies
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

-- RLS policies for join tables (inherit security from parent entities)
ALTER TABLE processing_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE processing_data_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE processing_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE processing_retention ENABLE ROW LEVEL SECURITY;

-- processing_systems policies
CREATE POLICY processing_systems_select_policy ON processing_systems
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM processing_activities pa 
      WHERE pa.id = processing_activity_id 
      AND pa.tenant_id = (auth.jwt() ->> 'tenant_id')::uuid 
      AND pa.workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
    )
  );

CREATE POLICY processing_systems_insert_policy ON processing_systems
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM processing_activities pa 
      WHERE pa.id = processing_activity_id 
      AND pa.tenant_id = (auth.jwt() ->> 'tenant_id')::uuid 
      AND pa.workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
    ) AND
    created_by = (auth.jwt() ->> 'sub')::uuid
  );

CREATE POLICY processing_systems_delete_policy ON processing_systems
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM processing_activities pa 
      WHERE pa.id = processing_activity_id 
      AND pa.tenant_id = (auth.jwt() ->> 'tenant_id')::uuid 
      AND pa.workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
    )
  );

-- processing_data_categories policies
CREATE POLICY processing_data_categories_select_policy ON processing_data_categories
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM processing_activities pa 
      WHERE pa.id = processing_activity_id 
      AND pa.tenant_id = (auth.jwt() ->> 'tenant_id')::uuid 
      AND pa.workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
    )
  );

CREATE POLICY processing_data_categories_insert_policy ON processing_data_categories
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM processing_activities pa 
      WHERE pa.id = processing_activity_id 
      AND pa.tenant_id = (auth.jwt() ->> 'tenant_id')::uuid 
      AND pa.workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
    ) AND
    created_by = (auth.jwt() ->> 'sub')::uuid
  );

CREATE POLICY processing_data_categories_delete_policy ON processing_data_categories
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM processing_activities pa 
      WHERE pa.id = processing_activity_id 
      AND pa.tenant_id = (auth.jwt() ->> 'tenant_id')::uuid 
      AND pa.workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
    )
  );

-- processing_vendors policies  
CREATE POLICY processing_vendors_select_policy ON processing_vendors
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM processing_activities pa 
      WHERE pa.id = processing_activity_id 
      AND pa.tenant_id = (auth.jwt() ->> 'tenant_id')::uuid 
      AND pa.workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
    )
  );

CREATE POLICY processing_vendors_insert_policy ON processing_vendors
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM processing_activities pa 
      WHERE pa.id = processing_activity_id 
      AND pa.tenant_id = (auth.jwt() ->> 'tenant_id')::uuid 
      AND pa.workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
    ) AND
    created_by = (auth.jwt() ->> 'sub')::uuid
  );

CREATE POLICY processing_vendors_delete_policy ON processing_vendors
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM processing_activities pa 
      WHERE pa.id = processing_activity_id 
      AND pa.tenant_id = (auth.jwt() ->> 'tenant_id')::uuid 
      AND pa.workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
    )
  );

-- processing_retention policies
CREATE POLICY processing_retention_select_policy ON processing_retention
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM processing_activities pa 
      WHERE pa.id = processing_activity_id 
      AND pa.tenant_id = (auth.jwt() ->> 'tenant_id')::uuid 
      AND pa.workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
    )
  );

CREATE POLICY processing_retention_insert_policy ON processing_retention
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM processing_activities pa 
      WHERE pa.id = processing_activity_id 
      AND pa.tenant_id = (auth.jwt() ->> 'tenant_id')::uuid 
      AND pa.workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
    ) AND
    created_by = (auth.jwt() ->> 'sub')::uuid
  );

CREATE POLICY processing_retention_delete_policy ON processing_retention
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM processing_activities pa 
      WHERE pa.id = processing_activity_id 
      AND pa.tenant_id = (auth.jwt() ->> 'tenant_id')::uuid 
      AND pa.workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
    )
  );