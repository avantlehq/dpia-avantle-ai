-- ============================================================================
-- Jurisdictions Table - Insert EU/EEA and Common Countries
-- Version: 1.0.3
-- Date: 2026-01-17
-- Purpose: Insert all EU/EEA countries and common third countries
--
-- IMPORTANT: Run this AFTER 20260117_jurisdiction_names.sql
-- Note: All jurisdictions use global system tenant/workspace (00000000-0000-0000-0000-000000000001)
-- ============================================================================

BEGIN;

-- Austria
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'AT', 'Austria', 'Rakúsko', 'adequate', false, 'eu_member'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'AT');

-- Belgium
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'BE', 'Belgium', 'Belgicko', 'adequate', false, 'eu_member'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'BE');

-- Bulgaria
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'BG', 'Bulgaria', 'Bulharsko', 'adequate', false, 'eu_member'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'BG');

-- Croatia
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'HR', 'Croatia', 'Chorvátsko', 'adequate', false, 'eu_member'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'HR');

-- Cyprus
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'CY', 'Cyprus', 'Cyprus', 'adequate', false, 'eu_member'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'CY');

-- Czech Republic
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'CZ', 'Czech Republic', 'Česká republika', 'adequate', false, 'eu_member'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'CZ');

-- Denmark
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'DK', 'Denmark', 'Dánsko', 'adequate', false, 'eu_member'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'DK');

-- Estonia
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'EE', 'Estonia', 'Estónsko', 'adequate', false, 'eu_member'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'EE');

-- Finland
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'FI', 'Finland', 'Fínsko', 'adequate', false, 'eu_member'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'FI');

-- France
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'FR', 'France', 'Francúzsko', 'adequate', false, 'eu_member'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'FR');

-- Germany
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'DE', 'Germany', 'Nemecko', 'adequate', false, 'eu_member'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'DE');

-- Greece
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'GR', 'Greece', 'Grécko', 'adequate', false, 'eu_member'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'GR');

-- Hungary
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'HU', 'Hungary', 'Maďarsko', 'adequate', false, 'eu_member'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'HU');

-- Ireland
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'IE', 'Ireland', 'Írsko', 'adequate', false, 'eu_member'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'IE');

-- Italy
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'IT', 'Italy', 'Taliansko', 'adequate', false, 'eu_member'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'IT');

-- Latvia
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'LV', 'Latvia', 'Lotyšsko', 'adequate', false, 'eu_member'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'LV');

-- Lithuania
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'LT', 'Lithuania', 'Litva', 'adequate', false, 'eu_member'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'LT');

-- Luxembourg
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'LU', 'Luxembourg', 'Luxembursko', 'adequate', false, 'eu_member'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'LU');

-- Malta
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'MT', 'Malta', 'Malta', 'adequate', false, 'eu_member'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'MT');

-- Netherlands
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'NL', 'Netherlands', 'Holandsko', 'adequate', false, 'eu_member'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'NL');

-- Poland
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'PL', 'Poland', 'Poľsko', 'adequate', false, 'eu_member'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'PL');

-- Portugal
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'PT', 'Portugal', 'Portugalsko', 'adequate', false, 'eu_member'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'PT');

-- Romania
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'RO', 'Romania', 'Rumunsko', 'adequate', false, 'eu_member'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'RO');

-- Slovenia
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'SI', 'Slovenia', 'Slovinsko', 'adequate', false, 'eu_member'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'SI');

-- Spain
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'ES', 'Spain', 'Španielsko', 'adequate', false, 'eu_member'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'ES');

-- Sweden
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'SE', 'Sweden', 'Švédsko', 'adequate', false, 'eu_member'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'SE');

-- Iceland (EEA)
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'IS', 'Iceland', 'Island', 'adequate', false, 'eea_member'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'IS');

-- Liechtenstein (EEA)
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'LI', 'Liechtenstein', 'Lichtenštajnsko', 'adequate', false, 'eea_member'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'LI');

-- Norway (EEA)
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'NO', 'Norway', 'Nórsko', 'adequate', false, 'eea_member'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'NO');

-- Switzerland
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'CH', 'Switzerland', 'Švajčiarsko', 'adequate', false, 'third_country'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'CH');

-- Canada
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type, notes)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'CA', 'Canada', 'Kanada', 'adequate', false, 'third_country', 'Adequacy limited to commercial organizations under PIPEDA'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'CA');

-- Japan
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'JP', 'Japan', 'Japonsko', 'adequate', false, 'third_country'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'JP');

-- South Korea
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'KR', 'South Korea', 'Južná Kórea', 'adequate', false, 'third_country'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'KR');

-- New Zealand
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'NZ', 'New Zealand', 'Nový Zéland', 'adequate', false, 'third_country'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'NZ');

-- Israel
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'IL', 'Israel', 'Izrael', 'adequate', false, 'third_country'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'IL');

-- Argentina
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'AR', 'Argentina', 'Argentína', 'adequate', false, 'third_country'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'AR');

-- Uruguay
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'UY', 'Uruguay', 'Uruguaj', 'adequate', false, 'third_country'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'UY');

-- Andorra
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'AD', 'Andorra', 'Andorra', 'adequate', false, 'third_country'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'AD');

-- Faroe Islands
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'FO', 'Faroe Islands', 'Faerské ostrovy', 'adequate', false, 'third_country'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'FO');

-- Guernsey
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'GG', 'Guernsey', 'Guernsey', 'adequate', false, 'third_country'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'GG');

-- Isle of Man
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'IM', 'Isle of Man', 'Ostrov Man', 'adequate', false, 'third_country'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'IM');

-- Jersey
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'JE', 'Jersey', 'Jersey', 'adequate', false, 'third_country'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'JE');

-- Update United States to conditional
UPDATE jurisdictions SET
  adequacy_status = 'conditional',
  safeguards_required = true,
  safeguards_description = 'Standard Contractual Clauses (SCCs) or EU-US Data Privacy Framework certification',
  jurisdiction_type = 'third_country',
  notes = 'No blanket adequacy decision. EU-US Data Privacy Framework provides conditional adequacy for certified organizations only.'
WHERE country_code = 'US';

-- China
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type, safeguards_description)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'CN', 'China', 'Čína', 'inadequate', true, 'third_country', 'Standard Contractual Clauses (SCCs) or Binding Corporate Rules (BCRs)'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'CN');

-- India
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type, safeguards_description)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'IN', 'India', 'India', 'inadequate', true, 'third_country', 'Standard Contractual Clauses (SCCs) or Binding Corporate Rules (BCRs)'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'IN');

-- Brazil
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type, safeguards_description)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'BR', 'Brazil', 'Brazília', 'inadequate', true, 'third_country', 'Standard Contractual Clauses (SCCs) or Binding Corporate Rules (BCRs)'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'BR');

-- Russia
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type, safeguards_description, data_localization_requirements)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'RU', 'Russia', 'Rusko', 'inadequate', true, 'third_country', 'Standard Contractual Clauses (SCCs) - Subject to data localization laws', true
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'RU');

-- Singapore
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type, safeguards_description)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'SG', 'Singapore', 'Singapur', 'inadequate', true, 'third_country', 'Standard Contractual Clauses (SCCs) or Binding Corporate Rules (BCRs)'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'SG');

-- Hong Kong
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type, safeguards_description)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'HK', 'Hong Kong', 'Hongkong', 'inadequate', true, 'third_country', 'Standard Contractual Clauses (SCCs) or Binding Corporate Rules (BCRs)'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'HK');

-- South Africa
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type, safeguards_description)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'ZA', 'South Africa', 'Južná Afrika', 'inadequate', true, 'third_country', 'Standard Contractual Clauses (SCCs) or Binding Corporate Rules (BCRs)'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'ZA');

-- Mexico
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type, safeguards_description)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'MX', 'Mexico', 'Mexiko', 'inadequate', true, 'third_country', 'Standard Contractual Clauses (SCCs) or Binding Corporate Rules (BCRs)'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'MX');

-- Turkey
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type, safeguards_description)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'TR', 'Turkey', 'Turecko', 'inadequate', true, 'third_country', 'Standard Contractual Clauses (SCCs) or Binding Corporate Rules (BCRs)'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'TR');

-- United Arab Emirates
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type, safeguards_description)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'AE', 'United Arab Emirates', 'Spojené arabské emiráty', 'inadequate', true, 'third_country', 'Standard Contractual Clauses (SCCs) or Binding Corporate Rules (BCRs)'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'AE');

-- Ukraine
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type, safeguards_description)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'UA', 'Ukraine', 'Ukrajina', 'inadequate', true, 'third_country', 'Standard Contractual Clauses (SCCs) or Binding Corporate Rules (BCRs)'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'UA');

-- Serbia
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type, safeguards_description)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'RS', 'Serbia', 'Srbsko', 'inadequate', true, 'third_country', 'Standard Contractual Clauses (SCCs) or Binding Corporate Rules (BCRs)'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'RS');

-- Australia
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type, safeguards_description)
SELECT '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'AU', 'Australia', 'Austrália', 'inadequate', true, 'third_country', 'Standard Contractual Clauses (SCCs) or Binding Corporate Rules (BCRs)'
WHERE NOT EXISTS (SELECT 1 FROM jurisdictions WHERE country_code = 'AU');

COMMIT;

-- Verify: SELECT COUNT(*) FROM jurisdictions; -- Should show 52
