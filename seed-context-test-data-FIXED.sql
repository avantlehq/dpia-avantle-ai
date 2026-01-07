-- Seed test data for Context module tables - FIXED VERSION
-- Run this in Supabase SQL Editor to create test data

-- Insert test systems (using actual schema)
INSERT INTO systems (
  tenant_id, workspace_id, name, description, system_type, 
  owner_team, technical_contact, business_contact, criticality, 
  status, encryption_at_rest, encryption_in_transit, access_logging_enabled
) VALUES 
(
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Customer Management System',
  'CRM system for managing customer relationships and sales data',
  'CRM',
  'Sales Team',
  'admin@dpia.avantle.ai',
  'sales@dpia.avantle.ai',
  'high',
  'active',
  true,
  true,
  true
),
(
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Employee Portal',
  'Internal HR system for employee data and payroll',
  'HR',
  'Human Resources',
  'hr-admin@dpia.avantle.ai',
  'hr@dpia.avantle.ai',
  'medium',
  'active',
  true,
  true,
  true
),
(
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Financial Analytics Platform',
  'Analytics system for financial reporting and business intelligence',
  'Analytics',
  'Finance Team',
  'finance-admin@dpia.avantle.ai',
  'finance@dpia.avantle.ai',
  'critical',
  'active',
  true,
  true,
  true
);

-- Insert test vendors (using actual schema)
INSERT INTO vendors (
  tenant_id, workspace_id, name, description, vendor_role,
  contact_email, phone_number, website, status, has_dpa
) VALUES 
(
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Microsoft Corporation',
  'Cloud services and software provider',
  'processor',
  'support@microsoft.com',
  '+1-800-642-7676',
  'https://www.microsoft.com',
  'active',
  true
),
(
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Salesforce Inc.',
  'Customer relationship management platform',
  'processor',
  'support@salesforce.com',
  '+1-415-901-7000',
  'https://www.salesforce.com',
  'active',
  true
);

-- Insert test physical locations (using actual schema)
INSERT INTO physical_locations (
  tenant_id, workspace_id, name, address, city, postal_code, 
  country_code, jurisdiction_id, status, is_primary_location
) VALUES 
(
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Bratislava Office',
  'Námestie SNP 12',
  'Bratislava',
  '81106',
  'SK',
  '273293b3-e029-4841-820f-90c114d2f9f6',
  'active',
  true
),
(
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'London Office',
  '1 London Bridge Street',
  'London',
  'SE1 9GF',
  'GB',
  '77ecb198-af08-4241-99ad-a749aebbc7d9',
  'active',
  false
);

-- Verify the data was inserted
SELECT 'Systems created:' as result, COUNT(*) as count FROM systems;
SELECT 'Vendors created:' as result, COUNT(*) as count FROM vendors;
SELECT 'Locations created:' as result, COUNT(*) as count FROM physical_locations;

SELECT 'Context test data seeded successfully!' as final_result;