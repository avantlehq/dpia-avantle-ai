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
import { 
  ChevronDown, 
  Globe, 
  User, 
  Settings, 
  HelpCircle, 
  Sun, 
  Moon,
  Monitor,
  LogOut
} from 'lucide-react'
import { useTheme } from 'next-themes'

export function Topbar() {
  const { toggleRightPanel } = useLayoutActions()
  const { theme: _theme, setTheme } = useTheme()

  return (
    <header className="flex items-center justify-between px-4 lg:px-6 h-18 border-b avantle-border bg-card/50 backdrop-blur-sm">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Workspace Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">A</span>
                </div>
                <span className="hidden sm:inline font-medium text-sm">Avantle Demo</span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <DropdownMenuLabel>Workspace</DropdownMenuLabel>
            <DropdownMenuItem>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">A</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">Avantle Demo</div>
                  <div className="text-xs text-muted-foreground">Demo workspace</div>
                </div>
                <Badge variant="outline" className="text-xs">Demo</Badge>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              <Settings className="h-4 w-4 mr-2" />
              Workspace Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="text-sm">
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")} className="text-sm">
              <Sun className="h-4 w-4 mr-2" />
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")} className="text-sm">
              <Moon className="h-4 w-4 mr-2" />
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")} className="text-sm">
              <Monitor className="h-4 w-4 mr-2" />
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

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