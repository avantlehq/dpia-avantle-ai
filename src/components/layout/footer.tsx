'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Heart, Globe } from 'lucide-react'
import { getVersionInfo } from '@/lib/version'

export function Footer() {
  const versionInfo = getVersionInfo()

  return (
    <footer className="mt-auto border-t border-border bg-card backdrop-blur-sm">
      <div className="px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {/* Left Section */}
          <div className="flex items-center gap-1">
            <Globe className="h-3 w-3" style={{ color: 'var(--color-purple)' }} />
            <span>European Privacy Values</span>
          </div>

          {/* Center Section */}
          <div className="hidden sm:flex items-center gap-1">
            <span>Built with</span>
            <Heart className="h-3 w-3 fill-current" style={{ color: 'var(--color-red)' }} />
            <span>for privacy professionals</span>
          </div>

          {/* Right Section */}
          <div className="flex items-center">
            <Badge variant="outline" className="text-xs">
              v{versionInfo.version}
            </Badge>
          </div>
        </div>
      </div>
    </footer>
  )
}