'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { precheckSubmissionSchema, type PrecheckSubmission, type Question } from '@/lib/validations/precheck'

interface PrecheckFormProps {
  questions: Question[]
  onSubmit: (data: PrecheckSubmission) => Promise<void>
  isLoading?: boolean
}

export function PrecheckForm({ questions, onSubmit, isLoading = false }: PrecheckFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  
  const form = useForm<PrecheckSubmission>({
    resolver: zodResolver(precheckSubmissionSchema),
    defaultValues: {
      answers: {},
    },
  })

  const currentQuestion = questions[currentStep]
  const isLastQuestion = currentStep === questions.length - 1
  const isFirstQuestion = currentStep === 0

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (data: PrecheckSubmission) => {
    await onSubmit(data)
  }

  const currentAnswer = form.watch(`answers.${currentQuestion?.id}`)

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Question {currentStep + 1} of {questions.length}</span>
          <span>{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {currentQuestion && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">
                  {currentQuestion.question}
                </CardTitle>
                {currentQuestion.description && (
                  <CardDescription className="text-base">
                    {currentQuestion.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name={`answers.${currentQuestion.id}`}
                  rules={{ required: currentQuestion.required }}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="space-y-4"
                        >
                          {currentQuestion.options.map((option) => (
                            <div key={option.value} className="flex items-center space-x-2">
                              <RadioGroupItem value={option.value} id={option.value} />
                              <Label 
                                htmlFor={option.value}
                                className="text-sm font-normal cursor-pointer flex-1"
                              >
                                {option.label}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between">
            <Button 
              type="button"
              variant="outline" 
              onClick={handlePrevious}
              disabled={isFirstQuestion || isLoading}
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl border border-blue-500 hover:border-blue-400 transform hover:scale-102 transition-all duration-300 px-8 py-4 font-semibold rounded-lg cursor-pointer"
              style={{
                backgroundColor: '#2563eb',
                borderColor: '#3b82f6',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '18px',
                fontWeight: '600'
              }}
            >
              Previous
            </Button>
            
            <div className="flex gap-2">
              {!isLastQuestion ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!currentAnswer || isLoading}
                  className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl border border-blue-500 hover:border-blue-400 transform hover:scale-102 transition-all duration-300 px-8 py-4 font-semibold rounded-lg cursor-pointer"
                  style={{
                    backgroundColor: '#2563eb',
                    borderColor: '#3b82f6',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '18px',
                    fontWeight: '600'
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button 
                  type="submit"
                  disabled={!currentAnswer || isLoading}
                  className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl border border-blue-500 hover:border-blue-400 transform hover:scale-102 transition-all duration-300 px-8 py-4 font-semibold rounded-lg cursor-pointer"
                  style={{
                    backgroundColor: '#2563eb',
                    borderColor: '#3b82f6',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '18px',
                    fontWeight: '600'
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Evaluating...
                    </>
                  ) : (
                    'Get Results'
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}