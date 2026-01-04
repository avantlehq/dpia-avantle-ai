'use client'

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card } from "@/components/ui/card"
import { CHANGELOG, getVersionInfo } from "@/src/lib/version"
import { CalendarDays, GitCommit, Tag } from "lucide-react"

export default function ChangelogPage() {
  const versionInfo = getVersionInfo()

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      
      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Changelog
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Track the evolution of Avantle.ai Privacy Platform. 
              Stay updated with the latest features, improvements, and fixes.
            </p>
          </div>

          {/* Current Version Info */}
          <Card className="p-6 mb-8 bg-dpia-blue/5 border-dpia-blue/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Tag className="h-6 w-6 text-dpia-blue" />
                <h2 className="text-xl font-bold text-foreground">Current Version</h2>
              </div>
              <code className="px-3 py-1 bg-dpia-blue/20 text-dpia-blue rounded-full text-sm font-mono">
                v{versionInfo.version}
              </code>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                <span>Build: {versionInfo.buildDate}</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <GitCommit className="h-4 w-4" />
                <span>Branch: {versionInfo.gitBranch}</span>
              </div>
              {versionInfo.gitCommit !== 'unknown' && (
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <span className="text-xs">Commit:</span>
                  <code className="font-mono text-xs">{versionInfo.gitCommit}</code>
                </div>
              )}
            </div>
          </Card>

          {/* Changelog Entries */}
          <div className="space-y-8">
            {CHANGELOG.map((release, index) => (
              <Card key={release.version} className="p-6">
                {/* Release Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-2xl font-bold text-foreground">
                        v{release.version}
                      </h3>
                      <span className="text-lg font-medium text-muted-foreground">
                        {release.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />
                      <span>{release.date}</span>
                    </div>
                  </div>
                  {index === 0 && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                      Latest
                    </span>
                  )}
                </div>

                {/* Changes */}
                <div className="space-y-3">
                  {release.changes.map((change, changeIndex) => (
                    <div key={changeIndex} className="flex items-start space-x-3">
                      <div className="mt-2 h-1.5 w-1.5 bg-dpia-blue rounded-full flex-shrink-0"></div>
                      <div 
                        className="text-sm text-foreground leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: change }}
                      />
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {/* Footer Note */}
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Want to stay updated? Follow our development on the admin console or check back regularly.
            </p>
          </div>
        </div>
      </main>
      
      <SiteFooter />
    </div>
  )
}