import React from 'react'
import { 
  Database,
  Server, 
  FileText, 
  Folder, 
  ArrowRight, 
  Users, 
  Globe,
  Plus,
  TrendingUp,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default function ContextOverviewPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Context Overview</h1>
        <p className="text-muted-foreground text-lg">
          Foundation data and processing context for privacy compliance
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Systems</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-600">+2</span> since last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Processing Activities</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-600">+7</span> documented this quarter
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Data Categories</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">
              Across all processing activities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Vendors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-orange-600">3</span> pending review
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Common tasks for managing foundation data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/context/systems">
              <Button variant="outline" className="w-full justify-start h-auto p-4">
                <div className="flex items-start gap-3">
                  <Server className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="text-left">
                    <div className="font-medium">Register New System</div>
                    <div className="text-sm text-muted-foreground">Add IT system or service</div>
                  </div>
                </div>
              </Button>
            </Link>

            <Link href="/context/processing">
              <Button variant="outline" className="w-full justify-start h-auto p-4">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="text-left">
                    <div className="font-medium">Document Processing</div>
                    <div className="text-sm text-muted-foreground">Create ROPA entry</div>
                  </div>
                </div>
              </Button>
            </Link>

            <Link href="/context/vendors">
              <Button variant="outline" className="w-full justify-start h-auto p-4">
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="text-left">
                    <div className="font-medium">Add Vendor</div>
                    <div className="text-sm text-muted-foreground">Register data processor</div>
                  </div>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity & Data Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest changes to foundation data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="text-sm font-medium">Customer CRM System updated</div>
                <div className="text-xs text-muted-foreground">Data categories and retention updated • 2 hours ago</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="text-sm font-medium">New processor agreement</div>
                <div className="text-xs text-muted-foreground">CloudStorage Inc. DPA signed • 1 day ago</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="text-sm font-medium">Processing activity review</div>
                <div className="text-xs text-muted-foreground">HR-001 Employee Management • 3 days ago</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Data Health
            </CardTitle>
            <CardDescription>Foundation data completeness and quality</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Systems Documentation</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                100%
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Processing Activities</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                92%
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                <span className="text-sm">Data Flows</span>
              </div>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                78%
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm">Vendor Agreements</span>
              </div>
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                64%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Foundation Data Components</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/context/systems">
            <Card className="transition-colors hover:bg-muted/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Server className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Systems</CardTitle>
                </div>
                <CardDescription>
                  IT systems and infrastructure registry
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">12</div>
                <p className="text-sm text-muted-foreground">Active systems</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/context/processing">
            <Card className="transition-colors hover:bg-muted/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">Processing Activities</CardTitle>
                </div>
                <CardDescription>
                  Record of Processing Activities (ROPA)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">45</div>
                <p className="text-sm text-muted-foreground">Documented activities</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/context/data-categories">
            <Card className="transition-colors hover:bg-muted/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Folder className="h-5 w-5 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">Data Categories</CardTitle>
                </div>
                <CardDescription>
                  Personal data classification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">28</div>
                <p className="text-sm text-muted-foreground">Defined categories</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/context/data-flows">
            <Card className="transition-colors hover:bg-muted/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <ArrowRight className="h-5 w-5 text-orange-600" />
                  </div>
                  <CardTitle className="text-lg">Data Flows</CardTitle>
                </div>
                <CardDescription>
                  Data movement and transfers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">35</div>
                <p className="text-sm text-muted-foreground">Mapped flows</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/context/vendors">
            <Card className="transition-colors hover:bg-muted/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Users className="h-5 w-5 text-indigo-600" />
                  </div>
                  <CardTitle className="text-lg">Vendors</CardTitle>
                </div>
                <CardDescription>
                  Third-party data processors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-indigo-600">18</div>
                <p className="text-sm text-muted-foreground">Registered vendors</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/context/locations">
            <Card className="transition-colors hover:bg-muted/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <Globe className="h-5 w-5 text-teal-600" />
                  </div>
                  <CardTitle className="text-lg">Locations</CardTitle>
                </div>
                <CardDescription>
                  Geographic data locations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-teal-600">8</div>
                <p className="text-sm text-muted-foreground">Jurisdictions</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}