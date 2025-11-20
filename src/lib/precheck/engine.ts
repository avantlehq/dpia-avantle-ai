import { PrecheckSubmission, PrecheckResult, PrecheckTemplate } from '../validations/precheck'
import precheckTemplate from '../templates/dpia-precheck-v1.json'

/**
 * DPIA Pre-check Engine
 * Evaluates user answers to determine if a DPIA is required
 */
export class PrecheckEngine {
  private template: PrecheckTemplate['template']

  constructor() {
    this.template = precheckTemplate.template as PrecheckTemplate['template']
  }

  /**
   * Evaluate pre-check submission and return result
   */
  evaluate(submission: PrecheckSubmission): PrecheckResult {
    const score = this.calculateScore(submission.answers)
    const result = this.determineResult(score)
    const resultConfig = this.template.scoring.results[result]

    return {
      score,
      result,
      title: resultConfig.title,
      description: resultConfig.description,
      recommendation: resultConfig.recommendation,
      next_steps: resultConfig.next_steps,
    }
  }

  /**
   * Calculate total score based on answers
   */
  private calculateScore(answers: Record<string, string>): number {
    let totalScore = 0

    for (const question of this.template.questions) {
      const answer = answers[question.id]
      if (answer) {
        const option = question.options.find(opt => opt.value === answer)
        if (option) {
          totalScore += option.score
        }
      }
    }

    return totalScore
  }

  /**
   * Determine result based on score thresholds
   */
  private determineResult(score: number): 'required' | 'recommended' | 'not_required' {
    const thresholds = this.template.scoring.thresholds

    if (score >= thresholds.required) {
      return 'required'
    } else if (score >= thresholds.recommended) {
      return 'recommended'
    } else {
      return 'not_required'
    }
  }

  /**
   * Get template questions
   */
  getQuestions() {
    return this.template.questions
  }

  /**
   * Get template metadata
   */
  getMetadata() {
    return {
      id: this.template.id,
      name: this.template.name,
      description: this.template.description,
      version: this.template.version,
    }
  }

  /**
   * Validate that all required questions are answered
   */
  validateSubmission(answers: Record<string, string>): { isValid: boolean; missingQuestions: string[] } {
    const missingQuestions: string[] = []

    for (const question of this.template.questions) {
      if (question.required && !answers[question.id]) {
        missingQuestions.push(question.id)
      }
    }

    return {
      isValid: missingQuestions.length === 0,
      missingQuestions,
    }
  }
}

// Create singleton instance
export const precheckEngine = new PrecheckEngine()