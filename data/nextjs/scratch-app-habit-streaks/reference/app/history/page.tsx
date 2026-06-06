'use client'
import React from 'react'
import { useApp } from '../../components/AppStateProvider'

export function HistoryPage() {
  const { completions } = useApp()
  const sorted = [...completions].sort((a, b) => b.date.localeCompare(a.date))
  return (
    <div data-testid="history-page">
      <h1>History</h1>
      {sorted.map(c => (
        <div key={c.id} data-testid={`history-item-${c.id}`}>
          <span>{c.habitId}</span>
          <span>{c.date}</span>
        </div>
      ))}
    </div>
  )
}
