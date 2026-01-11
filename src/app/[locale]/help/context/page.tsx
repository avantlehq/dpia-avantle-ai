'use client'

import React from 'react'
import Link from 'next/link'
import { 
  ArrowLeft,
  Database,
  MapPin,
  Network,
  FileText,
  CheckCircle,
  AlertTriangle,
  Shield,
  Building,
  Target,
  Workflow
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useTranslations } from '@/hooks/useTranslations'
import { useClientLocale } from '@/hooks/useClientLocale'

type Props = {
  params: Promise<{ locale: string }>
}

export default function ContextModuleHelpPage({ params: _params }: Props) {
  const { locale } = useClientLocale()
  const { t } = useTranslations('help.contextGuide')
  
  const contextPages = [
    {
      icon: <Database className="h-5 w-5 text-blue-500" />,
      title: t('pages.systems.title'),
      description: t('pages.systems.description'),
      url: '/context/systems',
      features: [
        t('pages.systems.features.status'),
        t('pages.systems.features.criticality'), 
        t('pages.systems.features.ownership'),
        t('pages.systems.features.contacts')
      ]
    },
    {
      icon: <FileText className="h-5 w-5 text-green-500" />,
      title: t('pages.processing.title'),
      description: t('pages.processing.description'),
      url: '/context/processing',
      features: [
        t('pages.processing.features.lawful'),
        t('pages.processing.features.dpo'),
        t('pages.processing.features.review'),
        t('pages.processing.features.purpose')
      ]
    },
    {
      icon: <Building className="h-5 w-5 text-purple-500" />,
      title: t('pages.vendors.title'),
      description: t('pages.vendors.description'),
      url: '/context/vendors',
      features: [
        t('pages.vendors.features.role'),
        t('pages.vendors.features.expiration'),
        t('pages.vendors.features.contacts'),
        t('pages.vendors.features.location')
      ]
    },
    {
      icon: <Network className="h-5 w-5 text-orange-500" />,
      title: t('pages.dataFlows.title'),
      description: t('pages.dataFlows.description'),
      url: '/context/data-flows',
      features: [
        t('pages.dataFlows.features.direction'),
        t('pages.dataFlows.features.crossBorder'),
        t('pages.dataFlows.features.encryption'),
        t('pages.dataFlows.features.criticality')
      ]
    },
    {
      icon: <MapPin className="h-5 w-5 text-cyan-500" />,
      title: t('pages.locations.title'),
      description: t('pages.locations.description'),
      url: '/context/locations',
      features: [
        t('pages.locations.features.adequacy'),
        t('pages.locations.features.safeguards'),
        t('pages.locations.features.localization'),
        t('pages.locations.features.classification')
      ]
    }
  ]

  const statusExplanations = [
    {
      status: t('statusTypes.active.label'),
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      description: t('statusTypes.active.description')
    },
    {
      status: t('statusTypes.critical.label'),
      color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      description: t('statusTypes.critical.description')
    },
    {
      status: t('statusTypes.review.label'),
      color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      description: t('statusTypes.review.description')
    },
    {
      status: t('statusTypes.inactive.label'),
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      description: t('statusTypes.inactive.description')
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link 
            href={`/${locale}/help`}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('backToHelp')}
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-3 flex items-center gap-3">
          <Database className="h-8 w-8 text-blue-500" />
          {t('title')}
        </h1>
        <p className="text-muted-foreground text-lg max-w-3xl">
          {t('description')}
        </p>
      </div>

      {/* Overview */}
      <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-foreground">
            <Target className="h-5 w-5 text-blue-500" />
            {t('purpose')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            <strong>Context</strong> {t('purposeDescription')}
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-foreground mb-2">{t('keyBenefits')}</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• {t('benefits.visibility')}</li>
                <li>• {t('benefits.compliance')}</li>
                <li>• {t('benefits.foundation')}</li>
                <li>• {t('benefits.management')}</li>
                <li>• {t('benefits.tracking')}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">{t('complianceFramework')}</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• {t('framework.dataMapping')}</li>
                <li>• {t('framework.transfers')}</li>
                <li>• {t('framework.agreements')}</li>
                <li>• {t('framework.adequacy')}</li>
                <li>• {t('framework.lawful')}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Module Pages */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
          <Workflow className="h-6 w-6 text-blue-500" />
          {t('modulePages')}
        </h2>
        
        <div className="grid gap-6">
          {contextPages.map((page, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="flex items-center gap-3 text-foreground">
                    {page.icon}
                    {page.title}
                  </CardTitle>
                  <Link href={`/${locale}${page.url}`}>
                    <Button variant="outline" size="sm">
                      {t('openPage')}
                    </Button>
                  </Link>
                </div>
                <p className="text-muted-foreground">{page.description}</p>
              </CardHeader>
              <CardContent>
                <h4 className="font-medium text-foreground mb-3">{t('keyFeatures')}</h4>
                <div className="grid md:grid-cols-2 gap-2">
                  {page.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Status System */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
          <Shield className="h-6 w-6 text-green-500" />
          {t('statusTracking')}
        </h2>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('universalPills')}</CardTitle>
            <p className="text-muted-foreground">
              {t('statusDescription')}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {statusExplanations.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <Badge className={item.color}>
                    {item.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{item.description}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflow */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
          <Workflow className="h-6 w-6 text-purple-500" />
          {t('workflow')}
        </h2>
        
        <div className="grid gap-4">
          {['step1', 'step2', 'step3', 'step4', 'step5'].map((step, index) => (
            <Card key={step}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className={`bg-${['blue', 'green', 'purple', 'orange', 'cyan'][index]}-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm font-bold`}>
                    {index + 1}
                  </span>
                  {t(`steps.${step}.title`)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  {t(`steps.${step}.description`)}
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                  <li>• {t(`steps.${step}.tasks.add` || `steps.${step}.tasks.define` || `steps.${step}.tasks.classify` || `steps.${step}.tasks.document`)}</li>
                  <li>• {t(`steps.${step}.tasks.classify` || `steps.${step}.tasks.specify` || `steps.${step}.tasks.track` || `steps.${step}.tasks.identify`)}</li>
                  <li>• {t(`steps.${step}.tasks.assign` || `steps.${step}.tasks.set` || `steps.${step}.tasks.monitor` || `steps.${step}.tasks.verify`)}</li>
                  <li>• {t(`steps.${step}.tasks.document` || `steps.${step}.tasks.link` || `steps.${step}.tasks.document` || `steps.${step}.tasks.assess`)}</li>
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Best Practices */}
      <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-foreground">
            <CheckCircle className="h-5 w-5 text-green-500" />
            {t('bestPractices')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-foreground mb-3">{t('dataQuality')}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• {t('qualityTips.current')}</li>
                <li>• {t('qualityTips.review')}</li>
                <li>• {t('qualityTips.validate')}</li>
                <li>• {t('qualityTips.naming')}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-3">{t('compliance')}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• {t('complianceTips.ropa')}</li>
                <li>• {t('complianceTips.dpa')}</li>
                <li>• {t('complianceTips.adequacy')}</li>
                <li>• {t('complianceTips.transfers')}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Common Issues */}
      <Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-950/20 dark:border-orange-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-foreground">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            {t('commonIssues')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                {t('missingDpa.title')}
              </h4>
              <p className="text-sm text-muted-foreground">
                <strong>{t('missingDpa.solution')}</strong>
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                {t('incompleteMapping.title')}
              </h4>
              <p className="text-sm text-muted-foreground">
                <strong>{t('incompleteMapping.solution')}</strong>
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                {t('outdatedActivities.title')}
              </h4>
              <p className="text-sm text-muted-foreground">
                <strong>{t('outdatedActivities.solution')}</strong>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>{t('quickAccess')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href={`/${locale}/context`} className="block">
              <Button variant="outline" className="w-full justify-start">
                <Database className="h-4 w-4 mr-2" />
                {t('quickLinks.overview')}
              </Button>
            </Link>
            <Link href={`/${locale}/context/systems`} className="block">
              <Button variant="outline" className="w-full justify-start">
                <Database className="h-4 w-4 mr-2" />
                {t('quickLinks.systems')}
              </Button>
            </Link>
            <Link href={`/${locale}/context/processing`} className="block">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                {t('quickLinks.processing')}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}