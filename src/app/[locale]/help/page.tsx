'use client'

import React, { useState, useMemo } from 'react'
import {
  HelpCircle,
  BookOpen,
  Shield,
  Database,
  AlertTriangle,
  Code2,
  Play
} from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'
import { useClientLocale } from '@/hooks/useClientLocale'
import { HelpActionBar } from '@/components/help/HelpActionBar'
import { HelpStats } from '@/components/help/HelpStats'
import { HelpSectionCard } from '@/components/help/HelpSectionCard'

export default function HelpPage() {
  const { t } = useTranslations('help')
  const { locale } = useClientLocale()
  const [searchQuery, setSearchQuery] = useState('')

  // All help sections
  const allSections = useMemo(() => [
    {
      id: 'gettingStarted',
      icon: <Play className="h-6 w-6 text-blue-500" />,
      title: t('categories.gettingStarted.title'),
      description: t('categories.gettingStarted.description'),
      url: '/help/getting-started',
      available: false
    },
    {
      id: 'compliance',
      icon: <Shield className="h-6 w-6 text-green-500" />,
      title: t('categories.compliance.title'),
      description: t('categories.compliance.description'),
      url: '/help/compliance',
      available: false
    },
    {
      id: 'modules',
      icon: <Database className="h-6 w-6 text-blue-500" />,
      title: t('categories.modules.title'),
      description: t('categories.modules.description'),
      url: '/help/modules',
      available: true
    },
    {
      id: 'glossary',
      icon: <BookOpen className="h-6 w-6 text-purple-500" />,
      title: t('categories.glossary.title'),
      description: t('categories.glossary.description'),
      url: '/help/glossary',
      available: false
    },
    {
      id: 'troubleshooting',
      icon: <AlertTriangle className="h-6 w-6 text-orange-500" />,
      title: t('categories.troubleshooting.title'),
      description: t('categories.troubleshooting.description'),
      url: '/help/troubleshooting',
      available: false
    },
    {
      id: 'api',
      icon: <Code2 className="h-6 w-6 text-red-500" />,
      title: t('categories.api.title'),
      description: t('categories.api.description'),
      url: '/help/api',
      available: false
    }
  ], [t])

  // Filter sections based on search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return allSections

    const query = searchQuery.toLowerCase()
    return allSections.filter(section =>
      section.title.toLowerCase().includes(query) ||
      section.description.toLowerCase().includes(query)
    )
  }, [allSections, searchQuery])

  // Calculate stats
  const stats = useMemo(() => [
    {
      label: t('guides'),
      value: allSections.filter(s => s.available).length
    },
    {
      label: t('articles'),
      value: 12
    },
    {
      label: t('languages'),
      value: 2
    }
  ], [allSections, t])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] flex items-center gap-3">
          <HelpCircle className="h-8 w-8 text-blue-500" />
          {t('title')}
        </h1>
        <p className="text-base text-[var(--text-secondary)] max-w-2xl">
          {t('description')}
        </p>
      </div>

      {/* Action Bar */}
      <HelpActionBar
        locale={locale}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        labels={{
          backToDashboard: t('backToDashboard'),
          searchPlaceholder: t('searchPlaceholder'),
          gettingStarted: t('gettingStartedButton'),
          contactSupport: t('contactSupport'),
          sectionBeingPrepared: t('sectionBeingPrepared')
        }}
      />

      {/* Stats */}
      <HelpStats stats={stats} />

      {/* Sections List */}
      <div className="space-y-4">
        {filteredSections.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {filteredSections.map((section) => (
              <HelpSectionCard
                key={section.id}
                icon={section.icon}
                title={section.title}
                description={section.description}
                available={section.available}
                url={section.url}
                locale={locale}
                availableLabel={t('available')}
                soonLabel={t('inPreparation')}
                browseLabel={t('browseGuides')}
                comingSoonLabel={t('comingSoonButton')}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4 bg-[var(--surface-1)] border border-[var(--border-default)] rounded-lg">
            <p className="text-lg font-medium text-[var(--text-primary)] mb-2">
              {t('noResults')}
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              {t('tryAnother')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
