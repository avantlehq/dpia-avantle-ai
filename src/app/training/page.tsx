import React from 'react'
import { GraduationCap, BookOpen, Users, CheckCircle, Clock, Trophy } from 'lucide-react'

// Training Module Test Page
export default function TrainingPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <div 
            className="p-2 rounded-lg" 
            style={{ backgroundColor: 'rgba(155, 89, 182, 0.15)' }}
          >
            <GraduationCap 
              className="h-6 w-6" 
              style={{ color: 'var(--color-purple)' }} 
            />
          </div>
          Training & Awareness
        </h1>
        <p className="text-muted-foreground text-lg">
          Privacy awareness and training programs for your organization
        </p>
      </div>

      {/* Training Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 dark:text-green-400">Completed</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">142</p>
            </div>
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-800/50">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 dark:text-yellow-400">In Progress</p>
              <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">28</p>
            </div>
            <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-800/50">
              <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400">Total Employees</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">185</p>
            </div>
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-800/50">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 dark:text-purple-400">Compliance Rate</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">87%</p>
            </div>
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-800/50">
              <Trophy className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Training Programs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* GDPR Fundamentals */}
        <div className="p-6 rounded-lg border border-border bg-card backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold">GDPR Fundamentals</h3>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Essential GDPR knowledge for all employees
            </p>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Duration:</span>
              <span>45 minutes</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Completed:</span>
              <span className="text-green-600 font-medium">142/185</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '77%' }}></div>
            </div>
          </div>
        </div>

        {/* Data Handler Training */}
        <div className="p-6 rounded-lg border border-border bg-card backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold">Data Handler Training</h3>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Advanced training for employees handling personal data
            </p>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Duration:</span>
              <span>90 minutes</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Completed:</span>
              <span className="text-yellow-600 font-medium">68/95</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '72%' }}></div>
            </div>
          </div>
        </div>

        {/* Security Awareness */}
        <div className="p-6 rounded-lg border border-border bg-card backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
              <Trophy className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold">Security Awareness</h3>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Cybersecurity and data protection awareness
            </p>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Duration:</span>
              <span>60 minutes</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Completed:</span>
              <span className="text-green-600 font-medium">156/185</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '84%' }}></div>
            </div>
          </div>
        </div>

        {/* Privacy by Design */}
        <div className="p-6 rounded-lg border border-border bg-card backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <GraduationCap className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold">Privacy by Design</h3>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Privacy engineering principles for developers
            </p>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Duration:</span>
              <span>120 minutes</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Completed:</span>
              <span className="text-red-600 font-medium">12/25</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-red-600 h-2 rounded-full" style={{ width: '48%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Training */}
      <div className="p-6 rounded-lg border border-border bg-card backdrop-blur-sm shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Upcoming Training Sessions
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <div>
              <div className="font-medium">Data Breach Response</div>
              <div className="text-sm text-muted-foreground">Incident management and notification procedures</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">Dec 28, 2025</div>
              <div className="text-xs text-muted-foreground">2:00 PM - 4:00 PM</div>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <div>
              <div className="font-medium">Cross-Border Data Transfers</div>
              <div className="text-sm text-muted-foreground">International data transfer mechanisms</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">Jan 15, 2026</div>
              <div className="text-xs text-muted-foreground">10:00 AM - 12:00 PM</div>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="text-center py-8">
        <p className="text-muted-foreground text-sm">
          Training management module is coming soon. This is a test page to ensure navigation works properly.
        </p>
      </div>
    </div>
  )
}