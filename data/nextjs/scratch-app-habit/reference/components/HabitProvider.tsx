'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import { DAYS } from '../lib/types'
import type { Habit, Route } from '../lib/types'

type Ctx = {
  habits: Habit[]
  theme: 'light' | 'dark'
  hideCompleted: boolean
  route: Route
  navigate: (r: Route) => void
  addHabit: (name: string) => void
  toggleDay: (id: number, dayIdx: number) => void
  toggleTheme: () => void
  toggleHideCompleted: () => void
}

export const HabitContext = createContext<Ctx | null>(null)

export function HabitProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [hideCompleted, setHideCompleted] = useState(false)
  const [route, setRoute] = useState<Route>('today')
  const [nextId, setNextId] = useState(1)

  function addHabit(name: string) {
    const n = name.trim()
    if (!n || habits.some((h) => h.name === n)) return
    setHabits((hs) => [...hs, { id: nextId, name: n, days: DAYS.map(() => false) }])
    setNextId((x) => x + 1)
  }
  function toggleDay(id: number, dayIdx: number) {
    setHabits((hs) =>
      hs.map((h) =>
        h.id === id ? { ...h, days: h.days.map((d, i) => (i === dayIdx ? !d : d)) } : h,
      ),
    )
  }

  const value: Ctx = {
    habits,
    theme,
    hideCompleted,
    route,
    navigate: setRoute,
    addHabit,
    toggleDay,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    toggleHideCompleted: () => setHideCompleted((s) => !s),
  }
  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>
}
