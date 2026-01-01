'use client'

import React from 'react'
import { HelpCircle, Mail, FileText, MessageCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTranslations } from '@/hooks/useTranslations'

export default function HelpPage() {
  const { t } = useTranslations('help')
  
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-700/50 pb-6">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <HelpCircle className="h-8 w-8 text-blue-500" />
          {t('title')}
        </h1>
        <p className="text-gray-400">
          {t('description')}
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Documentation */}
        <Card className="avantle-border bg-card backdrop-blur-sm shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-blue-500" />
              {t('documentation')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">
              {t('documentationDescription')}
            </p>
            <Button variant="outline" size="sm" disabled>
              {t('comingSoon')}
            </Button>
          </CardContent>
        </Card>

        {/* Support */}
        <Card className="avantle-border bg-card backdrop-blur-sm shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-green-500" />
              {t('support')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">
              {t('supportDescription')}
            </p>
            <Button variant="outline" size="sm" disabled>
              {t('comingSoon')}
            </Button>
          </CardContent>
        </Card>

        {/* Community */}
        <Card className="avantle-border bg-card backdrop-blur-sm shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <MessageCircle className="h-5 w-5 text-purple-500" />
              {t('community')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">
              {t('communityDescription')}
            </p>
            <Button variant="outline" size="sm" disabled>
              {t('comingSoon')}
            </Button>
          </CardContent>
        </Card>

        {/* Status */}
        <Card className="avantle-border bg-card backdrop-blur-sm shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <HelpCircle className="h-5 w-5 text-orange-500" />
              {t('status')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">
              {t('statusDescription')}
            </p>
            <Button variant="outline" size="sm" disabled>
              {t('comingSoon')}
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-gray-800/50 rounded-lg p-6 text-center border border-gray-700/30">
        <h2 className="text-xl font-semibold text-white mb-2">{t('tempMessage')}</h2>
        <p className="text-gray-400">
          {t('tempDescription')}
        </p>
      </div>
    </div>
  )
}