import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ShieldCheck, 
  FileText, 
  Users, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Scale,
  BookOpen,
  Zap,
  Globe
} from 'lucide-react'
import Link from 'next/link'
import { OnboardingWizard } from '@/components/onboarding/onboarding-wizard'

export default async function OnboardingPage() {
  return (
    <div className="py-12 px-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 rounded-full backdrop-blur-sm border border-dpia-blue bg-icon-blue hover:bg-icon-blue-hover transition-colors duration-200">
              <ShieldCheck className="h-12 w-12" style={{ color: 'var(--color-blue)' }} />
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--color-blue)' }}></div>
            <h1 className="text-4xl font-light tracking-tight text-foreground">
              Welcome to DPIA.ai
            </h1>
          </div>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            Your AI-powered companion for GDPR compliance. Create professional Data Protection Impact Assessments with European privacy values.
          </p>
        </div>

        {/* Feature Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="avantle-border bg-card backdrop-blur-sm border-l-4 border-l-dpia-green shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="text-center">
              <div className="p-3 rounded-lg w-fit mx-auto mb-4 bg-icon-green hover:bg-icon-green-hover transition-colors duration-200">
                <Zap className="h-6 w-6" style={{ color: 'var(--color-green)' }} />
              </div>
              <CardTitle className="text-lg text-card-foreground">Smart Pre-check</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground text-sm">
                AI-powered 8-question evaluation to determine if you need a full DPIA, based on GDPR Article 35 criteria.
              </p>
            </CardContent>
          </Card>

          <Card className="avantle-border bg-card backdrop-blur-sm border-l-4 border-l-dpia-orange shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="text-center">
              <div className="p-3 rounded-lg w-fit mx-auto mb-4 bg-icon-orange hover:bg-icon-orange-hover transition-colors duration-200">
                <FileText className="h-6 w-6" style={{ color: 'var(--color-orange)' }} />
              </div>
              <CardTitle className="text-lg text-card-foreground">Guided Assessment</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground text-sm">
                Step-by-step wizard with auto-save, risk scoring, and professional templates for comprehensive DPIAs.
              </p>
            </CardContent>
          </Card>

          <Card className="avantle-border bg-card backdrop-blur-sm border-l-4 border-l-dpia-purple shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="text-center">
              <div className="p-3 rounded-lg w-fit mx-auto mb-4 bg-icon-purple hover:bg-icon-purple-hover transition-colors duration-200">
                <Globe className="h-6 w-6" style={{ color: 'var(--color-purple)' }} />
              </div>
              <CardTitle className="text-lg text-card-foreground">Professional Export</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground text-sm">
                Generate executive-ready PDF and Word documents with risk analysis and mitigation recommendations.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Onboarding Wizard */}
        <Card className="avantle-border bg-card backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-card-foreground">
              Let&apos;s Get You Started
            </CardTitle>
            <p className="text-center text-muted-foreground">
              Choose your path based on your current needs
            </p>
          </CardHeader>
          <CardContent>
            <OnboardingWizard />
          </CardContent>
        </Card>

        {/* Quick Start Options */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="avantle-border bg-card backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-icon-blue hover:bg-icon-blue-hover transition-colors duration-200">
                  <Scale className="h-5 w-5" style={{ color: 'var(--color-blue)' }} />
                </div>
                <div>
                  <CardTitle className="text-lg text-card-foreground">I Need to Check if DPIA is Required</CardTitle>
                  <p className="text-sm text-muted-foreground">Quick 8-question pre-assessment</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm">
                Not sure if your data processing activity requires a DPIA? Our smart pre-check analyzes your activity against GDPR Article 35 criteria and provides instant guidance.
              </p>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  5 minutes
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  Beginner friendly
                </Badge>
              </div>
              <Link href="/precheck">
                <Button className="w-full avantle-glow">
                  Start Pre-check
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="avantle-border bg-card backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-icon-green hover:bg-icon-green-hover transition-colors duration-200">
                  <FileText className="h-5 w-5" style={{ color: 'var(--color-green)' }} />
                </div>
                <div>
                  <CardTitle className="text-lg text-card-foreground">I Need to Create a Full DPIA</CardTitle>
                  <p className="text-sm text-muted-foreground">Comprehensive 3-section assessment</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm">
                Create a professional DPIA with our guided wizard. Covers context & scope, legal basis, and risk assessment with automatic scoring and recommendations.
              </p>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  20-30 minutes
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Auto-save
                </Badge>
              </div>
              <Link href="/new">
                <Button variant="outline" className="w-full avantle-border">
                  Create New DPIA
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Learning Resources */}
        <Card className="avantle-border bg-card backdrop-blur-sm mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-primary" />
              <CardTitle className="text-xl text-card-foreground">Learn About DPIAs</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-foreground mb-2">What is a DPIA?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  A Data Protection Impact Assessment (DPIA) is a process designed to help identify and minimize data protection risks. Under GDPR Article 35, DPIAs are required for processing activities likely to result in high risks to individual rights and freedoms.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-2">When is a DPIA Required?</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Systematic evaluation or scoring (including profiling)</li>
                  <li>• Large-scale processing of special categories of data</li>
                  <li>• Systematic monitoring of publicly accessible areas</li>
                  <li>• Use of new technologies with high privacy risks</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-muted-foreground mb-6">
            Already have assessments? Access your dashboard to manage existing DPIAs.
          </p>
          <Link href="/dashboard">
            <Button variant="outline" className="avantle-border">
              Go to Dashboard
            </Button>
          </Link>
        </div>
    </div>
  )
}