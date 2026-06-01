'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Goal, Meal, Route, Theme } from '../lib/types'

export const TODAY = '2026-05-29'

type NewMealInput = {
  name: string
  date?: string
  calories: number
  protein?: number
  carbs?: number
  fat?: number
}

type AppApi = {
  meals: Meal[]
  goal: Goal
  theme: Theme
  route: Route
  today: string
  addMeal: (input: NewMealInput) => void
  removeMeal: (id: string) => void
  setGoal: (goal: Goal) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const SEED_MEALS: Meal[] = [
  { id: 'm1', name: 'Oatmeal', date: '2026-05-29', calories: 320, protein: 12, carbs: 54, fat: 6 },
  { id: 'm2', name: 'Chicken salad', date: '2026-05-29', calories: 450, protein: 38, carbs: 20, fat: 22 },
  { id: 'm3', name: 'Apple', date: '2026-05-28', calories: 95, protein: 0, carbs: 25, fat: 0 },
]

const SEED_GOAL: Goal = { calories: 2000, protein: 120, carbs: 250, fat: 65 }

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [meals, setMeals] = useState<Meal[]>(SEED_MEALS)
  const [goal, setGoal] = useState<Goal>(SEED_GOAL)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('today')
  const [nextId, setNextId] = useState(4)

  const value = useMemo<AppApi>(() => {
    const addMeal = (input: NewMealInput) => {
      const id = `m${nextId}`
      setNextId((n) => n + 1)
      setMeals((prev) => [
        ...prev,
        {
          id,
          name: input.name,
          date: input.date ?? TODAY,
          calories: input.calories,
          protein: input.protein ?? 0,
          carbs: input.carbs ?? 0,
          fat: input.fat ?? 0,
        },
      ])
    }

    const removeMeal = (id: string) => {
      setMeals((prev) => prev.filter((m) => m.id !== id))
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      meals,
      goal,
      theme,
      route,
      today: TODAY,
      addMeal,
      removeMeal,
      setGoal,
      setTheme,
      navigate,
    }
  }, [meals, goal, theme, route, nextId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
