'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { riskEngine } from '@/lib/risk/risk-engine'
import { RiskAssessment } from '@/lib/validations/dpia'
import { Control } from 'react-hook-form'

interface RiskAssessmentFieldProps {
  name: string
  label: string
  description?: string
  control: Control<any>
  required?: boolean
}

const likelihoodOptions = [
  { value: 1, label: 'Very Low', description: 'Highly unlikely to occur' },
  { value: 2, label: 'Low', description: 'Unlikely to occur' },
  { value: 3, label: 'Medium', description: 'May occur occasionally' },
  { value: 4, label: 'High', description: 'Likely to occur' },
  { value: 5, label: 'Very High', description: 'Almost certain to occur' },
]

const impactOptions = [
  { value: 1, label: 'Minimal', description: 'Little or no impact on individuals' },
  { value: 2, label: 'Minor', description: 'Some inconvenience to individuals' },
  { value: 3, label: 'Moderate', description: 'Significant impact on individuals' },
  { value: 4, label: 'Major', description: 'Substantial harm to individuals' },
  { value: 5, label: 'Severe', description: 'Serious harm or distress to individuals' },
]

export function RiskAssessmentField({ 
  name, 
  label, 
  description, 
  control, 
  required = false 
}: RiskAssessmentFieldProps) {
  const [currentRisk, setCurrentRisk] = useState<Partial<RiskAssessment>>({})

  const handleLikelihoodChange = (value: string, onChange: (value: RiskAssessment) => void) => {
    const likelihood = parseInt(value)
    const updated = { ...currentRisk, likelihood }
    
    if (updated.impact) {
      const score = riskEngine.calculateRiskScore(likelihood, updated.impact)
      const level = riskEngine.determineRiskLevel(score)
      const fullRisk = { ...updated, score, level } as RiskAssessment
      setCurrentRisk(fullRisk)
      onChange(fullRisk)
    } else {
      setCurrentRisk(updated)
    }
  }

  const handleImpactChange = (value: string, onChange: (value: RiskAssessment) => void) => {
    const impact = parseInt(value)
    const updated = { ...currentRisk, impact }
    
    if (updated.likelihood) {
      const score = riskEngine.calculateRiskScore(updated.likelihood, impact)
      const level = riskEngine.determineRiskLevel(score)
      const fullRisk = { ...updated, score, level } as RiskAssessment
      setCurrentRisk(fullRisk)
      onChange(fullRisk)
    } else {
      setCurrentRisk(updated)
    }
  }

  const handleDescriptionChange = (value: string, onChange: (value: RiskAssessment) => void) => {
    const updated = { ...currentRisk, description: value }
    setCurrentRisk(updated)
    
    if (updated.likelihood && updated.impact) {
      onChange(updated as RiskAssessment)
    }
  }

  const getRiskLevelBadge = (level?: string) => {
    if (!level) return null
    
    const variants = {
      low: 'secondary',
      medium: 'secondary', 
      high: 'destructive',
      critical: 'destructive',
    } as const

    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800', 
      critical: 'bg-red-100 text-red-800',
    } as const

    return (
      <Badge 
        variant={variants[level as keyof typeof variants]} 
        className={colors[level as keyof typeof colors]}
      >
        {level.charAt(0).toUpperCase() + level.slice(1)} Risk
      </Badge>
    )
  }

  return (
    <FormField
      control={control}
      name={name}
      rules={{ required }}
      render={({ field }) => {
        // Initialize currentRisk from field value
        if (field.value && Object.keys(currentRisk).length === 0) {
          setCurrentRisk(field.value)
        }

        return (
          <FormItem>
            <FormLabel className="text-base font-semibold">
              {label} {required && <span className="text-destructive">*</span>}
            </FormLabel>
            {description && (
              <p className="text-sm text-muted-foreground mb-4">{description}</p>
            )}
            
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Risk Assessment</CardTitle>
                  {currentRisk.level && (
                    <div className="flex items-center gap-2">
                      {getRiskLevelBadge(currentRisk.level)}
                      {currentRisk.score && (
                        <span className="text-sm font-medium">
                          Score: {currentRisk.score}/25
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Likelihood Assessment */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Likelihood of Risk Occurring
                  </Label>
                  <RadioGroup
                    value={currentRisk.likelihood?.toString()}
                    onValueChange={(value) => handleLikelihoodChange(value, field.onChange)}
                  >
                    {likelihoodOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value.toString()} id={`${name}-likelihood-${option.value}`} />
                        <Label 
                          htmlFor={`${name}-likelihood-${option.value}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          <span className="font-medium">{option.label}</span>
                          <span className="text-muted-foreground"> - {option.description}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Impact Assessment */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Impact on Data Subjects if Risk Occurs
                  </Label>
                  <RadioGroup
                    value={currentRisk.impact?.toString()}
                    onValueChange={(value) => handleImpactChange(value, field.onChange)}
                  >
                    {impactOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value.toString()} id={`${name}-impact-${option.value}`} />
                        <Label 
                          htmlFor={`${name}-impact-${option.value}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          <span className="font-medium">{option.label}</span>
                          <span className="text-muted-foreground"> - {option.description}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Additional Description */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Additional Risk Description (Optional)
                  </Label>
                  <Textarea
                    placeholder="Describe any specific aspects of this risk relevant to your processing..."
                    value={currentRisk.description || ''}
                    onChange={(e) => handleDescriptionChange(e.target.value, field.onChange)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
            
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}