'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { useLayoutState, useLayoutActions } from '@/lib/state/layout'
import { 
  dpiaWizardSteps, 
  updateWizardStepStatus, 
  type WizardStep 
} from '@/lib/state/navigation'
import { 
  CheckCircle, 
  Circle, 
  
  ChevronDown,
  ChevronLeft
} from 'lucide-react'

interface SidebarStepsProps {
  steps?: WizardStep[]
  _currentStepId?: string
  assessmentId?: string
  className?: string
}

export function SidebarSteps({ 
  steps = dpiaWizardSteps, 
  _currentStepId,
  assessmentId,
  className 
}: SidebarStepsProps) {
  const { wizardStepsOpen } = useLayoutState()
  const { toggleWizardSteps } = useLayoutActions()
  
  // Update step status based on current step
  const stepsWithStatus = _currentStepId 
    ? updateWizardStepStatus(steps, _currentStepId)
    : steps

  // Calculate progress
  const completedSteps = stepsWithStatus.filter(step => step.completed).length
  const progressPercent = (completedSteps / steps.length) * 100

  return (
    <>
      {/* Desktop Steps Sidebar */}
      <aside className={cn(
        "hidden lg:flex flex-col bg-card/30 backdrop-blur-sm border-r avantle-border",
        "transition-all duration-300",
        wizardStepsOpen ? "w-64" : "w-12",
        className
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {wizardStepsOpen && (
            <div>
              <h3 className="font-medium text-sm">Assessment Steps</h3>
              <p className="text-xs text-muted-foreground">
                {completedSteps} of {steps.length} completed
              </p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleWizardSteps}
          >
            <ChevronLeft className={cn(
              "h-4 w-4 transition-transform",
              !wizardStepsOpen && "rotate-180"
            )} />
          </Button>
        </div>

        {/* Progress Bar */}
        {wizardStepsOpen && (
          <div className="px-4 py-3 border-b border-border">
            <div className="space-y-2">
              <Progress value={progressPercent} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{progressPercent.toFixed(0)}% complete</span>
                <span>{completedSteps}/{steps.length}</span>
              </div>
            </div>
          </div>
        )}

        {/* Steps List */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {stepsWithStatus.map((step, index) => (
              <StepItem
                key={step.id}
                step={step}
                index={index}
                assessmentId={assessmentId}
                collapsed={!wizardStepsOpen}
              />
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* Mobile Steps Dropdown */}
      <div className="lg:hidden mb-6">
        <MobileStepsDropdown 
          steps={stepsWithStatus}
          _currentStepId={_currentStepId}
          assessmentId={assessmentId}
        />
      </div>
    </>
  )
}

interface StepItemProps {
  step: WizardStep
  index: number
  assessmentId?: string
  collapsed?: boolean
}

function StepItem({ step, index, assessmentId, collapsed = false }: StepItemProps) {
  const isDisabled = !step.completed && !step.current
  const href = assessmentId ? `/${assessmentId}${step.href}` : step.href

  const stepContent = (
    <Button
      variant={step.current ? "secondary" : "ghost"}
      size="sm"
      className={cn(
        "w-full justify-start relative",
        collapsed ? "px-2" : "px-3 py-6",
        step.current && "avantle-glow bg-primary/10",
        isDisabled && "opacity-50"
      )}
      disabled={isDisabled}
    >
      {/* Step Icon */}
      <div className={cn(
        "flex-shrink-0 flex items-center justify-center",
        collapsed ? "w-6 h-6" : "w-8 h-8 mr-3"
      )}>
        {step.completed ? (
          <CheckCircle className={cn(
            "text-green-500",
            collapsed ? "h-4 w-4" : "h-5 w-5"
          )} />
        ) : (
          <div className={cn(
            "rounded-full border-2 flex items-center justify-center",
            step.current ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/50",
            collapsed ? "w-6 h-6" : "w-8 h-8"
          )}>
            <span className={cn(
              "font-medium",
              collapsed ? "text-xs" : "text-sm"
            )}>
              {index + 1}
            </span>
          </div>
        )}
      </div>

      {/* Step Content */}
      {!collapsed && (
        <div className="flex-1 text-left space-y-1">
          <div className="font-medium text-sm">{step.name}</div>
          {step.description && (
            <div className="text-xs text-muted-foreground line-clamp-2">
              {step.description}
            </div>
          )}
        </div>
      )}

      {/* Active Indicator */}
      {step.current && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
      )}
    </Button>
  )

  if (isDisabled) {
    return stepContent
  }

  return (
    <Link href={href}>
      {stepContent}
    </Link>
  )
}

interface MobileStepsDropdownProps {
  steps: WizardStep[]
  _currentStepId?: string
  assessmentId?: string
}

function MobileStepsDropdown({ steps, _currentStepId, assessmentId }: MobileStepsDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const currentStep = steps.find(step => step.current) || steps[0]
  const completedSteps = steps.filter(step => step.completed).length

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">Assessment Progress</span>
          <span className="text-muted-foreground">
            {completedSteps} of {steps.length}
          </span>
        </div>
        <Progress value={(completedSteps / steps.length) * 100} />
      </div>

      {/* Current Step Dropdown */}
      <Button
        variant="outline"
        className="w-full justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          {currentStep.completed ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <Circle className="h-4 w-4" />
          )}
          <span>{currentStep.name}</span>
        </div>
        <ChevronDown className={cn(
          "h-4 w-4 transition-transform",
          isOpen && "rotate-180"
        )} />
      </Button>

      {/* Steps List */}
      {isOpen && (
        <div className="space-y-1 border rounded-lg p-2 bg-card">
          {steps.map((step, index) => {
            const isDisabled = !step.completed && !step.current
            const href = assessmentId ? `/${assessmentId}${step.href}` : step.href

            const stepContent = (
              <Button
                variant={step.current ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start py-6"
                disabled={isDisabled}
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center gap-3 w-full">
                  {step.completed ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                      step.current ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/50"
                    )}>
                      <span className="text-xs font-medium">{index + 1}</span>
                    </div>
                  )}
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm">{step.name}</div>
                    {step.description && (
                      <div className="text-xs text-muted-foreground">
                        {step.description}
                      </div>
                    )}
                  </div>
                </div>
              </Button>
            )

            if (isDisabled) {
              return <div key={step.id}>{stepContent}</div>
            }

            return (
              <Link key={step.id} href={href}>
                {stepContent}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}