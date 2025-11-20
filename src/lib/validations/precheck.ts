import { z } from 'zod'

// Pre-check answer schema
export const precheckAnswerSchema = z.object({
  questionId: z.string(),
  value: z.enum(['yes', 'no', 'unsure']),
})

// Pre-check form schema  
export const precheckFormSchema = z.object({
  answers: z.array(precheckAnswerSchema).min(8, 'All questions must be answered'),
})

// Pre-check submission schema
export const precheckSubmissionSchema = z.object({
  answers: z.record(z.string(), z.enum(['yes', 'no', 'unsure'])),
})

// Pre-check result schema
export const precheckResultSchema = z.object({
  score: z.number().min(0).max(24),
  result: z.enum(['required', 'recommended', 'not_required']),
  title: z.string(),
  description: z.string(), 
  recommendation: z.string(),
  next_steps: z.array(z.string()),
})

// Types
export type PrecheckAnswer = z.infer<typeof precheckAnswerSchema>
export type PrecheckForm = z.infer<typeof precheckFormSchema>
export type PrecheckSubmission = z.infer<typeof precheckSubmissionSchema>
export type PrecheckResult = z.infer<typeof precheckResultSchema>

// Question template schema
export const questionSchema = z.object({
  id: z.string(),
  question: z.string(),
  description: z.string().optional(),
  type: z.literal('radio'),
  required: z.boolean(),
  options: z.array(z.object({
    value: z.enum(['yes', 'no', 'unsure']),
    label: z.string(),
    score: z.number(),
  })),
})

export const precheckTemplateSchema = z.object({
  template: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    version: z.string(),
    questions: z.array(questionSchema),
    scoring: z.object({
      thresholds: z.object({
        required: z.number(),
        recommended: z.number(), 
        not_required: z.number(),
      }),
      results: z.object({
        required: z.object({
          title: z.string(),
          description: z.string(),
          recommendation: z.string(),
          next_steps: z.array(z.string()),
        }),
        recommended: z.object({
          title: z.string(), 
          description: z.string(),
          recommendation: z.string(),
          next_steps: z.array(z.string()),
        }),
        not_required: z.object({
          title: z.string(),
          description: z.string(),
          recommendation: z.string(),
          next_steps: z.array(z.string()),
        }),
      }),
    }),
  }),
})

export type Question = z.infer<typeof questionSchema>
export type PrecheckTemplate = z.infer<typeof precheckTemplateSchema>