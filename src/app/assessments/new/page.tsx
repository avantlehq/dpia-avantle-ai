'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, FileText, Plus } from 'lucide-react'
import Link from 'next/link'
import { createAssessmentAction } from '@/lib/actions/assessment-actions'
import { toast } from 'sonner'

export default function NewAssessmentPage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      toast.error('Assessment name is required')
      return
    }

    setIsLoading(true)
    
    try {
      const result = await createAssessmentAction(name.trim(), description.trim() || undefined)
      
      if (result.success && result.assessmentId) {
        console.log('Assessment created with ID:', result.assessmentId)
        console.log('Navigating to:', `/assessments/${result.assessmentId}`)
        toast.success('Assessment created successfully!')
        router.push(`/assessment?id=${result.assessmentId}`)
      } else {
        toast.error(`Failed to create assessment: ${result.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error creating assessment:', error)
      toast.error(`Error creating assessment: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-dpia-orange" style={{ color: 'var(--color-orange)' }} />
              <h1 className="text-xl font-semibold">Create New Assessment</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-icon-orange mb-4">
            <Plus className="h-8 w-8" style={{ color: 'var(--color-orange)' }} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Start Your GDPR Assessment</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Create a new Data Protection Impact Assessment to ensure GDPR compliance for your data processing activities.
          </p>
        </div>

        <Card className="avantle-border bg-card border-l-4 border-l-dpia-orange shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-dpia-orange" style={{ color: 'var(--color-orange)' }} />
              Assessment Details
            </CardTitle>
            <CardDescription>
              Provide basic information about the data processing activity you want to assess.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Assessment Name *
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Customer CRM System, Employee Management Platform, Marketing Analytics"
                  className="avantle-border bg-background"
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  Choose a clear, descriptive name for your data processing activity.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description (Optional)
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the data processing activity, systems involved, purpose, and scope..."
                  className="avantle-border bg-background min-h-[120px]"
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  Provide additional context about the processing activity, data types, and business purpose.
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  What happens next?
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>Step 1:</strong> Context & Scope - Define processing details</li>
                  <li>• <strong>Step 2:</strong> Data Flow Analysis - Map data movement</li>
                  <li>• <strong>Step 3:</strong> Risk Assessment - Identify and evaluate risks</li>
                  <li>• <strong>Step 4:</strong> Mitigation Measures - Plan protective controls</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <Link href="/dashboard" className="flex-1">
                  <Button 
                    type="button"
                    variant="outline" 
                    className="w-full avantle-border"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={!name.trim() || isLoading}
                  className="flex-1 bg-dpia-orange hover:bg-dpia-orange/90 text-white"
                >
                  {isLoading ? 'Creating Assessment...' : 'Start DPIA Assessment'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Need help? Learn more about{' '}
            <Link href="/precheck" className="text-dpia-orange hover:underline">
              when a DPIA is required
            </Link>{' '}
            or check our{' '}
            <Link href="/help" className="text-dpia-orange hover:underline">
              assessment guide
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}