'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '../../../../../i18n/routing'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Plus } from 'lucide-react'
import { Link } from '../../../../../i18n/routing'
import { toast } from 'sonner'

export default function NewAssessmentPage() {
  const t = useTranslations('dashboard')
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      toast.error('Assessment name is required')
      return
    }

    setLoading(true)
    
    try {
      // TODO: Create assessment via API  
      toast.success('Assessment created successfully')
      router.push('/dashboard')
    } catch (error) {
      toast.error('Failed to create assessment')
      console.error('Failed to create assessment:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{t('newAssessment')}</h1>
          <p className="text-muted-foreground mt-2">
            Create a new DPIA assessment for your data processing activities
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Assessment Details</CardTitle>
            <CardDescription>
              Provide basic information about your DPIA assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Assessment Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Employee Data Processing, Customer CRM System"
                  disabled={loading}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the data processing activity..."
                  disabled={loading}
                  rows={3}
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={loading}>
                  <Plus className="mr-2 h-4 w-4" />
                  {loading ? 'Creating...' : t('create')}
                </Button>
                <Link href="/dashboard">
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}