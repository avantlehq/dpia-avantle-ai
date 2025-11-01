"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Hero() {
  return (
    <section className="hero-gradient py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            <span className="text-primary">Privacy by Design.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Build the operating system for private AI — one core that powers infinite local agents.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="https://notes.avantle.ai">
              <Button size="lg" className="text-lg px-8 py-6 w-full">Launch Notes.Avantle.ai</Button>
            </Link>
            <Link href="/manifesto">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 w-full">Read the Manifesto</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}