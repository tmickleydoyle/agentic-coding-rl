'use client'
import React from 'react'
import { useApp } from '../../components/AppStateProvider'

export function HomePage() {
  const { habits, completions, getStreak } = useApp()
  const streaks = habits.map(h => getStreak(h.id))
  const longest = streaks.length > 0 ? Math.max(...streaks) : 0
  return (
    <div data-testid="home-page">
      <h1>Habit Streaks</h1>
      <div data-testid="longest-streak">{longest}</div>
      <div data-testid="total-habits">{habits.length}</div>
      <div data-testid="total-days-logged">{completions.length}</div>
    </div>
  )
}
