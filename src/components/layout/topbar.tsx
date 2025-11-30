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
            <div className="flex flex-col">
              <span className="font-bold text-lg text-foreground">DPIA.ai</span>
              <span className="text-xs text-muted-foreground font-medium">Privacy Platform</span>
            </div>
          </div>
          <Badge className="hidden sm:inline-flex text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
            v{versionInfo.version}
          </Badge>
        </div>
      </div>

      {/* Right Section - Modern Menu */}
      <div className="flex items-center gap-3">
        {/* Language Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 px-3 bg-background/50 border-border hover:bg-accent hover:text-accent-foreground">
              <Globe className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline font-medium">EN</span>
              <ChevronDown className="h-3 w-3 ml-1" />
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
          className="h-9 w-9 p-0 bg-background/50 border-border hover:bg-accent"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'light' ? (
            <Moon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          ) : (
            <Sun className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Help Button */}
        <Button 
          variant="outline" 
          size="sm"
          onClick={toggleRightPanel}
          className="hidden sm:flex h-9 w-9 p-0 bg-background/50 border-border hover:bg-accent"
        >
          <HelpCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 px-3 bg-background/50 border-border hover:bg-accent hover:text-accent-foreground">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm">
                <User className="h-3 w-3 text-white" />
              </div>
              <span className="hidden sm:inline font-medium ml-2">Demo User</span>
              <ChevronDown className="h-3 w-3 ml-1" />
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