'use client'

import React from 'react'
import { LucideIcon, Clock, ArrowRight, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTranslations } from '@/hooks/useTranslations'
import { useState, useEffect } from 'react'

interface ModuleComingSoonProps {
  icon: LucideIcon
  title: string
  description: string
  features: string[]
  estimatedTimeline?: string
  moduleColor?: string
  className?: string
}

interface FeatureItemProps {
  feature: string
}

const FeatureItem = ({ feature }: FeatureItemProps) => (
  <div className="flex items-center gap-3 text-left">
    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
    <span className="text-gray-300 text-sm">{feature}</span>
  </div>
)

export function ModuleComingSoon({
  icon: Icon,
  title,
  description,
  features,
  estimatedTimeline,
  moduleColor = '#4A90E2'
}: ModuleComingSoonProps) {
  const [mounted, setMounted] = useState(false)
  const { t } = useTranslations('common')

  useEffect(() => {
    setMounted(true)
  }, [])

  // Default fallback text for SSR
  const upcomingFeaturesText = mounted ? t('upcomingFeatures') : 'Upcoming Features'
  const notifyWhenReadyText = mounted ? t('notifyWhenReady') : 'Notify When Ready'
  const whyThisModuleText = mounted ? t('whyThisModule') : 'Why This Module?'
  const moduleImportanceText = mounted ? t('moduleImportance') : 'This module will help you maintain GDPR compliance and streamline your privacy management workflow.'
  const currentProgressText = mounted ? t('currentProgress') : 'Current Progress'
  const inDevelopmentText = mounted ? t('inDevelopment') : 'Currently in development. Check back soon for updates on our progress.'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-700/50 pb-6">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Icon className="h-8 w-8" style={{ color: moduleColor }} />
          {title}
        </h1>
        <p className="text-gray-400">
          {description}
        </p>
      </div>
      
      {/* Main Coming Soon Card */}
      <Card className="avantle-border bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-2">
        <CardContent className="p-8 text-center">
          {/* Module Icon */}
          <div 
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ 
              backgroundColor: `${moduleColor}20`,
              border: `2px solid ${moduleColor}30`
            }}
          >
            <Icon 
              className="h-10 w-10" 
              style={{ color: moduleColor }}
            />
          </div>
          
          {/* Title & Description */}
          <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            {description}
          </p>
          
          {/* Feature Preview */}
          <div className="bg-gray-900/50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-400" />
              {upcomingFeaturesText}
            </h3>
            <div className="grid gap-3 max-w-md mx-auto">
              {features.map((feature, index) => (
                <FeatureItem key={index} feature={feature} />
              ))}
            </div>
          </div>
          
          {/* Timeline & CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {estimatedTimeline && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                {estimatedTimeline}
              </div>
            )}
            <Button variant="outline" size="sm" disabled className="group">
              {notifyWhenReadyText}
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Additional Info Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="avantle-border bg-card backdrop-blur-sm">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-white mb-3">
              {whyThisModuleText}
            </h4>
            <p className="text-gray-400 text-sm">
              {moduleImportanceText}
            </p>
          </CardContent>
        </Card>
        
        <Card className="avantle-border bg-card backdrop-blur-sm">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-white mb-3">
              {currentProgressText}
            </h4>
            <p className="text-gray-400 text-sm">
              {inDevelopmentText}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}