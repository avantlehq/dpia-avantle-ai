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
      "group relative flex items-center w-full h-[--nav-item-height] px-3 text-sm font-medium rounded-[--nav-radius] transition-all duration-150",
      "focus-within:outline-none focus-within:ring-2 focus-within:ring-[--accent] focus-within:ring-offset-1 focus-within:ring-offset-gray-900",
      // Inactive state - muted neutral
      !isActive && !isDisabled && [
        "text-[--text-muted] hover:bg-[--nav-hover] hover:text-[--text-default]"
      ],
      // Active state - subtle background + left accent bar
      isActive && [
        "bg-[--nav-active-bg] text-[--text-bright] border-l-2 border-[--accent]"
      ],
      // Disabled state - reduced opacity
      isDisabled && "text-[--text-muted] opacity-60 cursor-not-allowed"
    )}
    >
      <Icon className={cn(
        "w-[--nav-icon-size] h-[--nav-icon-size] flex-shrink-0 transition-colors",
        !isActive && !isDisabled && "text-[--icon-muted] group-hover:text-[--icon-default]",
        isActive && "text-[--icon-bright]",
        isDisabled && "text-[--icon-muted]",
        !collapsed && "mr-3"
      )} />
      
      {!collapsed && (
        <span className="truncate select-none">{item.name}</span>
      )}
      
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
      "flex flex-col bg-[--nav-bg] border-r border-[--nav-border] transition-all duration-300",
      collapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Module Header - Consistent width, no description */}
      <div className="p-4 border-b border-[--nav-border]">
        {!collapsed && moduleConfig && (
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-[--nav-active-bg]">
              <moduleConfig.icon className="w-5 h-5 text-[--accent]" />
            </div>
            <h2 className="font-semibold text-[--text-bright] text-sm">
              {moduleConfig.name}
            </h2>
          </div>
        )}
        
        {collapsed && moduleConfig && (
          <div className="flex justify-center">
            <div className="p-1.5 rounded-lg bg-[--nav-active-bg]">
              <moduleConfig.icon className="w-5 h-5 text-[--accent]" />
            </div>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-3 space-y-1" role="navigation" aria-label="Module navigation">
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

      {/* Collapse Toggle - Ghost icon button */}
      <div className="p-3 border-t border-[--nav-border]">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-full h-8 text-[--text-muted] hover:text-[--text-default] hover:bg-[--nav-hover]",
            "border-none bg-transparent text-xs font-medium justify-center"
          )}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Collapse
            </>
          )}
        </Button>
      </div>
    </aside>
  )
}