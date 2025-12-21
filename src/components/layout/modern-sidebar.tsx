'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getActiveModule, getModuleConfig, type NavItem } from '@/lib/state/modules'

interface ModernSidebarProps {
  className?: string
}

// Fixed sidebar nav row - no link styling, proper nav appearance
interface SidebarLinkProps {
  item: NavItem
  isActive: boolean
  collapsed: boolean
}

function SidebarLink({ item, isActive, collapsed }: SidebarLinkProps) {
  const Icon = item.icon
  const isDisabled = item.disabled

  const navRowContent = (
    <div className={cn(
      "group relative flex items-center w-full px-3 py-2.5 text-sm rounded-lg transition-all duration-200",
      "focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-900",
      // Inactive state - muted text with subtle hover
      !isActive && !isDisabled && [
        "text-gray-400 hover:bg-white/5 hover:text-white"
      ],
      // Active state - simplified: left accent + text emphasis, minimal background
      isActive && [
        "text-white bg-white/5 border-l-2 border-blue-500"
      ],
      // Disabled state - reduced opacity
      isDisabled && "text-gray-500 opacity-50 cursor-not-allowed"
    )}
    >
      {/* Text-first: label is primary element */}
      {!collapsed && (
        <span className="font-medium truncate select-none">{item.name}</span>
      )}
      
      {/* Icon is secondary - smaller and muted */}
      <Icon className={cn(
        "w-4 h-4 flex-shrink-0 transition-colors",
        !collapsed && "ml-auto", // Push icon to right when text is shown
        collapsed && "mx-auto", // Center icon when collapsed
        !isActive && !isDisabled && "text-gray-500 group-hover:text-gray-300",
        isActive && "text-blue-400",
        isDisabled && "text-gray-600"
      )} />
      
      {/* Collapsed tooltip */}
      {collapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
          {item.name}
          {isDisabled && " - Coming soon"}
        </div>
      )}
    </div>
  )

  if (isDisabled) {
    return (
      <div className="group relative" title={`${item.name} - Coming soon`}>
        {navRowContent}
      </div>
    )
  }

  return (
    <Link 
      href={item.href}
      className="group relative block modern-nav-link"
      aria-current={isActive ? "page" : undefined}
    >
      {navRowContent}
    </Link>
  )
}

export function ModernSidebar({ className }: ModernSidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const activeModuleId = getActiveModule(pathname)
  const moduleConfig = getModuleConfig(activeModuleId || 'privacy')

  // Find active item within current module
  const activeItemId = moduleConfig?.items.find(item => 
    pathname === item.href || pathname.startsWith(item.href + '/')
  )?.id

  return (
    <aside className={cn(
      "flex flex-col bg-gray-900 border-r border-gray-700 transition-all duration-300",
      collapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Module Header - Clear visual separation */}
      <div className="px-4 py-4 border-b border-gray-700/50 bg-gray-800/30">
        <div className="flex items-center justify-between">
          {!collapsed && moduleConfig && (
            <div className="flex items-center gap-3">
              {/* Section header styling - distinct from nav items */}
              <h2 className="font-semibold text-white text-base tracking-wide">
                {moduleConfig.name}
              </h2>
              {/* Module icon is secondary to section title */}
              <moduleConfig.icon className="w-4 h-4 text-blue-400 flex-shrink-0" />
            </div>
          )}
          
          {collapsed && moduleConfig && (
            <div className="flex justify-center w-full">
              <moduleConfig.icon className="w-5 h-5 text-blue-400" />
            </div>
          )}

          {/* Collapse Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10",
              "border-none bg-transparent flex-shrink-0",
              collapsed && "w-full justify-center"
            )}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation Items - Increased vertical spacing */}
      <nav className="flex-1 px-4 py-6 space-y-2" role="navigation" aria-label="Module navigation">
        {moduleConfig?.items.map((item) => {
          const isActive = activeItemId === item.id
          return (
            <SidebarLink
              key={item.id}
              item={item}
              isActive={isActive}
              collapsed={collapsed}
            />
          )
        })}
      </nav>

    </aside>
  )
}