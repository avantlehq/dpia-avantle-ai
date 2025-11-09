import type { DomainEvent } from '@/lib/types'

export class EventService {
  async logEvent(
    type: string,
    entityId: string,
    payload: Record<string, unknown> = {}
  ): Promise<void> {
    // Mock event logging for now
    console.log('Domain event logged:', { type, entityId, payload })
  }

  async logAssessmentCreated(assessmentId: string, userId: string) {
    await this.logEvent('assessment.created', assessmentId, { userId })
  }

  async logAssessmentUpdated(assessmentId: string, userId: string, changes: string[]) {
    await this.logEvent('assessment.updated', assessmentId, { userId, changes })
  }

  async logAssessmentExported(assessmentId: string, userId: string, format: string) {
    await this.logEvent('assessment.exported', assessmentId, { userId, format })
  }

  async logAssessmentSubmitted(assessmentId: string, userId: string) {
    await this.logEvent('assessment.submitted', assessmentId, { userId })
  }

  async getEvents(entityId: string): Promise<DomainEvent[]> {
    // Mock events for now
    return []
  }
}

export const eventService = new EventService()