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
        "modern-nav-link relative px-4 py-3 text-sm font-medium transition-opacity duration-200",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900",
        // Text-only, minimal state changes
        !isActive && "text-gray-300 hover:opacity-80",
        isActive && "text-white"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {/* Text-only modules for enterprise clarity */}
      {module.name}
      
      {/* Only active underline, no other visual noise */}
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
      )}
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
      {/* Left: Brand only - clean, no noise */}
      <div className="flex items-center">
        <Link 
          href={getHomeLink()} 
          className="text-lg font-semibold text-gray-300 hover:opacity-80 transition-opacity focus:outline-none"
        >
          Avantle Privacy
        </Link>
      </div>

      {/* Center: Text-only modules for enterprise clarity */}
      <nav className="flex items-center justify-center flex-1" role="navigation" aria-label="Module navigation">
        <div className="flex items-center">
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
              className="h-9 w-9 p-0 text-gray-400 hover:text-white border-none bg-transparent"
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

        {/* Help */}
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0 text-gray-400 hover:text-white border-none bg-transparent"
          title="Help & Support"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-9 w-9 p-0 text-gray-400 hover:text-white border-none bg-transparent"
              title="User Menu"
            >
              <User className="h-4 w-4" />
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