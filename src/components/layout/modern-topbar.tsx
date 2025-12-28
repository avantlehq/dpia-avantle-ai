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
  Menu,
  X
} from 'lucide-react'
import { privacyModulesConfig, getActiveModule } from '@/lib/state/modules'
import { cn } from '@/lib/utils'
import { IconButton } from '@/components/ui/icon-button'
import { useSidebarContext } from '@/contexts/SidebarContext'

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
        backgroundColor: isActive ? 'rgba(96, 165, 250, 0.15)' : 'transparent',
        padding: '8px 12px',
        color: isActive ? '#ffffff' : '#9ca3af',
        boxShadow: isActive ? 'inset 0 -2px 0 #60a5fa' : 'none',
        borderRadius: '4px'
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
  const { toggle, isCollapsed, isMobileOpen } = useSidebarContext()
  
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
      {/* Left: Sidebar Toggle + Brand Block */}
      <div className="flex items-center">
        {/* Sidebar Toggle Button */}
        <IconButton
          variant="ghost"
          size="md"
          icon={isMobileOpen ? <X /> : <Menu />}
          onClick={toggle}
          aria-label="Toggle sidebar"
          aria-expanded={!isCollapsed && !isMobileOpen}
          aria-controls="main-sidebar"
          className="mr-3"
        />
        
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
            Privacy Platform
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

      {/* Right: Clean utilities with proper spacing */}
      <div className="flex items-center" style={{ gap: '16px' }}>
        {/* Language */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-9 w-9 p-0 border-none"
              style={{ 
                backgroundColor: 'transparent',
                color: '#9ca3af',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(96, 165, 250, 0.1)'
                const icon = e.currentTarget.querySelector('svg')
                if (icon) icon.style.color = '#60a5fa'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                const icon = e.currentTarget.querySelector('svg')
                if (icon) icon.style.color = '#9ca3af'
              }}
              title="Language"
            >
              <Globe className="h-4 w-4" style={{ color: '#9ca3af', transition: 'color 0.2s ease' }} />
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
          className="h-9 w-9 p-0 border-none"
          style={{ 
            backgroundColor: 'transparent',
            color: '#9ca3af',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(96, 165, 250, 0.1)'
            const icon = e.currentTarget.querySelector('svg')
            if (icon) icon.style.color = '#60a5fa'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            const icon = e.currentTarget.querySelector('svg')
            if (icon) icon.style.color = '#9ca3af'
          }}
          title="Help & Support"
        >
          <HelpCircle className="h-4 w-4" style={{ color: '#9ca3af', transition: 'color 0.2s ease' }} />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-9 w-9 p-0 border-none"
              style={{ 
                backgroundColor: 'transparent',
                color: '#9ca3af',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(96, 165, 250, 0.1)'
                const icon = e.currentTarget.querySelector('svg')
                if (icon) icon.style.color = '#60a5fa'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                const icon = e.currentTarget.querySelector('svg')
                if (icon) icon.style.color = '#9ca3af'
              }}
              title="User Menu"
            >
              <User className="h-4 w-4" style={{ color: '#9ca3af', transition: 'color 0.2s ease' }} />
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