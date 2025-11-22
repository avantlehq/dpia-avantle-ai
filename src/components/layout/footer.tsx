'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Heart, Shield, Globe } from 'lucide-react'
import { getVersionInfo } from '@/lib/version'

export function Footer() {
  const versionInfo = getVersionInfo()

  return (
    <footer className="mt-auto border-t border-border bg-card/30 backdrop-blur-sm">
      <div className="px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              <span>GDPR Compliant</span>
            </div>
            <Separator orientation="vertical" className="h-3" />
            <div className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              <span>European Privacy Values</span>
            </div>
          </div>

          {/* Center Section */}
          <div className="hidden sm:flex items-center gap-1">
            <span>Built with</span>
            <Heart className="h-3 w-3 text-red-500 fill-current" />
            <span>for privacy professionals</span>
          </div>

          {/* Right Section */}
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