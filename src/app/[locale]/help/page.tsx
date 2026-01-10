'use client'

import React from 'react'
import Link from 'next/link'
import { 
  HelpCircle, 
  Mail,
  ArrowLeft,
  BookOpen,
  Shield,
  Database,
  AlertTriangle,
  Code2,
  Play
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslations } from '@/hooks/useTranslations'
import { useClientLocale } from '@/hooks/useClientLocale'
import { CategoryCard } from '@/components/help/CategoryCard'

export default function HelpPage() {
  const { t } = useTranslations('help')
  const { locale } = useClientLocale()
  
  // Category definitions organized by sections
  const gettingStartedCategories = [
    {
      id: 'gettingStarted',
      icon: <Play className="h-6 w-6 text-blue-500" />,
      title: t('categories.gettingStarted.title'),
      description: t('categories.gettingStarted.description'),
      url: '/help/getting-started',
      available: false
    }
  ]

  const documentationCategories = [
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
    }
  ]

  const supportCategories = [
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
  ]

  // Calculate metrics
  const totalCategories = gettingStartedCategories.length + documentationCategories.length + supportCategories.length
  const availableGuides = [...gettingStartedCategories, ...documentationCategories, ...supportCategories]
    .filter(cat => cat.available).length

  return (
    <div className="space-y-8">
      {/* Header with Primary Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <HelpCircle className="h-8 w-8 text-blue-500" />
            {t('title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            {t('description')}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href={`/${locale}/dashboard`}>
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t('backToDashboard')}
            </Button>
          </Link>
          
          <Button 
            disabled 
            variant="primary" 
            size="md"
            className="gap-2 opacity-60 cursor-not-allowed"
            title={t('sectionBeingPrepared')}
          >
            <Mail className="h-4 w-4" />
            {t('contactSupport')}
          </Button>
        </div>
      </div>

      {/* Compact Help System Overview */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-foreground">
          {t('helpSystemOverview')}
        </h2>
        
        <div className="flex flex-wrap gap-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-lg">
            <span className="text-sm font-medium text-muted-foreground">
              {t('guidesAvailable')}:
            </span>
            <span className="text-base font-semibold text-foreground">
              {availableGuides}
            </span>
          </div>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-lg">
            <span className="text-sm font-medium text-muted-foreground">
              {t('articles')}:
            </span>
            <span className="text-base font-semibold text-foreground">
              12
            </span>
          </div>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-lg">
            <span className="text-sm font-medium text-muted-foreground">
              {t('languages')}:
            </span>
            <span className="text-base font-semibold text-foreground">
              2
            </span>
          </div>
        </div>
      </div>

      {/* Getting Started Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground">
          {t('sections.gettingStarted')}
        </h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          {gettingStartedCategories.map((category) => (
            <CategoryCard
              key={category.id}
              {...category}
              locale={locale}
            />
          ))}
        </div>
      </div>

      {/* Product Documentation Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground">
          {t('sections.documentation')}
        </h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          {documentationCategories.map((category) => (
            <CategoryCard
              key={category.id}
              {...category}
              locale={locale}
            />
          ))}
        </div>
      </div>

      {/* Support & Troubleshooting Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground">
          {t('sections.support')}
        </h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          {supportCategories.map((category) => (
            <CategoryCard
              key={category.id}
              {...category}
              locale={locale}
            />
          ))}
        </div>
      </div>

    </div>
  )
}