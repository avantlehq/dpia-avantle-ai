'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { type NavItem as NavItemType } from '@/lib/state/navigation'

interface NavItemProps {
  item: NavItemType
  collapsed?: boolean
  active?: boolean
  onClick?: () => void
}

export function NavItem({ item, collapsed = false, active = false, onClick }: NavItemProps) {
  const Icon = item.icon

  const buttonContent = (
    <Button
      variant={active ? "secondary" : "ghost"}
      size="sm"
      className={cn(
        "w-full justify-start relative transition-all duration-200",
        collapsed ? "px-2" : "px-3",
        active && "avantle-glow bg-primary/10 text-primary",
        item.disabled && "opacity-50 cursor-not-allowed"
      )}
      disabled={item.disabled}
      onClick={onClick}
    >
      <Icon className={cn(
        "h-4 w-4 flex-shrink-0",
        !collapsed && "mr-3"
      )} />
      
      {!collapsed && (
        <>
          <span className="flex-1 text-left">{item.name}</span>
          {item.badge && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {item.badge}
            </Badge>
          )}
        </>
      )}
      
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
      )}
    </Button>
  )

  if (item.disabled) {
    if (collapsed && item.description) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {buttonContent}
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs">
              <div className="space-y-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-muted-foreground">{item.description}</div>
                <div className="text-xs text-yellow-500">Coming Soon</div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }
    
    return buttonContent
  }

  const linkContent = (
    <Link href={item.href} className="block">
      {buttonContent}
    </Link>
  )

  if (collapsed && item.description) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {linkContent}
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-xs">
            <div className="space-y-1">
              <div className="font-medium">{item.name}</div>
              <div className="text-sm text-muted-foreground">{item.description}</div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return linkContent
}