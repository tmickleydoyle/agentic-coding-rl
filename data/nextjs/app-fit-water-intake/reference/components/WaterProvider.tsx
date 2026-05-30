'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Drink, Route, Theme } from '../lib/types'

type WaterApi = {
  drinks: Drink[]
  goal: number
  reminders: number
  theme: Theme
  route: Route
  today: string
  addDrink: (input: { amount: number; date?: string }) => void
  removeDrink: (id: string) => void
  setGoal: (value: number) => void
  setReminders: (value: number) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const WaterContext = createContext<WaterApi | null>(null)

const SEED_DRINKS: Drink[] = [
  { id: 'd1', date: '2026-05-27', amount: 500 },
  { id: 'd2', date: '2026-05-27', amount: 750 },
  { id: 'd3', date: '2026-05-28', amount: 250 },
]

export function WaterProvider({ children }: { children: ReactNode }) {
  const [drinks, setDrinks] = useState<Drink[]>(SEED_DRINKS)
  const [goal, setGoal] = useState(2000)
  const [reminders, setReminders] = useState(4)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('today')
  const [today] = useState('2026-05-28')
  const [nextId, setNextId] = useState(4)

  const value = useMemo<WaterApi>(() => {
    const addDrink = (input: { amount: number; date?: string }) => {
      const id = `d${nextId}`
      setNextId((n) => n + 1)
      setDrinks((prev) => [
        ...prev,
        { id, date: input.date ?? today, amount: input.amount },
      ])
    }

    const removeDrink = (id: string) => {
      setDrinks((prev) => prev.filter((d) => d.id !== id))
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      drinks,
      goal,
      reminders,
      theme,
      route,
      today,
      addDrink,
      removeDrink,
      setGoal,
      setReminders,
      setTheme,
      navigate,
    }
  }, [drinks, goal, reminders, theme, route, today, nextId])

  return <WaterContext.Provider value={value}>{children}</WaterContext.Provider>
}

export function useWater(): WaterApi {
  const v = useContext(WaterContext)
  if (!v) throw new Error('useWater must be used within a WaterProvider')
  return v
}
