import React from 'react'

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function PlatformDashboard({ params }: Props) {
  const { locale } = await params;


  return (
    <div className="space-y-6">
      {/* Header - Status Monitoring Focus */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Platform Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your privacy compliance status and identify priority areas
        </p>
      </div>

      {/* Platform Status Overview - Primary content section matching Context module */}
      <div className="space-y-5">
        <h2 className="text-lg font-medium text-foreground">Platform Status</h2>
        
        {/* Status Cards - Row 1: Overall Health */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Overall Health</h3>
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
                Active Modules
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
                Critical Items
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
                Reviews Needed
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

            {/* Compliance Score */}
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
                Compliance Score
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
            </div>
          </div>
        </div>
        
        {/* Status Cards - Row 2: Compliance & Audit Metrics */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Compliance & Audit</h3>
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
                Audit Reports
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
                Certifications
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
                DPIA Active
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
                Last Updated
              </span>
              <span 
                style={{ 
                  fontSize: '16px',
                  color: 'var(--text-primary)',
                  fontWeight: '600'
                }}
              >
                Jan 2026
              </span>
            </div>
          </div>
        </div>
      </div>


    </div>
  )
}