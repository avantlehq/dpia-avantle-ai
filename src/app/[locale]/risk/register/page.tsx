'use client'

import React from 'react'

export default function RiskRegisterPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-700/50 pb-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          Risk Register
        </h1>
        <p className="text-gray-400">
          Centralized risk registry and tracking
        </p>
      </div>
      
      <div className="bg-gray-800/50 rounded-lg p-8 text-center border border-gray-700/30">
        <div className="mb-4">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📋</span>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Risk Register</h2>
        <p className="text-gray-400 mb-6">
          Maintain a centralized register of all identified privacy risks with status tracking and mitigation plans.
        </p>
        <div className="text-sm text-gray-500">
          Coming soon in future release
        </div>
      </div>
    </div>
  )
}