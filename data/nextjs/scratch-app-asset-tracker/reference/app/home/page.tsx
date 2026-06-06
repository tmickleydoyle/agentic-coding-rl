'use client'
import React from 'react'
import { useApp } from '../../components/AppStateProvider'
import { currentValue } from '../../lib/types'
export function HomePage() {
  const { assets } = useApp()
  const totalOriginal = assets.reduce((s, a) => s + a.purchasePrice, 0)
  const totalCurrent = assets.reduce((s, a) => s + currentValue(a), 0)
  return (
    <div data-testid="home-page">
      <h1>Asset Tracker</h1>
      <div data-testid="total-assets">{assets.length}</div>
      <div data-testid="total-original-value">{totalOriginal}</div>
      <div data-testid="total-current-value">{Math.round(totalCurrent * 100) / 100}</div>
    </div>
  )
}
