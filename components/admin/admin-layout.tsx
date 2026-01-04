'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, Settings, BarChart3, Users, Building2, Globe, LogOut, Shield } from 'lucide-react'
import { checkAuth, logout, User as UserType } from '@/lib/auth'
import { getVersionString } from '@/src/lib/version'

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    const authState = checkAuth()
    setUser(authState.user)
    setIsLoading(authState.isLoading)

    if (!authState.isAuthenticated) {
      // Redirect to login will happen in requireAuth
      return
    }
  }, [])

  const handleLogout = async () => {
    await logout()
  }

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: BarChart3,
      description: 'System overview and statistics'
    },
    {
      name: 'Partners',
      href: '/admin/partners',
      icon: Building2,
      description: 'Partner management'
    },
    {
      name: 'Tenants',
      href: '/admin/tenants',
      icon: Users,
      description: 'Tenant management'
    },
    {
      name: 'Domains',
      href: '/admin/domains',
      icon: Globe,
      description: 'Domain verification and management'
    },
    {
      name: 'System',
      href: '/admin/system',
      icon: Settings,
      description: 'System settings and monitoring'
    }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dpia-blue"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-dpia-blue" />
              <div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-xl font-semibold text-foreground">Avantle</span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {getVersionString()}
                  </span>
                </div>
                <div className="hidden md:block">
                  <span className="text-sm text-muted-foreground">Admin Console</span>
                </div>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.role}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-dpia-blue/20 flex items-center justify-center">
                  <User className="h-4 w-4 text-dpia-blue" />
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/admin' && pathname.startsWith(item.href))
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-dpia-blue/20 text-dpia-blue border border-dpia-blue/30' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }
                  `}
                >
                  <item.icon className="h-5 w-5" />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs opacity-75">{item.description}</p>
                  </div>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}