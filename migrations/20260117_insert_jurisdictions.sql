-- ============================================================================
-- Jurisdictions Table - Insert EU/EEA and Common Countries
-- Version: 1.0.1
-- Date: 2026-01-17
-- Purpose: Insert all EU/EEA countries and common third countries
--
-- IMPORTANT: Run this AFTER 20260117_jurisdiction_names.sql
-- Schema: Uses adequacy_status ('adequate'|'inadequate'|'conditional') instead of gdpr_adequacy
-- ============================================================================

BEGIN;

-- ============================================================================
-- Insert EU/EEA Countries (27 EU + 3 EEA)
-- adequacy_status: 'adequate' for EU/EEA countries (automatic GDPR adequacy)
-- safeguards_required: false for adequate countries
-- ============================================================================

-- Austria
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('AT', 'Austria', 'Rakúsko', 'adequate', false, 'eu_member')
ON CONFLICT (country_code) DO NOTHING;

-- Belgium
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('BE', 'Belgium', 'Belgicko', 'adequate', false, 'eu_member')
ON CONFLICT (country_code) DO NOTHING;

-- Bulgaria
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('BG', 'Bulgaria', 'Bulharsko', 'adequate', false, 'eu_member')
ON CONFLICT (country_code) DO NOTHING;

-- Croatia
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('HR', 'Croatia', 'Chorvátsko', 'adequate', false, 'eu_member')
ON CONFLICT (country_code) DO NOTHING;

-- Cyprus
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('CY', 'Cyprus', 'Cyprus', 'adequate', false, 'eu_member')
ON CONFLICT (country_code) DO NOTHING;

-- Czech Republic
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('CZ', 'Czech Republic', 'Česká republika', 'adequate', false, 'eu_member')
ON CONFLICT (country_code) DO NOTHING;

-- Denmark
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('DK', 'Denmark', 'Dánsko', 'adequate', false, 'eu_member')
ON CONFLICT (country_code) DO NOTHING;

-- Estonia
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('EE', 'Estonia', 'Estónsko', 'adequate', false, 'eu_member')
ON CONFLICT (country_code) DO NOTHING;

-- Finland
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('FI', 'Finland', 'Fínsko', 'adequate', false, 'eu_member')
ON CONFLICT (country_code) DO NOTHING;

-- France
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('FR', 'France', 'Francúzsko', 'adequate', false, 'eu_member')
ON CONFLICT (country_code) DO NOTHING;

-- Germany
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('DE', 'Germany', 'Nemecko', 'adequate', false, 'eu_member')
ON CONFLICT (country_code) DO NOTHING;

-- Greece
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('GR', 'Greece', 'Grécko', 'adequate', false, 'eu_member')
ON CONFLICT (country_code) DO NOTHING;

-- Hungary
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('HU', 'Hungary', 'Maďarsko', 'adequate', false, 'eu_member')
ON CONFLICT (country_code) DO NOTHING;

-- Ireland
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('IE', 'Ireland', 'Írsko', 'adequate', false, 'eu_member')
ON CONFLICT (country_code) DO NOTHING;

-- Italy
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('IT', 'Italy', 'Taliansko', 'adequate', false, 'eu_member')
ON CONFLICT (country_code) DO NOTHING;

-- Latvia
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('LV', 'Latvia', 'Lotyšsko', 'adequate', false, 'eu_member')
ON CONFLICT (country_code) DO NOTHING;

-- Lithuania
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('LT', 'Lithuania', 'Litva', 'adequate', false, 'eu_member')
ON CONFLICT (country_code) DO NOTHING;

-- Luxembourg
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('LU', 'Luxembourg', 'Luxembursko', 'adequate', false, 'eu_member')
ON CONFLICT (country_code) DO NOTHING;

-- Malta
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('MT', 'Malta', 'Malta', 'adequate', false, 'eu_member')
ON CONFLICT (country_code) DO NOTHING;

-- Netherlands
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('NL', 'Netherlands', 'Holandsko', 'adequate', false, 'eu_member')
ON CONFLICT (country_code) DO NOTHING;

-- Poland
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('PL', 'Poland', 'Poľsko', 'adequate', false, 'eu_member')
ON CONFLICT (country_code) DO NOTHING;

-- Portugal
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('PT', 'Portugal', 'Portugalsko', 'adequate', false, 'eu_member')
ON CONFLICT (country_code) DO NOTHING;

-- Romania
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('RO', 'Romania', 'Rumunsko', 'adequate', false, 'eu_member')
ON CONFLICT (country_code) DO NOTHING;

-- Slovenia
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('SI', 'Slovenia', 'Slovinsko', 'adequate', false, 'eu_member')
ON CONFLICT (country_code) DO NOTHING;

-- Spain
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('ES', 'Spain', 'Španielsko', 'adequate', false, 'eu_member')
ON CONFLICT (country_code) DO NOTHING;

-- Sweden
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('SE', 'Sweden', 'Švédsko', 'adequate', false, 'eu_member')
ON CONFLICT (country_code) DO NOTHING;

-- ============================================================================
-- EEA Countries (Not EU members but part of EEA)
-- ============================================================================

-- Iceland
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('IS', 'Iceland', 'Island', 'adequate', false, 'eea_member')
ON CONFLICT (country_code) DO NOTHING;

-- Liechtenstein
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('LI', 'Liechtenstein', 'Lichtenštajnsko', 'adequate', false, 'eea_member')
ON CONFLICT (country_code) DO NOTHING;

-- Norway
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('NO', 'Norway', 'Nórsko', 'adequate', false, 'eea_member')
ON CONFLICT (country_code) DO NOTHING;

-- ============================================================================
-- Third Countries with GDPR Adequacy Decisions
-- ============================================================================

-- Switzerland
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('CH', 'Switzerland', 'Švajčiarsko', 'adequate', false, 'third_country')
ON CONFLICT (country_code) DO NOTHING;

-- Canada (commercial organizations)
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type, notes)
VALUES ('CA', 'Canada', 'Kanada', 'adequate', false, 'third_country', 'Adequacy limited to commercial organizations under PIPEDA')
ON CONFLICT (country_code) DO NOTHING;

-- Japan
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('JP', 'Japan', 'Japonsko', 'adequate', false, 'third_country')
ON CONFLICT (country_code) DO NOTHING;

-- South Korea
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('KR', 'South Korea', 'Južná Kórea', 'adequate', false, 'third_country')
ON CONFLICT (country_code) DO NOTHING;

-- New Zealand
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('NZ', 'New Zealand', 'Nový Zéland', 'adequate', false, 'third_country')
ON CONFLICT (country_code) DO NOTHING;

-- Israel
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('IL', 'Israel', 'Izrael', 'adequate', false, 'third_country')
ON CONFLICT (country_code) DO NOTHING;

-- Argentina
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('AR', 'Argentina', 'Argentína', 'adequate', false, 'third_country')
ON CONFLICT (country_code) DO NOTHING;

-- Uruguay
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('UY', 'Uruguay', 'Uruguaj', 'adequate', false, 'third_country')
ON CONFLICT (country_code) DO NOTHING;

-- Andorra
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('AD', 'Andorra', 'Andorra', 'adequate', false, 'third_country')
ON CONFLICT (country_code) DO NOTHING;

-- Faroe Islands
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('FO', 'Faroe Islands', 'Faerské ostrovy', 'adequate', false, 'third_country')
ON CONFLICT (country_code) DO NOTHING;

-- Guernsey
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('GG', 'Guernsey', 'Guernsey', 'adequate', false, 'third_country')
ON CONFLICT (country_code) DO NOTHING;

-- Isle of Man
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('IM', 'Isle of Man', 'Ostrov Man', 'adequate', false, 'third_country')
ON CONFLICT (country_code) DO NOTHING;

-- Jersey
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type)
VALUES ('JE', 'Jersey', 'Jersey', 'adequate', false, 'third_country')
ON CONFLICT (country_code) DO NOTHING;

-- ============================================================================
-- Common Third Countries WITHOUT Adequacy (require safeguards like SCCs/BCRs)
-- adequacy_status: 'inadequate'
-- safeguards_required: true
-- safeguards_description: Typically SCCs, BCRs, or other Article 46 mechanisms
-- ============================================================================

-- United States (NO adequacy - EU-US DPF is conditional, not blanket adequacy)
-- Update existing US record
UPDATE jurisdictions SET
  adequacy_status = 'conditional',
  safeguards_required = true,
  safeguards_description = 'Standard Contractual Clauses (SCCs) or EU-US Data Privacy Framework certification',
  jurisdiction_type = 'third_country',
  notes = 'No blanket adequacy decision. EU-US Data Privacy Framework provides conditional adequacy for certified organizations only.'
WHERE country_code = 'US';

-- China
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type, safeguards_description)
VALUES ('CN', 'China', 'Čína', 'inadequate', true, 'third_country', 'Standard Contractual Clauses (SCCs) or Binding Corporate Rules (BCRs)')
ON CONFLICT (country_code) DO NOTHING;

-- India
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type, safeguards_description)
VALUES ('IN', 'India', 'India', 'inadequate', true, 'third_country', 'Standard Contractual Clauses (SCCs) or Binding Corporate Rules (BCRs)')
ON CONFLICT (country_code) DO NOTHING;

-- Brazil
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type, safeguards_description)
VALUES ('BR', 'Brazil', 'Brazília', 'inadequate', true, 'third_country', 'Standard Contractual Clauses (SCCs) or Binding Corporate Rules (BCRs)')
ON CONFLICT (country_code) DO NOTHING;

-- Russia
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type, safeguards_description, data_localization_requirements)
VALUES ('RU', 'Russia', 'Rusko', 'inadequate', true, 'third_country', 'Standard Contractual Clauses (SCCs) - Subject to data localization laws', true)
ON CONFLICT (country_code) DO NOTHING;

-- Singapore
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type, safeguards_description)
VALUES ('SG', 'Singapore', 'Singapur', 'inadequate', true, 'third_country', 'Standard Contractual Clauses (SCCs) or Binding Corporate Rules (BCRs)')
ON CONFLICT (country_code) DO NOTHING;

-- Hong Kong
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type, safeguards_description)
VALUES ('HK', 'Hong Kong', 'Hongkong', 'inadequate', true, 'third_country', 'Standard Contractual Clauses (SCCs) or Binding Corporate Rules (BCRs)')
ON CONFLICT (country_code) DO NOTHING;

-- South Africa
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type, safeguards_description)
VALUES ('ZA', 'South Africa', 'Južná Afrika', 'inadequate', true, 'third_country', 'Standard Contractual Clauses (SCCs) or Binding Corporate Rules (BCRs)')
ON CONFLICT (country_code) DO NOTHING;

-- Mexico
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type, safeguards_description)
VALUES ('MX', 'Mexico', 'Mexiko', 'inadequate', true, 'third_country', 'Standard Contractual Clauses (SCCs) or Binding Corporate Rules (BCRs)')
ON CONFLICT (country_code) DO NOTHING;

-- Turkey
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type, safeguards_description)
VALUES ('TR', 'Turkey', 'Turecko', 'inadequate', true, 'third_country', 'Standard Contractual Clauses (SCCs) or Binding Corporate Rules (BCRs)')
ON CONFLICT (country_code) DO NOTHING;

-- United Arab Emirates
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type, safeguards_description)
VALUES ('AE', 'United Arab Emirates', 'Spojené arabské emiráty', 'inadequate', true, 'third_country', 'Standard Contractual Clauses (SCCs) or Binding Corporate Rules (BCRs)')
ON CONFLICT (country_code) DO NOTHING;

-- Ukraine
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type, safeguards_description)
VALUES ('UA', 'Ukraine', 'Ukrajina', 'inadequate', true, 'third_country', 'Standard Contractual Clauses (SCCs) or Binding Corporate Rules (BCRs)')
ON CONFLICT (country_code) DO NOTHING;

-- Serbia
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type, safeguards_description)
VALUES ('RS', 'Serbia', 'Srbsko', 'inadequate', true, 'third_country', 'Standard Contractual Clauses (SCCs) or Binding Corporate Rules (BCRs)')
ON CONFLICT (country_code) DO NOTHING;

-- Australia
INSERT INTO jurisdictions (country_code, name_en, name_sk, adequacy_status, safeguards_required, jurisdiction_type, safeguards_description)
VALUES ('AU', 'Australia', 'Austrália', 'inadequate', true, 'third_country', 'Standard Contractual Clauses (SCCs) or Binding Corporate Rules (BCRs)')
ON CONFLICT (country_code) DO NOTHING;

COMMIT;

-- ============================================================================
-- Verification Queries
-- ============================================================================

-- Run these queries after migration to verify success:

-- 1. Check total jurisdiction count (should be ~52)
-- SELECT COUNT(*) as total_jurisdictions FROM jurisdictions;

-- 2. Check EU/EEA countries (should be ~30)
-- SELECT COUNT(*) as eu_eea_count
-- FROM jurisdictions
-- WHERE adequacy_status = 'adequate';

-- 3. Check third countries without adequacy (should be ~13)
-- SELECT COUNT(*) as inadequate_countries
-- FROM jurisdictions
-- WHERE adequacy_status = 'inadequate';

-- 4. List all jurisdictions ordered by name
-- SELECT country_code, name_en, name_sk, adequacy_status, safeguards_required
-- FROM jurisdictions
-- ORDER BY name_en;

-- 5. Check for any missing names (should return 0 rows)
-- SELECT country_code, name_en, name_sk
-- FROM jurisdictions
-- WHERE name_en IS NULL OR name_sk IS NULL;

-- ============================================================================
-- Notes
-- ============================================================================

-- GDPR Adequacy Decisions (as of 2026-01-17):
-- - adequacy_status values:
--   * 'adequate': Full GDPR adequacy decision (EU/EEA + approved third countries)
--   * 'inadequate': No adequacy decision (requires safeguards like SCCs/BCRs)
--   * 'conditional': Conditional adequacy (e.g., US under EU-US DPF - only for certified orgs)
--
-- - All 27 EU member states: 'adequate' (automatic)
-- - EEA countries (Iceland, Liechtenstein, Norway): 'adequate'
-- - UK: 'adequate' (adequacy decision granted 2021, subject to review)
-- - Switzerland, Canada (commercial), Japan, South Korea, New Zealand,
--   Israel, Argentina, Uruguay, Andorra, Faroe Islands, Guernsey,
--   Isle of Man, Jersey: 'adequate'
-- - US: 'conditional' (EU-US Data Privacy Framework - certification required)
-- - China, India, Brazil, Russia, Singapore, Hong Kong, South Africa,
--   Mexico, Turkey, UAE, Ukraine, Serbia, Australia: 'inadequate'

-- IMPORTANT: GDPR adequacy decisions can change. Always verify current status at:
-- https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/adequacy-decisions_en
