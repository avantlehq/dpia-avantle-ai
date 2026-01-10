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
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Platform Dashboard</h1>
          <p className="text-muted-foreground">
            Executive overview of your privacy compliance platform
          </p>
        </div>
      </div>

      {/* Module Cards Grid */}
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

      {/* Platform Status Summary */}
      <div className="mt-12">
        <Card className="avantle-border bg-card backdrop-blur-sm shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-foreground">Platform Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-3" />
              <h3 className="text-base font-medium text-foreground mb-2">Platform Active</h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                Your privacy compliance platform is operational. Navigate to specific modules for detailed management.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}