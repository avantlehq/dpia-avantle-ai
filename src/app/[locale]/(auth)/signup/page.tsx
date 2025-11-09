'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Link } from '../../../../../i18n/routing'

export default function SignupPage() {
  const t = useTranslations('auth')
  const [email, setEmail] = useState('')
  const { signIn, loading } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Email is required')
      return
    }

    try {
      await signIn(email)
      toast.success(t('checkEmail'))
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to sign up')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">DPIA Agent</CardTitle>
          <CardDescription className="text-center">
            {t('getStarted')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                disabled={loading}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Sending...' : t('signUpWithEmail')}
            </Button>
          </form>
          <p className="text-sm text-muted-foreground text-center mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">
              {t('login')}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}