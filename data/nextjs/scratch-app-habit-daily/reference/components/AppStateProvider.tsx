'use client'
import React, { createContext, useContext, useState } from 'react'
import { Habit, HabitLog, Route } from '../lib/types'
import { TODAY } from '../lib/store'

interface AppState {
  route: Route
  habits: Habit[]
  logs: HabitLog[]
  today: string
  navigate: (r: Route) => void
  setHabits: (h: Habit[]) => void
  setLogs: (l: HabitLog[]) => void
}

const AppContext = createContext<AppState>({
  route: 'home', habits: [], logs: [], today: TODAY,
  navigate: () => {}, setHabits: () => {}, setLogs: () => {},
})

export function useApp() { return useContext(AppContext) }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>('home')
  const [habits, setHabits] = useState<Habit[]>([
    { id: 'h1', name: 'Morning Run', frequency: 'daily', category: 'Health' },
    { id: 'h2', name: 'Read 30min', frequency: 'daily', category: 'Learning' },
    { id: 'h3', name: 'Weekly Review', frequency: 'weekly', category: 'Productivity' },
  ])
  const [logs, setLogs] = useState<HabitLog[]>([
    { id: 'l1', habitId: 'h1', date: '2026-06-06', completed: true },
    { id: 'l2', habitId: 'h2', date: '2026-06-05', completed: true },
    { id: 'l3', habitId: 'h1', date: '2026-06-05', completed: true },
  ])

  return (
    <AppContext.Provider value={{ route, habits, logs, today: TODAY, navigate: setRoute, setHabits, setLogs }}>
      {children}
    </AppContext.Provider>
  )
}
