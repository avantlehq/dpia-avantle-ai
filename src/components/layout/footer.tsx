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
              <div className="p-0.5 rounded bg-gradient-to-r from-green-500/20 to-emerald-600/20">
                <Shield className="h-3 w-3" style={{ color: '#7ED321' }} />
              </div>
              <span>GDPR Compliant</span>
            </div>
            <Separator orientation="vertical" className="h-3" style={{ backgroundColor: '#4A90E2' }} />
            <div className="flex items-center gap-1">
              <div className="p-0.5 rounded bg-gradient-to-r from-purple-500/20 to-indigo-600/20">
                <Globe className="h-3 w-3" style={{ color: '#9B59B6' }} />
              </div>
              <span>European Privacy Values</span>
            </div>
          </div>

          {/* Center Section */}
          <div className="hidden sm:flex items-center gap-1">
            <span>Built with</span>
            <div className="p-0.5 rounded bg-gradient-to-r from-red-500/20 to-pink-600/20">
              <Heart className="h-3 w-3 fill-current" style={{ color: '#FF6B6B' }} />
            </div>
            <span>for privacy professionals</span>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-600 border-blue-500/30">
              {versionInfo.displayName}
            </Badge>
            <span>© 2024 Avantle.ai</span>
          </div>
        </div>
      </div>
    </footer>
  )
}