-- ============================================================================
-- Jurisdictions Table - Populate Localized Names
-- Version: 1.0.0
-- Date: 2026-01-17
-- Purpose: Populate name_en and name_sk columns with proper country names
--
-- IMPORTANT: Run this AFTER 20260117_context_schema_alignment.sql
-- ============================================================================

BEGIN;

-- ============================================================================
-- EU/EEA Countries (27 EU + 3 EEA)
-- ============================================================================

UPDATE jurisdictions SET
  name_en = 'Austria',
  name_sk = 'Rakúsko'
WHERE country_code = 'AT';

UPDATE jurisdictions SET
  name_en = 'Belgium',
  name_sk = 'Belgicko'
WHERE country_code = 'BE';

UPDATE jurisdictions SET
  name_en = 'Bulgaria',
  name_sk = 'Bulharsko'
WHERE country_code = 'BG';

UPDATE jurisdictions SET
  name_en = 'Croatia',
  name_sk = 'Chorvátsko'
WHERE country_code = 'HR';

UPDATE jurisdictions SET
  name_en = 'Cyprus',
  name_sk = 'Cyprus'
WHERE country_code = 'CY';

UPDATE jurisdictions SET
  name_en = 'Czech Republic',
  name_sk = 'Česká republika'
WHERE country_code = 'CZ';

UPDATE jurisdictions SET
  name_en = 'Denmark',
  name_sk = 'Dánsko'
WHERE country_code = 'DK';

UPDATE jurisdictions SET
  name_en = 'Estonia',
  name_sk = 'Estónsko'
WHERE country_code = 'EE';

UPDATE jurisdictions SET
  name_en = 'Finland',
  name_sk = 'Fínsko'
WHERE country_code = 'FI';

UPDATE jurisdictions SET
  name_en = 'France',
  name_sk = 'Francúzsko'
WHERE country_code = 'FR';

UPDATE jurisdictions SET
  name_en = 'Germany',
  name_sk = 'Nemecko'
WHERE country_code = 'DE';

UPDATE jurisdictions SET
  name_en = 'Greece',
  name_sk = 'Grécko'
WHERE country_code = 'GR';

UPDATE jurisdictions SET
  name_en = 'Hungary',
  name_sk = 'Maďarsko'
WHERE country_code = 'HU';

UPDATE jurisdictions SET
  name_en = 'Iceland',
  name_sk = 'Island'
WHERE country_code = 'IS';

UPDATE jurisdictions SET
  name_en = 'Ireland',
  name_sk = 'Írsko'
WHERE country_code = 'IE';

UPDATE jurisdictions SET
  name_en = 'Italy',
  name_sk = 'Taliansko'
WHERE country_code = 'IT';

UPDATE jurisdictions SET
  name_en = 'Latvia',
  name_sk = 'Lotyšsko'
WHERE country_code = 'LV';

UPDATE jurisdictions SET
  name_en = 'Liechtenstein',
  name_sk = 'Lichtenštajnsko'
WHERE country_code = 'LI';

UPDATE jurisdictions SET
  name_en = 'Lithuania',
  name_sk = 'Litva'
WHERE country_code = 'LT';

UPDATE jurisdictions SET
  name_en = 'Luxembourg',
  name_sk = 'Luxembursko'
WHERE country_code = 'LU';

UPDATE jurisdictions SET
  name_en = 'Malta',
  name_sk = 'Malta'
WHERE country_code = 'MT';

UPDATE jurisdictions SET
  name_en = 'Netherlands',
  name_sk = 'Holandsko'
WHERE country_code = 'NL';

UPDATE jurisdictions SET
  name_en = 'Norway',
  name_sk = 'Nórsko'
WHERE country_code = 'NO';

UPDATE jurisdictions SET
  name_en = 'Poland',
  name_sk = 'Poľsko'
WHERE country_code = 'PL';

UPDATE jurisdictions SET
  name_en = 'Portugal',
  name_sk = 'Portugalsko'
WHERE country_code = 'PT';

UPDATE jurisdictions SET
  name_en = 'Romania',
  name_sk = 'Rumunsko'
WHERE country_code = 'RO';

UPDATE jurisdictions SET
  name_en = 'Slovakia',
  name_sk = 'Slovensko'
WHERE country_code = 'SK';

UPDATE jurisdictions SET
  name_en = 'Slovenia',
  name_sk = 'Slovinsko'
WHERE country_code = 'SI';

UPDATE jurisdictions SET
  name_en = 'Spain',
  name_sk = 'Španielsko'
WHERE country_code = 'ES';

UPDATE jurisdictions SET
  name_en = 'Sweden',
  name_sk = 'Švédsko'
WHERE country_code = 'SE';

-- ============================================================================
-- Common Third Countries (Major Data Transfer Destinations)
-- ============================================================================

UPDATE jurisdictions SET
  name_en = 'United States',
  name_sk = 'Spojené štáty'
WHERE country_code = 'US';

UPDATE jurisdictions SET
  name_en = 'United Kingdom',
  name_sk = 'Spojené kráľovstvo'
WHERE country_code = 'GB';

UPDATE jurisdictions SET
  name_en = 'Switzerland',
  name_sk = 'Švajčiarsko'
WHERE country_code = 'CH';

UPDATE jurisdictions SET
  name_en = 'Canada',
  name_sk = 'Kanada'
WHERE country_code = 'CA';

UPDATE jurisdictions SET
  name_en = 'Australia',
  name_sk = 'Austrália'
WHERE country_code = 'AU';

UPDATE jurisdictions SET
  name_en = 'Japan',
  name_sk = 'Japonsko'
WHERE country_code = 'JP';

UPDATE jurisdictions SET
  name_en = 'South Korea',
  name_sk = 'Južná Kórea'
WHERE country_code = 'KR';

UPDATE jurisdictions SET
  name_en = 'New Zealand',
  name_sk = 'Nový Zéland'
WHERE country_code = 'NZ';

UPDATE jurisdictions SET
  name_en = 'Israel',
  name_sk = 'Izrael'
WHERE country_code = 'IL';

UPDATE jurisdictions SET
  name_en = 'Argentina',
  name_sk = 'Argentína'
WHERE country_code = 'AR';

UPDATE jurisdictions SET
  name_en = 'Uruguay',
  name_sk = 'Uruguaj'
WHERE country_code = 'UY';

UPDATE jurisdictions SET
  name_en = 'Andorra',
  name_sk = 'Andorra'
WHERE country_code = 'AD';

UPDATE jurisdictions SET
  name_en = 'Faroe Islands',
  name_sk = 'Faerské ostrovy'
WHERE country_code = 'FO';

UPDATE jurisdictions SET
  name_en = 'Guernsey',
  name_sk = 'Guernsey'
WHERE country_code = 'GG';

UPDATE jurisdictions SET
  name_en = 'Isle of Man',
  name_sk = 'Ostrov Man'
WHERE country_code = 'IM';

UPDATE jurisdictions SET
  name_en = 'Jersey',
  name_sk = 'Jersey'
WHERE country_code = 'JE';

-- ============================================================================
-- Other Common Countries
-- ============================================================================

UPDATE jurisdictions SET
  name_en = 'China',
  name_sk = 'Čína'
WHERE country_code = 'CN';

UPDATE jurisdictions SET
  name_en = 'India',
  name_sk = 'India'
WHERE country_code = 'IN';

UPDATE jurisdictions SET
  name_en = 'Brazil',
  name_sk = 'Brazília'
WHERE country_code = 'BR';

UPDATE jurisdictions SET
  name_en = 'Russia',
  name_sk = 'Rusko'
WHERE country_code = 'RU';

UPDATE jurisdictions SET
  name_en = 'Singapore',
  name_sk = 'Singapur'
WHERE country_code = 'SG';

UPDATE jurisdictions SET
  name_en = 'Hong Kong',
  name_sk = 'Hongkong'
WHERE country_code = 'HK';

UPDATE jurisdictions SET
  name_en = 'South Africa',
  name_sk = 'Južná Afrika'
WHERE country_code = 'ZA';

UPDATE jurisdictions SET
  name_en = 'Mexico',
  name_sk = 'Mexiko'
WHERE country_code = 'MX';

UPDATE jurisdictions SET
  name_en = 'Turkey',
  name_sk = 'Turecko'
WHERE country_code = 'TR';

UPDATE jurisdictions SET
  name_en = 'United Arab Emirates',
  name_sk = 'Spojené arabské emiráty'
WHERE country_code = 'AE';

UPDATE jurisdictions SET
  name_en = 'Ukraine',
  name_sk = 'Ukrajina'
WHERE country_code = 'UA';

UPDATE jurisdictions SET
  name_en = 'Serbia',
  name_sk = 'Srbsko'
WHERE country_code = 'RS';

COMMIT;

-- ============================================================================
-- Verification Queries
-- ============================================================================

-- Run these queries after migration to verify success:

-- 1. Check all jurisdictions have localized names
-- SELECT country_code, name_en, name_sk
-- FROM jurisdictions
-- WHERE name_en IS NOT NULL
-- ORDER BY name_en;

-- 2. Check for any jurisdictions still missing names (should return 0 rows)
-- SELECT country_code, name_en, name_sk
-- FROM jurisdictions
-- WHERE name_en IS NULL OR name_sk IS NULL;

-- 3. Verify EU/EEA countries
-- SELECT country_code, name_en, name_sk, gdpr_adequacy
-- FROM jurisdictions
-- WHERE country_code IN ('DE', 'FR', 'SK', 'GB', 'US')
-- ORDER BY name_en;

-- ============================================================================
-- Rollback Script (if needed)
-- ============================================================================

/*
BEGIN;

UPDATE jurisdictions SET
  name_en = country_code,
  name_sk = country_code;

COMMIT;
*/
