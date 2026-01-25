'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreVertical, Edit, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'

interface ContextTableActionsProps {
  itemId: string
  itemName: string
  module: 'systems' | 'vendors' | 'locations' | 'data-categories' | 'data-flows' | 'processing'
  onDelete: () => void
  editLabel?: string
  deleteLabel?: string
}

export function ContextTableActions({
  itemId,
  itemName,
  module,
  onDelete,
  editLabel = 'Edit',
  deleteLabel = 'Delete'
}: ContextTableActionsProps) {
  const router = useRouter()
  const locale = useLocale()

  const handleEdit = () => {
    router.push(`/${locale}/context/${module}/${itemId}`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-44 rounded-xl border-border/50 shadow-lg shadow-black/5 p-2"
        sideOffset={8}
      >
        {/* Primary Actions */}
        <DropdownMenuItem
          onClick={handleEdit}
          className="font-medium cursor-pointer"
        >
          <Edit className="h-4 w-4 mr-2" />
          {editLabel}
        </DropdownMenuItem>

        {/* Subtle Divider */}
        <div className="h-px bg-border/40 my-2 mx-1" />

        {/* Destructive Action */}
        <DropdownMenuItem
          onClick={onDelete}
          variant="destructive"
          className="font-medium cursor-pointer"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          {deleteLabel}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
