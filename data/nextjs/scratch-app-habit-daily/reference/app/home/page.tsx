'use client'
import React from 'react'
import { useApp } from '../../components/AppStateProvider'

export function HomePage() {
  const { habits, logs, today } = useApp()
  const completedToday = logs.filter(l => l.date === today && l.completed).length
  return (
    <div data-testid="home-page">
      <h1>Daily Habits</h1>
      <div data-testid="today-date">{today}</div>
      <div data-testid="habit-count">{habits.length}</div>
      <div data-testid="completed-today">{completedToday}</div>
    </div>
  )
}
