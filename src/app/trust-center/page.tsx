import React from 'react'
import { CheckCircle, FileText, Shield, BarChart3, Download, Eye, Calendar, Award } from 'lucide-react'

// Trust Center Module Test Page
export default function TrustCenterPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <div 
            className="p-2 rounded-lg" 
            style={{ backgroundColor: 'rgba(169, 169, 169, 0.15)' }}
          >
            <CheckCircle 
              className="h-6 w-6" 
              style={{ color: 'var(--color-gray)' }} 
            />
          </div>
          Trust Center
        </h1>
        <p className="text-muted-foreground text-lg">
          Audit packages and compliance reporting for stakeholders
        </p>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 dark:text-green-400">Compliance Score</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">92%</p>
            </div>
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-800/50">
              <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400">Audit Reports</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">8</p>
            </div>
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-800/50">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 dark:text-purple-400">Certifications</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">3</p>
            </div>
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-800/50">
              <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 dark:text-orange-400">Last Updated</p>
              <p className="text-lg font-bold text-orange-700 dark:text-orange-300">Dec 2025</p>
            </div>
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-800/50">
              <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Audit Packages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* GDPR Compliance Package */}
        <div className="p-6 rounded-lg border border-border bg-card backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold">GDPR Compliance Package</h3>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Complete GDPR compliance documentation and evidence
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Data Protection Impact Assessments</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Record of Processing Activities</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Privacy Policies & Notices</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Data Processing Agreements</span>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                <Download className="h-4 w-4" />
                Download
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 border border-border text-sm rounded-md hover:bg-muted/50">
                <Eye className="h-4 w-4" />
                Preview
              </button>
            </div>
          </div>
        </div>

        {/* Security Audit Package */}
        <div className="p-6 rounded-lg border border-border bg-card backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
              <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold">Security Audit Package</h3>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Comprehensive security controls and risk assessments
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Risk Assessment Reports</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Security Control Matrix</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Vulnerability Assessments</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Penetration Test Results</span>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700">
                <Download className="h-4 w-4" />
                Download
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 border border-border text-sm rounded-md hover:bg-muted/50">
                <Eye className="h-4 w-4" />
                Preview
              </button>
            </div>
          </div>
        </div>

        {/* ISO 27001 Package */}
        <div className="p-6 rounded-lg border border-border bg-card backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold">ISO 27001 Package</h3>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Information security management system documentation
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Information Security Policy</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Risk Treatment Plan</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Statement of Applicability</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Management Review Reports</span>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700">
                <Download className="h-4 w-4" />
                Download
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 border border-border text-sm rounded-md hover:bg-muted/50">
                <Eye className="h-4 w-4" />
                Preview
              </button>
            </div>
          </div>
        </div>

        {/* SOC 2 Package */}
        <div className="p-6 rounded-lg border border-border bg-card backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <BarChart3 className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold">SOC 2 Package</h3>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Service organization control reports and documentation
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>SOC 2 Type II Report</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Control Environment Documentation</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Trust Services Criteria</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Audit Evidence</span>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700">
                <Download className="h-4 w-4" />
                Download
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 border border-border text-sm rounded-md hover:bg-muted/50">
                <Eye className="h-4 w-4" />
                Preview
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="p-6 rounded-lg border border-border bg-card backdrop-blur-sm shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="font-medium">GDPR Compliance Package updated</div>
                <div className="text-sm text-muted-foreground">Added Q4 DPIA assessments</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">2 hours ago</div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Download className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="font-medium">Security Audit Package downloaded</div>
                <div className="text-sm text-muted-foreground">Downloaded by compliance team</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">1 day ago</div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30">
                <Award className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="font-medium">ISO 27001 certification renewed</div>
                <div className="text-sm text-muted-foreground">Valid until December 2026</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">3 days ago</div>
          </div>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="text-center py-8">
        <p className="text-muted-foreground text-sm">
          Trust Center module is coming soon. This is a test page to ensure navigation works properly.
        </p>
      </div>
    </div>
  )
}