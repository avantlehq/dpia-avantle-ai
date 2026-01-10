import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useTranslations } from '@/hooks/useTranslations'

interface CategoryCardProps {
  id: string
  icon: React.ReactNode
  title: string
  description: string
  url?: string
  available: boolean
  locale: string
}

export function CategoryCard({ 
  id, 
  icon, 
  title, 
  description, 
  url, 
  available, 
  locale 
}: CategoryCardProps) {
  const { t } = useTranslations('help')
  
  return (
    <Card className="h-full hover:shadow-md transition-all duration-200 border border-border/60">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold text-foreground leading-tight">
                {title}
              </CardTitle>
            </div>
          </div>
          <Badge 
            variant={available ? "default" : "secondary"}
            className={`ml-2 flex-shrink-0 ${
              available 
                ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800'
                : 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-800'
            }`}
          >
            {available ? t('available') : t('inPreparation')}
          </Badge>
        </div>
        
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </CardHeader>
      
      <CardContent className="pt-0">
        {available && url ? (
          <Link href={`/${locale}${url}`} className="block">
            <Button 
              variant="outline" 
              className="w-full justify-center font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {t('browseGuides')}
            </Button>
          </Link>
        ) : (
          <Button 
            variant="outline" 
            disabled 
            className="w-full justify-center opacity-60 cursor-not-allowed"
            title={t('sectionBeingPrepared')}
          >
            {t('browseGuides')}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}