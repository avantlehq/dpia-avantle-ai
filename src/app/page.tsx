import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, FileText, ArrowRight, Lock, Zap, Shield, Sparkles, Globe } from 'lucide-react'
import Link from 'next/link'
import { getVersionInfo } from '@/lib/version'

export default function Home() {
  const versionInfo = getVersionInfo()
  
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Modern Gradient Background with Animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-600/5 via-transparent to-transparent"></div>
      </div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-emerald-600/3 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-3/4 w-48 h-48 bg-purple-600/4 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-24 lg:py-32">
          {/* Modern Hero Section */}
          <div className="text-center mb-32">
            {/* Badge Section with Modern Design */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <Badge 
                variant="secondary" 
                className="backdrop-blur-sm bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-300 px-4 py-2"
              >
                <Shield className="mr-2 h-4 w-4 text-emerald-400" />
                Privacy by Design
              </Badge>
              <Badge 
                variant="outline" 
                className="backdrop-blur-sm bg-blue-500/10 border border-blue-400/30 text-blue-300 hover:bg-blue-500/20 transition-all duration-300 px-4 py-2"
              >
                <Sparkles className="mr-2 h-3 w-3" />
                {versionInfo.displayName}
              </Badge>
              <Badge 
                variant="outline" 
                className="backdrop-blur-sm bg-purple-500/10 border border-purple-400/30 text-purple-300 hover:bg-purple-500/20 transition-all duration-300 px-4 py-2"
              >
                <Globe className="mr-2 h-3 w-3" />
                EU Compliant
              </Badge>
            </div>

            {/* Hero Title with Modern Typography */}
            <div className="mb-8">
              <h1 className="text-6xl lg:text-8xl xl:text-9xl font-extralight tracking-tighter mb-4 bg-gradient-to-r from-white via-blue-100 to-emerald-100 bg-clip-text text-transparent leading-[0.9]">
                DPIA
              </h1>
              <h2 className="text-4xl lg:text-6xl xl:text-7xl font-light tracking-tight text-white/90 mb-6">
                Agent
              </h2>
            </div>

            {/* Modern Subtitle */}
            <p className="text-xl lg:text-2xl text-slate-300 max-w-4xl mx-auto mb-4 font-light leading-relaxed">
              One core that powers infinite local agents.
            </p>
            <p className="text-lg lg:text-xl text-slate-400 max-w-3xl mx-auto mb-12 font-light leading-relaxed">
              Professional GDPR assessments with European values of data sovereignty.
            </p>

            {/* Modern CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-medium" 
                asChild
              >
                <Link href="/onboarding">
                  <Zap className="mr-3 h-5 w-5" />
                  Get Started
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="backdrop-blur-sm bg-white/5 border border-white/20 text-white hover:bg-white/10 hover:border-white/30 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-medium" 
                asChild
              >
                <Link href="/precheck">
                  <CheckCircle className="mr-3 h-5 w-5 text-emerald-400" />
                  Quick Pre-check
                </Link>
              </Button>
              
              <Button 
                variant="ghost" 
                size="lg" 
                className="text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-300 px-6 py-4 text-lg font-medium group" 
                asChild
              >
                <Link href="/dashboard">
                  Dashboard
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Modern Features Section */}
          <div className="mb-32">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h3 className="text-3xl lg:text-4xl font-light text-white mb-4">
                Powerful Features
              </h3>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Everything you need for comprehensive GDPR compliance
              </p>
            </div>

            {/* Modern Feature Grid - Centered with max width */}
            <div className="max-w-4xl mx-auto px-4">
              <div className="grid md:grid-cols-3 gap-6 lg:gap-8 xl:gap-10">
              <Card className="group backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-400/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/10">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/30 group-hover:from-emerald-400/30 group-hover:to-emerald-500/40 transition-all duration-300">
                      <CheckCircle className="h-8 w-8 text-emerald-400" />
                    </div>
                    <CardTitle className="text-xl font-medium text-white">Quick Assessment</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-300 leading-relaxed text-base">
                    8-question smart evaluation to determine if your project requires a full DPIA 
                    under GDPR Article 35.
                  </CardDescription>
                  <div className="mt-6">
                    <Button variant="ghost" size="sm" className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 p-0 h-auto font-medium group-hover:translate-x-1 transition-transform duration-300">
                      Try Pre-check →
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="group backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-400/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/30 group-hover:from-blue-400/30 group-hover:to-blue-500/40 transition-all duration-300">
                      <Zap className="h-8 w-8 text-blue-400" />
                    </div>
                    <CardTitle className="text-xl font-medium text-white">Risk Scoring</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-300 leading-relaxed text-base">
                    Advanced risk engine calculating likelihood × impact scores with specific 
                    mitigation recommendations.
                  </CardDescription>
                  <div className="mt-6">
                    <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 p-0 h-auto font-medium group-hover:translate-x-1 transition-transform duration-300">
                      Learn More →
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="group backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-400/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/30 group-hover:from-purple-400/30 group-hover:to-purple-500/40 transition-all duration-300">
                      <FileText className="h-8 w-8 text-purple-400" />
                    </div>
                    <CardTitle className="text-xl font-medium text-white">Professional Reports</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-300 leading-relaxed text-base">
                    Generate comprehensive DPIA documents in PDF and DOCX formats ready 
                    for regulatory submission.
                  </CardDescription>
                  <div className="mt-6">
                    <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 p-0 h-auto font-medium group-hover:translate-x-1 transition-transform duration-300">
                      View Sample →
                    </Button>
                  </div>
                </CardContent>
              </Card>
              </div>
            </div>
          </div>

          {/* Modern Footer */}
          <div className="text-center pt-16 mt-32 border-t border-white/10">
            <div className="max-w-2xl mx-auto">
              <p className="text-sm text-slate-400 font-light mb-3">
                {versionInfo.fullDisplayName} • Built on {versionInfo.buildDate}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Privacy by Design. One core that powers infinite local agents.
              </p>
              <p className="text-xs text-slate-600 mt-3">
                🇪🇺 European values • Data sovereignty • GDPR compliant by default
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
