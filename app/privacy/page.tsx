import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      
      <main className="flex-1 px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center space-y-6 mb-16">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-dpia-green/10 border border-dpia-green/20">
              <div className="w-2 h-2 rounded-full bg-dpia-green animate-pulse"></div>
              <span className="text-sm font-medium text-dpia-green">Privacy by Design</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              <span className="text-foreground">Privacy</span>
              <span className="text-dpia-green"> by Design</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Our foundational approach to building privacy-first technology that respects user rights and European values.
            </p>
          </div>

          {/* Privacy Principles */}
          <div className="space-y-12">
            {/* Principle 1 */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-dpia-blue/20 flex items-center justify-center">
                  <span className="text-xl font-bold text-dpia-blue">1</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">No Tracking, Ever</h2>
              </div>
              <div className="ml-16 space-y-4">
                <p className="text-lg text-muted-foreground">
                  We do not track users across websites, collect behavioral data, or build advertising profiles. 
                  Your privacy is not a commodity to be traded.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-dpia-green/5 border border-dpia-green/20">
                    <h4 className="font-semibold text-dpia-green mb-2">✓ What We Do</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Functional analytics only</li>
                      <li>• Anonymized usage metrics</li>
                      <li>• Transparent data practices</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-dpia-red/5 border border-dpia-red/20">
                    <h4 className="font-semibold text-dpia-red mb-2">✗ What We Don't Do</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Third-party tracking pixels</li>
                      <li>• Cross-site cookies</li>
                      <li>• Behavioral profiling</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Principle 2 */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-dpia-green/20 flex items-center justify-center">
                  <span className="text-xl font-bold text-dpia-green">2</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">European Data Sovereignty</h2>
              </div>
              <div className="ml-16 space-y-4">
                <p className="text-lg text-muted-foreground">
                  All data processing occurs within European Union boundaries. We maintain complete control over 
                  data location and ensure compliance with EU regulations.
                </p>
                <div className="p-6 rounded-lg bg-card border">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto rounded-lg bg-dpia-blue/20 flex items-center justify-center mb-3">
                        🇪🇺
                      </div>
                      <h4 className="font-semibold mb-1">EU Hosting</h4>
                      <p className="text-sm text-muted-foreground">Servers exclusively in EU</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto rounded-lg bg-dpia-green/20 flex items-center justify-center mb-3">
                        🛡️
                      </div>
                      <h4 className="font-semibold mb-1">GDPR Native</h4>
                      <p className="text-sm text-muted-foreground">Built for EU regulations</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto rounded-lg bg-dpia-purple/20 flex items-center justify-center mb-3">
                        🔒
                      </div>
                      <h4 className="font-semibold mb-1">Data Protection</h4>
                      <p className="text-sm text-muted-foreground">Encryption at rest & transit</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Principle 3 */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-dpia-purple/20 flex items-center justify-center">
                  <span className="text-xl font-bold text-dpia-purple">3</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Transparency & Control</h2>
              </div>
              <div className="ml-16 space-y-4">
                <p className="text-lg text-muted-foreground">
                  We believe users should have complete visibility into how their data is processed and 
                  full control over their privacy preferences.
                </p>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold mb-2">🔍 Complete Transparency</h4>
                    <p className="text-sm text-muted-foreground">
                      Every data processing activity is documented and accessible. We provide clear explanations 
                      of why data is collected and how it's used.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold mb-2">⚙️ User Control</h4>
                    <p className="text-sm text-muted-foreground">
                      Granular privacy controls allow users to customize their experience while maintaining 
                      functionality and security.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold mb-2">📋 Audit Trails</h4>
                    <p className="text-sm text-muted-foreground">
                      Complete audit logs of data processing activities are maintained and can be provided 
                      upon request for compliance verification.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Principle 4 */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-dpia-red/20 flex items-center justify-center">
                  <span className="text-xl font-bold text-dpia-red">4</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Minimal Data Collection</h2>
              </div>
              <div className="ml-16 space-y-4">
                <p className="text-lg text-muted-foreground">
                  We collect only the minimum data necessary for functionality. Every data point serves 
                  a specific purpose that benefits the user.
                </p>
                <div className="p-6 rounded-lg bg-card border">
                  <h4 className="font-semibold mb-4">Data Minimization in Practice</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Personal Information</span>
                      <span className="text-sm text-dpia-green font-mono">Only what's required</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Usage Analytics</span>
                      <span className="text-sm text-dpia-green font-mono">Anonymized & aggregated</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Session Data</span>
                      <span className="text-sm text-dpia-green font-mono">Temporary & functional</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Third-party Sharing</span>
                      <span className="text-sm text-dpia-red font-mono">Never</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center space-y-6 p-8 rounded-lg bg-dpia-blue/5 border border-dpia-blue/20">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Experience Privacy by Design</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how our privacy-first approach works in practice. Try the DPIA platform built 
              on these principles.
            </p>
            <a 
              href="https://dpia.avantle.ai" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-dpia-blue text-white rounded-lg hover:bg-dpia-blue/90 transition-colors font-medium"
            >
              <span>Launch DPIA Platform</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </main>
      
      <SiteFooter />
    </div>
  )
}