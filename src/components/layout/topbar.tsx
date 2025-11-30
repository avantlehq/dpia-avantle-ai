'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLayoutActions } from '@/lib/state/layout'
import { getVersionInfo } from '@/lib/version'
import { 
  ChevronDown, 
  Globe, 
  User, 
  Settings, 
  HelpCircle, 
  Sun, 
  Moon,
  LogOut,
  ShieldCheck
} from 'lucide-react'
import { useTheme } from 'next-themes'

export function Topbar() {
  const { toggleRightPanel } = useLayoutActions()
  const { theme, setTheme } = useTheme()
  const versionInfo = getVersionInfo()

  return (
    <header className="flex items-center justify-between px-4 lg:px-6 h-18 border-b border-border bg-background/95 backdrop-blur-sm">
      {/* Left Section - Modern App Branding */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-lg text-foreground">DPIA.ai</span>
              <span className="text-sm text-muted-foreground font-medium">Privacy Platform v{versionInfo.version}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Modern Menu */}
      <div className="flex items-center gap-3">
        {/* Language Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 px-3 bg-white/10 dark:bg-white/5 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200">
              <Globe className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline font-medium text-blue-700 dark:text-blue-300">EN</span>
              <ChevronDown className="h-3 w-3 ml-1 text-blue-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <span className="flex items-center justify-between w-full">
                English
                <Badge variant="default" className="text-xs bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">EN</Badge>
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <span className="flex items-center justify-between w-full">
                Slovenčina
                <Badge variant="outline" className="text-xs">SK</Badge>
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <span className="flex items-center justify-between w-full">
                Deutsch
                <Badge variant="outline" className="text-xs">DE</Badge>
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <Button 
          variant="outline" 
          size="sm" 
          className="h-9 w-9 p-0 bg-white/10 dark:bg-white/5 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-200"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'light' ? (
            <Moon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          ) : (
            <Sun className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Help Button */}
        <Button 
          variant="outline" 
          size="sm"
          onClick={toggleRightPanel}
          className="hidden sm:flex h-9 w-9 p-0 bg-white/10 dark:bg-white/5 border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-900/30 hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-200"
        >
          <HelpCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 px-3 bg-white/10 dark:bg-white/5 border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/30 hover:border-green-300 dark:hover:border-green-700 transition-all duration-200">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm">
                <User className="h-3 w-3 text-white" />
              </div>
              <span className="hidden sm:inline font-medium ml-2 text-green-700 dark:text-green-300">Demo User</span>
              <ChevronDown className="h-3 w-3 ml-1 text-green-500" />
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
              <User className="h-4 w-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="sm:hidden" onClick={toggleRightPanel}>
              <HelpCircle className="h-4 w-4 mr-2" />
              Help & Support
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