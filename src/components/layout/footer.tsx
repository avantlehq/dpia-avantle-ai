'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Heart, Shield, Globe } from 'lucide-react'
import { getVersionInfo } from '@/lib/version'

export function Footer() {
  const versionInfo = getVersionInfo()

  return (
    <footer className="mt-auto border-t border-border bg-card backdrop-blur-sm">
      <div className="px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {/* Left Section - Remove gradients for neutral footer */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3" style={{ color: 'var(--color-green)' }} />
              <span>GDPR Compliant</span>
            </div>
            <Separator orientation="vertical" className="h-3 bg-border" />
            <div className="flex items-center gap-1">
              <Globe className="h-3 w-3" style={{ color: 'var(--color-purple)' }} />
              <span>European Privacy Values</span>
            </div>
          </div>

          {/* Center Section - Remove gradients for neutral footer */}
          <div className="hidden sm:flex items-center gap-1">
            <span>Built with</span>
            <Heart className="h-3 w-3 fill-current" style={{ color: 'var(--color-red)' }} />
            <span>for privacy professionals</span>
          </div>

          {/* Right Section - Keep minimal styling */}
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs">
              {versionInfo.displayName}
            </Badge>
            <span>© 2024 Avantle.ai</span>
          </div>
        </div>
      </div>
    </footer>
  )
}