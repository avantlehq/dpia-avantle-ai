import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { 
  Target
} from 'lucide-react'
import Link from 'next/link'

// Privacy Overview Dashboard - Central hub for all privacy activities
export default function PrivacyOverview() {
  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs />
      
      {/* Header with CTAs - matching dashboard style */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Privacy Overview</h1>
          <p className="text-muted-foreground">
            Manage your DPIA assessments and compliance activities
          </p>
        </div>
        <div className="flex items-center" style={{ gap: '32px' }}>
          {/* Secondary CTA - Start Pre-check */}
          <Link href="/precheck">
            <button
              className="secondary-cta-button"
              style={{
                backgroundColor: '#357ABD',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                boxShadow: '0 2px 4px rgba(53, 122, 189, 0.15)'
              }}
              title="Quick pre-assessment to check if full DPIA is required"
            >
              Start Pre-check
            </button>
          </Link>
          
          {/* Primary CTA - New Assessment */}
          <Link href="/assessments/new">
            <button
              className="primary-cta-button"
              style={{
                backgroundColor: '#357ABD',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                boxShadow: '0 2px 4px rgba(53, 122, 189, 0.25)'
              }}
            >
              New Assessment
            </button>
          </Link>
        </div>
      </div>

      {/* Assessment Overview - matching dashboard pills */}
      <div className="space-y-5">
        <h2 className="text-lg font-medium text-foreground">Assessment Overview</h2>
        
        {/* Status Pills Group - matching dashboard style */}
        <div className="flex flex-wrap" style={{ gap: '12px' }}>
          {/* Completed Pill */}
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
              Completed
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

          {/* In Progress Pill */}
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
              In Progress
            </span>
            <span 
              style={{ 
                fontSize: '16px',
                color: '#ffffff',
                fontWeight: '600'
              }}
            >
              5
            </span>
          </div>

          {/* Drafts Pill */}
          <div 
            className="inline-flex items-center rounded-lg"
            style={{ 
              height: '38px',
              paddingLeft: '12px',
              paddingRight: '16px',
              backgroundColor: 'transparent',
              borderLeft: '3px solid #9ca3af',
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
              Drafts
            </span>
            <span 
              style={{ 
                fontSize: '16px',
                color: '#ffffff',
                fontWeight: '600'
              }}
            >
              8
            </span>
          </div>

          {/* Overdue Pill */}
          <div 
            className="inline-flex items-center rounded-lg"
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
              Overdue
            </span>
            <span 
              style={{ 
                fontSize: '16px',
                color: '#ffffff',
                fontWeight: '600'
              }}
            >
              2
            </span>
          </div>
        </div>
      </div>

      {/* Increased Spacing Before Assessments */}
      <div className="mt-12"></div>

      {/* Privacy Assessments Table - matching dashboard style */}
      <Card className="avantle-border bg-card backdrop-blur-sm shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Privacy Assessments
            <Link href="/dashboard">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Target className="h-4 w-4" />
                View All
              </Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Target className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Ready to assess privacy impact</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start with a pre-check to determine if you need a full DPIA, or create a comprehensive assessment directly.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center" style={{ gap: '32px' }}>
              {/* Secondary CTA - Start Pre-check */}
              <Link href="/precheck">
                <button
                  className="secondary-cta-button"
                  style={{
                    backgroundColor: '#357ABD',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 20px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                    boxShadow: '0 2px 4px rgba(53, 122, 189, 0.15)'
                  }}
                  title="Quick pre-assessment to check if full DPIA is required"
                >
                  Start Pre-check
                </button>
              </Link>
              
              {/* Primary CTA - New Assessment */}
              <Link href="/assessments/new">
                <button
                  className="primary-cta-button"
                  style={{
                    backgroundColor: '#357ABD',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                    boxShadow: '0 2px 4px rgba(53, 122, 189, 0.25)'
                  }}
                >
                  New Assessment
                </button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}