import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  Database, 
  Target, 
  AlertTriangle, 
  Shield, 
  GraduationCap, 
  CheckCircle,
  ArrowRight 
} from 'lucide-react'

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function PlatformDashboard({ params }: Props) {
  const { locale } = await params;

  // Module cards data - static for minimalistic approach
  const moduleCards = [
    {
      name: 'Context',
      description: 'Data inventory and processing context',
      href: `/${locale}/context`,
      icon: Database,
      metric: '24 Systems',
      color: '#22c55e' // green
    },
    {
      name: 'Privacy',
      description: 'DPIA assessments and compliance',
      href: `/${locale}/privacy`,
      icon: Target,
      metric: '12 Assessments',
      color: '#3b82f6' // blue
    },
    {
      name: 'Risk',
      description: 'Privacy risk identification and management',
      href: `/${locale}/risk`,
      icon: AlertTriangle,
      metric: '3 High Risk',
      color: '#ef4444' // red
    },
    {
      name: 'Controls',
      description: 'Technical and organizational measures',
      href: `/${locale}/controls`,
      icon: Shield,
      metric: '18 Technical',
      color: '#8b5cf6' // purple
    },
    {
      name: 'Training',
      description: 'Privacy awareness and training programs',
      href: `/${locale}/training`,
      icon: GraduationCap,
      metric: '87% Complete',
      color: '#f59e0b' // amber
    },
    {
      name: 'Trust Center',
      description: 'Audit packages and compliance reporting',
      href: `/${locale}/trust-center`,
      icon: CheckCircle,
      metric: '92% Score',
      color: '#10b981' // emerald
    }
  ];

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

      {/* Module Navigation - Secondary content section */}
      <div className="space-y-5">
        <h2 className="text-lg font-medium text-foreground">Module Navigation</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {moduleCards.map((module) => {
          const IconComponent = module.icon;
          return (
            <Link key={module.name} href={module.href}>
              <Card className="avantle-border bg-card backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${module.color}15` }}
                      >
                        <IconComponent 
                          className="h-5 w-5" 
                          style={{ color: module.color }}
                        />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-medium text-foreground">
                          {module.name}
                        </CardTitle>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    {module.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span 
                      className="text-sm font-medium"
                      style={{ color: module.color }}
                    >
                      {module.metric}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      View Details →
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
        </div>
      </div>

      {/* Increased Spacing Before Summary */}
      <div className="mt-12"></div>

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