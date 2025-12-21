import React from 'react'
import { AlertTriangle, Plus, Shield } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function RiskOverviewPage() {
  return (
    <div className="space-y-6">
      {/* Header with CTAs - matching dashboard style */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Risk Overview</h1>
          <p className="text-muted-foreground">
            Privacy risk identification, assessment, and management
          </p>
        </div>
        <div className="flex items-center" style={{ gap: '32px' }}>
          {/* Secondary CTA - Risk Register */}
          <Link href="/risk/register">
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
              title="View risk register and documentation"
            >
              Risk Register
            </button>
          </Link>
          
          {/* Primary CTA - Assess Risk */}
          <Link href="/risk/privacy-risks">
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
              Assess Risk
            </button>
          </Link>
        </div>
      </div>

      {/* Risk Overview - matching dashboard pills */}
      <div className="space-y-5">
        <h2 className="text-lg font-medium text-foreground">Risk Overview</h2>
        
        {/* Status Pills Group - matching dashboard style */}
        <div className="flex flex-wrap" style={{ gap: '12px' }}>
          {/* High Risk Pill */}
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
              High Risk
            </span>
            <span 
              style={{ 
                fontSize: '16px',
                color: '#ffffff',
                fontWeight: '600'
              }}
            >
              3
            </span>
          </div>

          {/* Medium Risk Pill */}
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
              Medium Risk
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

          {/* Low Risk Pill */}
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
              Low Risk
            </span>
            <span 
              style={{ 
                fontSize: '16px',
                color: '#ffffff',
                fontWeight: '600'
              }}
            >
              15
            </span>
          </div>

          {/* Mitigated Pill */}
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
              Mitigated
            </span>
            <span 
              style={{ 
                fontSize: '16px',
                color: '#ffffff',
                fontWeight: '600'
              }}
            >
              22
            </span>
          </div>
        </div>
      </div>

      {/* Increased Spacing Before Risk Management */}
      <div className="mt-12"></div>

      {/* Risk Management Table - matching dashboard style */}
      <Card className="avantle-border bg-card backdrop-blur-sm shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Risk Management
            <Link href="/risk/privacy-risks">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Risk
              </Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <AlertTriangle className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Risk assessment ready</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Identify, assess, and manage privacy risks across your data processing activities.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center" style={{ gap: '32px' }}>
              {/* Secondary CTA - Risk Register */}
              <Link href="/risk/register">
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
                  title="View risk register and documentation"
                >
                  Risk Register
                </button>
              </Link>
              
              {/* Primary CTA - Assess Risk */}
              <Link href="/risk/privacy-risks">
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
                  Assess Risk
                </button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}