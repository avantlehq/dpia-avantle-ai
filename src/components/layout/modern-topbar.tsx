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
  ChevronDown,
  Users,
  AlertTriangle,
  FileText
} from 'lucide-react'
import { privacyModulesConfig, getActiveModule } from '@/lib/state/modules'
import { cn } from '@/lib/utils'

// Modern module navigation link
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
        "group relative flex items-center px-4 py-2 text-sm font-medium transition-all duration-200",
        "hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900",
        isActive ? "text-white" : "text-gray-400 hover:text-gray-200"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon className={cn(
        "w-[--nav-icon-size] h-[--nav-icon-size] mr-2 transition-colors",
        isActive ? "text-[--nav-active]" : "text-gray-400 group-hover:text-gray-300"
      )} />
      <span className="hidden sm:inline">{module.name}</span>
      
      {/* Active underline indicator */}
      {isActive && (
        <div 
          className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[--nav-active]"
          style={{ backgroundColor: 'var(--nav-active)' }}
        />
      )}
      
      {/* Mobile tooltip (for icon-only responsive state) */}
      <div className="sm:hidden absolute left-1/2 -translate-x-1/2 -bottom-12 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        {module.name}
      </div>
    </Link>
  )
}

export function ModernTopbar() {
  const pathname = usePathname()
  const activeModuleId = getActiveModule(pathname)
  const versionInfo = getVersionInfo()

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-[--background] border-b border-[--nav-border]">
      {/* Left: Brand + Version */}
      <div className="flex items-center gap-6">
        <Link 
          href="/dashboard" 
          className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-white">Avantle Privacy</span>
            <span className="text-xs text-gray-400 font-medium">v{versionInfo.version}</span>
          </div>
        </Link>
      </div>

      {/* Center: Module Navigation */}
      <nav className="flex items-center space-x-1" role="navigation" aria-label="Module navigation">
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

      {/* Right: Utilities */}
      <div className="flex items-center gap-2">
        {/* Language Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-9 px-3 text-gray-400 hover:text-white hover:bg-white/5 border-none bg-transparent"
            >
              <Globe className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">EN</span>
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
          className="h-9 w-9 p-0 text-gray-400 hover:text-white hover:bg-white/5 border-none bg-transparent"
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
              className="h-9 px-3 text-gray-400 hover:text-white hover:bg-white/5 border-none bg-transparent"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <User className="h-3 w-3 text-white" />
              </div>
              <span className="hidden sm:inline ml-2">Demo User</span>
              <ChevronDown className="h-3 w-3 ml-1" />
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