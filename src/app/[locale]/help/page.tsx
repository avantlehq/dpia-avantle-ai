'use client'

import React from 'react'
import Link from 'next/link'
import { 
  HelpCircle, 
  Mail, 
  FileText, 
  MessageCircle, 
  BookOpen,
  Video,
  Shield,
  Code,
  ArrowLeft
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTranslations } from '@/hooks/useTranslations'
import { useClientLocale } from '@/hooks/useClientLocale'

export default function HelpPage() {
  const { t } = useTranslations('help')
  const { locale } = useClientLocale()
  
  const helpFeatures = [
    {
      icon: <BookOpen className="h-5 w-5 text-blue-500" />,
      title: t('features.userGuide'),
      description: 'Step-by-step guides for all platform features'
    },
    {
      icon: <MessageCircle className="h-5 w-5 text-green-500" />,
      title: t('features.faq'),
      description: 'Common questions and troubleshooting'
    },
    {
      icon: <Mail className="h-5 w-5 text-purple-500" />,
      title: t('features.support'),
      description: 'Direct support for technical issues'
    },
    {
      icon: <Shield className="h-5 w-5 text-orange-500" />,
      title: t('features.legal'),
      description: 'GDPR compliance and legal guidance'
    },
    {
      icon: <Code className="h-5 w-5 text-cyan-500" />,
      title: t('features.api'),
      description: 'API integration and developer resources'
    },
    {
      icon: <Video className="h-5 w-5 text-red-500" />,
      title: t('features.videos'),
      description: 'Interactive video tutorials and demos'
    }
  ]
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[--border-default] pb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link 
            href={`/${locale}/dashboard`}
            className="flex items-center gap-2 text-[--text-muted] hover:text-[--text-primary] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('backToDashboard')}
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold text-[--text-primary] mb-3 flex items-center gap-3">
          <HelpCircle className="h-8 w-8 text-[--brand-primary]" />
          {t('title')}
        </h1>
        <p className="text-[--text-secondary] text-lg">
          {t('description')}
        </p>
      </div>
      
      {/* Coming Soon Banner */}
      <div className="bg-gradient-to-r from-[--brand-primary]/10 to-[--brand-primary]/5 rounded-lg p-6 border border-[--brand-primary]/20">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-[--brand-primary]/20 rounded-full flex items-center justify-center">
            <HelpCircle className="h-6 w-6 text-[--brand-primary]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[--text-primary] mb-1">
              {t('comingSoon')}
            </h2>
            <p className="text-[--text-secondary]">
              {t('description')}
            </p>
          </div>
        </div>
      </div>
      
      {/* Features Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {helpFeatures.map((feature, index) => (
          <Card key={index} className="bg-[--surface-1] border-[--border-default] shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-[--text-primary]">
                {feature.icon}
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[--text-secondary] text-sm mb-4">
                {feature.description}
              </p>
              <div className="text-xs text-[--text-muted] bg-[--surface-2] px-2 py-1 rounded">
                {t('comingSoon')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Contact Section */}
      <Card className="bg-[--surface-1] border-[--border-default]">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-[--text-primary]">
            <Mail className="h-5 w-5 text-[--brand-primary]" />
            {t('contact.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-[--text-secondary]">
              {t('contact.email')} <span className="text-[--brand-primary] font-medium">support@avantle.ai</span>
            </p>
            <p className="text-[--text-muted] text-sm">
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