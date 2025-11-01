"use client"

import { Card } from "@/components/ui/card"

export function Stack() {
  return (
    <section className="py-16 px-4 bg-muted/50">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">
              Avantle.ai Architecture
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <div className="font-semibold">Your Device</div>
                  <div className="text-sm text-muted-foreground">All processing happens locally on your hardware</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <div className="font-semibold">AvantleCore Runtime</div>
                  <div className="text-sm text-muted-foreground">One core that powers infinite local agents</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <div className="font-semibold">Private Agents</div>
                  <div className="text-sm text-muted-foreground">Specialized AI modules for notes, GDPR, and more</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <div className="font-semibold">End-to-End Encryption</div>
                  <div className="text-sm text-muted-foreground">AES-256 with zero-knowledge architecture</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <div className="font-semibold">GDPR Compliant</div>
                  <div className="text-sm text-muted-foreground">Built for European privacy standards</div>
                </div>
              </div>
            </div>
          </div>
          
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">System Diagram</h3>
              <div className="bg-muted rounded-lg p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-background rounded border">
                    <span className="text-sm font-mono">Your Device</span>
                    <span className="text-xs text-green-500">●</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-px h-6 bg-border"></div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background rounded border">
                    <span className="text-sm font-mono">AvantleCore Runtime</span>
                    <span className="text-xs text-green-500">●</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-px h-6 bg-border"></div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background rounded border">
                    <span className="text-sm font-mono">Private Agents</span>
                    <span className="text-xs text-green-500">●</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}