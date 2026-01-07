-- Seed test data for Context module tables
-- Run this in Supabase SQL Editor to create test data

-- Check all table structures first
SELECT 'systems' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'systems' 
UNION ALL
SELECT 'vendors' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'vendors'
UNION ALL  
SELECT 'physical_locations' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'physical_locations'
ORDER BY table_name, column_name;

-- Insert test systems (without created_by/updated_by - they don't exist in actual schema)
INSERT INTO systems (
  tenant_id, workspace_id, name, description, system_type, 
  owner_team, technical_contact, business_contact, criticality, 
  status
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
  'active'
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
  'active'
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
  'active'
);

-- Insert test vendors
INSERT INTO vendors (
  tenant_id, workspace_id, name, description, vendor_type,
  contact_email, contact_phone, website, status, 
  created_by, updated_by
) VALUES 
(
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Microsoft Corporation',
  'Cloud services and software provider',
  'technology',
  'support@microsoft.com',
  '+1-800-642-7676',
  'https://www.microsoft.com',
  'active',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001'
),
(
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Salesforce Inc.',
  'Customer relationship management platform',
  'saas',
  'support@salesforce.com',
  '+1-415-901-7000',
  'https://www.salesforce.com',
  'active',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001'
);

-- Insert test physical locations
INSERT INTO physical_locations (
  tenant_id, workspace_id, name, description, address_line1,
  city, postal_code, country_code, jurisdiction_id, status,
  created_by, updated_by
) VALUES 
(
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Bratislava Office',
  'Main office in Slovakia',
  'Námestie SNP 12',
  'Bratislava',
  '81106',
  'SK',
  '273293b3-e029-4841-820f-90c114d2f9f6',
  'active',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001'
),
(
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'London Office',
  'UK office location',
  '1 London Bridge Street',
  'London',
  'SE1 9GF',
  'GB',
  '77ecb198-af08-4241-99ad-a749aebbc7d9',
  'active',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001'
);

-- Insert test processing activities
INSERT INTO processing_activities (
  tenant_id, workspace_id, name, description, purpose,
  lawful_basis, special_category_basis, data_subject_types,
  status, created_by, updated_by
) VALUES 
(
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Customer Data Processing',
  'Processing customer information for sales and marketing',
  'Marketing and sales activities',
  'legitimate_interest',
  null,
  ARRAY['customers', 'prospects'],
  'active',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001'
),
(
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Employee Data Processing',
  'Processing employee personal data for HR purposes',
  'Human resources management',
  'contract',
  null,
  ARRAY['employees'],
  'active',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001'
);

SELECT 'Context test data seeded successfully!' as result;