-- ============================================================================
-- Jurisdictions Table - Insert EU/EEA and Common Countries
-- Version: 1.0.2
-- Date: 2026-01-17
-- Purpose: Insert all EU/EEA countries and common third countries
--
-- IMPORTANT: Run this AFTER 20260117_jurisdiction_names.sql
-- Note: All jurisdictions use global system tenant/workspace (00000000-0000-0000-0000-000000000001)
-- ============================================================================

BEGIN;

-- Austria
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'AT', 'Austria', 'Rakúsko', 'adequate', false, 'eu_member') ON CONFLICT (country_code) DO NOTHING;

-- Belgium
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'BE', 'Belgium', 'Belgicko', 'adequate', false, 'eu_member') ON CONFLICT (country_code) DO NOTHING;

-- Bulgaria
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'BG', 'Bulgaria', 'Bulharsko', 'adequate', false, 'eu_member') ON CONFLICT (country_code) DO NOTHING;

-- Croatia
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'HR', 'Croatia', 'Chorvátsko', 'adequate', false, 'eu_member') ON CONFLICT (country_code) DO NOTHING;

-- Cyprus
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'CY', 'Cyprus', 'Cyprus', 'adequate', false, 'eu_member') ON CONFLICT (country_code) DO NOTHING;

-- Czech Republic
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'CZ', 'Czech Republic', 'Česká republika', 'adequate', false, 'eu_member') ON CONFLICT (country_code) DO NOTHING;

-- Denmark
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'DK', 'Denmark', 'Dánsko', 'adequate', false, 'eu_member') ON CONFLICT (country_code) DO NOTHING;

-- Estonia
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'EE', 'Estonia', 'Estónsko', 'adequate', false, 'eu_member') ON CONFLICT (country_code) DO NOTHING;

-- Finland
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'FI', 'Finland', 'Fínsko', 'adequate', false, 'eu_member') ON CONFLICT (country_code) DO NOTHING;

-- France
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'FR', 'France', 'Francúzsko', 'adequate', false, 'eu_member') ON CONFLICT (country_code) DO NOTHING;

-- Germany
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'DE', 'Germany', 'Nemecko', 'adequate', false, 'eu_member') ON CONFLICT (country_code) DO NOTHING;

-- Greece
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'GR', 'Greece', 'Grécko', 'adequate', false, 'eu_member') ON CONFLICT (country_code) DO NOTHING;

-- Hungary
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'HU', 'Hungary', 'Maďarsko', 'adequate', false, 'eu_member') ON CONFLICT (country_code) DO NOTHING;

-- Ireland
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'IE', 'Ireland', 'Írsko', 'adequate', false, 'eu_member') ON CONFLICT (country_code) DO NOTHING;

-- Italy
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'IT', 'Italy', 'Taliansko', 'adequate', false, 'eu_member') ON CONFLICT (country_code) DO NOTHING;

-- Latvia
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'LV', 'Latvia', 'Lotyšsko', 'adequate', false, 'eu_member') ON CONFLICT (country_code) DO NOTHING;

-- Lithuania
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'LT', 'Lithuania', 'Litva', 'adequate', false, 'eu_member') ON CONFLICT (country_code) DO NOTHING;

-- Luxembourg
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'LU', 'Luxembourg', 'Luxembursko', 'adequate', false, 'eu_member') ON CONFLICT (country_code) DO NOTHING;

-- Malta
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'MT', 'Malta', 'Malta', 'adequate', false, 'eu_member') ON CONFLICT (country_code) DO NOTHING;

-- Netherlands
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'NL', 'Netherlands', 'Holandsko', 'adequate', false, 'eu_member') ON CONFLICT (country_code) DO NOTHING;

-- Poland
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'PL', 'Poland', 'Poľsko', 'adequate', false, 'eu_member') ON CONFLICT (country_code) DO NOTHING;

-- Portugal
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'PT', 'Portugal', 'Portugalsko', 'adequate', false, 'eu_member') ON CONFLICT (country_code) DO NOTHING;

-- Romania
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'RO', 'Romania', 'Rumunsko', 'adequate', false, 'eu_member') ON CONFLICT (country_code) DO NOTHING;

-- Slovenia
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'SI', 'Slovenia', 'Slovinsko', 'adequate', false, 'eu_member') ON CONFLICT (country_code) DO NOTHING;

-- Spain
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'ES', 'Spain', 'Španielsko', 'adequate', false, 'eu_member') ON CONFLICT (country_code) DO NOTHING;

-- Sweden
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'SE', 'Sweden', 'Švédsko', 'adequate', false, 'eu_member') ON CONFLICT (country_code) DO NOTHING;

-- Iceland (EEA)
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'IS', 'Iceland', 'Island', 'adequate', false, 'eea_member') ON CONFLICT (country_code) DO NOTHING;

-- Liechtenstein (EEA)
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'LI', 'Liechtenstein', 'Lichtenštajnsko', 'adequate', false, 'eea_member') ON CONFLICT (country_code) DO NOTHING;

-- Norway (EEA)
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'NO', 'Norway', 'Nórsko', 'adequate', false, 'eea_member') ON CONFLICT (country_code) DO NOTHING;

-- Switzerland
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'CH', 'Switzerland', 'Švajčiarsko', 'adequate', false, 'third_country') ON CONFLICT (country_code) DO NOTHING;

-- Canada
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type, notes)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'CA', 'Canada', 'Kanada', 'adequate', false, 'third_country', 'Adequacy limited to commercial organizations under PIPEDA') ON CONFLICT (country_code) DO NOTHING;

-- Japan
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'JP', 'Japan', 'Japonsko', 'adequate', false, 'third_country') ON CONFLICT (country_code) DO NOTHING;

-- South Korea
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'KR', 'South Korea', 'Južná Kórea', 'adequate', false, 'third_country') ON CONFLICT (country_code) DO NOTHING;

-- New Zealand
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'NZ', 'New Zealand', 'Nový Zéland', 'adequate', false, 'third_country') ON CONFLICT (country_code) DO NOTHING;

-- Israel
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'IL', 'Israel', 'Izrael', 'adequate', false, 'third_country') ON CONFLICT (country_code) DO NOTHING;

-- Argentina
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'AR', 'Argentina', 'Argentína', 'adequate', false, 'third_country') ON CONFLICT (country_code) DO NOTHING;

-- Uruguay
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'UY', 'Uruguay', 'Uruguaj', 'adequate', false, 'third_country') ON CONFLICT (country_code) DO NOTHING;

-- Andorra
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'AD', 'Andorra', 'Andorra', 'adequate', false, 'third_country') ON CONFLICT (country_code) DO NOTHING;

-- Faroe Islands
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'FO', 'Faroe Islands', 'Faerské ostrovy', 'adequate', false, 'third_country') ON CONFLICT (country_code) DO NOTHING;

-- Guernsey
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'GG', 'Guernsey', 'Guernsey', 'adequate', false, 'third_country') ON CONFLICT (country_code) DO NOTHING;

-- Isle of Man
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'IM', 'Isle of Man', 'Ostrov Man', 'adequate', false, 'third_country') ON CONFLICT (country_code) DO NOTHING;

-- Jersey
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'JE', 'Jersey', 'Jersey', 'adequate', false, 'third_country') ON CONFLICT (country_code) DO NOTHING;

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
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'CN', 'China', 'Čína', 'inadequate', true, 'third_country', 'Standard Contractual Clauses (SCCs) or Binding Corporate Rules (BCRs)') ON CONFLICT (country_code) DO NOTHING;

-- India
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type, safeguards_description)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'IN', 'India', 'India', 'inadequate', true, 'third_country', 'Standard Contractual Clauses (SCCs) or Binding Corporate Rules (BCRs)') ON CONFLICT (country_code) DO NOTHING;

-- Brazil
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type, safeguards_description)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'BR', 'Brazil', 'Brazília', 'inadequate', true, 'third_country', 'Standard Contractual Clauses (SCCs) or Binding Corporate Rules (BCRs)') ON CONFLICT (country_code) DO NOTHING;

-- Russia
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type, safeguards_description, data_localization_requirements)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'RU', 'Russia', 'Rusko', 'inadequate', true, 'third_country', 'Standard Contractual Clauses (SCCs) - Subject to data localization laws', true) ON CONFLICT (country_code) DO NOTHING;

-- Singapore
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type, safeguards_description)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'SG', 'Singapore', 'Singapur', 'inadequate', true, 'third_country', 'Standard Contractual Clauses (SCCs) or Binding Corporate Rules (BCRs)') ON CONFLICT (country_code) DO NOTHING;

-- Hong Kong
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type, safeguards_description)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'HK', 'Hong Kong', 'Hongkong', 'inadequate', true, 'third_country', 'Standard Contractual Clauses (SCCs) or Binding Corporate Rules (BCRs)') ON CONFLICT (country_code) DO NOTHING;

-- South Africa
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type, safeguards_description)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'ZA', 'South Africa', 'Južná Afrika', 'inadequate', true, 'third_country', 'Standard Contractual Clauses (SCCs) or Binding Corporate Rules (BCRs)') ON CONFLICT (country_code) DO NOTHING;

-- Mexico
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type, safeguards_description)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'MX', 'Mexico', 'Mexiko', 'inadequate', true, 'third_country', 'Standard Contractual Clauses (SCCs) or Binding Corporate Rules (BCRs)') ON CONFLICT (country_code) DO NOTHING;

-- Turkey
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type, safeguards_description)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'TR', 'Turkey', 'Turecko', 'inadequate', true, 'third_country', 'Standard Contractual Clauses (SCCs) or Binding Corporate Rules (BCRs)') ON CONFLICT (country_code) DO NOTHING;

-- United Arab Emirates
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type, safeguards_description)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'AE', 'United Arab Emirates', 'Spojené arabské emiráty', 'inadequate', true, 'third_country', 'Standard Contractual Clauses (SCCs) or Binding Corporate Rules (BCRs)') ON CONFLICT (country_code) DO NOTHING;

-- Ukraine
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type, safeguards_description)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'UA', 'Ukraine', 'Ukrajina', 'inadequate', true, 'third_country', 'Standard Contractual Clauses (SCCs) or Binding Corporate Rules (BCRs)') ON CONFLICT (country_code) DO NOTHING;

-- Serbia
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type, safeguards_description)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'RS', 'Serbia', 'Srbsko', 'inadequate', true, 'third_country', 'Standard Contractual Clauses (SCCs) or Binding Corporate Rules (BCRs)') ON CONFLICT (country_code) DO NOTHING;

-- Australia
INSERT INTO jurisdictions (tenant_id, workspace_id, country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type, safeguards_description)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'AU', 'Australia', 'Austrália', 'inadequate', true, 'third_country', 'Standard Contractual Clauses (SCCs) or Binding Corporate Rules (BCRs)') ON CONFLICT (country_code) DO NOTHING;

COMMIT;

-- Verify: SELECT COUNT(*) FROM jurisdictions; -- Should show ~52
