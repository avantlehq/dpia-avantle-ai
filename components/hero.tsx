"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Hero() {
  return (
    <section className="hero-gradient py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Platform for <span className="text-primary">Secure AI Agents</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Privacy by Design. One core that powers infinite local agents.
          </p>
          
          <div className="flex justify-center">
            <Link href="https://dpia.avantle.ai">
              <Button size="lg" className="text-lg px-8 py-6">Launch DPIA Agent</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}