-- Migration 6: Data Categories + Seed (TENANT-SCOPED)
-- Context Module - Database Schema & RLS (Supabase)

-- Data categories table
CREATE TABLE data_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  workspace_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  category_type data_category_type NOT NULL,
  sensitivity data_sensitivity NOT NULL DEFAULT 'internal',
  special_category_basis special_category_basis,
  is_standard boolean NOT NULL DEFAULT false,
  parent_id uuid,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid NOT NULL,
  updated_by uuid NOT NULL,
  deleted_at timestamptz NULL,
  
  CONSTRAINT fk_data_categories_parent
    FOREIGN KEY (parent_id) REFERENCES data_categories(id)
    ON DELETE SET NULL,
  CONSTRAINT data_categories_special_basis_check
    CHECK (
      (category_type = 'special' AND special_category_basis IS NOT NULL) OR
      (category_type != 'special' AND special_category_basis IS NULL)
    )
);

-- Indexes
CREATE INDEX idx_data_categories_tenant_workspace ON data_categories(tenant_id, workspace_id);
CREATE INDEX idx_data_categories_tenant_workspace_status ON data_categories(tenant_id, workspace_id, status);
CREATE INDEX idx_data_categories_created_at ON data_categories(created_at);
CREATE INDEX idx_data_categories_name ON data_categories(name);
CREATE INDEX idx_data_categories_type ON data_categories(category_type);
CREATE INDEX idx_data_categories_parent_id ON data_categories(parent_id);

-- Updated at trigger
CREATE TRIGGER trigger_data_categories_updated_at
  BEFORE UPDATE ON data_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS policies
ALTER TABLE data_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY data_categories_select_policy ON data_categories
  FOR SELECT
  USING (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid AND
    workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
  );

CREATE POLICY data_categories_insert_policy ON data_categories
  FOR INSERT
  WITH CHECK (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid AND
    workspace_id = (auth.jwt() ->> 'workspace_id')::uuid AND
    created_by = (auth.jwt() ->> 'sub')::uuid
  );

CREATE POLICY data_categories_update_policy ON data_categories
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

-- Function to seed standard GDPR data categories for a tenant/workspace
CREATE OR REPLACE FUNCTION seed_standard_data_categories(
  p_tenant_id uuid,
  p_workspace_id uuid,
  p_created_by uuid
)
RETURNS void AS $$
DECLARE
  contact_id uuid;
  identification_id uuid;
  financial_id uuid;
  employment_id uuid;
  health_id uuid;
  biometric_id uuid;
  location_id uuid;
  technical_id uuid;
BEGIN
  -- Personal Data Categories
  INSERT INTO data_categories (tenant_id, workspace_id, name, description, category_type, sensitivity, is_standard, created_by, updated_by)
  VALUES 
    (p_tenant_id, p_workspace_id, 'Contact Information', 'Email addresses, phone numbers, postal addresses', 'personal', 'internal', true, p_created_by, p_created_by)
    RETURNING id INTO contact_id;
    
  INSERT INTO data_categories (tenant_id, workspace_id, name, description, category_type, sensitivity, is_standard, created_by, updated_by)
  VALUES 
    (p_tenant_id, p_workspace_id, 'Identification Data', 'Names, ID numbers, passport details', 'personal', 'confidential', true, p_created_by, p_created_by)
    RETURNING id INTO identification_id;
    
  INSERT INTO data_categories (tenant_id, workspace_id, name, description, category_type, sensitivity, is_standard, created_by, updated_by)
  VALUES 
    (p_tenant_id, p_workspace_id, 'Financial Information', 'Payment details, bank account numbers, financial history', 'personal', 'restricted', true, p_created_by, p_created_by)
    RETURNING id INTO financial_id;
    
  INSERT INTO data_categories (tenant_id, workspace_id, name, description, category_type, sensitivity, is_standard, created_by, updated_by)
  VALUES 
    (p_tenant_id, p_workspace_id, 'Employment Data', 'Job title, salary, employment history, performance reviews', 'personal', 'confidential', true, p_created_by, p_created_by)
    RETURNING id INTO employment_id;
    
  INSERT INTO data_categories (tenant_id, workspace_id, name, description, category_type, sensitivity, is_standard, created_by, updated_by)
  VALUES 
    (p_tenant_id, p_workspace_id, 'Technical Data', 'IP addresses, device identifiers, log files, cookies', 'personal', 'internal', true, p_created_by, p_created_by)
    RETURNING id INTO technical_id;
    
  INSERT INTO data_categories (tenant_id, workspace_id, name, description, category_type, sensitivity, is_standard, created_by, updated_by)
  VALUES 
    (p_tenant_id, p_workspace_id, 'Location Data', 'Geographic location, GPS coordinates, travel history', 'personal', 'confidential', true, p_created_by, p_created_by)
    RETURNING id INTO location_id;

  -- Special Categories
  INSERT INTO data_categories (tenant_id, workspace_id, name, description, category_type, sensitivity, special_category_basis, is_standard, created_by, updated_by)
  VALUES 
    (p_tenant_id, p_workspace_id, 'Health Data', 'Medical records, health conditions, treatment history', 'special', 'restricted', 'healthcare', true, p_created_by, p_created_by)
    RETURNING id INTO health_id;
    
  INSERT INTO data_categories (tenant_id, workspace_id, name, description, category_type, sensitivity, special_category_basis, is_standard, created_by, updated_by)
  VALUES 
    (p_tenant_id, p_workspace_id, 'Biometric Data', 'Fingerprints, facial recognition, voice patterns', 'special', 'restricted', 'explicit_consent', true, p_created_by, p_created_by)
    RETURNING id INTO biometric_id;
    
  INSERT INTO data_categories (tenant_id, workspace_id, name, description, category_type, sensitivity, special_category_basis, is_standard, created_by, updated_by)
  VALUES 
    (p_tenant_id, p_workspace_id, 'Ethnic/Racial Origin', 'Information about racial or ethnic origin', 'special', 'restricted', 'explicit_consent', true, p_created_by, p_created_by);
    
  INSERT INTO data_categories (tenant_id, workspace_id, name, description, category_type, sensitivity, special_category_basis, is_standard, created_by, updated_by)
  VALUES 
    (p_tenant_id, p_workspace_id, 'Religious Beliefs', 'Religious or philosophical beliefs', 'special', 'restricted', 'explicit_consent', true, p_created_by, p_created_by);
    
  INSERT INTO data_categories (tenant_id, workspace_id, name, description, category_type, sensitivity, special_category_basis, is_standard, created_by, updated_by)
  VALUES 
    (p_tenant_id, p_workspace_id, 'Political Opinions', 'Political views and affiliations', 'special', 'restricted', 'explicit_consent', true, p_created_by, p_created_by);
    
  INSERT INTO data_categories (tenant_id, workspace_id, name, description, category_type, sensitivity, special_category_basis, is_standard, created_by, updated_by)
  VALUES 
    (p_tenant_id, p_workspace_id, 'Sexual Orientation', 'Information about sexual orientation or sex life', 'special', 'restricted', 'explicit_consent', true, p_created_by, p_created_by);

  -- Criminal Data
  INSERT INTO data_categories (tenant_id, workspace_id, name, description, category_type, sensitivity, is_standard, created_by, updated_by)
  VALUES 
    (p_tenant_id, p_workspace_id, 'Criminal Convictions', 'Criminal history, convictions, legal proceedings', 'criminal', 'restricted', true, p_created_by, p_created_by);
    
  -- Subcategories for Contact Information
  INSERT INTO data_categories (tenant_id, workspace_id, name, description, category_type, sensitivity, parent_id, is_standard, created_by, updated_by)
  VALUES 
    (p_tenant_id, p_workspace_id, 'Email Addresses', 'Personal and business email addresses', 'personal', 'internal', contact_id, true, p_created_by, p_created_by),
    (p_tenant_id, p_workspace_id, 'Phone Numbers', 'Mobile and landline phone numbers', 'personal', 'internal', contact_id, true, p_created_by, p_created_by),
    (p_tenant_id, p_workspace_id, 'Postal Addresses', 'Home and business addresses', 'personal', 'confidential', contact_id, true, p_created_by, p_created_by);

END;
$$ LANGUAGE plpgsql;