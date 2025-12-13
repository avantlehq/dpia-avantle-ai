import { jsPDF } from 'jspdf'
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx'
import type { Database } from '@/lib/supabase/database.types'
import { DatabaseService } from './database'
import dpiaTemplate from '@/lib/templates/dpia-basic-eu-v1.json'

type Assessment = Database['public']['Tables']['assessments']['Row']

interface ExportData {
  assessment: Assessment
  answers: Record<string, Record<string, unknown>>
  template: typeof dpiaTemplate
  metadata: {
    exportedAt: string
    exportedBy?: string
    version: string
  }
}

export interface ExportRequest {
  assessment_id: string
  format: 'pdf' | 'docx'
}

export interface ExportResult {
  id: string
  url: string
  expires_at: string
}

export class RealExportService {
  private db: DatabaseService

  constructor(db: DatabaseService) {
    this.db = db
  }

  static async create() {
    const db = await DatabaseService.create()
    return new RealExportService(db)
  }

  async generate(request: ExportRequest): Promise<ExportResult> {
    const fileId = `assessment-${request.assessment_id}-${Date.now()}`
    const fileName = `dpia-assessment.${request.format}`
    
    let fileBuffer: Uint8Array

    if (request.format === 'pdf') {
      fileBuffer = await this.generatePDF(request.assessment_id)
    } else if (request.format === 'docx') {
      fileBuffer = await this.generateDOCX(request.assessment_id)
    } else {
      throw new Error('Unsupported export format')
    }

    // For now, create a blob URL (in production this would upload to Supabase Storage)
    const _blob = new Blob([fileBuffer as BlobPart], {
      type: request.format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    })
    
    const url = `/api/export/download/${fileId}/${fileName}`
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Log the export
    await this.logExport(request.assessment_id, request.format, url)

    return {
      id: fileId,
      url,
      expires_at: expiresAt.toISOString()
    }
  }

  async generatePDF(assessmentId: string): Promise<Uint8Array> {
    const exportData = await this.prepareExportData(assessmentId)
    
    const doc = new jsPDF()
    let yPosition = 20
    const lineHeight = 7
    const pageHeight = doc.internal.pageSize.height
    const margin = 20

    // Helper function to add text with automatic page breaks
    const addText = (text: string, fontSize = 11, isBold = false) => {
      if (yPosition > pageHeight - margin) {
        doc.addPage()
        yPosition = margin
      }
      
      doc.setFontSize(fontSize)
      if (isBold) {
        doc.setFont('helvetica', 'bold')
      } else {
        doc.setFont('helvetica', 'normal')
      }
      
      const splitText = doc.splitTextToSize(text, doc.internal.pageSize.width - 2 * margin)
      doc.text(splitText, margin, yPosition)
      yPosition += splitText.length * lineHeight
    }

    // Document header
    addText('DATA PROTECTION IMPACT ASSESSMENT (DPIA)', 16, true)
    yPosition += 10
    addText(`Assessment: ${exportData.assessment.name}`, 14, true)
    yPosition += 5
    addText(`Generated: ${new Date(exportData.metadata.exportedAt).toLocaleString()}`, 10)
    addText(`Version: ${exportData.metadata.version}`, 10)
    yPosition += 15

    // Executive summary
    addText('EXECUTIVE SUMMARY', 14, true)
    yPosition += 5
    
    const summary = this.generateExecutiveSummary(exportData)
    addText(summary, 11)
    yPosition += 10

    // Process each section
    for (const section of Object.values(exportData.template.sections)) {
      addText(section.title.toUpperCase(), 12, true)
      yPosition += 5
      addText(section.description, 10)
      yPosition += 5

      const sectionAnswers = exportData.answers[section.sectionId] || {}
      
      for (const field of section.fields) {
        const answer = sectionAnswers[field.id]
        if (answer) {
          addText(`${field.label}:`, 10, true)
          
          if (field.type === 'risk_assessment' && typeof answer === 'object') {
            const risk = answer as Record<string, unknown>
            addText(`Likelihood: ${risk.likelihood}/5`, 10)
            addText(`Impact: ${risk.impact}/5`, 10)
            addText(`Risk Score: ${risk.score}/25 (${risk.level})`, 10)
            if (risk.description) {
              addText(`Description: ${risk.description}`, 10)
            }
          } else {
            const answerText = typeof answer === 'string' ? answer : JSON.stringify(answer)
            addText(answerText, 10)
          }
          yPosition += 3
        }
      }
      yPosition += 10
    }

    // Risk assessment summary
    addText('RISK ASSESSMENT SUMMARY', 14, true)
    yPosition += 5
    
    const riskSummary = this.generateRiskSummary(exportData)
    addText(riskSummary, 11)
    yPosition += 10

    // Mitigation measures section
    const mitigationAnswers = exportData.answers.mitigation_measures || {}
    if (Object.keys(mitigationAnswers).length > 0) {
      addText('MITIGATION MEASURES', 14, true)
      yPosition += 5
      
      const mitigationSummary = this.generateMitigationSummary(exportData)
      addText(mitigationSummary, 11)
      yPosition += 10
      
      // Residual risk evaluation
      const residualRisk = this.getResidualRiskEvaluation(exportData)
      if (residualRisk) {
        addText('RESIDUAL RISK ASSESSMENT', 12, true)
        yPosition += 3
        addText(`After implementing mitigation measures:`, 10)
        addText(`• Residual Likelihood: ${residualRisk.residual_likelihood}/5`, 10)
        addText(`• Residual Impact: ${residualRisk.residual_impact}/5`, 10)
        addText(`• Residual Risk Score: ${residualRisk.residual_score}/25`, 10)
        addText(`• Residual Risk Level: ${residualRisk.residual_level}`, 10, true)
        yPosition += 10
      }
    }

    // Recommendations
    addText('RECOMMENDATIONS', 14, true)
    yPosition += 5
    
    const recommendations = this.generateRecommendations(exportData)
    addText(recommendations, 11)

    // Footer
    doc.setFontSize(8)
    const footerY = pageHeight - 10
    doc.text('Generated by DPIA.ai - https://dpia.avantle.ai', margin, footerY)

    return new Uint8Array(doc.output('arraybuffer') as ArrayBuffer)
  }

  async generateDOCX(assessmentId: string): Promise<Uint8Array> {
    const exportData = await this.prepareExportData(assessmentId)
    
    const children = []

    // Document header
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'DATA PROTECTION IMPACT ASSESSMENT (DPIA)',
            bold: true,
            size: 32
          })
        ],
        heading: HeadingLevel.TITLE
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Assessment: ${exportData.assessment.name}`,
            bold: true,
            size: 24
          })
        ],
        heading: HeadingLevel.HEADING_1
      }),
      new Paragraph({
        children: [
          new TextRun(`Generated: ${new Date(exportData.metadata.exportedAt).toLocaleString()}`),
          new TextRun({ text: '\n' }),
          new TextRun(`Version: ${exportData.metadata.version}`)
        ]
      }),
      new Paragraph({ text: '' }) // Empty line
    )

    // Executive summary
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'EXECUTIVE SUMMARY',
            bold: true,
            size: 24
          })
        ],
        heading: HeadingLevel.HEADING_1
      }),
      new Paragraph({
        children: [
          new TextRun(this.generateExecutiveSummary(exportData))
        ]
      }),
      new Paragraph({ text: '' })
    )

    // Process each section
    for (const section of Object.values(exportData.template.sections)) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: section.title,
              bold: true,
              size: 20
            })
          ],
          heading: HeadingLevel.HEADING_2
        }),
        new Paragraph({
          children: [
            new TextRun(section.description)
          ]
        })
      )

      const sectionAnswers = exportData.answers[section.sectionId] || {}
      
      for (const field of section.fields) {
        const answer = sectionAnswers[field.id]
        if (answer) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: field.label + ':',
                  bold: true
                })
              ]
            })
          )
          
          if (field.type === 'risk_assessment' && typeof answer === 'object') {
            const risk = answer as Record<string, unknown>
            children.push(
              new Paragraph({
                children: [
                  new TextRun(`Likelihood: ${risk.likelihood}/5\n`),
                  new TextRun(`Impact: ${risk.impact}/5\n`),
                  new TextRun(`Risk Score: ${risk.score}/25 (${risk.level})\n`),
                  ...(risk.description ? [new TextRun(`Description: ${risk.description}`)] : [])
                ]
              })
            )
          } else {
            const answerText = typeof answer === 'string' ? answer : JSON.stringify(answer)
            children.push(
              new Paragraph({
                children: [
                  new TextRun(answerText)
                ]
              })
            )
          }
        }
      }
      
      children.push(new Paragraph({ text: '' })) // Empty line between sections
    }

    // Risk assessment summary
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'RISK ASSESSMENT SUMMARY',
            bold: true,
            size: 24
          })
        ],
        heading: HeadingLevel.HEADING_1
      }),
      new Paragraph({
        children: [
          new TextRun(this.generateRiskSummary(exportData))
        ]
      }),
      new Paragraph({ text: '' })
    )
    
    // Mitigation measures section
    const mitigationAnswers = exportData.answers.mitigation_measures || {}
    if (Object.keys(mitigationAnswers).length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'MITIGATION MEASURES',
              bold: true,
              size: 24
            })
          ],
          heading: HeadingLevel.HEADING_1
        }),
        new Paragraph({
          children: [
            new TextRun(this.generateMitigationSummary(exportData))
          ]
        })
      )
      
      // Residual risk evaluation
      const residualRisk = this.getResidualRiskEvaluation(exportData)
      if (residualRisk) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'RESIDUAL RISK ASSESSMENT',
                bold: true,
                size: 20
              })
            ],
            heading: HeadingLevel.HEADING_2
          }),
          new Paragraph({
            children: [
              new TextRun(`After implementing mitigation measures:\n`),
              new TextRun(`• Residual Likelihood: ${residualRisk.residual_likelihood}/5\n`),
              new TextRun(`• Residual Impact: ${residualRisk.residual_impact}/5\n`),
              new TextRun(`• Residual Risk Score: ${residualRisk.residual_score}/25\n`),
              new TextRun({
                text: `• Residual Risk Level: ${residualRisk.residual_level}\n`,
                bold: true
              }),
              new TextRun(`• Assessment Date: ${new Date(residualRisk.residual_calculated_at).toLocaleString()}`)
            ]
          })
        )
      }
      
      children.push(new Paragraph({ text: '' }))
    }

    // Recommendations
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'RECOMMENDATIONS',
            bold: true,
            size: 24
          })
        ],
        heading: HeadingLevel.HEADING_1
      }),
      new Paragraph({
        children: [
          new TextRun(this.generateRecommendations(exportData))
        ]
      })
    )

    const doc = new Document({
      sections: [{
        children
      }]
    })

    return await Packer.toBuffer(doc)
  }

  private async prepareExportData(assessmentId: string): Promise<ExportData> {
    const assessment = await this.db.getAssessment(assessmentId)
    if (!assessment) {
      throw new Error('Assessment not found')
    }

    const answers = await this.db.getAssessmentAnswers(assessmentId)

    return {
      assessment,
      answers,
      template: dpiaTemplate,
      metadata: {
        exportedAt: new Date().toISOString(),
        version: '3.11.0'
      }
    }
  }

  private generateExecutiveSummary(data: ExportData): string {
    const { assessment, answers } = data
    
    // Calculate completion percentage
    const totalFields = Object.values(data.template.sections).reduce(
      (total, section) => total + section.fields.length, 0
    )
    
    const completedFields = Object.values(answers).reduce(
      (total, sectionAnswers) => total + Object.keys(sectionAnswers).length, 0
    )
    
    const completionPercentage = Math.round((completedFields / totalFields) * 100)

    // Find risk factors
    const riskFactors = answers.risk_factors || {}
    const riskCount = Object.keys(riskFactors).length

    return `This Data Protection Impact Assessment (DPIA) was conducted for "${assessment.name}" ` +
           `in accordance with Article 35 of the General Data Protection Regulation (GDPR). ` +
           `The assessment is ${completionPercentage}% complete with ${riskCount} risk factors evaluated. ` +
           `Status: ${assessment.status}. ` +
           `This assessment identifies potential privacy risks and provides recommendations ` +
           `for mitigation measures to ensure GDPR compliance.`
  }

  private generateRiskSummary(data: ExportData): string {
    const riskFactors = data.answers.risk_factors || {}
    const risks = Object.values(riskFactors).filter(risk => 
      risk && typeof risk === 'object' && 'score' in risk
    )

    if (risks.length === 0) {
      return 'No risk assessments have been completed for this DPIA.'
    }

    const totalScore = risks.reduce((sum: number, risk: unknown) => {
      const riskObj = risk as { score?: number }
      return sum + (riskObj.score || 0)
    }, 0)
    const averageScore = Math.round(totalScore / risks.length)
    
    let riskLevel = 'low'
    if (averageScore >= 15) riskLevel = 'critical'
    else if (averageScore >= 10) riskLevel = 'high'
    else if (averageScore >= 6) riskLevel = 'medium'

    const riskCounts = risks.reduce((counts: Record<string, number>, risk: unknown) => {
      const riskObj = risk as { level?: string }
      const level = riskObj.level || 'unknown'
      counts[level] = (counts[level] || 0) + 1
      return counts
    }, {} as Record<string, number>)

    return `Risk Assessment Summary:\n` +
           `• Total risks evaluated: ${risks.length}\n` +
           `• Average risk score: ${averageScore}/25 (${riskLevel} risk)\n` +
           `• Risk distribution: ${Object.entries(riskCounts)
             .map(([level, count]) => `${count} ${level}`)
             .join(', ')}\n\n` +
           `The overall risk level indicates ${riskLevel === 'critical' ? 'immediate attention required' :
             riskLevel === 'high' ? 'significant risks that should be addressed' :
             riskLevel === 'medium' ? 'moderate risks requiring monitoring' :
             'acceptable risk levels with standard precautions'}.`
  }

  private generateRecommendations(data: ExportData): string {
    const riskFactors = data.answers.risk_factors || {}
    const risks = Object.values(riskFactors).filter(risk => 
      risk && typeof risk === 'object' && 'score' in risk
    ) as Array<Record<string, unknown>>

    const recommendations = []

    // General recommendations
    recommendations.push(
      '1. Implement data minimization principles to collect only necessary personal data',
      '2. Ensure lawful basis for processing is clearly documented and communicated',
      '3. Implement appropriate technical and organizational measures (TOMs)',
      '4. Conduct regular reviews of this DPIA and update as processing changes'
    )

    // Risk-specific recommendations
    const highRisks = risks.filter(risk => {
      const riskObj = risk as { score?: number }
      return (riskObj.score || 0) >= 10
    })
    if (highRisks.length > 0) {
      recommendations.push(
        '5. Address high-risk factors identified in the risk assessment',
        '6. Consider additional safeguards such as encryption, pseudonymization, or access controls',
        '7. Implement monitoring and logging for high-risk processing activities'
      )
    }

    const criticalRisks = risks.filter(risk => {
      const riskObj = risk as { score?: number }
      return (riskObj.score || 0) >= 15
    })
    if (criticalRisks.length > 0) {
      recommendations.push(
        '8. URGENT: Critical risks require immediate mitigation before processing begins',
        '9. Consider consultation with supervisory authority for critical risk factors',
        '10. Implement additional oversight and governance measures for critical processing'
      )
    }

    // Compliance recommendations
    recommendations.push(
      `${recommendations.length + 1}. Document all processing activities in the Record of Processing Activities (ROPA)`,
      `${recommendations.length + 2}. Ensure data subject rights procedures are in place and tested`,
      `${recommendations.length + 3}. Provide privacy notices and obtain valid consent where required`,
      `${recommendations.length + 4}. Establish data breach response procedures and notification processes`
    )

    return recommendations.join('\n')
  }

  private getResidualRiskEvaluation(data: ExportData): {
    residual_likelihood: number
    residual_impact: number
    residual_score: number
    residual_level: string
    residual_calculated_at: string
  } | null {
    if (data.assessment.data && typeof data.assessment.data === 'object') {
      const assessmentData = data.assessment.data as Record<string, unknown>
      const riskEval = assessmentData.risk_evaluation as any
      
      if (riskEval && riskEval.residual_likelihood && riskEval.residual_impact) {
        return {
          residual_likelihood: riskEval.residual_likelihood,
          residual_impact: riskEval.residual_impact,
          residual_score: riskEval.residual_score,
          residual_level: riskEval.residual_level,
          residual_calculated_at: riskEval.residual_calculated_at
        }
      }
    }
    return null
  }
  
  private generateMitigationSummary(data: ExportData): string {
    const mitigationAnswers = data.answers.mitigation_measures || {}
    
    if (Object.keys(mitigationAnswers).length === 0) {
      return 'No mitigation measures have been documented for this DPIA.'
    }
    
    let summary = 'Mitigation Measures Summary:\n\n'
    
    // Technical measures
    if (mitigationAnswers.technical_measures && Array.isArray(mitigationAnswers.technical_measures)) {
      const measures = mitigationAnswers.technical_measures as string[]
      summary += `Technical Measures (${measures.length}):\n`
      summary += measures.map(measure => `• ${measure}`).join('\n') + '\n\n'
      
      if (mitigationAnswers.technical_measures_details) {
        summary += `Technical Implementation Details:\n${mitigationAnswers.technical_measures_details}\n\n`
      }
    }
    
    // Organisational measures
    if (mitigationAnswers.organisational_measures && Array.isArray(mitigationAnswers.organisational_measures)) {
      const measures = mitigationAnswers.organisational_measures as string[]
      summary += `Organisational Measures (${measures.length}):\n`
      summary += measures.map(measure => `• ${measure}`).join('\n') + '\n\n'
      
      if (mitigationAnswers.organisational_measures_details) {
        summary += `Organisational Implementation Details:\n${mitigationAnswers.organisational_measures_details}\n\n`
      }
    }
    
    // Privacy by Design measures
    if (mitigationAnswers.privacy_by_design_measures && Array.isArray(mitigationAnswers.privacy_by_design_measures)) {
      const measures = mitigationAnswers.privacy_by_design_measures as string[]
      summary += `Privacy by Design / Default Measures (${measures.length}):\n`
      summary += measures.map(measure => `• ${measure}`).join('\n') + '\n\n'
      
      if (mitigationAnswers.privacy_by_design_details) {
        summary += `Privacy by Design Implementation:\n${mitigationAnswers.privacy_by_design_details}\n\n`
      }
    }
    
    // Data subject rights support
    if (mitigationAnswers.data_subject_rights_support && Array.isArray(mitigationAnswers.data_subject_rights_support)) {
      const measures = mitigationAnswers.data_subject_rights_support as string[]
      summary += `Data Subject Rights Support:\n`
      summary += measures.map(measure => `• ${measure}`).join('\n') + '\n\n'
    }
    
    // Review and monitoring
    if (mitigationAnswers.review_frequency) {
      summary += `Review Frequency: ${mitigationAnswers.review_frequency}\n`
    }
    
    if (mitigationAnswers.review_triggers && Array.isArray(mitigationAnswers.review_triggers)) {
      const triggers = mitigationAnswers.review_triggers as string[]
      summary += `Review Triggers: ${triggers.join(', ')}\n\n`
    }
    
    // Residual risk statement
    if (mitigationAnswers.residual_risk_statement) {
      summary += `Residual Risk Statement:\n${mitigationAnswers.residual_risk_statement}\n\n`
    }
    
    // High risk determination and consultation
    if (mitigationAnswers.high_residual_risk_remains) {
      summary += `High residual risk remains: ${mitigationAnswers.high_residual_risk_remains}\n`
    }
    
    if (mitigationAnswers.consultation_decision) {
      summary += `Supervisory authority consultation: ${mitigationAnswers.consultation_decision}\n`
    }
    
    return summary
  }

  async logExport(assessmentId: string, exportType: 'pdf' | 'docx', filePath?: string): Promise<void> {
    try {
      await this.db.logEvent({
        type: 'assessment.exported',
        entityType: 'assessment',
        entityId: assessmentId,
        payload: {
          exportType,
          filePath,
          timestamp: new Date().toISOString()
        }
      })
    } catch (error) {
      console.error('Failed to log export event:', error)
    }
  }
}

// Fallback mock service for development
export class MockExportService {
  async generate(request: ExportRequest): Promise<ExportResult> {
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const fileId = `assessment-${request.assessment_id}-${Date.now()}`
    const fileName = `dpia-assessment.${request.format}`
    const mockUrl = `/api/export/download/${fileId}/${fileName}`
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
    
    return {
      id: fileId,
      url: mockUrl,
      expires_at: expiresAt.toISOString()
    }
  }
}

// Export service factory - use real or mock based on environment
export async function createExportService() {
  return process.env.NODE_ENV === 'development' 
    ? new MockExportService() 
    : await RealExportService.create()
}