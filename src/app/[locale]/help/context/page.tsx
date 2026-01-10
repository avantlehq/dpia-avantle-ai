'use client'

import React from 'react'
import Link from 'next/link'
import { 
  ArrowLeft,
  Database,
  Users,
  MapPin,
  Network,
  FileText,
  CheckCircle,
  AlertTriangle,
  Shield,
  Globe,
  Building,
  Scale,
  Target,
  Workflow
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function ContextModuleHelpPage({ params }: Props) {
  const { locale } = await params
  
  const contextPages = [
    {
      icon: <Database className="h-5 w-5 text-blue-500" />,
      title: 'IT Systems',
      description: 'Track IT infrastructure, data processing systems, and technical components',
      url: '/context/systems',
      features: ['Active/Inactive status tracking', 'Criticality assessment', 'Owner assignment', 'Technical contacts']
    },
    {
      icon: <FileText className="h-5 w-5 text-green-500" />,
      title: 'Processing Activities',
      description: 'GDPR Article 30 Record of Processing Activities (ROPA) management',
      url: '/context/processing',
      features: ['Lawful basis documentation', 'DPO review tracking', 'Review date monitoring', 'Purpose specification']
    },
    {
      icon: <Building className="h-5 w-5 text-purple-500" />,
      title: 'Vendors & Processors',
      description: 'Third-party processor management and DPA tracking',
      url: '/context/vendors',
      features: ['Processor role classification', 'DPA expiration tracking', 'Contact management', 'Location tracking']
    },
    {
      icon: <Network className="h-5 w-5 text-orange-500" />,
      title: 'Data Flows',
      description: 'Map data movement across systems, vendors, and jurisdictions',
      url: '/context/data-flows',
      features: ['Flow direction tracking', 'Cross-border identification', 'Encryption monitoring', 'Criticality assessment']
    },
    {
      icon: <MapPin className="h-5 w-5 text-cyan-500" />,
      title: 'Locations & Jurisdictions',
      description: 'Geographic data processing locations and adequacy decisions',
      url: '/context/locations',
      features: ['Adequacy status tracking', 'Safeguards requirements', 'Data localization rules', 'EU/Third country classification']
    }
  ]

  const statusExplanations = [
    {
      status: 'Active',
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      description: 'Currently operational and processing data'
    },
    {
      status: 'Critical',
      color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      description: 'High-risk items requiring immediate attention'
    },
    {
      status: 'Review Required',
      color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      description: 'Items needing review or DPO assessment'
    },
    {
      status: 'Inactive',
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      description: 'Not currently in use or decommissioned'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link 
            href={`/${locale}/help`}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Help
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-3 flex items-center gap-3">
          <Database className="h-8 w-8 text-blue-500" />
          Context Module Guide
        </h1>
        <p className="text-muted-foreground text-lg max-w-3xl">
          The Context module provides comprehensive data mapping and infrastructure management 
          for GDPR compliance. It helps you understand where your data lives, how it flows, 
          and who has access to it across your entire organization.
        </p>
      </div>

      {/* Overview */}
      <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-foreground">
            <Target className="h-5 w-5 text-blue-500" />
            Context Module Purpose
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            <strong>Context</strong> represents 25% of your compliance score and serves as the foundation 
            for all other privacy assessments. It provides the essential infrastructure mapping required 
            for GDPR Article 30 compliance and data protection impact assessments.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-foreground mb-2">Key Benefits:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Complete data infrastructure visibility</li>
                <li>• GDPR Article 30 ROPA compliance</li>
                <li>• Risk assessment foundation</li>
                <li>• Vendor relationship management</li>
                <li>• Cross-border transfer tracking</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Compliance Framework:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Data mapping requirements (Art. 30)</li>
                <li>• International transfer rules (Ch. V)</li>
                <li>• Processor agreements (Art. 28)</li>
                <li>• Adequacy decision tracking</li>
                <li>• Lawful basis documentation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Module Pages */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
          <Workflow className="h-6 w-6 text-blue-500" />
          Context Module Pages
        </h2>
        
        <div className="grid gap-6">
          {contextPages.map((page, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="flex items-center gap-3 text-foreground">
                    {page.icon}
                    {page.title}
                  </CardTitle>
                  <Link href={`/${locale}${page.url}`}>
                    <Button variant="outline" size="sm">
                      Open Page
                    </Button>
                  </Link>
                </div>
                <p className="text-muted-foreground">{page.description}</p>
              </CardHeader>
              <CardContent>
                <h4 className="font-medium text-foreground mb-3">Key Features:</h4>
                <div className="grid md:grid-cols-2 gap-2">
                  {page.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Status System */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
          <Shield className="h-6 w-6 text-green-500" />
          Status Tracking System
        </h2>
        
        <Card>
          <CardHeader>
            <CardTitle>Universal Status Pills</CardTitle>
            <p className="text-muted-foreground">
              All Context module pages use consistent status indicators for quick overview and risk assessment.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {statusExplanations.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <Badge className={item.color}>
                    {item.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{item.description}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflow */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
          <Workflow className="h-6 w-6 text-purple-500" />
          Implementation Workflow
        </h2>
        
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-blue-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm font-bold">1</span>
                Start with IT Systems
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">
                Begin by cataloging all IT systems that process personal data. This forms the foundation for all other mappings.
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Add all applications, databases, and services</li>
                <li>• Classify criticality levels (low, medium, high, critical)</li>
                <li>• Assign system owners and technical contacts</li>
                <li>• Document system purposes and descriptions</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-green-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm font-bold">2</span>
                Document Processing Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">
                Create your GDPR Article 30 Record of Processing Activities (ROPA) by linking business processes to systems.
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Define processing purposes and lawful basis</li>
                <li>• Specify data subject categories</li>
                <li>• Set review dates and DPO requirements</li>
                <li>• Link to relevant IT systems</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-purple-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm font-bold">3</span>
                Register Vendors & Processors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">
                Maintain a registry of all third-party processors and vendors with access to personal data.
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Classify vendor roles (processor, joint controller, etc.)</li>
                <li>• Track DPA agreements and expiration dates</li>
                <li>• Monitor vendor locations and contact details</li>
                <li>• Document data processing agreements</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-orange-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm font-bold">4</span>
                Map Data Flows
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">
                Track how personal data moves between systems, vendors, and jurisdictions.
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Document data flow directions and endpoints</li>
                <li>• Identify cross-border transfers</li>
                <li>• Verify encryption in transit</li>
                <li>• Assess flow criticality and volume</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-cyan-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm font-bold">5</span>
                Define Locations & Jurisdictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">
                Establish geographic context for data processing locations and adequacy decisions.
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Classify EU/EEA vs. third countries</li>
                <li>• Track adequacy decision status</li>
                <li>• Document required safeguards</li>
                <li>• Monitor data localization requirements</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Best Practices */}
      <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-foreground">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-foreground mb-3">Data Quality:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Keep information current and accurate</li>
                <li>• Set regular review cycles for all data</li>
                <li>• Validate cross-references between modules</li>
                <li>• Use consistent naming conventions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-3">Compliance:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Maintain complete ROPA documentation</li>
                <li>• Monitor DPA expiration dates</li>
                <li>• Track adequacy decision changes</li>
                <li>• Document all international transfers</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Common Issues */}
      <Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-950/20 dark:border-orange-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-foreground">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Common Issues & Solutions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Missing DPA Agreements
              </h4>
              <p className="text-sm text-muted-foreground">
                <strong>Solution:</strong> Review vendor list regularly, prioritize processors with access to sensitive data, 
                establish DPA templates for common vendor types.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                Incomplete Data Flow Mapping
              </h4>
              <p className="text-sm text-muted-foreground">
                <strong>Solution:</strong> Start with high-risk/high-volume flows first, involve IT teams in discovery, 
                use network diagrams and existing documentation as reference.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Outdated Processing Activities
              </h4>
              <p className="text-sm text-muted-foreground">
                <strong>Solution:</strong> Set quarterly review schedules, involve data protection officers in reviews, 
                link business process changes to ROPA updates.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Access Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href={`/${locale}/context`} className="block">
              <Button variant="outline" className="w-full justify-start">
                <Database className="h-4 w-4 mr-2" />
                Context Overview
              </Button>
            </Link>
            <Link href={`/${locale}/context/systems`} className="block">
              <Button variant="outline" className="w-full justify-start">
                <Database className="h-4 w-4 mr-2" />
                IT Systems
              </Button>
            </Link>
            <Link href={`/${locale}/context/processing`} className="block">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Processing Activities
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}