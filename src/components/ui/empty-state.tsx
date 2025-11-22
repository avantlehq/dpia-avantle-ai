'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Plus } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  icon?: React.ReactNode
}

export function EmptyState({
  title = "Nothing here yet",
  description = "Get started by creating your first item",
  actionLabel = "Create New",
  onAction,
  icon = <FileText className="h-12 w-12 text-muted-foreground" />
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <Card className="w-full max-w-md avantle-border bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-muted/50">
              {icon}
            </div>
          </div>
          <CardTitle className="text-card-foreground">{title}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {description}
          </CardDescription>
        </CardHeader>
        {onAction && (
          <CardContent>
            <Button 
              onClick={onAction}
              className="w-full avantle-glow"
            >
              <Plus className="mr-2 h-4 w-4" />
              {actionLabel}
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  )
}