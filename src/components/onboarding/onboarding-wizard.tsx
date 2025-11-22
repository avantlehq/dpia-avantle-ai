'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  FileText, 
  Scale, 
  Users,
  Building,
  Zap,
  Target,
  type LucideIcon
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: LucideIcon
  options: {
    value: string
    label: string
    description: string
    recommended?: boolean
  }[]
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'role',
    title: 'What\'s your role?',
    description: 'This helps us provide relevant guidance for your responsibilities.',
    icon: Users,
    options: [
      {
        value: 'dpo',
        label: 'Data Protection Officer (DPO)',
        description: 'Responsible for GDPR compliance and privacy governance'
      },
      {
        value: 'privacy_officer',
        label: 'Privacy Officer / Legal Counsel',
        description: 'Legal professional handling data protection matters'
      },
      {
        value: 'consultant',
        label: 'Privacy Consultant',
        description: 'External advisor helping organizations with GDPR compliance'
      },
      {
        value: 'manager',
        label: 'Project / Product Manager',
        description: 'Managing projects that process personal data'
      },
      {
        value: 'other',
        label: 'Other',
        description: 'Different role but need to create DPIAs'
      }
    ]
  },
  {
    id: 'organization',
    title: 'Organization size?',
    description: 'Different sized organizations have different GDPR requirements.',
    icon: Building,
    options: [
      {
        value: 'startup',
        label: 'Startup (< 50 employees)',
        description: 'Small team, need efficient GDPR compliance'
      },
      {
        value: 'sme',
        label: 'Small/Medium Enterprise (50-250)',
        description: 'Growing business with structured privacy needs'
      },
      {
        value: 'large',
        label: 'Large Enterprise (250+)',
        description: 'Complex organization with multiple data processing activities',
        recommended: true
      },
      {
        value: 'public',
        label: 'Public Sector / NGO',
        description: 'Government agency or non-profit organization'
      }
    ]
  },
  {
    id: 'urgency',
    title: 'What\'s your timeline?',
    description: 'Understanding urgency helps us recommend the best approach.',
    icon: Target,
    options: [
      {
        value: 'urgent',
        label: 'Urgent (This week)',
        description: 'Need results quickly for compliance deadline',
        recommended: true
      },
      {
        value: 'soon',
        label: 'Soon (This month)',
        description: 'Planning ahead for upcoming project or audit'
      },
      {
        value: 'planning',
        label: 'Future Planning',
        description: 'Exploring options and building processes'
      },
      {
        value: 'learning',
        label: 'Learning & Exploration',
        description: 'Understanding DPIA requirements and best practices'
      }
    ]
  }
]

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isCompleted, setIsCompleted] = useState(false)
  const router = useRouter()

  const progress = ((currentStep + 1) / onboardingSteps.length) * 100

  const handleAnswer = (stepId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [stepId]: value }))
  }

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleComplete = () => {
    setIsCompleted(true)
    
    // Store onboarding completion in localStorage
    localStorage.setItem('dpia-agent-onboarding', JSON.stringify({
      completed: true,
      answers,
      completedAt: new Date().toISOString()
    }))
  }

  const getRecommendation = () => {
    const { role, organization, urgency } = answers

    if (urgency === 'urgent' || role === 'dpo') {
      return {
        path: '/precheck',
        title: 'Start with Pre-check',
        description: 'Quick assessment to determine if you need a full DPIA',
        reason: 'Best for urgent timelines and experienced users'
      }
    }

    if (role === 'consultant' || organization === 'large') {
      return {
        path: '/new',
        title: 'Create Full DPIA',
        description: 'Comprehensive assessment for complex processing activities',
        reason: 'Recommended for consultants and large organizations'
      }
    }

    return {
      path: '/precheck',
      title: 'Start with Pre-check',
      description: 'Learn as you go with our guided pre-assessment',
      reason: 'Perfect for getting started and understanding requirements'
    }
  }

  if (isCompleted) {
    const recommendation = getRecommendation()
    
    return (
      <div className="text-center py-8">
        <div className="flex items-center justify-center mb-6">
          <div className="p-4 rounded-full bg-green-500/20 border border-green-500/30">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <h3 className="text-xl font-medium text-foreground mb-2">
          Perfect! Here's what we recommend:
        </h3>
        
        <Card className="avantle-border bg-primary/5 max-w-md mx-auto mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/10">
                {recommendation.path === '/precheck' ? 
                  <Scale className="h-5 w-5 text-primary" /> : 
                  <FileText className="h-5 w-5 text-primary" />
                }
              </div>
              <div className="text-left">
                <h4 className="font-medium text-foreground">{recommendation.title}</h4>
                <p className="text-sm text-muted-foreground">{recommendation.reason}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-left">
              {recommendation.description}
            </p>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={() => router.push(recommendation.path)}
            className="avantle-glow w-full sm:w-auto"
          >
            {recommendation.title}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            onClick={() => router.push('/dashboard')}
            className="avantle-border w-full sm:w-auto"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const currentStepData = onboardingSteps[currentStep]
  const currentAnswer = answers[currentStepData.id]
  const Icon = currentStepData.icon

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {onboardingSteps.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Current Step */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 rounded-full bg-primary/20 border border-primary/30">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
        <h2 className="text-2xl font-medium text-foreground mb-2">
          {currentStepData.title}
        </h2>
        <p className="text-muted-foreground">
          {currentStepData.description}
        </p>
      </div>

      {/* Options */}
      <RadioGroup 
        value={currentAnswer} 
        onValueChange={(value) => handleAnswer(currentStepData.id, value)}
        className="space-y-3 mb-8"
      >
        {currentStepData.options.map((option) => (
          <Label
            key={option.value}
            htmlFor={option.value}
            className={`
              flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all
              ${currentAnswer === option.value 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
              }
            `}
          >
            <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-foreground">{option.label}</span>
                {option.recommended && (
                  <Badge variant="secondary" className="text-xs">
                    <Zap className="h-3 w-3 mr-1" />
                    Recommended
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{option.description}</p>
            </div>
          </Label>
        ))}
      </RadioGroup>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="avantle-border"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={!currentAnswer}
          className="avantle-glow"
        >
          {currentStep === onboardingSteps.length - 1 ? 'Complete' : 'Next'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}