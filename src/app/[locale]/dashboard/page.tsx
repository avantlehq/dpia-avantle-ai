import React from 'react'
import { useTranslations } from 'next-intl'

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function PlatformDashboard({ params }: Props) {
  const { locale } = await params;
  const t = useTranslations('dashboard.platform')


  return (
    <div className="space-y-6">
      {/* Header - Status Monitoring Focus */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('description')}
        </p>
      </div>

      {/* Platform Status Overview - Primary content section matching Context module */}
      <div className="space-y-5">
        <h2 className="text-lg font-medium text-foreground">{t('platformStatus')}</h2>

        {/* Status Cards - Row 1: Overall Health */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">{t('overallHealth')}</h3>
          <div className="flex flex-wrap" style={{ gap: '12px' }}>
            {/* Active Modules */}
            <div 
              className="inline-flex items-center rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
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
                {t('activeModules')}
              </span>
              <span 
                style={{ 
                  fontSize: '16px',
                  color: 'var(--text-primary)',
                  fontWeight: '600'
                }}
              >
                6
              </span>
            </div>

            {/* Critical Items */}
            <div 
              className="inline-flex items-center rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              style={{ 
                height: '38px',
                paddingLeft: '12px',
                paddingRight: '16px',
                backgroundColor: 'transparent',
                borderLeft: '3px solid #ef4444',
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
                {t('criticalItems')}
              </span>
              <span 
                style={{ 
                  fontSize: '16px',
                  color: 'var(--text-primary)',
                  fontWeight: '600'
                }}
              >
                3
              </span>
            </div>

            {/* Reviews Needed */}
            <div 
              className="inline-flex items-center rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
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
                {t('reviewsNeeded')}
              </span>
              <span 
                style={{ 
                  fontSize: '16px',
                  color: 'var(--text-primary)',
                  fontWeight: '600'
                }}
              >
                8
              </span>
            </div>

            {/* Compliance Score - Clickable with methodology link */}
            <a
              href={`/${locale}/trust-center/governance`}
              className="inline-flex items-center rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
              style={{ 
                height: '38px',
                paddingLeft: '12px',
                paddingRight: '16px',
                backgroundColor: 'transparent',
                borderLeft: '3px solid #3b82f6',
                gap: '8px',
                textDecoration: 'none'
              }}
              title={t('complianceScoreTooltip')}
            >
              <span
                style={{
                  fontSize: '14px',
                  color: '#9ca3af',
                  fontWeight: '500'
                }}
              >
                {t('complianceScore')}
              </span>
              <span 
                style={{ 
                  fontSize: '16px',
                  color: 'var(--text-primary)',
                  fontWeight: '600'
                }}
              >
                92%
              </span>
              <span 
                style={{ 
                  fontSize: '12px',
                  color: '#3b82f6',
                  fontWeight: '400'
                }}
              >
                ⓘ
              </span>
            </a>
          </div>
        </div>
        
        {/* Status Cards - Row 2: Compliance & Audit Metrics */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">{t('complianceAudit')}</h3>
          <div className="flex flex-wrap" style={{ gap: '12px' }}>
            {/* Audit Reports */}
            <div 
              className="inline-flex items-center rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
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
                {t('auditReports')}
              </span>
              <span 
                style={{ 
                  fontSize: '16px',
                  color: 'var(--text-primary)',
                  fontWeight: '600'
                }}
              >
                8
              </span>
            </div>

            {/* Certifications */}
            <div 
              className="inline-flex items-center rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
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
                {t('certifications')}
              </span>
              <span 
                style={{ 
                  fontSize: '16px',
                  color: 'var(--text-primary)',
                  fontWeight: '600'
                }}
              >
                3
              </span>
            </div>

            {/* DPIA Active */}
            <div 
              className="inline-flex items-center rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
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
                {t('dpiaActive')}
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

            {/* Last Updated */}
            <div 
              className="inline-flex items-center rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
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
                {t('lastUpdated')}
              </span>
              <span
                style={{
                  fontSize: '16px',
                  color: 'var(--text-primary)',
                  fontWeight: '600'
                }}
              >
                {t('lastUpdatedValue')}
              </span>
            </div>
          </div>
        </div>
      </div>


    </div>
  )
}