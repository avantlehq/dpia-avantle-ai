/**
 * Processing Activity Not Found Page
 *
 * Displayed when a processing activity with the specified ID cannot be found.
 */

import Link from 'next/link'
import { FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ProcessingActivityNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center space-y-4">
        <FileQuestion className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
        <h1 className="text-2xl font-semibold">Processing Activity Not Found</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          The processing activity you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <div className="pt-4">
          <Link href="/context/processing">
            <Button variant="primary">
              Return to Processing Activities
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
