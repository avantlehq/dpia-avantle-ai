'use client'

import React from 'react'
import Link from 'next/link'
import { 
  HelpCircle, 
  Mail, 
  MessageCircle, 
  BookOpen,
  Shield,
  Code,
  ArrowLeft,
  Database,
  AlertTriangle,
  Settings,
  GraduationCap,
  FileText,
  Bookmark,
  Zap
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTranslations } from '@/hooks/useTranslations'
import { useClientLocale } from '@/hooks/useClientLocale'

export default function HelpPage() {
  const { t } = useTranslations('help')
  const { locale } = useClientLocale()
  
  // Help categories with status and routing
  const helpCategories = [
    {
      id: 'compliance',
      icon: <Shield className="h-5 w-5 text-green-500" />,
      title: t('categories.compliance'),
      description: t('compliance.description'),
      url: '/help/compliance',
      available: false,
      color: 'green'
    },
    {
      id: 'modules',
      icon: <Database className="h-5 w-5 text-blue-500" />,
      title: t('categories.modules'),
      description: 'Module-specific implementation guides and workflows',
      url: '/help/modules',
      available: true,
      color: 'blue'
    },
    {
      id: 'glossary', 
      icon: <BookOpen className="h-5 w-5 text-purple-500" />,
      title: t('categories.glossary'),
      description: t('glossary.description'),
      url: '/help/glossary',
      available: false,
      color: 'purple'
    },
    {
      id: 'gettingStarted',
      icon: <Zap className="h-5 w-5 text-orange-500" />,
      title: t('categories.gettingStarted'),
      description: t('gettingStarted.description'),
      url: '/help/getting-started',
      available: false,
      color: 'orange'
    },
    {
      id: 'troubleshooting',
      icon: <MessageCircle className="h-5 w-5 text-cyan-500" />,
      title: t('categories.troubleshooting'),
      description: 'Technical support and troubleshooting guides',
      url: '/help/troubleshooting',
      available: false,
      color: 'cyan'
    },
    {
      id: 'api',
      icon: <Code className="h-5 w-5 text-red-500" />,
      title: t('categories.api'),
      description: 'API integration and developer documentation',
      url: '/help/api',
      available: false,
      color: 'red'
    }
  ]

  const moduleGuides = [
    {
      module: 'context',
      icon: <Database className="h-5 w-5 text-blue-500" />,
      title: t('modules.context'),
      description: 'Data mapping, infrastructure tracking, and GDPR Article 30 compliance',
      url: '/help/context',
      available: true
    },
    {
      module: 'privacy',
      icon: <Shield className="h-5 w-5 text-green-500" />,
      title: t('modules.privacy'),
      description: 'DPIA workflows, LIA/TIA processes, and privacy assessments',
      url: '/help/privacy',
      available: false
    },
    {
      module: 'risk',
      icon: <AlertTriangle className="h-5 w-5 text-orange-500" />,
      title: t('modules.risk'),
      description: 'Risk assessment methodology and threat modeling',
      url: '/help/risk',
      available: false
    },
    {
      module: 'controls',
      icon: <Settings className="h-5 w-5 text-purple-500" />,
      title: t('modules.controls'),
      description: 'Security controls implementation and compliance mapping',
      url: '/help/controls',
      available: false
    },
    {
      module: 'training',
      icon: <GraduationCap className="h-5 w-5 text-cyan-500" />,
      title: t('modules.training'),
      description: 'Privacy awareness training and certification programs',
      url: '/help/training',
      available: false
    },
    {
      module: 'trustCenter',
      icon: <FileText className="h-5 w-5 text-indigo-500" />,
      title: t('modules.trustCenter'),
      description: 'Audit packages and stakeholder compliance reporting',
      url: '/help/trust-center',
      available: false
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header - matching module pattern */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-3">
            <HelpCircle className="h-7 w-7 text-blue-500" />
            {t('title')}
          </h1>
          <p className="text-muted-foreground">
            {t('description')}
          </p>
        </div>
        
        <Link href={`/${locale}/dashboard`}>
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t('backToDashboard')}
          </Button>
        </Link>
      </div>

      {/* Help System Status Overview - matching assessments pills */}
      <div className="space-y-5">
        <h2 className="text-lg font-medium text-foreground">
          Help System Overview
        </h2>
        
        {/* Status Pills Group - matching module style */}
        <div className="flex flex-wrap" style={{ gap: '12px' }}>
          {/* Available Guides Pill */}
          <div 
            className="inline-flex items-center rounded-lg"
            style={{ 
              height: '38px',
              paddingLeft: '12px',
              paddingRight: '16px',
              backgroundColor: 'transparent',
              borderLeft: '3px solid #22c55e',
              gap: '8px'
            }}
          >
            <span 
              style={{ 
                fontSize: '14px',
                color: '#9ca3af',
                fontWeight: '500'
              }}
            >
              {t('status.availableGuides')}
            </span>
            <span 
              style={{ 
                fontSize: '16px',
                color: 'var(--text-primary)',
                fontWeight: '600'
              }}
            >
              {helpCategories.filter(cat => cat.available).length + moduleGuides.filter(mod => mod.available).length}
            </span>
          </div>

          {/* Translations Available Pill */}
          <div 
            className="inline-flex items-center rounded-lg"
            style={{ 
              height: '38px',
              paddingLeft: '12px',
              paddingRight: '16px',
              backgroundColor: 'transparent',
              borderLeft: '3px solid #3b82f6',
              gap: '8px'
            }}
          >
            <span 
              style={{ 
                fontSize: '14px',
                color: '#9ca3af',
                fontWeight: '500'
              }}
            >
              {t('status.translationsAvailable')}
            </span>
            <span 
              style={{ 
                fontSize: '16px',
                color: 'var(--text-primary)',
                fontWeight: '600'
              }}
            >
              2
            </span>
          </div>

          {/* Coming Soon Pill */}
          <div 
            className="inline-flex items-center rounded-lg"
            style={{ 
              height: '38px',
              paddingLeft: '12px',
              paddingRight: '16px',
              backgroundColor: 'transparent',
              borderLeft: '3px solid #f59e0b',
              gap: '8px'
            }}
          >
            <span 
              style={{ 
                fontSize: '14px',
                color: '#9ca3af',
                fontWeight: '500'
              }}
            >
              {t('comingSoon')}
            </span>
            <span 
              style={{ 
                fontSize: '16px',
                color: 'var(--text-primary)',
                fontWeight: '600'
              }}
            >
              {helpCategories.filter(cat => !cat.available).length + moduleGuides.filter(mod => !mod.available).length}
            </span>
          </div>

          {/* Support Articles Pill */}
          <div 
            className="inline-flex items-center rounded-lg"
            style={{ 
              height: '38px',
              paddingLeft: '12px',
              paddingRight: '16px',
              backgroundColor: 'transparent',
              borderLeft: '3px solid #9ca3af',
              gap: '8px'
            }}
          >
            <span 
              style={{ 
                fontSize: '14px',
                color: '#9ca3af',
                fontWeight: '500'
              }}
            >
              {t('status.supportArticles')}
            </span>
            <span 
              style={{ 
                fontSize: '16px',
                color: 'var(--text-primary)',
                fontWeight: '600'
              }}
            >
              12
            </span>
          </div>
        </div>
      </div>

      {/* Increased Spacing Before Categories */}
      <div className="mt-12"></div>

      {/* Help Categories - Main Grid */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-6">Help Categories</h2>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {helpCategories.map((category) => (
            <Card key={category.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-foreground">
                  {category.icon}
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  {category.description}
                </p>
                {category.available ? (
                  <Link href={`/${locale}${category.url}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Browse Guide
                    </Button>
                  </Link>
                ) : (
                  <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded text-center">
                    {t('comingSoon')}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Module Guides - Available Now */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-6">Module Guides</h2>
        
        <div className="grid gap-4 md:grid-cols-2">
          {moduleGuides.map((guide) => (
            <Card key={guide.module} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-foreground">
                    {guide.icon}
                    {guide.title}
                  </div>
                  {guide.available && (
                    <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Available
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  {guide.description}
                </p>
                {guide.available ? (
                  <Link href={`/${locale}${guide.url}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      {guide.icon}
                      <span className="ml-2">Open Guide</span>
                    </Button>
                  </Link>
                ) : (
                  <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded text-center">
                    {t('comingSoon')}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Access Section */}
      <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-foreground">
            <Bookmark className="h-5 w-5 text-blue-500" />
            Quick Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href={`/${locale}/context`} className="block">
              <Button variant="outline" className="w-full justify-start">
                <Database className="h-4 w-4 mr-2" />
                Context Overview
              </Button>
            </Link>
            <Link href={`/${locale}/help/context`} className="block">
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="h-4 w-4 mr-2" />
                Context Guide
              </Button>
            </Link>
            <Link href={`/${locale}/dashboard`} className="block">
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Platform Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Contact Section - Enhanced */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-foreground">
            <Mail className="h-5 w-5 text-blue-500" />
            {t('contact.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-muted-foreground">
              {t('contact.email')} <span className="text-blue-500 font-medium">support@avantle.ai</span>
            </p>
            <p className="text-muted-foreground text-sm">
              {t('contact.response')}
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.location.href = 'mailto:support@avantle.ai'}
              className="mt-3"
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}