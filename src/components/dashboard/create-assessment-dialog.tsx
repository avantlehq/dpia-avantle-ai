'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createAssessmentAction } from '@/lib/actions/assessment-actions'

export function CreateAssessmentDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) return

    setIsLoading(true)
    
    try {
      const result = await createAssessmentAction(name.trim(), description.trim() || undefined)
      
      if (result.success && result.assessmentId) {
        console.log('Assessment created successfully:', result.assessmentId)
        setOpen(false)
        setName('')
        setDescription('')
        console.log('Navigating to:', `/assessments/${result.assessmentId}`)
        router.push(`/assessments/${result.assessmentId}`)
      } else {
        console.error('Assessment creation failed:', result)
        alert(`Failed to create assessment: ${result.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error creating assessment:', error)
      alert(`Error creating assessment: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="avantle-glow">
          <Plus className="mr-2 h-4 w-4" />
          New Assessment
        </Button>
      </DialogTrigger>
      <DialogContent className="avantle-border bg-card border-l-4 border-l-dpia-blue shadow-xl max-w-xl w-full mx-4 sm:mx-auto p-6">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-foreground text-xl font-semibold">Create New Assessment</DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Start a new GDPR Data Protection Impact Assessment for your data processing activities.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-foreground">
                Assessment Name *
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Customer CRM System, Employee Management Platform"
                className="avantle-border bg-background text-base py-2 px-3"
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-foreground">
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the data processing activity, systems involved, and purpose..."
                className="avantle-border bg-background text-base py-2 px-3 min-h-[80px]"
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter className="flex gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
              className="avantle-border px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || isLoading}
              className="avantle-glow px-6 bg-dpia-blue hover:bg-dpia-blue/90"
              style={{ color: 'var(--color-blue)' }}
            >
              {isLoading ? 'Creating...' : 'Create DPIA Assessment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}