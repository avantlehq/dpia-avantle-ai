import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen avantle-gradient flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Page Not Found</CardTitle>
          <CardDescription>
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-4xl sm:text-6xl font-bold text-gray-300 mb-4">404</div>
          </div>
          
          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go to Homepage
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link href="/precheck">
                <ArrowLeft className="mr-2 h-4 w-4" />
                DPIA Pre-check
              </Link>
            </Button>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>Available pages:</p>
            <ul className="mt-2 space-y-1">
              <li>• <Link href="/" className="text-primary hover:underline">Homepage</Link></li>
              <li>• <Link href="/precheck" className="text-primary hover:underline">DPIA Pre-check</Link></li>
              <li>• <Link href="/dashboard" className="text-primary hover:underline">Dashboard</Link></li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}