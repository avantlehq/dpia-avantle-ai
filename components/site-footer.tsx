"use client"

import { Shield } from "lucide-react"
import { getVersionInfo } from "@/src/lib/version"

export function SiteFooter() {
  const versionInfo = getVersionInfo()

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-dpia-blue" />
              <span className="font-bold text-foreground">Avantle.ai</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Privacy Management Platform
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/manifesto" className="text-muted-foreground hover:text-foreground transition-colors">
                  Manifesto
                </a>
              </li>
              <li>
                <a href="https://dpia.avantle.ai" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Platform
                </a>
              </li>
              <li>
                <a href="/changelog" className="text-muted-foreground hover:text-foreground transition-colors">
                  Changelog
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-muted-foreground">Privacy by Design</span>
              </li>
              <li>
                <span className="text-muted-foreground">European Data Sovereignty</span>
              </li>
            </ul>
          </div>

          {/* Version Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Platform</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">Version:</span>
                <code className="text-xs bg-accent px-2 py-1 rounded font-mono text-foreground">
                  v{versionInfo.version}
                </code>
              </div>
              <div>
                <span className="text-muted-foreground font-medium">{versionInfo.name}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Build: {versionInfo.buildDate}
              </div>
              {versionInfo.gitCommit !== 'unknown' && (
                <div className="text-xs text-muted-foreground">
                  Commit: <code className="font-mono">{versionInfo.gitCommit}</code>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-4 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Avantle. All rights reserved.
            </div>
            <div className="text-xs text-muted-foreground">
              Privacy Platform v{versionInfo.version} • {versionInfo.name}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}