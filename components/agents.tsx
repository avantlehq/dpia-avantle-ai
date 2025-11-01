"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Shield, BarChart3, Plane } from "lucide-react"
import Link from "next/link"

const agents = [
  {
    icon: Brain,
    title: "notes.avantle.ai",
    description: "Encrypted Zettelkasten with AI memory → Search your mind without Google",
    href: "https://notes.avantle.ai"
  },
  {
    icon: Shield,
    title: "dpia.avantle.ai",
    description: "Automated DPIA, RoPA, DSAR → GDPR compliance, zero exposure",
    href: "#"
  }
]

export function Agents() {
  return (
    <section className="py-16 px-4 bg-muted/50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Agents that Respect You</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Each Avantle Agent is a self-contained, local-first AI module.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {agents.map((agent, index) => (
            <Card key={index} className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <agent.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{agent.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-base">
                  {agent.description}
                </CardDescription>
                <Link 
                  href={agent.href}
                  aria-label={`Open ${agent.title}`}
                >
                  <Button variant="outline" className="w-full">
                    Open
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}