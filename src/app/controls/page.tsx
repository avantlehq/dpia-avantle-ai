import React from 'react'
import { Lock, Plus, Shield } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ControlsOverviewPage() {
  return (
    <div className="space-y-6">
      {/* Header with CTAs - matching dashboard style */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Controls Overview</h1>
          <p className="text-muted-foreground">
            Technical and organizational measures for data protection
          </p>
        </div>
        <div className="flex items-center" style={{ gap: '32px' }}>
          {/* Secondary CTA - View TOMs */}
          <Link href="/controls/toms">
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
              title="View technical and organizational measures"
            >
              View TOMs
            </button>
          </Link>
          
          {/* Primary CTA - Add Control */}
          <Link href="/controls/toms">
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
              Add Control
            </button>
          </Link>
        </div>
      </div>

      {/* Controls Overview - matching dashboard pills */}
      <div className="space-y-5">
        <h2 className="text-lg font-medium text-foreground">Controls Overview</h2>
        
        {/* Status Pills Group - matching dashboard style */}
        <div className="flex flex-wrap" style={{ gap: '12px' }}>
          {/* Implemented Pill */}
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
              Implemented
            </span>
            <span 
              style={{ 
                fontSize: '16px',
                color: '#ffffff',
                fontWeight: '600'
              }}
            >
              24
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
              In Progress
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

          {/* Planned Pill */}
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
              Planned
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

          {/* Technical Measures Pill */}
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
              Technical
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

      {/* Increased Spacing Before Controls */}
      <div className="mt-12"></div>

      {/* Controls Management Table - matching dashboard style */}
      <Card className="avantle-border bg-card backdrop-blur-sm shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Technical & Organizational Measures
            <Link href="/controls/toms">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add TOM
              </Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Shield className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Security controls ready</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Implement and manage technical and organizational measures to protect personal data.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center" style={{ gap: '32px' }}>
              {/* Secondary CTA - View TOMs */}
              <Link href="/controls/toms">
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
                  title="View technical and organizational measures"
                >
                  View TOMs
                </button>
              </Link>
              
              {/* Primary CTA - Add Control */}
              <Link href="/controls/toms">
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
                  Add Control
                </button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}