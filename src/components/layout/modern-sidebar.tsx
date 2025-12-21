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

// Modern sidebar navigation link
interface SidebarLinkProps {
  item: NavItem
  isActive: boolean
  collapsed: boolean
}

function SidebarLink({ item, isActive, collapsed }: SidebarLinkProps) {
  const Icon = item.icon
  const isDisabled = item.disabled

  const linkContent = (
    <div className={cn(
      "flex items-center w-full h-[--nav-item-height] px-3 text-sm font-medium rounded-lg transition-all duration-200",
      "hover:bg-[--nav-hover-bg] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900",
      isActive && [
        "bg-[--nav-active-bg] text-[--text-active]",
        "shadow-sm border-l-2 border-[--nav-active]"
      ],
      !isActive && !isDisabled && "text-[--text-muted] hover:text-[--text-default]",
      isDisabled && "text-gray-600 cursor-not-allowed opacity-60"
    )}
    >
      <Icon className={cn(
        "w-[--nav-icon-size] h-[--nav-icon-size] flex-shrink-0 transition-colors",
        isActive && "text-[--nav-active]",
        !isActive && !isDisabled && "text-gray-400",
        isDisabled && "text-gray-600",
        !collapsed && "mr-3"
      )} />
      
      {!collapsed && (
        <span className="truncate">{item.name}</span>
      )}
      
      {collapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
          {item.name}
        </div>
      )}
    </div>
  )

  if (isDisabled) {
    return (
      <div className="group relative" title={`${item.name} - Coming soon`}>
        {linkContent}
      </div>
    )
  }

  return (
    <Link 
      href={item.href}
      className="group relative block"
      aria-current={isActive ? "page" : undefined}
    >
      {linkContent}
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
      {/* Module Header */}
      <div className="p-4 border-b border-[--nav-border]">
        {!collapsed && moduleConfig && (
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-[--nav-active-bg]">
              <moduleConfig.icon className="w-5 h-5 text-[--nav-active]" />
            </div>
            <div>
              <h2 className="font-semibold text-[--text-active] text-sm">
                {moduleConfig.name}
              </h2>
              <p className="text-xs text-[--text-muted] mt-0.5">
                {moduleConfig.description}
              </p>
            </div>
          </div>
        )}
        
        {collapsed && moduleConfig && (
          <div className="flex justify-center">
            <div className="p-1.5 rounded-lg bg-[--nav-active-bg]">
              <moduleConfig.icon className="w-5 h-5 text-[--nav-active]" />
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

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-[--nav-border]">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-full h-8 text-[--text-muted] hover:text-[--text-default] hover:bg-[--nav-hover-bg]",
            "border-none bg-transparent text-xs font-medium"
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