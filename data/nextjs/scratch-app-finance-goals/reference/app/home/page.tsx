'use client'
import React from 'react'
import { useApp } from '../../components/AppStateProvider'

export function HomePage() {
  const { goals } = useApp()
  const totalSaved = goals.reduce((s, g) => s + g.currentAmount, 0)
  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0)
  const activeCount = goals.filter(g => g.currentAmount < g.targetAmount).length

  return (
    <div data-testid="home-page">
      <h1>Finance Dashboard</h1>
      <div data-testid="total-saved">{totalSaved}</div>
      <div data-testid="total-target">{totalTarget}</div>
      <div data-testid="active-goals-count">{activeCount}</div>
    </div>
  )
}
