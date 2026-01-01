'use client'

import React from 'react'
import { 
  Database,
  Plus
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useClientLocale } from '@/hooks/useClientLocale'
import { useTranslations } from '@/hooks/useTranslations'
import { useState, useEffect } from 'react'

export default function ContextOverviewPage() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // SSR fallback with English defaults
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Context</h1>
            <p className="text-muted-foreground">
              Foundation data and processing context
            </p>
          </div>
          <div className="flex items-center" style={{ gap: '32px' }}>
            <Link href="/en/context/systems">
              <Button variant="secondary" size="md">
                Register System
              </Button>
            </Link>
            <Link href="/en/context/processing">
              <Button variant="primary" size="md">
                Add Processing
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const { locale } = useClientLocale()
  const { t } = useTranslations('context')
  
  return (
    <div className="space-y-6">
      {/* Header with CTAs - matching dashboard style */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
          <p className="text-muted-foreground">
            {description}
          </p>
        </div>
        <div className="flex items-center" style={{ gap: '32px' }}>
          {/* Secondary CTA - Register System */}
          <Link href={`/${locale}/context/systems`}>
            <Button 
              variant="secondary" 
              size="md"
              title={t('systemsDescription')}
            >
              {t('registerSystem')}
            </Button>
          </Link>
          
          {/* Primary CTA - Add Processing */}
          <Link href={`/${locale}/context/processing`}>
            <Button 
              variant="primary" 
              size="md"
            >
              {t('addProcessing')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Foundation Data Overview - matching dashboard pills */}
      <div className="space-y-5">
        <h2 className="text-lg font-medium text-foreground">{t('foundationData')}</h2>
        
        {/* Status Pills Group - matching dashboard style */}
        <div className="flex flex-wrap" style={{ gap: '12px' }}>
          {/* Systems Pill */}
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
              {t('systems')}
            </span>
            <span 
              style={{ 
                fontSize: '16px',
                color: '#ffffff',
                fontWeight: '600'
              }}
            >
              12
            </span>
          </div>

          {/* Processing Activities Pill */}
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
              {t('processingActivities')}
            </span>
            <span 
              style={{ 
                fontSize: '16px',
                color: '#ffffff',
                fontWeight: '600'
              }}
            >
              45
            </span>
          </div>

          {/* Data Categories Pill */}
          <div 
            className="inline-flex items-center rounded-lg"
            style={{ 
              height: '38px',
              paddingLeft: '12px',
              paddingRight: '16px',
              backgroundColor: 'transparent',
              borderLeft: '3px solid #8b5cf6',
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
              {t('dataCategories')}
            </span>
            <span 
              style={{ 
                fontSize: '16px',
                color: '#ffffff',
                fontWeight: '600'
              }}
            >
              28
            </span>
          </div>

          {/* Vendors Pill */}
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
              {t('vendors')}
            </span>
            <span 
              style={{ 
                fontSize: '16px',
                color: '#ffffff',
                fontWeight: '600'
              }}
            >
              18
            </span>
          </div>
        </div>
      </div>

      {/* Increased Spacing Before Components */}
      <div className="mt-12"></div>

      {/* Foundation Components Table - matching dashboard style */}
      <Card className="avantle-border bg-card backdrop-blur-sm shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {t('foundationComponents')}
            <Link href={`/${locale}/context/systems`}>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                {t('addComponent')}
              </Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Database className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">{t('foundationReady')}</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {t('foundationDescription')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center" style={{ gap: '32px' }}>
              {/* Secondary CTA - Manage Systems */}
              <Link href={`/${locale}/context/systems`}>
                <Button 
                  variant="secondary" 
                  size="md"
                  title={t('systemsDescription')}
                >
                  {t('manageSystem')}
                </Button>
              </Link>
              
              {/* Primary CTA - View Processing */}
              <Link href={`/${locale}/context/processing`}>
                <Button 
                  variant="primary" 
                  size="lg"
                >
                  {t('viewProcessing')}
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}