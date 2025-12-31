import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Target
} from 'lucide-react'
import Link from 'next/link'
import { PrivacyOverviewClient } from '@/components/privacy/privacy-overview-client'

// Server component that renders client component with translations
export default function PrivacyOverview() {
  return <PrivacyOverviewClient />
}