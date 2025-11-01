import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { Problem } from "@/components/problem"
import { Stack } from "@/components/stack"
import { MissionVision } from "@/components/mission-vision"
import { Agents } from "@/components/agents"
import { SiteFooter } from "@/components/site-footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <Hero />
        <Problem />
        <Stack />
        <MissionVision />
        <Agents />
      </main>
      <SiteFooter />
    </div>
  )
}