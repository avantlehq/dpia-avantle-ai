"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CTA() {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <blockquote className="text-2xl md:text-3xl font-medium mb-8 italic">
          &quot;Everyone should have their own AI assistant. Encrypted. Local. Yours.&quot;
        </blockquote>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="https://dpia.avantle.ai"
            aria-label="Launch DPIA Agent - Start automated GDPR compliance"
          >
            <Button size="lg" className="text-lg px-8 py-6 w-full">
              Launch DPIA Agent
            </Button>
          </Link>
          <Link 
            href="/manifesto"
            aria-label="Read the Manifesto - Learn about our privacy-first philosophy"
          >
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 w-full">
              Read the Manifesto
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}