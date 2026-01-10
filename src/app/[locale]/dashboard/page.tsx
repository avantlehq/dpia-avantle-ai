import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  Target, 
  CheckCircle
} from 'lucide-react'

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function PlatformDashboard({ params }: Props) {
  const { locale } = await params;


  return (
    <div className="space-y-6">
      {/* Header with CTAs - matching Context style */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Platform Dashboard</h1>
          <p className="text-muted-foreground">
            Executive overview of your privacy compliance platform
          </p>
        </div>
        <div className="flex items-center" style={{ gap: '32px' }}>
          {/* Secondary CTA - Quick Start */}
          <Link href={`/${locale}/precheck`}>
            <Button 
              variant="secondary" 
              size="md"
              title="Quick GDPR pre-assessment to get started"
            >
              Quick Start
            </Button>
          </Link>
          
          {/* Primary CTA - New Assessment */}
          <Link href={`/${locale}/assessments/new`}>
            <Button 
              variant="primary" 
              size="md"
            >
              New Assessment
            </Button>
          </Link>
        </div>
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
        
        {/* Status Cards - Row 2: Module Summary */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Module Summary</h3>
          <div className="flex flex-wrap" style={{ gap: '12px' }}>
            {/* Context Status */}
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
                Context Ready
              </span>
              <span 
                style={{ 
                  fontSize: '16px',
                  color: 'var(--text-primary)',
                  fontWeight: '600'
                }}
              >
                ✓
              </span>
            </div>

            {/* Privacy Assessments */}
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

            {/* Risk Items */}
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
                High Risks
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

            {/* Training Progress */}
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
                Training
              </span>
              <span 
                style={{ 
                  fontSize: '16px',
                  color: 'var(--text-primary)',
                  fontWeight: '600'
                }}
              >
                87%
              </span>
            </div>
          </div>
        </div>
      </div>


      {/* Platform Summary - Tertiary content matching Context pattern */}
      <Card className="avantle-border bg-card backdrop-blur-sm shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Platform Overview
            <Link href={`/${locale}/privacy`}>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Target className="h-4 w-4" />
                Get Started
              </Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-3" />
            <h3 className="text-base font-medium text-foreground mb-2">Platform Active</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              Your privacy compliance platform is operational. Use the status cards above to identify priority areas.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}