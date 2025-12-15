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
      variant="ghost"
      size="sm"
      className={cn(
        "w-full justify-start relative transition-all duration-200 h-10",
        collapsed ? "px-2" : "px-3",
        active && "bg-muted/50 border-l-2 border-l-indigo-500",
        item.disabled && "opacity-50 cursor-not-allowed"
      )}
      disabled={item.disabled}
      onClick={onClick}
    >
      <Icon 
        className={cn(
          "h-4 w-4 flex-shrink-0 text-muted-foreground",
          !collapsed && "mr-3",
          active && "text-foreground"
        )} 
      />
      
      {!collapsed && (
        <>
          <span className={cn(
            "flex-1 text-left font-medium text-sm transition-colors",
            active ? "text-foreground" : "text-muted-foreground"
          )}>
            {item.name}
          </span>
          {item.badge && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {item.badge}
            </Badge>
          )}
        </>
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