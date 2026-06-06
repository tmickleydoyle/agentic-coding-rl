'use client'
import React from 'react'
import { useApp } from '../../components/AppStateProvider'

export function StreaksPage() {
  const { habits, getStreak } = useApp()
  return (
    <div data-testid="streaks-page">
      <h1>Streaks</h1>
      {habits.map(h => (
        <div key={h.id} data-testid={`streak-${h.id}`}>
          {h.name}: {getStreak(h.id)}
        </div>
      ))}
    </div>
  )
}
