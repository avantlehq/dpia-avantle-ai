import { RiskAssessment } from '../validations/dpia'

export interface RiskEvaluation {
  assessment_id: string
  risk_type: string
  likelihood: number
  impact: number
  score: number
  level: 'low' | 'medium' | 'high' | 'critical'
  description?: string
  mitigation_measures?: string[]
}

export interface OverallRiskAssessment {
  overall_score: number
  overall_level: 'low' | 'medium' | 'high' | 'critical'
  risk_evaluations: RiskEvaluation[]
  recommendations: string[]
}

/**
 * DPIA Risk Scoring Engine
 * Calculates risk scores based on likelihood and impact assessments
 */
export class RiskEngine {
  
  /**
   * Calculate risk score from likelihood and impact
   */
  calculateRiskScore(likelihood: number, impact: number): number {
    // Simple multiplication formula: likelihood × impact
    return likelihood * impact
  }

  /**
   * Determine risk level from score
   */
  determineRiskLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
    if (score >= 21) return 'critical'
    if (score >= 16) return 'high' 
    if (score >= 6) return 'medium'
    return 'low'
  }

  /**
   * Create risk assessment from likelihood and impact
   */
  createRiskAssessment(likelihood: number, impact: number, description?: string): RiskAssessment {
    const score = this.calculateRiskScore(likelihood, impact)
    const level = this.determineRiskLevel(score)
    
    return {
      likelihood,
      impact,
      score,
      level,
      description,
    }
  }

  /**
   * Evaluate individual risk factor
   */
  evaluateRiskFactor(
    assessmentId: string,
    riskType: string, 
    riskAssessment: RiskAssessment,
    mitigationMeasures?: string[]
  ): RiskEvaluation {
    return {
      assessment_id: assessmentId,
      risk_type: riskType,
      likelihood: riskAssessment.likelihood,
      impact: riskAssessment.impact,
      score: riskAssessment.score,
      level: riskAssessment.level,
      description: riskAssessment.description,
      mitigation_measures: mitigationMeasures,
    }
  }

  /**
   * Calculate overall risk assessment from multiple risk factors
   */
  calculateOverallRisk(
    assessmentId: string,
    riskFactors: Record<string, RiskAssessment>,
    mitigationMeasures?: Record<string, string[]>
  ): OverallRiskAssessment {
    const riskEvaluations: RiskEvaluation[] = []
    let totalScore = 0
    let maxScore = 0
    
    // Process each risk factor
    for (const [riskType, riskAssessment] of Object.entries(riskFactors)) {
      const evaluation = this.evaluateRiskFactor(
        assessmentId,
        riskType,
        riskAssessment,
        mitigationMeasures?.[riskType]
      )
      
      riskEvaluations.push(evaluation)
      totalScore += evaluation.score
      maxScore = Math.max(maxScore, evaluation.score)
    }

    // Calculate overall score (weighted average with emphasis on highest risk)
    const avgScore = totalScore / riskEvaluations.length
    const overallScore = Math.round((avgScore + maxScore) / 2)
    const overallLevel = this.determineRiskLevel(overallScore)

    // Generate recommendations
    const recommendations = this.generateRecommendations(riskEvaluations)

    return {
      overall_score: overallScore,
      overall_level: overallLevel,
      risk_evaluations: riskEvaluations,
      recommendations,
    }
  }

  /**
   * Generate risk mitigation recommendations
   */
  private generateRecommendations(riskEvaluations: RiskEvaluation[]): string[] {
    const recommendations: string[] = []
    
    // High-level recommendations based on risk levels
    const criticalRisks = riskEvaluations.filter(r => r.level === 'critical')
    const highRisks = riskEvaluations.filter(r => r.level === 'high')
    const mediumRisks = riskEvaluations.filter(r => r.level === 'medium')

    if (criticalRisks.length > 0) {
      recommendations.push('Immediate action required: Critical privacy risks identified that must be addressed before processing begins')
      recommendations.push('Consider consulting with Data Protection Officer and legal counsel')
      recommendations.push('Implement strong technical and organizational safeguards')
    }

    if (highRisks.length > 0) {
      recommendations.push('High privacy risks require robust mitigation measures')
      recommendations.push('Regular monitoring and review of risk controls needed')
    }

    if (mediumRisks.length > 0) {
      recommendations.push('Moderate risks should be monitored and controlled through appropriate measures')
    }

    // Specific recommendations based on risk types
    for (const risk of riskEvaluations) {
      const specific = this.getSpecificRecommendations(risk.risk_type, risk.level)
      recommendations.push(...specific)
    }

    // General recommendations
    recommendations.push('Ensure data minimization principles are applied')
    recommendations.push('Implement privacy by design and default measures')
    recommendations.push('Provide clear information to data subjects about processing')
    recommendations.push('Establish procedures for handling data subject rights requests')

    // Remove duplicates and return
    return Array.from(new Set(recommendations))
  }

  /**
   * Get specific recommendations for risk types
   */
  private getSpecificRecommendations(riskType: string, riskLevel: string): string[] {
    const recommendations: string[] = []

    switch (riskType) {
      case 'risk_systematic_monitoring':
        if (riskLevel === 'high' || riskLevel === 'critical') {
          recommendations.push('Implement strong access controls and monitoring safeguards')
          recommendations.push('Consider anonymization or pseudonymization techniques')
        }
        break
        
      case 'risk_large_scale':
        if (riskLevel === 'high' || riskLevel === 'critical') {
          recommendations.push('Implement robust data security measures including encryption')
          recommendations.push('Establish clear data retention and deletion procedures')
        }
        break
        
      case 'risk_vulnerable_subjects':
        if (riskLevel === 'medium' || riskLevel === 'high' || riskLevel === 'critical') {
          recommendations.push('Implement additional safeguards for vulnerable individuals')
          recommendations.push('Ensure appropriate consent mechanisms for children')
        }
        break
        
      case 'risk_innovative_tech':
        if (riskLevel === 'high' || riskLevel === 'critical') {
          recommendations.push('Conduct thorough testing of new technologies')
          recommendations.push('Implement algorithmic accountability measures')
        }
        break
        
      case 'risk_automated_decisions':
        if (riskLevel === 'medium' || riskLevel === 'high' || riskLevel === 'critical') {
          recommendations.push('Provide meaningful information about automated decision-making')
          recommendations.push('Implement right to human intervention procedures')
        }
        break
    }

    return recommendations
  }

  /**
   * Validate risk assessment values
   */
  validateRiskAssessment(riskAssessment: RiskAssessment): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (riskAssessment.likelihood < 1 || riskAssessment.likelihood > 5) {
      errors.push('Likelihood must be between 1 and 5')
    }

    if (riskAssessment.impact < 1 || riskAssessment.impact > 5) {
      errors.push('Impact must be between 1 and 5')
    }

    const expectedScore = riskAssessment.likelihood * riskAssessment.impact
    if (riskAssessment.score !== expectedScore) {
      errors.push(`Score should be ${expectedScore} (likelihood × impact)`)
    }

    const expectedLevel = this.determineRiskLevel(riskAssessment.score)
    if (riskAssessment.level !== expectedLevel) {
      errors.push(`Level should be ${expectedLevel} for score ${riskAssessment.score}`)
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}

// Create singleton instance
export const riskEngine = new RiskEngine()