import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  HelpCircle, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  BookOpen,
  Users,
  Shield,
  Clock
} from 'lucide-react'

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
              <HelpCircle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Assessment Help & Guidance</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Complete guide to creating and managing GDPR Data Protection Impact Assessments
          </p>
        </div>

        {/* Quick Start Guide */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <CardTitle className="text-green-700">Quick Start Guide</CardTitle>
            </div>
            <CardDescription>
              Follow these steps to create your first DPIA assessment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-start gap-4">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">1</Badge>
                <div>
                  <h4 className="font-semibold">Start with Pre-check Assessment</h4>
                  <p className="text-muted-foreground">Complete the 8-question pre-check to determine if a full DPIA is required for your data processing activity.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">2</Badge>
                <div>
                  <h4 className="font-semibold">Create New Assessment</h4>
                  <p className="text-muted-foreground">If DPIA is required, create a new assessment with a descriptive name and clear project description.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">3</Badge>
                <div>
                  <h4 className="font-semibold">Complete Assessment Sections</h4>
                  <p className="text-muted-foreground">Work through the 4-section wizard: Context & Scope, Data Flow, Risk Assessment, and Mitigation Measures.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">4</Badge>
                <div>
                  <h4 className="font-semibold">Review & Export</h4>
                  <p className="text-muted-foreground">Review your completed assessment and export to PDF or DOCX format for compliance documentation.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assessment Sections Guide */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-blue-600" />
              <CardTitle>Assessment Sections Explained</CardTitle>
            </div>
            <CardDescription>
              Understanding what information is required in each section
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="space-y-4">
              <div className="border-l-4 border-l-blue-500 pl-4">
                <h4 className="font-semibold text-blue-700">Section 1: Context & Scope</h4>
                <p className="text-muted-foreground mt-1">
                  Define the purpose, legal basis, and scope of your data processing activities. 
                  Include details about the processing purpose, data subjects involved, and organizational context.
                </p>
                <div className="mt-2">
                  <Badge variant="secondary" className="mr-2">Processing Purpose</Badge>
                  <Badge variant="secondary" className="mr-2">Legal Basis</Badge>
                  <Badge variant="secondary">Data Controller Details</Badge>
                </div>
              </div>

              <div className="border-l-4 border-l-green-500 pl-4">
                <h4 className="font-semibold text-green-700">Section 2: Data Flow Analysis</h4>
                <p className="text-muted-foreground mt-1">
                  Map how personal data flows through your systems and processes. 
                  Document data sources, processing activities, storage locations, and data sharing arrangements.
                </p>
                <div className="mt-2">
                  <Badge variant="secondary" className="mr-2">Data Categories</Badge>
                  <Badge variant="secondary" className="mr-2">Processing Activities</Badge>
                  <Badge variant="secondary">Third-Party Transfers</Badge>
                </div>
              </div>

              <div className="border-l-4 border-l-orange-500 pl-4">
                <h4 className="font-semibold text-orange-700">Section 3: Risk Assessment</h4>
                <p className="text-muted-foreground mt-1">
                  Identify and evaluate privacy risks to data subjects. 
                  Assess likelihood and impact of potential data protection issues and privacy violations.
                </p>
                <div className="mt-2">
                  <Badge variant="secondary" className="mr-2">Risk Identification</Badge>
                  <Badge variant="secondary" className="mr-2">Likelihood Assessment</Badge>
                  <Badge variant="secondary">Impact Analysis</Badge>
                </div>
              </div>

              <div className="border-l-4 border-l-red-500 pl-4">
                <h4 className="font-semibold text-red-700">Section 4: Mitigation Measures</h4>
                <p className="text-muted-foreground mt-1">
                  Define specific measures to address identified risks and ensure GDPR compliance. 
                  Include technical and organizational measures, monitoring procedures, and review schedules.
                </p>
                <div className="mt-2">
                  <Badge variant="secondary" className="mr-2">Technical Safeguards</Badge>
                  <Badge variant="secondary" className="mr-2">Organizational Measures</Badge>
                  <Badge variant="secondary">Monitoring Plans</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Best Practices */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-green-600" />
                <CardTitle className="text-green-700">Best Practices</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm">Always involve your Data Protection Officer (DPO) or legal team in the assessment process</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm">Document all data processing activities comprehensively and accurately</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm">Regular review and update assessments when processing activities change</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm">Engage with data subjects and stakeholders during the assessment process</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm">Keep detailed records of decision-making rationale and risk evaluations</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
                <CardTitle className="text-orange-700">Common Issues to Avoid</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm">Don't rush through risk assessment - take time to identify all potential privacy impacts</p>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm">Avoid generic or template responses - each assessment should be specific to your processing</p>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm">Don't forget to consider data subject rights and how they will be implemented</p>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm">Ensure mitigation measures are practical and actually implementable</p>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm">Don't ignore international data transfers and cross-border compliance requirements</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Resources */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-purple-600" />
              <CardTitle>Additional Resources</CardTitle>
            </div>
            <CardDescription>
              Links and references for comprehensive GDPR compliance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Official Guidelines</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• GDPR Article 35 Guidelines</li>
                  <li>• EDPB DPIA Guidelines</li>
                  <li>• National DPA Guidance</li>
                  <li>• ICO DPIA Framework</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Templates & Tools</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• DPIA Template Library</li>
                  <li>• Risk Assessment Tools</li>
                  <li>• Legal Basis Assessment</li>
                  <li>• Data Mapping Templates</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Training Materials</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• GDPR Fundamentals Course</li>
                  <li>• DPIA Best Practices</li>
                  <li>• Risk Management Training</li>
                  <li>• Legal Updates & Changes</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-blue-600" />
              <CardTitle className="text-blue-700">Need Additional Support?</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If you need additional guidance or have specific questions about your DPIA assessment, 
              our compliance experts are available to help.
            </p>
            <div className="flex flex-wrap gap-4">
              <Badge variant="outline" className="text-blue-700 border-blue-200">
                <Clock className="h-4 w-4 mr-1" />
                24/7 Support Available
              </Badge>
              <Badge variant="outline" className="text-green-700 border-green-200">
                <Shield className="h-4 w-4 mr-1" />
                GDPR Experts
              </Badge>
              <Badge variant="outline" className="text-purple-700 border-purple-200">
                <BookOpen className="h-4 w-4 mr-1" />
                Compliance Training
              </Badge>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}