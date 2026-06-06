'use client'
import React from 'react'
import { useApp } from '../../components/AppStateProvider'
import { currentValue } from '../../lib/types'
export function DepreciationPage() {
  const { assets } = useApp()
  return (
    <div data-testid="depreciation-page">
      <h1>Depreciation</h1>
      {assets.map(a => {
        const cv = currentValue(a)
        const depreciated = Math.round((a.purchasePrice - cv) * 100) / 100
        return (
          <div key={a.id} data-testid={`dep-row-${a.id}`}>
            <span>{a.name}</span>
            <span>{a.purchasePrice}</span>
            <span data-testid={`dep-current-${a.id}`}>{cv}</span>
            <span data-testid={`dep-amount-${a.id}`}>{depreciated}</span>
          </div>
        )
      })}
    </div>
  )
}
