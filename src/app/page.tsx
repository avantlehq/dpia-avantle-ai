import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, CheckCircle, FileText, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            GDPR Compliance Tool
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            DPIA Suite
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Professional Data Protection Impact Assessment platform. Evaluate privacy risks, 
            ensure GDPR compliance, and generate comprehensive DPIA documentation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/precheck">
                <CheckCircle className="mr-2 h-5 w-5" />
                Do I Need a DPIA?
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/dashboard">
                Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <CardTitle>Quick Assessment</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                8-question smart evaluation to determine if your project requires a full DPIA 
                under GDPR Article 35.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-blue-500" />
                <CardTitle>Risk Scoring</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Advanced risk engine calculating likelihood × impact scores with specific 
                mitigation recommendations.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-purple-500" />
                <CardTitle>Professional Reports</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Generate comprehensive DPIA documents in PDF and DOCX formats ready 
                for regulatory submission.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Start?</CardTitle>
              <CardDescription>
                Begin with our quick assessment or dive directly into a full DPIA evaluation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Button className="w-full" asChild>
                  <Link href="/precheck">
                    Start Quick Assessment
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/dashboard">
                    Go to Dashboard
                  </Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Professional GDPR compliance tools for modern organizations
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
