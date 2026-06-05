'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Habit, Route, Theme } from '../lib/types'
import { TODAY } from '../lib/types'

type HabitApi = {
  habits: Habit[]
  theme: Theme
  route: Route
  today: string
  toggleToday: (id: string) => void
  addHabit: (name: string) => void
  removeHabit: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const HabitContext = createContext<HabitApi | null>(null)

const SEED_HABITS: Habit[] = [
  { id: 'h1', name: 'Drink water', history: ['2026-05-26', '2026-05-27', '2026-05-28'] },
  { id: 'h2', name: 'Exercise', history: ['2026-05-27', '2026-05-28'] },
  { id: 'h3', name: 'Read', history: ['2026-05-25', '2026-05-26'] },
]

export function HabitProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>(SEED_HABITS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('today')
  const [today] = useState(TODAY)
  const [nextId, setNextId] = useState(4)

  const value = useMemo<HabitApi>(() => {
    const toggleToday = (id: string) => {
      setHabits((prev) =>
        prev.map((h) => {
          if (h.id !== id) return h
          if (h.history.includes(today)) {
            return { ...h, history: h.history.filter((d) => d !== today) }
          }
          return { ...h, history: [...h.history, today].sort() }
        }),
      )
    }

    const addHabit = (name: string) => {
      const trimmed = name.trim()
      if (trimmed.length === 0) return
      const id = `h${nextId}`
      setNextId((n) => n + 1)
      setHabits((prev) => [...prev, { id, name: trimmed, history: [] }])
    }

    const removeHabit = (id: string) => {
      setHabits((prev) => prev.filter((h) => h.id !== id))
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      habits,
      theme,
      route,
      today,
      toggleToday,
      addHabit,
      removeHabit,
      setTheme,
      navigate,
    }
  }, [habits, theme, route, today, nextId])

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>
}

export function useHabits(): HabitApi {
  const v = useContext(HabitContext)
  if (!v) throw new Error('useHabits must be used within a HabitProvider')
  return v
}
