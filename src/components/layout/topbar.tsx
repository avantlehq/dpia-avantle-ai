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
  Monitor,
  LogOut,
  ShieldCheck
} from 'lucide-react'
import { useTheme } from 'next-themes'

export function Topbar() {
  const { toggleRightPanel } = useLayoutActions()
  const { theme: _theme, setTheme } = useTheme()
  const versionInfo = getVersionInfo()

  return (
    <header className="flex items-center justify-between px-4 lg:px-6 h-18 border-b avantle-border bg-card">
      {/* Left Section - App Title */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span className="font-semibold text-sm">DPIA Agent</span>
          </div>
          <Badge variant="secondary" className="text-xs">{versionInfo.displayName}</Badge>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Language Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="text-sm">
              <Globe className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline text-sm">EN</span>
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <span className="flex items-center justify-between w-full text-sm">
                English
                <Badge variant="secondary" className="text-xs">EN</Badge>
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <span className="flex items-center justify-between w-full text-sm">
                Slovenčina
                <Badge variant="outline" className="text-xs">SK</Badge>
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <span className="flex items-center justify-between w-full text-sm">
                Deutsch
                <Badge variant="outline" className="text-xs">DE</Badge>
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-sm"
          onClick={() => setTheme(_theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Help Button */}
        <Button 
          variant="ghost" 
          size="sm"
          onClick={toggleRightPanel}
          className="hidden sm:flex"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-sm">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="h-3 w-3 text-primary" />
              </div>
              <span className="hidden sm:inline font-medium text-sm">Demo User</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="space-y-1">
                <div className="font-medium text-sm">Demo User</div>
                <div className="text-xs text-muted-foreground">demo@avantle.ai</div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled className="text-sm">
              <User className="h-4 w-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem disabled className="text-sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="sm:hidden text-sm" onClick={toggleRightPanel}>
              <HelpCircle className="h-4 w-4 mr-2" />
              Help & Support
            </DropdownMenuItem>
            <DropdownMenuItem disabled className="text-sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}