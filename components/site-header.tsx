"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Shield, User, Settings } from "lucide-react"
import { getCurrentUser, isAdmin, isPartnerAdmin } from "@/lib/auth"
import type { User as UserType } from "@/lib/auth"
import { getVersionString } from "@/src/lib/version"

export function SiteHeader() {
  const [user, setUser] = useState<UserType | null>(null)

  useEffect(() => {
    setUser(getCurrentUser())
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Shield className="h-6 w-6 text-dpia-blue" />
            <div className="hidden sm:block">
              <div className="flex items-baseline space-x-2">
                <span className="font-bold text-foreground">Avantle.ai</span>
                <span className="text-xs text-muted-foreground font-mono">
                  {getVersionString()}
                </span>
              </div>
            </div>
          </Link>
        </div>
        
        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6 flex-1">
          <nav className="flex items-center space-x-4">
            <Link 
              href="/manifesto" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Manifesto
            </Link>
            {user && isPartnerAdmin(user) && (
              <Link 
                href="/partners" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Partners
              </Link>
            )}
            {user && isAdmin(user) && (
              <Link 
                href="/admin" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1"
              >
                <Settings className="h-3 w-3" />
                <span>Admin</span>
              </Link>
            )}
          </nav>
        </div>

        {/* User Actions */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.role}</p>
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
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}