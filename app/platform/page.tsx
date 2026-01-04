// 'use client' - Temporarily removed for SSR compatibility

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
// import { useTranslation } from "@/lib/i18n/use-translation"

export default function PlatformPage() {
  // const { t } = useTranslation()
  // Temporary placeholder
  const t = {
    platformPageTitle: "Avantle Privacy Platform",
    platformPageSubtitle: "Complete platform for privacy compliance and data protection",
    launchPlatform: "Launch Platform", 
    platformAdministration: "Platform Administration"
  }
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      
      <main className="flex-1 px-6 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center space-y-6 mb-16">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-dpia-blue/10 border border-dpia-blue/20">
              <span className="text-sm font-medium text-dpia-blue">Multi-Tenant Architecture</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              <span className="text-foreground">{t.platformPageTitle}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              {t.platformPageSubtitle}
            </p>
          </div>

          {/* Architecture Diagram */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Platform Architecture</h2>
            <div className="bg-card rounded-lg border p-8">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-8">
                {/* Frontend Layer */}
                <div className="flex-1 space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto rounded-lg bg-dpia-blue/20 flex items-center justify-center mb-3">
                      <svg className="w-8 h-8 text-dpia-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-dpia-blue">avantle.ai</h3>
                    <p className="text-sm text-muted-foreground">Control Plane Frontend</p>
                    <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                      <div>Partner Management</div>
                      <div>Admin Console</div>
                      <div>Marketing Platform</div>
                    </div>
                  </div>
                </div>

                <div className="text-2xl text-muted-foreground">→</div>

                {/* API Layer */}
                <div className="flex-1 space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto rounded-lg bg-dpia-green/20 flex items-center justify-center mb-3">
                      <svg className="w-8 h-8 text-dpia-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-dpia-green">core.avantle.ai</h3>
                    <p className="text-sm text-muted-foreground">Control Plane API</p>
                    <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                      <div>Multi-Tenant RBAC</div>
                      <div>Partner/Tenant Mgmt</div>
                      <div>Usage Analytics</div>
                    </div>
                  </div>
                </div>

                <div className="text-2xl text-muted-foreground">→</div>

                {/* Runtime Layer */}
                <div className="flex-1 space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto rounded-lg bg-dpia-purple/20 flex items-center justify-center mb-3">
                      <svg className="w-8 h-8 text-dpia-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-dpia-purple">dpia.avantle.ai</h3>
                    <p className="text-sm text-muted-foreground">Runtime Platform</p>
                    <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                      <div>DPIA Workflows</div>
                      <div>Client Data Processing</div>
                      <div>Whitelabel Access</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="space-y-4 p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-foreground">Multi-Tenant Architecture</h3>
              <p className="text-muted-foreground">
                Complete isolation between partners and tenants with enterprise-grade security and white-label customization.
              </p>
            </div>
            
            <div className="space-y-4 p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-foreground">GDPR Automation</h3>
              <p className="text-muted-foreground">
                Automated Data Protection Impact Assessments with expert-guided workflows and compliance tracking.
              </p>
            </div>
            
            <div className="space-y-4 p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-foreground">European Data Sovereignty</h3>
              <p className="text-muted-foreground">
                Built specifically for EU regulations with data processing exclusively within European boundaries.
              </p>
            </div>
            
            <div className="space-y-4 p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-foreground">Partner Ecosystem</h3>
              <p className="text-muted-foreground">
                Enable partners to offer privacy compliance services under their own brand with complete autonomy.
              </p>
            </div>
            
            <div className="space-y-4 p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-foreground">Usage Analytics</h3>
              <p className="text-muted-foreground">
                Comprehensive usage tracking and analytics for platform optimization and billing transparency.
              </p>
            </div>
            
            <div className="space-y-4 p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-foreground">API-First Design</h3>
              <p className="text-muted-foreground">
                Headless architecture enabling multiple frontend experiences and third-party integrations.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join the Avantle Privacy Platform and bring GDPR compliance automation to your organization.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <a 
                href="https://dpia.avantle.ai" 
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-dpia-blue text-white rounded-lg hover:bg-dpia-blue/90 transition-colors font-medium"
              >
                {t.launchPlatform}
              </a>
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