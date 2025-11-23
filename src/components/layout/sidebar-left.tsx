'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useLayoutState, useLayoutActions } from '@/lib/state/layout'
import { navigationConfig, getActiveNavItem } from '@/lib/state/navigation'
import { NavGroup } from '@/components/navigation/nav-group'
import { ChevronLeft, Menu } from 'lucide-react'

export function SidebarLeft() {
  const pathname = usePathname()
  const { leftSidebarOpen, mobileSidebarOpen } = useLayoutState()
  const { toggleLeftSidebar, setMobileSidebarOpen } = useLayoutActions()
  const _activeItem = getActiveNavItem(pathname)

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn(
        "flex flex-col transition-all duration-300 ease-in-out",
        "bg-card/30 backdrop-blur-sm border-r avantle-border",
        "h-full overflow-hidden"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {leftSidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="font-semibold text-foreground">DPIA Agent</div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLeftSidebar}
            className="hover:bg-accent"
          >
            <ChevronLeft className={cn(
              "h-4 w-4 transition-transform duration-200",
              !leftSidebarOpen && "rotate-180"
            )} />
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <div className="space-y-6">
            {navigationConfig.map((group, _index) => (
              <NavGroup
                key={group.name}
                group={group}
                collapsed={!leftSidebarOpen}
                activePath={pathname}
              />
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        {leftSidebarOpen && (
          <div className="mt-auto border-t border-border bg-card/30 backdrop-blur-sm">
            <div className="p-4">
              <div className="text-xs text-muted-foreground">
                Version 3.2.1
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm lg:hidden z-40"
            onClick={() => setMobileSidebarOpen(false)}
          />

          {/* Mobile Sidebar */}
          <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r avantle-border lg:hidden z-50 animate-in slide-in-from-left duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="font-semibold text-foreground">DPIA Agent</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileSidebarOpen(false)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile Navigation */}
            <ScrollArea className="flex-1 px-3 py-4">
              <div className="space-y-6">
                {navigationConfig.map((group) => (
                  <NavGroup
                    key={group.name}
                    group={group}
                    collapsed={false}
                    activePath={pathname}
                    onItemClick={() => setMobileSidebarOpen(false)}
                  />
                ))}
              </div>
            </ScrollArea>
          </aside>
        </>
      )}
    </>
  )
}

// Mobile menu button component
export function MobileMenuButton() {
  const { setMobileSidebarOpen } = useLayoutActions()

  return (
    <Button
      variant="ghost"
      size="sm"
      className="lg:hidden"
      onClick={() => setMobileSidebarOpen(true)}
    >
      <Menu className="h-4 w-4" />
    </Button>
  )
}