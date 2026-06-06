'use client'
import React from 'react'
import { useApp } from '../../components/AppStateProvider'
import { HabitLog } from '../../lib/types'

export function LogPage() {
  const { habits, logs, setLogs, today } = useApp()

  const toggle = (habitId: string) => {
    const existing = logs.find(l => l.habitId === habitId && l.date === today)
    if (existing) {
      setLogs(logs.map(l => l === existing ? { ...l, completed: !l.completed } : l))
    } else {
      const newLog: HabitLog = { id: `l${Date.now()}`, habitId, date: today, completed: true }
      setLogs([...logs, newLog])
    }
  }

  return (
    <div data-testid="log-page">
      <h1>Daily Log — {today}</h1>
      {habits.map(h => {
        const entry = logs.find(l => l.habitId === h.id && l.date === today)
        const checked = entry?.completed ?? false
        return (
          <div key={h.id}>
            <span>{h.name}</span>
            <input
              type="checkbox"
              data-testid={`log-check-${h.id}`}
              checked={checked}
              onChange={() => toggle(h.id)}
            />
          </div>
        )
      })}
    </div>
  )
}
