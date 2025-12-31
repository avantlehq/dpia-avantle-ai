'use client'

import React from 'react'

export default function DataFlowsPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-700/50 pb-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          Data Flows
        </h1>
        <p className="text-gray-400">
          Data movement and transfer tracking
        </p>
      </div>
      
      <div className="bg-gray-800/50 rounded-lg p-8 text-center border border-gray-700/30">
        <div className="mb-4">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔄</span>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Data Flow Mapping</h2>
        <p className="text-gray-400 mb-6">
          Track and visualize how personal data moves through your systems and to third parties.
        </p>
        <div className="text-sm text-gray-500">
          Coming soon in future release
        </div>
      </div>
    </div>
  )
}