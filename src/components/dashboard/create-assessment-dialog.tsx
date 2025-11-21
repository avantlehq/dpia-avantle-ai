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
        setOpen(false)
        setName('')
        setDescription('')
        router.push(`/en/${result.assessmentId}`)
      }
    } catch (error) {
      console.error('Error creating assessment:', error)
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
      <DialogContent className="avantle-border bg-card/95 backdrop-blur-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-foreground">Create New Assessment</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Start a new DPIA assessment for your data processing activities.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-foreground">
                Assessment Name *
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Customer CRM System"
                className="avantle-border bg-background/50"
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
                placeholder="Brief description of the data processing activity..."
                className="avantle-border bg-background/50"
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
              className="avantle-border"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || isLoading}
              className="avantle-glow"
            >
              {isLoading ? 'Creating...' : 'Create Assessment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}