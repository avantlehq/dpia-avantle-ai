'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getVersionInfo } from '@/lib/version'
import { 
  Globe, 
  User, 
  Settings, 
  HelpCircle, 
  LogOut,
  ShieldCheck,
  Users,
  AlertTriangle,
  FileText
} from 'lucide-react'
import { privacyModulesConfig, getActiveModule } from '@/lib/state/modules'
import { cn } from '@/lib/utils'

// Fixed module navigation link - no floating icons, proper text+icon rows
interface ModuleLinkProps {
  module: {
    id: string
    name: string
    href: string
    icon: React.ComponentType<{ className?: string }>
  }
  isActive: boolean
}

function ModuleLink({ module, isActive }: ModuleLinkProps) {
  return (
    <Link 
      href={module.href}
      className={cn(
        "modern-nav-link px-1 py-3 text-sm font-medium transition-all duration-200",
        "focus:outline-none",
        // Clear contrast between active and inactive
        !isActive && "text-gray-400 hover:opacity-80",
        isActive && "text-white"
      )}
      style={{
        borderBottom: isActive ? '2px solid #3b82f6' : '2px solid transparent'
      }}
      aria-current={isActive ? "page" : undefined}
    >
      {/* Text-only modules for enterprise clarity */}
      {module.name}
    </Link>
  )
}

export function ModernTopbar() {
  const pathname = usePathname()
  const activeModuleId = getActiveModule(pathname)
  const versionInfo = getVersionInfo()
  
  // Context-aware home link based on active module
  const getHomeLink = () => {
    if (activeModuleId === 'privacy') return '/privacy' // Privacy Overview
    if (activeModuleId === 'context') return '/context' // Context Overview  
    if (activeModuleId === 'risk') return '/risk' // Risk Overview
    if (activeModuleId === 'controls') return '/controls' // Controls Overview
    if (activeModuleId === 'training') return '/training' // Training Overview
    if (activeModuleId === 'trust-center') return '/trust-center' // Trust Center Overview
    return '/dashboard' // Default fallback
  }

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-[--background] border-b border-[--nav-border]">
      {/* Left: Brand Block */}
      <div className="flex items-center">
        {/* Clickable Brand Lockup */}
        <Link 
          href={getHomeLink()} 
          className="flex items-center gap-3 pl-2 pr-8 py-2 hover:brightness-110 transition-all duration-200 cursor-pointer group"
        >
          {/* Product Mark */}
          <ShieldCheck 
            className="h-4 w-4 transition-colors duration-200" 
            style={{ color: '#60a5fa' }} 
          />
          
          {/* Product Name */}
          <span 
            className="font-bold transition-colors duration-200" 
            style={{ color: '#ffffff' }}
          >
            Avantle Privacy
          </span>
          
          {/* Version */}
          <span 
            className="text-xs font-normal" 
            style={{ marginLeft: '12px', color: '#9ca3af' }}
          >
            v{versionInfo.version}
          </span>
        </Link>
        
        {/* Subtle Separator */}
        <div className="h-5 w-px bg-gray-700 ml-2"></div>
      </div>

      {/* Center: Properly spaced modules with visual separation */}
      <nav className="flex items-center justify-center flex-1" role="navigation" aria-label="Module navigation">
        <div className="flex items-center" style={{ gap: '32px' }}>
          {privacyModulesConfig.map((module) => {
            const isActive = activeModuleId === module.id
            return (
              <ModuleLink
                key={module.id}
                module={module}
                isActive={isActive}
              />
            )
          })}
        </div>
      </nav>

      {/* Right: Clean utilities - max 3 items */}
      <div className="flex items-center gap-2">
        {/* Language */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-9 w-9 p-0 border-none bg-transparent"
              style={{ color: '#9ca3af' }}
              title="Language"
            >
              <Globe className="h-4 w-4" style={{ color: '#9ca3af' }} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem>English</DropdownMenuItem>
            <DropdownMenuItem disabled>Slovenčina</DropdownMenuItem>
            <DropdownMenuItem disabled>Deutsch</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Help */}
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0 border-none bg-transparent"
          style={{ color: '#9ca3af' }}
          title="Help & Support"
        >
          <HelpCircle className="h-4 w-4" style={{ color: '#9ca3af' }} />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-9 w-9 p-0 border-none bg-transparent"
              style={{ color: '#9ca3af' }}
              title="User Menu"
            >
              <User className="h-4 w-4" style={{ color: '#9ca3af' }} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="space-y-1">
                <div className="font-medium">Demo User</div>
                <div className="text-xs text-muted-foreground">demo@avantle.ai</div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}