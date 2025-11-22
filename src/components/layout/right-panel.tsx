'use client'

import React, { type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useLayoutActions } from '@/lib/state/layout'
import { X, Bot, HelpCircle, BookOpen, ExternalLink, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RightPanelProps {
  children?: ReactNode
  className?: string
}

export function RightPanel({ children, className }: RightPanelProps) {
  const { toggleRightPanel } = useLayoutActions()

  return (
    <aside className={cn(
      "border-l avantle-border bg-card/20 backdrop-blur-sm flex flex-col",
      "animate-in slide-in-from-right duration-300 overflow-hidden w-full h-full",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-primary" />
          <span className="font-medium">AI Assistant</span>
          <Badge variant="secondary" className="text-xs">Beta</Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={toggleRightPanel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {children || <DefaultRightPanelContent />}
        </div>
      </ScrollArea>
    </aside>
  )
}

function DefaultRightPanelContent() {
  return (
    <>
      {/* AI Chat */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Bot className="h-4 w-4 text-primary" />
            GDPR AI Assistant
          </CardTitle>
          <CardDescription className="text-xs">
            Get help with privacy compliance questions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 rounded-lg bg-muted/50 text-sm">
            <p className="text-muted-foreground mb-2">👋 Hi! I&apos;m here to help with:</p>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• GDPR Article interpretation</li>
              <li>• Risk assessment guidance</li>
              <li>• Legal basis selection</li>
              <li>• Mitigation strategies</li>
            </ul>
          </div>
          <Button size="sm" className="w-full" disabled>
            <Bot className="h-3 w-3 mr-2" />
            Start Chat (Coming Soon)
          </Button>
        </CardContent>
      </Card>

      {/* Quick Help */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            Quick Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="p-3 rounded-lg border border-amber-200/20 bg-amber-50/10">
            <p className="font-medium text-amber-700 dark:text-amber-400 mb-1">
              💡 Pro Tip
            </p>
            <p className="text-xs text-muted-foreground">
              Start with the pre-check to determine if you need a full DPIA. It only takes 2 minutes!
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wide">
              Helpful Resources
            </h4>
            <div className="space-y-2">
              <Button variant="ghost" size="sm" className="w-full justify-start text-xs h-auto py-2">
                <BookOpen className="h-3 w-3 mr-2 text-muted-foreground" />
                GDPR Article 35 Guide
                <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start text-xs h-auto py-2">
                <BookOpen className="h-3 w-3 mr-2 text-muted-foreground" />
                DPIA Template Library
                <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start text-xs h-auto py-2">
                <BookOpen className="h-3 w-3 mr-2 text-muted-foreground" />
                Risk Assessment Guide
                <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Context Help */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Page Context</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            Context-specific help and suggestions will appear here based on your current page and progress.
          </p>
        </CardContent>
      </Card>
    </>
  )
}

// Specialized right panel for different contexts
export function AIAssistantPanel({ context }: { context?: string }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Bot className="h-4 w-4 text-primary" />
            AI Assistant
            {context && <Badge variant="outline" className="text-xs">{context}</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-3 rounded-lg bg-muted/50 text-sm mb-3">
            <p className="text-muted-foreground">
              🤖 I&apos;m analyzing this {context || `page`} to provide relevant guidance...
            </p>
          </div>
          <Button size="sm" className="w-full" disabled>
            Ask AI (Coming Soon)
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export function HelpPanel({ topic }: { topic?: string }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-blue-500" />
            Help & Guidance
            {topic && <Badge variant="outline" className="text-xs">{topic}</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-3">
          <p className="text-muted-foreground">
            Get help with {topic || 'GDPR compliance'} and step-by-step guidance.
          </p>
          <Button size="sm" variant="outline" className="w-full" disabled>
            View Help Articles
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}