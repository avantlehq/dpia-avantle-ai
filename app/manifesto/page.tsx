import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ManifestoPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">The Avantle Manifesto</h1>
            <p className="text-xl text-muted-foreground">
              Privacy by Design.
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Our Vision</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none">
              <p className="text-muted-foreground mb-4">
                We believe every human deserves an AI assistant that serves them without compromise. 
                Today&apos;s AI systems require you to surrender your data to external corporations, 
                creating privacy risks and vendor dependencies that shouldn&apos;t exist.
              </p>
              <p className="text-muted-foreground mb-4">
                Avantle.ai is building the infrastructure for truly private AI — agents that run locally, 
                learn from your data without exposing it, and remain under your complete control. 
                No cloud dependencies. No data mining. No surveillance capitalism.
              </p>
              <p className="text-muted-foreground">
                By 2030, we envision a world where every person carries an encrypted AI brain — 
                an assistant that learns privately, serves loyally, and never phones home.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}