import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Target,
  Scale,
  Plane
} from 'lucide-react'
import Link from 'next/link'

type Props = {
  params: Promise<{ locale: string }>;
};

// Privacy Overview - Module overview covering DPIA, LIA, TIA assessments
export default async function PrivacyOverview({ params }: Props) {
  const { locale } = await params;
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          {locale === 'sk' ? 'Prehľad ochrany údajov' : 'Privacy Overview'}
        </h1>
        <p className="text-muted-foreground">
          {locale === 'sk' 
            ? 'Centrálny prehľad všetkých hodnotení ochrany údajov a compliance aktivít'
            : 'Central overview of all privacy assessments and compliance activities'
          }
        </p>
      </div>

      {/* Privacy Assessment Types Status */}
      <div className="space-y-5">
        <h2 className="text-lg font-medium text-foreground">
          {locale === 'sk' ? 'Hodnotenia ochrany údajov' : 'Privacy Assessments'}
        </h2>
        
        {/* DPIA Status Pills */}
        <div className="space-y-4">
          <h3 className="text-md font-medium text-foreground">
            {locale === 'sk' ? 'DPIA - Posúdenie vplyvu na ochranu údajov' : 'DPIA - Data Protection Impact Assessment'}
          </h3>
          <div className="flex flex-wrap" style={{ gap: '12px' }}>
            <Link 
              href={`/${locale}/assessments`}
              className="inline-flex items-center rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer text-decoration-none"
              style={{ 
                height: '38px',
                paddingLeft: '12px',
                paddingRight: '16px',
                backgroundColor: 'transparent',
                borderLeft: '3px solid #22c55e',
                gap: '8px'
              }}
            >
              <span style={{ fontSize: '14px', color: '#9ca3af', fontWeight: '500' }}>
                {locale === 'sk' ? 'Aktívne' : 'Active'}
              </span>
              <span style={{ fontSize: '16px', color: 'var(--text-primary)', fontWeight: '600' }}>
                12
              </span>
            </Link>

            <Link 
              href={`/${locale}/assessments`}
              className="inline-flex items-center rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer text-decoration-none"
              style={{ 
                height: '38px',
                paddingLeft: '12px',
                paddingRight: '16px',
                backgroundColor: 'transparent',
                borderLeft: '3px solid #3b82f6',
                gap: '8px'
              }}
            >
              <span style={{ fontSize: '14px', color: '#9ca3af', fontWeight: '500' }}>
                {locale === 'sk' ? 'Prebieha' : 'In Progress'}
              </span>
              <span style={{ fontSize: '16px', color: 'var(--text-primary)', fontWeight: '600' }}>
                5
              </span>
            </Link>

            <Link 
              href={`/${locale}/assessments`}
              className="inline-flex items-center rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer text-decoration-none"
              style={{ 
                height: '38px',
                paddingLeft: '12px',
                paddingRight: '16px',
                backgroundColor: 'transparent',
                borderLeft: '3px solid #ef4444',
                gap: '8px'
              }}
            >
              <span style={{ fontSize: '14px', color: '#9ca3af', fontWeight: '500' }}>
                {locale === 'sk' ? 'Kritické' : 'Critical'}
              </span>
              <span style={{ fontSize: '16px', color: 'var(--text-primary)', fontWeight: '600' }}>
                2
              </span>
            </Link>
          </div>
        </div>

        {/* LIA Status Pills */}
        <div className="space-y-4">
          <h3 className="text-md font-medium text-foreground">
            {locale === 'sk' ? 'LIA - Posúdenie oprávneného záujmu' : 'LIA - Legitimate Interest Assessment'}
          </h3>
          <div className="flex flex-wrap" style={{ gap: '12px' }}>
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
              <span style={{ fontSize: '14px', color: '#9ca3af', fontWeight: '500' }}>
                {locale === 'sk' ? 'Čoskoro' : 'Coming Soon'}
              </span>
              <span style={{ fontSize: '16px', color: 'var(--text-primary)', fontWeight: '600' }}>
                -
              </span>
            </div>
          </div>
        </div>

        {/* TIA Status Pills */}
        <div className="space-y-4">
          <h3 className="text-md font-medium text-foreground">
            {locale === 'sk' ? 'TIA - Posúdenie vplyvu prenosu' : 'TIA - Transfer Impact Assessment'}
          </h3>
          <div className="flex flex-wrap" style={{ gap: '12px' }}>
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
              <span style={{ fontSize: '14px', color: '#9ca3af', fontWeight: '500' }}>
                {locale === 'sk' ? 'Čoskoro' : 'Coming Soon'}
              </span>
              <span style={{ fontSize: '16px', color: 'var(--text-primary)', fontWeight: '600' }}>
                -
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-5">
        <h2 className="text-lg font-medium text-foreground">
          {locale === 'sk' ? 'Rýchle akcie' : 'Quick Actions'}
        </h2>
        
        <div className="flex flex-wrap" style={{ gap: '12px' }}>
          <Link href={`/${locale}/assessments`}>
            <Button variant="outline" className="gap-2">
              <Target className="h-4 w-4" />
              {locale === 'sk' ? 'Spravovať DPIA' : 'Manage DPIA'}
            </Button>
          </Link>
          
          <Link href={`/${locale}/precheck`}>
            <Button variant="outline" className="gap-2">
              <Target className="h-4 w-4" />
              {locale === 'sk' ? 'DPIA Kontrola' : 'DPIA Pre-check'}
            </Button>
          </Link>

          <Button variant="outline" className="gap-2" disabled>
            <Scale className="h-4 w-4" />
            {locale === 'sk' ? 'LIA (Čoskoro)' : 'LIA (Coming Soon)'}
          </Button>

          <Button variant="outline" className="gap-2" disabled>
            <Plane className="h-4 w-4" />
            {locale === 'sk' ? 'TIA (Čoskoro)' : 'TIA (Coming Soon)'}
          </Button>
        </div>
      </div>
    </div>
  )
}