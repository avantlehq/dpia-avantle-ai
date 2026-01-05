'use client'

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useTranslation } from "@/lib/i18n/use-translation"

export default function HomePage() {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          {/* Hero Section */}
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-dpia-blue/10 border border-dpia-blue/20">
              <div className="w-2 h-2 rounded-full bg-dpia-blue animate-pulse"></div>
              <span className="text-sm font-medium text-dpia-blue">{t.europeanPrivacyPlatform}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground">
              {t.heroTitle}
            </h1>
            
            <p className="text-xl md:text-2xl lg:text-3xl max-w-4xl mx-auto leading-relaxed" style={{color: '#A0A0A0'}}>
              {t.heroSubtitle}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="space-y-3 p-6 rounded-lg border border-dpia-blue/10 bg-dpia-blue/5">
              <div className="w-12 h-12 rounded-lg bg-dpia-blue/20 flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-dpia-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground">{t.dpiaAutomation}</h3>
              <p className="text-sm text-muted-foreground">{t.dpiaAutomationDesc}</p>
            </div>
            
            <div className="space-y-3 p-6 rounded-lg border border-dpia-green/10 bg-dpia-green/5">
              <div className="w-12 h-12 rounded-lg bg-dpia-green/20 flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-dpia-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground">{t.multiTenantPlatform}</h3>
              <p className="text-sm text-muted-foreground">{t.multiTenantPlatformDesc}</p>
            </div>
            
            <div className="space-y-3 p-6 rounded-lg border border-dpia-purple/10 bg-dpia-purple/5">
              <div className="w-12 h-12 rounded-lg bg-dpia-purple/20 flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-dpia-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground">{t.europeanFirst}</h3>
              <p className="text-sm text-muted-foreground">{t.europeanFirstDesc}</p>
            </div>
          </div>

          {/* Platform Access */}
          <div className="pt-8 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <a 
                href="https://dpia.avantle.ai" 
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-dpia-blue text-white rounded-lg hover:bg-dpia-blue/90 transition-colors font-medium"
              >
                {t.launchPlatform}
              </a>
              <span className="text-sm text-muted-foreground">{t.or}</span>
              <a 
                href="/admin" 
                className="px-6 py-3 border border-dpia-blue text-dpia-blue rounded-lg hover:bg-dpia-blue/5 transition-colors font-medium"
              >
                {t.platformAdministration}
              </a>
            </div>
          </div>
        </div>
      </main>
      
      <SiteFooter />
    </div>
  )
}