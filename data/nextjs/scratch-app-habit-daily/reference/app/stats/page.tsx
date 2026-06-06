'use client'
import React from 'react'
import { useApp } from '../../components/AppStateProvider'

export function StatsPage() {
  const { habits, logs } = useApp()
  return (
    <div data-testid="stats-page">
      <h1>Stats</h1>
      {habits.map(h => {
        const count = logs.filter(l => l.habitId === h.id && l.completed).length
        return (
          <div key={h.id} data-testid={`stat-${h.id}`}>
            {h.name}: {count}
          </div>
        )
      })}
    </div>
  )
}
