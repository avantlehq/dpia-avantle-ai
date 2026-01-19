/**
 * JurisdictionSelect Component
 *
 * Domain-specific wrapper around SelectCombobox for jurisdiction selection.
 * Features:
 * - Searchable across name_en, name_sk, country_code
 * - Grouped by jurisdiction type (EU/EEA/Third Country)
 * - Popular countries shown first
 * - Adequacy badge (✓) for adequate jurisdictions
 * - Bilingual support (Slovak/English)
 */

'use client'

import { SelectCombobox } from '@/components/ui/select-combobox'
import { useJurisdictions } from '@/hooks/useJurisdictions'
import { Check } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

interface JurisdictionSelectProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

const POPULAR_CODES = ['SK', 'CZ', 'DE', 'US', 'GB', 'FR', 'AT', 'PL', 'HU', 'NL']

export function JurisdictionSelect({
  value,
  onChange,
  disabled,
}: JurisdictionSelectProps) {
  const locale = useLocale()
  const { jurisdictions, loading } = useJurisdictions()
  const tc = useTranslations('common')
  const t = useTranslations('context.jurisdictions')

  if (loading) {
    return (
      <div className="w-full rounded-md border border-[var(--border-default)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-tertiary)]">
        {tc('loading')}
      </div>
    )
  }

  return (
    <SelectCombobox
      options={jurisdictions}
      value={value}
      onChange={onChange}
      disabled={disabled}

      // Value extraction (database content - NOT from messages)
      getOptionValue={(j) => j.id}
      getOptionLabel={(j) => locale === 'sk' ? j.name_sk : j.name_en}
      getOptionKeywords={(j) => [j.name_en, j.name_sk, j.country_code]}

      // Grouping (UI labels - from messages)
      groupBy={(j) => {
        if (j.jurisdiction_type === 'eu_member_state') {
          return t('euMemberStates')
        }
        if (j.jurisdiction_type === 'eea_country') {
          return t('eeaCountries')
        }
        return t('thirdCountries')
      }}

      renderGroupHeader={(group) => (
        <div className="px-2 py-1.5 text-xs font-semibold text-[var(--text-secondary)]">
          {group}
        </div>
      )}

      // Adequacy badge
      getBadge={(j) =>
        j.adequacy_status === 'adequate' ? (
          <Check className="h-4 w-4 text-[var(--status-success)]" />
        ) : null
      }

      // Popular first
      popularItems={POPULAR_CODES}

      // i18n (UI chrome - from messages)
      placeholder={t('searchPlaceholder')}
      searchPlaceholder={t('searchPlaceholder')}
      emptyMessage={t('noResults')}
    />
  )
}
