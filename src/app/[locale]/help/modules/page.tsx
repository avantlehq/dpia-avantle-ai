'use client'

import React from 'react'
import Link from 'next/link'
import { 
  Database,
  Shield,
  AlertTriangle,
  Settings,
  GraduationCap,
  FileText,
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Clock
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTranslations } from '@/hooks/useTranslations'
import { useClientLocale } from '@/hooks/useClientLocale'

export default function ModulesHelpPage() {
  const { t } = useTranslations('help')
  const { locale } = useClientLocale()

  const moduleGuides = [
    {
      module: 'context',
      icon: <Database className="h-6 w-6 text-blue-500" />,
      title: t('modules.context'),
      description: 'Data mapping, IT systems inventory, processing activities (ROPA), vendor management, and GDPR Article 30 compliance documentation',
      url: '/help/context',
      moduleUrl: '/context',
      available: true,
      features: ['Data Mapping', 'ROPA Management', 'System Inventory', 'Vendor Tracking']
    },
    {
      module: 'privacy',
      icon: <Shield className="h-6 w-6 text-green-500" />,
      title: t('modules.privacy'),
      description: 'DPIA workflows, Legitimate Interest Assessments (LIA), Transfer Impact Assessments (TIA), and comprehensive privacy impact evaluations',
      url: '/help/privacy',
      moduleUrl: '/dashboard',
      available: false,
      features: ['DPIA Builder', 'LIA Processing', 'TIA Assessments', 'Privacy Reviews']
    },
    {
      module: 'risk',
      icon: <AlertTriangle className="h-6 w-6 text-orange-500" />,
      title: t('modules.risk'),
      description: 'Risk assessment methodology, threat modeling, vulnerability assessments, and privacy risk quantification frameworks',
      url: '/help/risk',
      moduleUrl: '/risk',
      available: false,
      features: ['Threat Modeling', 'Risk Matrices', 'Impact Assessment', 'Vulnerability Scanning']
    },
    {
      module: 'controls',
      icon: <Settings className="h-6 w-6 text-purple-500" />,
      title: t('modules.controls'),
      description: 'Security controls implementation, compliance framework mapping, audit trail management, and control effectiveness monitoring',
      url: '/help/controls',
      moduleUrl: '/controls',
      available: false,
      features: ['Control Catalog', 'Compliance Mapping', 'Audit Trails', 'Effectiveness Testing']
    },
    {
      module: 'training',
      icon: <GraduationCap className="h-6 w-6 text-cyan-500" />,
      title: t('modules.training'),
      description: 'Privacy awareness training programs, certification tracking, compliance education, and knowledge assessment tools',
      url: '/help/training',
      moduleUrl: '/training',
      available: false,
      features: ['Training Programs', 'Certification Tracking', 'Knowledge Tests', 'Compliance Education']
    },
    {
      module: 'trustCenter',
      icon: <FileText className="h-6 w-6 text-indigo-500" />,
      title: t('modules.trustCenter'),
      description: 'External audit packages, stakeholder compliance reporting, certification management, and transparency documentation',
      url: '/help/trust-center',
      moduleUrl: '/trust-center',
      available: false,
      features: ['Audit Packages', 'Compliance Reports', 'Certifications', 'Transparency Hub']
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header - matching module pattern */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-3">
            <Database className="h-7 w-7 text-blue-500" />
            Module Guides
          </h1>
          <p className="text-muted-foreground">
            Implementation guides and workflows for each platform module
          </p>
        </div>
        
        <Link href={`/${locale}/help`}>
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Help Center
          </Button>
        </Link>
      </div>

      {/* Module Status Overview */}
      <div className="space-y-5">
        <h2 className="text-lg font-medium text-foreground">
          Module Implementation Status
        </h2>
        
        {/* Status Pills Group */}
        <div className="flex flex-wrap" style={{ gap: '12px' }}>
          {/* Available Modules */}
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
              Available Modules
            </span>
            <span 
              style={{ 
                fontSize: '16px',
                color: 'var(--text-primary)',
                fontWeight: '600'
              }}
            >
              {moduleGuides.filter(m => m.available).length}
            </span>
          </div>

          {/* In Development */}
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
              In Development
            </span>
            <span 
              style={{ 
                fontSize: '16px',
                color: 'var(--text-primary)',
                fontWeight: '600'
              }}
            >
              {moduleGuides.filter(m => !m.available).length}
            </span>
          </div>

          {/* Total Features */}
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
              Total Features
            </span>
            <span 
              style={{ 
                fontSize: '16px',
                color: 'var(--text-primary)',
                fontWeight: '600'
              }}
            >
              {moduleGuides.reduce((acc, mod) => acc + mod.features.length, 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Module Guides Grid */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-6">Platform Modules</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          {moduleGuides.map((guide) => (
            <Card key={guide.module} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-foreground">
                    {guide.icon}
                    {guide.title}
                  </div>
                  <div className="flex items-center gap-2">
                    {guide.available ? (
                      <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Available
                      </div>
                    ) : (
                      <div className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Coming Soon
                      </div>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  {guide.description}
                </p>
                
                {/* Features List */}
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                    Key Features
                  </h4>
                  <div className="grid grid-cols-2 gap-1">
                    {guide.features.map((feature, index) => (
                      <div key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                        <div className="w-1 h-1 bg-muted-foreground/50 rounded-full" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  {guide.available ? (
                    <>
                      <Link href={`/${locale}${guide.url}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <BookOpen className="h-4 w-4 mr-2" />
                          View Guide
                        </Button>
                      </Link>
                      <Link href={`/${locale}${guide.moduleUrl}`} className="flex-1">
                        <Button variant="default" size="sm" className="w-full">
                          {guide.icon}
                          <span className="ml-2">Open Module</span>
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <div className="w-full text-xs text-muted-foreground bg-muted px-2 py-2 rounded text-center">
                      Implementation in progress - Expected Q1 2025
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-foreground">
            <BookOpen className="h-5 w-5 text-blue-500" />
            Quick Links
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
                DPIA Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}