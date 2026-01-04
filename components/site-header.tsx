// "use client" - Temporarily removed for SSR compatibility

import Link from "next/link"
import { Shield, User, Settings } from "lucide-react"
// import { getCurrentUser, isAdmin, isPartnerAdmin } from "@/lib/auth"
// import type { User as UserType } from "@/lib/auth"
import { getVersionString } from "@/src/lib/version"
// import { useTranslation } from "@/lib/i18n/use-translation"
// import { LanguageSwitcher } from "./language-switcher" - REMOVED

export function SiteHeader() {
  // const [user, setUser] = useState<UserType | null>(null)
  // Temporarily simplified for SSR
  const user = null
  // const { t } = useTranslation()
  // Temporary placeholder  
  const t = {
    platform: "Platform",
    privacyByDesign: "Privacy by Design", 
    dpiaSuite: "Privacy Platform",
    partners: "Partners",
    platformAdmin: "Platform Admin",
    login: "Login"
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Shield className="h-7 w-7 text-dpia-blue" />
              <div className="h-6 w-px bg-border"></div>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-baseline space-x-2">
                <div className="flex flex-col">
                  <span className="font-bold text-foreground leading-tight">
                    Privacy Platform
                  </span>
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                  {getVersionString()}
                </span>
              </div>
            </div>
          </Link>
        </div>
        
        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6 flex-1">
          <nav className="flex items-center space-x-6">
            <Link 
              href="/platform" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t.platform}
            </Link>
            <Link 
              href="/privacy" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t.privacyByDesign}
            </Link>
            <a 
              href="https://dpia.avantle.ai" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-dpia-blue transition-colors flex items-center space-x-1"
            >
              <span>{t.dpiaSuite}</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            {/* Temporarily disabled admin links
            <Link 
              href="/partners" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t.partners}
            </Link>
            <Link 
              href="/admin" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1"
            >
              <Settings className="h-3 w-3" />
              <span>{t.platformAdmin}</span>
            </Link>
            */}
          </nav>
        </div>

        {/* User Actions */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="flex items-center space-x-4">
            {/* LanguageSwitcher COMPLETELY REMOVED */}
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-foreground">Guest</p>
                  <p className="text-xs text-muted-foreground">Visitor</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-dpia-blue/20 flex items-center justify-center">
                  <User className="h-4 w-4 text-dpia-blue" />
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t.login}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}