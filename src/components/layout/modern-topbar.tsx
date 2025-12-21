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
  const Icon = module.icon

  return (
    <Link 
      href={module.href}
      className={cn(
        "modern-nav-link relative flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-150 rounded-md",
        "focus:outline-none focus:ring-2 focus:ring-[--accent] focus:ring-offset-1 focus:ring-offset-gray-900",
        // Inactive state - muted neutral
        !isActive && [
          "text-[--text-muted] hover:bg-[--nav-hover] hover:text-[--text-default]"
        ],
        // Active state - bright text + underline
        isActive && [
          "text-[--text-bright] bg-[--nav-active-bg]"
        ]
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon className={cn(
        "w-[--nav-icon-size] h-[--nav-icon-size] flex-shrink-0 transition-colors",
        !isActive && "text-[--icon-muted] group-hover:text-[--icon-default]",
        isActive && "text-[--icon-bright]"
      )} />
      <span className="hidden sm:block">{module.name}</span>
      
      {/* Active bottom border indicator */}
      {isActive && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[--accent] rounded-full" />
      )}
      
      {/* Mobile tooltip for icon-only responsive state */}
      <div className="sm:hidden absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
        {module.name}
      </div>
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
      {/* Left: Brand + Version - Fixed visibility */}
      <div className="flex items-center gap-4">
        <Link 
          href={getHomeLink()} 
          className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-[--accent] focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          <div className="p-2 rounded-xl bg-[--accent] shadow-lg">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-white">Avantle Privacy</span>
            <span className="text-xs text-gray-400 font-medium">v{versionInfo.version}</span>
          </div>
        </Link>
      </div>

      {/* Center: Module Navigation - Single centered row */}
      <nav className="flex items-center gap-1" role="navigation" aria-label="Module navigation">
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
      </nav>

      {/* Right: Ghost Icon-Only Utilities */}
      <div className="flex items-center gap-1">
        {/* Language Switcher - Ghost Icon Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-9 w-9 p-0 text-gray-400 hover:text-white hover:bg-white/10 border-none bg-transparent rounded-md"
              title="Language"
            >
              <Globe className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem>English</DropdownMenuItem>
            <DropdownMenuItem disabled>Slovenčina</DropdownMenuItem>
            <DropdownMenuItem disabled>Deutsch</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Help - Ghost Icon Button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0 text-gray-400 hover:text-white hover:bg-white/10 border-none bg-transparent rounded-md"
          title="Help & Support"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>

        {/* User Menu - Ghost Icon Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-9 w-9 p-0 text-gray-400 hover:text-white hover:bg-white/10 border-none bg-transparent rounded-md"
              title="User Menu"
            >
              <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                <User className="h-3 w-3 text-white" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>
              <div className="space-y-1">
                <div className="font-medium">Demo User</div>
                <div className="text-xs text-muted-foreground">demo@avantle.ai</div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem disabled>
              <User className="h-4 w-4 mr-2" />
              Profile & Account
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <Settings className="h-4 w-4 mr-2" />
              Organization Settings
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider">
              Settings
            </DropdownMenuLabel>
            <DropdownMenuItem disabled>
              <Settings className="h-4 w-4 mr-2" />
              Platform Settings
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <Users className="h-4 w-4 mr-2" />
              Identity & Access
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Risk Model & Scoring
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <FileText className="h-4 w-4 mr-2" />
              Evidence Rules
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
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