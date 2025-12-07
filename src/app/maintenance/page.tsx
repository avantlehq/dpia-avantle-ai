'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Shield, Wrench } from 'lucide-react'

export default function MaintenancePage() {
  const [password, setPassword] = useState('')
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleAdminLogin = async () => {
    if (password === 'life2026') {
      setIsLoading(true)
      // Redirect with admin parameter to set cookie
      window.location.href = `${window.location.origin}/?admin=life2026`
    } else {
      alert('Neplatné heslo')
      setPassword('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdminLogin()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#192734' }}>
      <div className="text-center max-w-md mx-auto px-6">
        {/* Main Content */}
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full" style={{ backgroundColor: 'rgba(74, 144, 226, 0.15)' }}>
              <Wrench className="h-12 w-12" style={{ color: '#4A90E2' }} />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">
            🚧 Údržba
          </h1>
          
          <p className="text-gray-300 mb-6 text-lg">
            Stránka je momentálne v údržbe.<br />
            Pracujeme na vylepšeniach platformy.
          </p>
          
          <div className="text-sm text-gray-400 space-y-1">
            <p>DPIA.ai - Privacy by Design</p>
            <p>Európska platforma pre GDPR compliance</p>
          </div>
        </div>

        {/* Hidden Admin Access */}
        <div className="border-t border-gray-600 pt-6">
          {!showLoginForm ? (
            <button
              onClick={() => setShowLoginForm(true)}
              className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
              style={{ fontSize: '10px' }}
            >
              •
            </button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <Shield className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-400">Admin prístup</span>
              </div>
              
              <Input
                type="password"
                placeholder="Heslo"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                disabled={isLoading}
              />
              
              <div className="flex space-x-2">
                <Button
                  onClick={handleAdminLogin}
                  disabled={!password || isLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading ? 'Prihlasovanie...' : 'Prístup'}
                </Button>
                
                <Button
                  onClick={() => {
                    setShowLoginForm(false)
                    setPassword('')
                  }}
                  variant="outline"
                  className="border-gray-600 text-gray-400 hover:text-white"
                >
                  Zrušiť
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-xs text-gray-500">
          <p>© 2024 Avantle.ai - Všetky práva vyhradené</p>
        </div>
      </div>
    </div>
  )
}