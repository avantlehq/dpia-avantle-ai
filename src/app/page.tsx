import { Badge } from '@/components/ui/badge'
import { Zap, Shield, Sparkles, Globe } from 'lucide-react'
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
        {/* Modern Container with Responsive Padding */}
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 py-20 sm:py-24 lg:py-32">
          
          {/* Modern Hero Section - Centered Content Container */}
          <div className="max-w-5xl mx-auto text-center mb-24 sm:mb-32">
            
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
              <h1 className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-extralight tracking-tighter mb-4 bg-gradient-to-r from-white via-blue-100 to-emerald-100 bg-clip-text text-transparent leading-[0.9]">
                DPIA.ai
              </h1>
              <h2 className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-light tracking-tight text-white/90 mb-6">
                Privacy Platform
              </h2>
            </div>

            {/* Simple Description */}
            <div className="max-w-3xl mx-auto mb-12">
              <p className="text-lg sm:text-xl lg:text-2xl text-slate-300 mb-6 font-light leading-relaxed">
                European GDPR compliance platform for Data Protection Impact Assessments
              </p>
            </div>

            {/* Clean Modern Login Button */}
            <div className="flex justify-center mb-16">
              <Link 
                href="/dashboard"
                className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl border border-blue-500 hover:border-blue-400 transform hover:scale-102 transition-all duration-300 px-8 py-4 font-semibold rounded-lg cursor-pointer min-w-[280px]"
                style={{
                  backgroundColor: '#2563eb',
                  borderColor: '#3b82f6',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '24px',
                  fontWeight: '600'
                }}
              >
                Enter Platform
              </Link>
            </div>
          </div>


          {/* Simple Footer */}
          <div className="text-center pt-12 sm:pt-16 mt-24 sm:mt-32 border-t border-white/10">
            <div className="max-w-3xl mx-auto px-4">
              <p className="text-sm text-slate-400 font-light mb-3">
                {versionInfo.fullDisplayName} • Built on {versionInfo.buildDate}
              </p>
              <p className="text-xs text-slate-600 mt-3">
                🇪🇺 European GDPR compliance • Privacy by Design
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
