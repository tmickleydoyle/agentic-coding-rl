'use client'
import React, { createContext, useContext, useState } from 'react'
import { Habit, Completion, Route } from '../lib/types'
import { TODAY, computeStreak } from '../lib/store'

interface AppState {
  route: Route
  habits: Habit[]
  completions: Completion[]
  today: string
  navigate: (r: Route) => void
  setHabits: (h: Habit[]) => void
  setCompletions: (c: Completion[]) => void
  getStreak: (habitId: string) => number
}

const AppContext = createContext<AppState>({
  route: 'home', habits: [], completions: [], today: TODAY,
  navigate: () => {}, setHabits: () => {}, setCompletions: () => {},
  getStreak: () => 0,
})

export function useApp() { return useContext(AppContext) }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>('home')
  const [habits, setHabits] = useState<Habit[]>([
    { id: 'h1', name: 'Push-ups', color: 'red' },
    { id: 'h2', name: 'Journaling', color: 'blue' },
    { id: 'h3', name: 'Cold Shower', color: 'cyan' },
  ])
  const [completions, setCompletions] = useState<Completion[]>([
    { id: 'c1', habitId: 'h1', date: '2026-06-06' },
    { id: 'c2', habitId: 'h1', date: '2026-06-05' },
    { id: 'c3', habitId: 'h1', date: '2026-06-04' },
    { id: 'c4', habitId: 'h2', date: '2026-06-06' },
    { id: 'c5', habitId: 'h2', date: '2026-06-04' },
    { id: 'c6', habitId: 'h3', date: '2026-06-01' },
  ])

  const getStreak = (habitId: string): number => {
    const dates = completions
      .filter(c => c.habitId === habitId)
      .map(c => c.date)
      .sort()
      .reverse()
    if (dates.length === 0) return 0
    const todayMs = new Date(TODAY).getTime()
    const yesterdayStr = new Date(todayMs - 86400000).toISOString().slice(0, 10)
    if (dates[0] !== TODAY && dates[0] !== yesterdayStr) return 0
    let streak = 1
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1]).getTime()
      const curr = new Date(dates[i]).getTime()
      if (prev - curr === 86400000) streak++
      else break
    }
    return streak
  }

  return (
    <AppContext.Provider value={{ route, habits, completions, today: TODAY, navigate: setRoute, setHabits, setCompletions, getStreak }}>
      {children}
    </AppContext.Provider>
  )
}
