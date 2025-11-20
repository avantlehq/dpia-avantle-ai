import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, CheckCircle, FileText, ArrowRight, Lock, Zap } from 'lucide-react'
import Link from 'next/link'
import { getVersionInfo } from '@/lib/version'

export default function Home() {
  const versionInfo = getVersionInfo()
  
  return (
    <div className="min-h-screen avantle-gradient">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="flex justify-center gap-3 mb-6">
            <Badge variant="secondary" className="avantle-border bg-card text-card-foreground">
              <Lock className="mr-2 h-3 w-3" />
              Privacy by Design
            </Badge>
            <Badge variant="outline" className="avantle-border border-primary/30">
              {versionInfo.displayName}
            </Badge>
          </div>
          <h1 className="text-5xl lg:text-7xl font-light tracking-tight mb-8 text-foreground">
            DPIA Agent
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 font-light leading-relaxed">
            One core that powers infinite local agents. <br/>
            Professional GDPR assessments with European values of data sovereignty.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="avantle-glow" asChild>
              <Link href="/precheck">
                <CheckCircle className="mr-2 h-5 w-5" />
                Start Assessment
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="avantle-border" asChild>
              <Link href="/dashboard">
                Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <Card className="avantle-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-card-foreground">Quick Assessment</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-muted-foreground leading-relaxed">
                8-question smart evaluation to determine if your project requires a full DPIA 
                under GDPR Article 35.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="avantle-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-card-foreground">Risk Scoring</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-muted-foreground leading-relaxed">
                Advanced risk engine calculating likelihood × impact scores with specific 
                mitigation recommendations.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="avantle-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-card-foreground">Professional Reports</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-muted-foreground leading-relaxed">
                Generate comprehensive DPIA documents in PDF and DOCX formats ready 
                for regulatory submission.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Minimal Footer - Avantle.ai style */}
        <div className="text-center mt-20 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground font-light">
            {versionInfo.fullDisplayName} • Built on {versionInfo.buildDate}
          </p>
          <p className="text-xs text-muted-foreground/70 mt-2">
            Privacy by Design. One core that powers infinite local agents.
          </p>
        </div>
      </div>
    </div>
  )
}
