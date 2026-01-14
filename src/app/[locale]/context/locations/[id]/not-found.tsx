/**
 * Location Not Found Page
 *
 * Displayed when a location ID doesn't exist.
 */

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LocationNotFound() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="text-center py-12">
        <h1 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Location Not Found
        </h1>
        <p className="text-muted-foreground mb-6">
          The location you're looking for doesn't exist or has been deleted.
        </p>
        <Link href="/en/context/locations">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Locations List
          </Button>
        </Link>
      </div>
    </div>
  )
}
