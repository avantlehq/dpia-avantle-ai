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
import { getVersionInfo } from '@/lib/version'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ChevronDown, 
  Globe, 
  User, 
  Settings, 
  HelpCircle, 
  LogOut,
  ShieldCheck,
  Search,
  Bell,
  Users,
  AlertTriangle,
  FileText
} from 'lucide-react'
import { ModuleTopbar } from '@/components/navigation/module-topbar'

export function Topbar() {
  const versionInfo = getVersionInfo()
  const router = useRouter()

  return (
    <header className="flex items-center justify-between px-4 lg:px-6 h-18 border-b border-border bg-background/95 backdrop-blur-sm">
      {/* Left Section - Logo */}
      <div className="flex items-center gap-6">
        {/* Clickable Home Link */}
        <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-200 cursor-pointer">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-lg text-foreground hover:text-blue-600 transition-colors duration-200">Avantle Privacy</span>
        </Link>
        
        {/* Version Info */}
        <span className="text-xs text-muted-foreground font-medium">v{versionInfo.version}</span>
      </div>

      {/* Center Section - Module Navigation */}
      <div className="flex-1 flex justify-center">
        {/* DEBUG: Test if this section renders */}
        <div className="bg-yellow-500 text-black px-4 py-2 text-sm font-bold">
          TOPBAR CENTER TEST
        </div>
        <ModuleTopbar />
      </div>

      {/* Right Section - Global Actions & User Menu */}
      <div className="flex items-center gap-2">
        {/* Global Search */}
        <Button 
          variant="outline" 
          size="sm"
          className="h-9 w-9 p-0 bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/30 border-blue-200/50 dark:border-blue-800/50 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200"
          title="Global Search"
        >
          <Search className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </Button>

        {/* Notifications */}
        <Button 
          variant="outline" 
          size="sm"
          className="h-9 w-9 p-0 bg-transparent hover:bg-green-50 dark:hover:bg-green-900/30 border-green-200/50 dark:border-green-800/50 hover:border-green-300 dark:hover:border-green-700 transition-all duration-200"
          title="Notifications"
        >
          <Bell className="h-4 w-4 text-green-600 dark:text-green-400" />
        </Button>

        {/* Help Button */}
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => router.push('/help')}
          className="h-9 w-9 p-0 bg-transparent hover:bg-orange-50 dark:hover:bg-orange-900/30 border-orange-200/50 dark:border-orange-800/50 hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-200"
          title="Help & Support"
        >
          <HelpCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
        </Button>

        {/* Language Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 px-2 bg-transparent hover:bg-purple-50 dark:hover:bg-purple-900/30 border-purple-200/50 dark:border-purple-800/50 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-200">
              <Globe className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="hidden sm:inline font-medium text-purple-700 dark:text-purple-300 ml-1">EN</span>
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

        {/* User Menu with Settings Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 px-3 bg-transparent hover:bg-green-50 dark:hover:bg-green-900/30 border-green-200/50 dark:border-green-800/50 hover:border-green-300 dark:hover:border-green-700 transition-all duration-200">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm">
                <User className="h-3 w-3 text-white" />
              </div>
              <span className="hidden sm:inline font-medium ml-2 text-green-700 dark:text-green-300">Demo User</span>
              <ChevronDown className="h-3 w-3 ml-1 text-green-500" />
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
            
            {/* Account Section */}
            <DropdownMenuItem disabled>
              <User className="h-4 w-4 mr-2" />
              Profile & Account
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <Settings className="h-4 w-4 mr-2" />
              Organization Management  
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <Settings className="h-4 w-4 mr-2" />
              Billing & Subscriptions
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            {/* Settings Submenu */}
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
            <DropdownMenuItem disabled>
              <FileText className="h-4 w-4 mr-2" />
              Reporting Templates
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